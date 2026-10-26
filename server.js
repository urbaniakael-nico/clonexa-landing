// Servidor de produccion de la landing (solo modulos de Node).
// Sirve dist/ con gzip/brotli, cache para /assets, rangos para video,
// las rutas limpias de las paginas legales y, si se pide, redireccion de dominio.
import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import { resolveLegalPath } from "./legal/pages.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");
const PORT = Number(process.env.PORT || 8080);

// CANONICAL_HOST=www.clonexa.com.co: clonexa.com.co y la URL de Railway redirigen (301) a www.
// Por la URL de Railway NO se redirigen los .txt de TikTok ni las paginas legales (ni lo que
// ellas cargan), para no romper verificaciones ya hechas con esa URL.
// Vacio: los dos dominios y la URL de Railway responden igual.
const CANONICAL_HOST = (process.env.CANONICAL_HOST || "").trim().toLowerCase();
const OWN_HOSTS = new Set(["clonexa.com.co", "www.clonexa.com.co"]);
const RAILWAY_KEEP = [
  /^\/tiktok[\w-]*\.txt$/i,
  /^\/(privacidad|terminos|borrar-datos|privacy|terms|data-deletion)\/?$/,
  /^\/(assets|brand)\//,
  /^\/(favicon\.ico|apple-touch-icon\.png)$/
];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2"
};
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".webmanifest", ".txt", ".xml", ".svg"]);
const compressedCache = new Map();

export function redirectForHost(hostHeader, url) {
  if (!CANONICAL_HOST) return null;
  const host = String(hostHeader || "").toLowerCase().split(":")[0];
  if (!host || host === CANONICAL_HOST) return null;
  if (host.endsWith(".up.railway.app")) {
    const urlPath = String(url || "/").split("?")[0].split("#")[0];
    if (RAILWAY_KEEP.some((rule) => rule.test(urlPath))) return null;
  } else if (!OWN_HOSTS.has(host)) {
    return null;
  }
  return `https://${CANONICAL_HOST}${url}`;
}

function cacheControl(urlPath, ext) {
  if (urlPath.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  if (ext === ".html") return "no-cache";
  return "public, max-age=3600";
}

async function findFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch (_) {
    return null;
  }
  const target = path.normalize(path.join(ROOT, decoded));
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null;
  try {
    const stat = await fs.stat(target);
    if (stat.isDirectory()) {
      const index = path.join(target, "index.html");
      const indexStat = await fs.stat(index);
      return { file: index, stat: indexStat };
    }
    return { file: target, stat };
  } catch (_) {
    return null;
  }
}

function pickEncoding(req) {
  const accept = String(req.headers["accept-encoding"] || "");
  if (/\bbr\b/.test(accept)) return "br";
  if (/\bgzip\b/.test(accept)) return "gzip";
  return "";
}

async function compressed(file, mtime, encoding) {
  const key = `${file}:${encoding}:${mtime}`;
  if (!compressedCache.has(key)) {
    const raw = await fs.readFile(file);
    const body =
      encoding === "br"
        ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } })
        : zlib.gzipSync(raw, { level: 9 });
    compressedCache.set(key, body);
  }
  return compressedCache.get(key);
}

async function handle(req, res) {
  const url = req.url || "/";
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }

  const hostRedirect = redirectForHost(req.headers.host, url);
  if (hostRedirect) {
    res.writeHead(301, { Location: hostRedirect });
    res.end();
    return;
  }

  const legal = resolveLegalPath(url);
  if (legal?.redirect) {
    res.writeHead(301, { Location: legal.redirect });
    res.end();
    return;
  }
  const urlPath = (legal?.rewrite || url).split("?")[0].split("#")[0];

  const found = await findFile(urlPath);
  if (!found) {
    // Paginas que no existen: 404 real con la pagina 404 prerenderizada; archivos: texto corto.
    const notFound = !path.extname(urlPath) && (await findFile("/404.html"));
    if (notFound) {
      res.writeHead(404, { "Content-Type": TYPES[".html"], "Cache-Control": "no-cache" });
      if (req.method === "HEAD") return res.end();
      createReadStream(notFound.file).pipe(res);
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("No encontrado");
    return;
  }

  const ext = path.extname(found.file).toLowerCase();
  const headers = {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Cache-Control": cacheControl(urlPath, ext),
    "Last-Modified": found.stat.mtime.toUTCString()
  };

  if (COMPRESSIBLE.has(ext)) {
    headers.Vary = "Accept-Encoding";
    const encoding = pickEncoding(req);
    if (encoding) {
      const body = await compressed(found.file, found.stat.mtimeMs, encoding);
      res.writeHead(200, { ...headers, "Content-Encoding": encoding, "Content-Length": body.length });
      res.end(req.method === "HEAD" ? undefined : body);
      return;
    }
  }

  const size = found.stat.size;
  headers["Accept-Ranges"] = "bytes";
  const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ""));
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);
    if (start > end) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` });
      res.end();
      return;
    }
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
    if (req.method === "HEAD") return res.end();
    createReadStream(found.file, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, { ...headers, "Content-Length": size });
  if (req.method === "HEAD") return res.end();
  createReadStream(found.file).pipe(res);
}

export function startServer(port = PORT) {
  const server = createServer((req, res) => {
    handle(req, res).catch(() => {
      if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error");
    });
  });
  return new Promise((resolve) => server.listen(port, "0.0.0.0", () => resolve(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer().then(() => console.log(`Landing Clonexa en el puerto ${PORT}`));
}
