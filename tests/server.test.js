// Servidor de produccion: rutas legales, verificacion de TikTok, video, SEO y dominio.
// Requiere `npm run build` antes (sirve dist/).
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import http from "node:http";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HAS_DIST = fs.existsSync(path.join(ROOT, "dist", "index.html"));

async function startServer(port, env = {}) {
  const child = spawn(process.execPath, ["server.js"], { cwd: ROOT, env: { ...process.env, PORT: String(port), ...env }, stdio: "pipe" });
  await new Promise((resolve, reject) => {
    child.stdout.on("data", (chunk) => String(chunk).includes("puerto") && resolve());
    child.on("exit", (code) => reject(new Error(`server exited ${code}`)));
    setTimeout(() => reject(new Error("server timeout")), 8000);
  });
  return child;
}

// http.request (fetch no deja cambiar Host); sin descompresion automatica.
function get(port, p, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path: p, headers }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const body = Buffer.concat(chunks);
        resolve({
          status: res.statusCode,
          headers: { get: (k) => res.headers[k.toLowerCase()] ?? null },
          text: async () => body.toString("utf8")
        });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

test("rutas que deben seguir respondiendo", { skip: !HAS_DIST && "sin dist/ (corre npm run build)" }, async () => {
  const port = 41731;
  const server = await startServer(port);
  try {
    const tiktok = fs.readdirSync(path.join(ROOT, "public")).filter((f) => /^tiktok.*\.txt$/.test(f));
    assert.ok(tiktok.length >= 2, "faltan los archivos de verificacion de TikTok");
    for (const p of ["/", "/privacidad", "/privacidad/", "/terminos", "/borrar-datos", "/nexa-prueba.mp4", "/robots.txt", "/sitemap.xml",
      "/favicon.ico", "/apple-touch-icon.png", "/og-clonexa.png", "/brand/clonexa-logo.svg", "/brand/clonexa-logo-claro.svg", ...tiktok.map((f) => `/${f}`)]) {
      const res = await get(port, p);
      assert.equal(res.status, 200, `${p} -> ${res.status}`);
    }
    for (const f of tiktok) {
      const body = await (await get(port, `/${f}`)).text();
      assert.equal(body, fs.readFileSync(path.join(ROOT, "public", f), "utf8"), `${f} cambio de contenido`);
    }
    for (const [from, to] of [["/privacy", "/privacidad"], ["/terms", "/terminos"], ["/data-deletion?x=1", "/borrar-datos?x=1"]]) {
      const res = await get(port, from);
      assert.equal(res.status, 301, from);
      assert.equal(res.headers.get("location"), to);
    }
    assert.equal((await get(port, "/no-existe.png")).status, 404);
    assert.equal((await get(port, "/%2e%2e/server.js")).status, 404, "no sale de dist/");

    const legal = await (await get(port, "/privacidad")).text();
    assert.match(legal, /Política de privacidad/);
    assert.match(legal, /href="https:\/\/www\.clonexa\.com\.co\/privacidad"/);

    const range = await get(port, "/nexa-prueba.mp4", { Range: "bytes=0-99" });
    assert.equal(range.status, 206);
    assert.equal(range.headers.get("content-length"), "100");
    assert.equal(range.headers.get("content-type"), "video/mp4");

    const gz = await get(port, "/");
    assert.equal(gz.status, 200);
    const html = await gz.text();
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.clonexa\.com\.co\/"/);
    assert.match(html, /property="og:url" content="https:\/\/www\.clonexa\.com\.co\/"/);
    assert.match(html, /og-clonexa\.png/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /localStorage\.getItem\("clonexa_theme"\)/, "tema antes de pintar");

    const asset = html.match(/\/assets\/main-[^"]+\.js/)[0];
    const assetRes = await get(port, asset);
    assert.match(assetRes.headers.get("cache-control"), /immutable/);
    assert.equal((await get(port, "/")).headers.get("cache-control"), "no-cache");

    const robots = await (await get(port, "/robots.txt")).text();
    assert.match(robots, /Sitemap: https:\/\/www\.clonexa\.com\.co\/sitemap\.xml/);
    const sitemap = await (await get(port, "/sitemap.xml")).text();
    assert.match(sitemap, /<loc>https:\/\/www\.clonexa\.com\.co\/<\/loc>/);
  } finally {
    server.kill();
  }
});

test("sin CANONICAL_HOST todo responde igual; con CANONICAL_HOST la raiz y Railway van a www salvo TikTok y legales", { skip: !HAS_DIST && "sin dist/" }, async () => {
  const open = await startServer(41732);
  try {
    for (const host of ["clonexa.com.co", "www.clonexa.com.co", "clonexa-landing-production.up.railway.app"]) {
      assert.equal((await get(41732, "/", { Host: host })).status, 200, host);
    }
  } finally {
    open.kill();
  }
  const www = await startServer(41733, { CANONICAL_HOST: "www.clonexa.com.co" });
  try {
    const res = await get(41733, "/planes?utm_source=instagram", { Host: "clonexa.com.co" });
    assert.equal(res.status, 301);
    assert.equal(res.headers.get("location"), "https://www.clonexa.com.co/planes?utm_source=instagram");
    assert.equal((await get(41733, "/", { Host: "www.clonexa.com.co" })).status, 200);
    const RW = "clonexa-landing-production.up.railway.app";
    const fromRailway = await get(41733, "/?utm_source=tiktok", { Host: RW });
    assert.equal(fromRailway.status, 301, "Railway / va a www");
    assert.equal(fromRailway.headers.get("location"), "https://www.clonexa.com.co/?utm_source=tiktok");
    const tiktok = fs.readdirSync(path.join(ROOT, "public")).filter((f) => /^tiktok.*.txt$/.test(f));
    for (const p of ["/privacidad", "/privacidad/", "/terminos", "/borrar-datos", "/brand/clonexa-logo.svg", "/favicon.ico", ...tiktok.map((f) => `/${f}`)]) {
      assert.equal((await get(41733, p, { Host: RW })).status, 200, `Railway ${p} no se redirige`);
    }
    assert.equal((await get(41733, "/privacy", { Host: RW })).headers.get("location"), "/privacidad", "alias legal sigue en Railway");
    assert.equal((await get(41733, "/privacidad", { Host: "clonexa.com.co" })).status, 301, "raiz siempre a www");
    assert.equal((await get(41733, "/", { Host: "localhost:8080" })).status, 200, "otros hosts sin redireccion");
  } finally {
    www.kill();
  }
});

test("el numero de WhatsApp nunca aparece como texto en la pagina construida", { skip: !HAS_DIST && "sin dist/" }, () => {
  const files = [path.join(ROOT, "dist", "index.html"), ...fs.readdirSync(path.join(ROOT, "dist", "assets")).filter((f) => f.endsWith(".js")).map((f) => path.join(ROOT, "dist", "assets", f))];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    assert.ok(!/(?<!\d)346\s?824\s?4098|\+1\s?346/.test(text), `${path.basename(file)} muestra el numero`);
    // el identificador solo existe una vez (la constante con la que se arman los enlaces wa.me)
    assert.ok((text.match(/13468244098/g) || []).length <= 1, `${path.basename(file)}: numero repetido fuera de wa.me`);
  }
});

test("gzip devuelve el mismo contenido", { skip: !HAS_DIST && "sin dist/" }, async () => {
  const server = await startServer(41734);
  try {
    const res = await new Promise((resolve) => {
      import("node:http").then(({ get: httpGet }) => httpGet({ host: "127.0.0.1", port: 41734, path: "/robots.txt", headers: { "Accept-Encoding": "gzip" } }, resolve));
    });
    assert.equal(res.headers["content-encoding"], "gzip");
    const chunks = [];
    for await (const c of res) chunks.push(c);
    assert.equal(zlib.gunzipSync(Buffer.concat(chunks)).toString(), fs.readFileSync(path.join(ROOT, "public", "robots.txt"), "utf8"));
  } finally {
    server.kill();
  }
});

test("SEO: robots exacto, sitemap www, sin noindex ni X-Robots-Tag, titulo, JSON-LD y favicon", { skip: !HAS_DIST && "sin dist/" }, async () => {
  const server = await startServer(41735);
  try {
    const robots = await (await get(41735, "/robots.txt")).text();
    assert.equal(robots.replace(/\r\n/g, "\n").trim(), "User-agent: *\nAllow: /\n\nSitemap: https://www.clonexa.com.co/sitemap.xml");
    assert.doesNotMatch(robots, /Disallow/i);

    const sitemap = await (await get(41735, "/sitemap.xml")).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.deepEqual(locs, ["/", "/privacidad", "/terminos", "/borrar-datos"].map((p) => `https://www.clonexa.com.co${p}`));
    assert.equal((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length, 4);

    for (const p of ["/", "/privacidad", "/terminos", "/borrar-datos", "/robots.txt", "/sitemap.xml"]) {
      const res = await get(41735, p);
      assert.equal(res.status, 200, p);
      assert.equal(res.headers.get("x-robots-tag"), null, `${p}: X-Robots-Tag`);
      assert.doesNotMatch(await res.text(), /noindex|nofollow/i, `${p}: noindex`);
    }

    const html = await (await get(41735, "/")).text();
    assert.match(html, /<title>Clonexa \|[^<]+<\/title>/);
    assert.match(html, /<meta\s+name="description"\s+content="[^"]{50,160}"/);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const org = ld["@graph"].find((n) => n["@type"] === "Organization");
    const site = ld["@graph"].find((n) => n["@type"] === "WebSite");
    assert.equal(org.name, "Clonexa");
    assert.equal(org.url, "https://www.clonexa.com.co/");
    assert.equal(site.name, "Clonexa");
    assert.equal(site.url, "https://www.clonexa.com.co/");
    const { SOCIAL } = await import("../src/content.js");
    assert.deepEqual(org.sameAs, SOCIAL.map((s) => s.url.replace("?utm_source=web", "")), "sameAs = redes de Siguenos");
    assert.equal((await get(41735, new URL(org.logo).pathname)).status, 200, "logo");

    for (const [p, size] of [["/favicon-48.png", 48], ["/favicon-96.png", 96]]) {
      assert.match(html, new RegExp(`href="${p}" type="image/png" sizes="${size}x${size}"`));
      assert.equal((await get(41735, p)).status, 200, p);
      const png = fs.readFileSync(path.join(ROOT, "dist", p));
      assert.equal(png.readUInt32BE(16), size, `${p} ancho`);
      assert.equal(png.readUInt32BE(20), size, `${p} alto`);
    }
  } finally {
    server.kill();
  }
});
