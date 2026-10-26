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

test("el numero de WhatsApp nunca aparece como texto: en el HTML solo dentro de enlaces wa.me", { skip: !HAS_DIST && "sin dist/" }, () => {
  const pages = ["index.html", "404.html", ...fs.readdirSync(path.join(ROOT, "dist"), { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, "dist", d.name, "index.html"))).map((d) => path.join(d.name, "index.html"))];
  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, "dist", page), "utf8");
    assert.ok(!/(?<!\d)346\s?824\s?4098|\+1\s?346/.test(html), `${page} muestra el numero`);
    const all = (html.match(/13468244098/g) || []).length;
    const inLinks = (html.match(/https:\/\/wa\.me\/13468244098\?text=/g) || []).length;
    assert.equal(all, inLinks, `${page}: numero fuera de wa.me`);
  }
  for (const f of fs.readdirSync(path.join(ROOT, "dist", "assets")).filter((f) => f.endsWith(".js"))) {
    const text = fs.readFileSync(path.join(ROOT, "dist", "assets", f), "utf8");
    assert.ok((text.match(/13468244098/g) || []).length <= 1, `${f}: numero repetido fuera de wa.me`);
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

const SITE = "https://www.clonexa.com.co";
const NEW_PAGES = ["/que-es-clonexa", "/restaurantes", "/bares", "/talleres-y-fabricas", "/call-centers", "/personal-en-campo"];

// Texto visible del HTML sin JavaScript (sin scripts, estilos ni etiquetas).
function visibleText(html) {
  const body = html.slice(html.indexOf("<body"));
  return body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLd(html) {
  const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return raw ? JSON.parse(raw[1])["@graph"] : [];
}

test("SEO: robots, sitemap con todas las paginas, sin noindex ni X-Robots-Tag", { skip: !HAS_DIST && "sin dist/" }, async () => {
  const server = await startServer(41735);
  try {
    const robots = await (await get(41735, "/robots.txt")).text();
    assert.equal(robots.replace(/\r\n/g, "\n").trim(), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml`);
    const sitemap = await (await get(41735, "/sitemap.xml")).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.deepEqual(locs, ["/", ...NEW_PAGES, "/privacidad", "/terminos", "/borrar-datos"].map((p) => `${SITE}${p}`));
    assert.equal((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length, locs.length);
    for (const p of ["/", ...NEW_PAGES, "/privacidad", "/terminos", "/borrar-datos", "/robots.txt", "/sitemap.xml"]) {
      const res = await get(41735, p);
      assert.equal(res.status, 200, p);
      assert.equal(res.headers.get("x-robots-tag"), null, `${p}: X-Robots-Tag`);
      assert.doesNotMatch(await res.text(), /noindex|nofollow/i, `${p}: noindex`);
    }
  } finally {
    server.kill();
  }
});

test("prerender: cada ruta trae en el HTML su title, description, canonical, og, H1 y texto", { skip: !HAS_DIST && "sin dist/" }, async () => {
  const server = await startServer(41736);
  try {
    const titles = new Set();
    for (const p of ["/", ...NEW_PAGES]) {
      const html = await (await get(41736, p)).text();
      const url = `${SITE}${p === "/" ? "/" : p}`;
      const title = html.match(/<title>([^<]+)<\/title>/)[1];
      assert.ok(/^Clonexa|\| Clonexa$|Clonexa\?/.test(title), `${p}: title ${title}`);
      assert.ok(!titles.has(title), `${p}: title repetido`);
      titles.add(title);
      assert.equal((html.match(/<title>/g) || []).length, 1, `${p}: un solo title`);
      const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
      assert.ok(description.length >= 70 && description.length <= 165, `${p}: description ${description.length}`);
      assert.match(html, new RegExp(`<link rel="canonical" href="${url}" />`), `${p}: canonical`);
      assert.match(html, new RegExp(`<meta property="og:url" content="${url}" />`), `${p}: og:url`);
      assert.match(html, /<meta property="og:title" content="[^"]+" \/>/);
      assert.match(html, /<meta property="og:description" content="[^"]+" \/>/);
      assert.match(html, /<meta property="og:image" content="https:\/\/www\.clonexa\.com\.co\/og-clonexa\.png" \/>/);
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${p}: un solo H1`);
      for (const icon of ['href="/favicon.ico"', 'href="/favicon.svg"', 'href="/icon-192.png"', 'href="/icon-512.png"', 'rel="apple-touch-icon" href="/apple-touch-icon.png"']) {
        assert.ok(html.includes(icon), `${p}: icono ${icon}`);
      }
      const words = visibleText(html).split(" ").length;
      assert.ok(words > 400, `${p}: ${words} palabras en el HTML sin JS`);
      assert.ok(!/13468244098|346\s?824/.test(visibleText(html)), `${p}: numero de WhatsApp como texto`);
    }

    // Inicio: WebSite + Organization
    const home = jsonLd(await (await get(41736, "/")).text());
    const site = home.find((n) => n["@type"] === "WebSite");
    const org = home.find((n) => n["@type"] === "Organization");
    assert.equal(site.name, "Clonexa");
    assert.deepEqual(site.alternateName, ["Clonexa SaaS", "clonexa.com.co"]);
    assert.equal(site.url, `${SITE}/`);
    assert.equal(org.name, "Clonexa");
    assert.equal(org.logo, `${SITE}/icon-512.png`);
    assert.equal(org.email, "clonexasaas@gmail.com");
    assert.equal(org.address.addressLocality, "Bogotá");
    assert.equal(org.areaServed.name, "Colombia");
    assert.ok(org.description.length > 40);
    const { SOCIAL } = await import("../src/content.js");
    assert.deepEqual(org.sameAs, SOCIAL.map((s) => s.url.replace("?utm_source=web", "")));

    // Que es Clonexa: AboutPage + Organization, primera frase y aclaracion
    const aboutHtml = await (await get(41736, "/que-es-clonexa")).text();
    const about = jsonLd(aboutHtml);
    assert.ok(about.some((n) => n["@type"] === "AboutPage"));
    assert.ok(about.some((n) => n["@type"] === "Organization"));
    const aboutText = visibleText(aboutHtml);
    assert.ok(aboutText.includes("Clonexa es un software en la nube (SaaS) hecho en Bogotá, Colombia, que conecta en un solo sistema los pedidos, el inventario, la caja, el personal, los turnos, la nómina y los reportes de los negocios."));
    assert.ok(aboutText.includes("Clonexa, la empresa de software de Bogotá, no tiene relación con medicamentos de nombre parecido."));

    // Industrias: FAQPage + BreadcrumbList, H1, capturas reales con alt, enlaces a las demas, 500-900 palabras propias
    const { INDUSTRY_PAGES } = await import("../src/industries.js");
    for (const page of INDUSTRY_PAGES) {
      const html = await (await get(41736, `/${page.slug}`)).text();
      assert.equal(html.match(/<title>([^<]+)<\/title>/)[1], `${page.name} | Clonexa`);
      assert.ok(html.includes(`>${page.h1}</h1>`), `${page.slug}: H1`);
      const graph = jsonLd(html);
      const faq = graph.find((n) => n["@type"] === "FAQPage");
      assert.equal(faq.mainEntity.length, page.faq.length);
      assert.ok(page.faq.length >= 4 && page.faq.length <= 5);
      const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList").itemListElement;
      assert.deepEqual(crumbs.map((c) => c.name), ["Inicio", page.name]);
      for (const step of page.steps) assert.ok(html.includes(`src="/capturas/${step.shot}.webp"`), `${page.slug}: ${step.shot}`);
      for (const other of INDUSTRY_PAGES.filter((o) => o !== page)) assert.ok(html.includes(`href="/${other.slug}"`), `${page.slug}: enlace a ${other.slug}`);
      assert.ok(html.includes(encodeURIComponent(`Hola, quiero una demo de Clonexa para mi ${page.business}.`)), `${page.slug}: mensaje de WhatsApp`);
      const own = [page.h1, ...page.intro, page.fit, ...page.steps.flatMap((s) => [s.title, s.text]), ...page.modules.flat(), ...page.faq.flat()].join(" ");
      const words = own.split(/\s+/).length;
      assert.ok(words >= 500 && words <= 900, `${page.slug}: ${words} palabras propias`);
    }
  } finally {
    server.kill();
  }
});

test("404 real con pagina bonita; archivos inexistentes tambien 404", { skip: !HAS_DIST && "sin dist/" }, async () => {
  const server = await startServer(41737);
  try {
    for (const p of ["/ruta-inventada", "/restaurantes/otra", "/tiendas-y-cadenas"]) {
      const res = await get(41737, p);
      assert.equal(res.status, 404, p);
      const html = await res.text();
      assert.match(html, /Esta página no existe/);
      assert.match(html, /href="\/restaurantes"/);
      assert.match(html, /<meta name="robots" content="noindex" \/>/);
    }
    assert.equal((await get(41737, "/capturas/no-existe.webp")).status, 404);
    assert.equal((await get(41737, "/restaurantes/")).status, 200, "con / final");
  } finally {
    server.kill();
  }
});

test("iconos cuadrados con fondo solido", { skip: !HAS_DIST && "sin dist/" }, async () => {
  const server = await startServer(41738);
  try {
    for (const [p, size] of [["/icon-192.png", 192], ["/icon-512.png", 512], ["/apple-touch-icon.png", 180]]) {
      assert.equal((await get(41738, p)).status, 200, p);
      const png = fs.readFileSync(path.join(ROOT, "dist", p));
      assert.equal(png.readUInt32BE(16), size, `${p} ancho`);
      assert.equal(png.readUInt32BE(20), size, `${p} alto`);
    }
    assert.equal((await get(41738, "/favicon.svg")).status, 200);
    const ico = fs.readFileSync(path.join(ROOT, "dist", "favicon.ico"));
    const sizes = Array.from({ length: ico.readUInt16LE(4) }, (_, i) => ico[6 + i * 16]);
    assert.ok(sizes.includes(48), `favicon.ico con 48x48 (${sizes})`);
  } finally {
    server.kill();
  }
});
