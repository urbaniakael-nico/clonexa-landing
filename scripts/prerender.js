// Prerender: despues de `vite build` (cliente) y `vite build --ssr` (servidor), escribe el HTML
// de cada ruta en cada idioma (dist/<ruta>, dist/en/<ruta>, dist/fr/<ruta>) con su head propio
// (lang, title, description, canonical, hreflang, og), dist/404.html y dist/sitemap.xml.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SSR_DIR = path.join(ROOT, "dist-ssr");

const entryFile = fs.readdirSync(SSR_DIR).find((f) => /^entry-server\.m?js$/.test(f));
const { render, ROUTES, BASE_ROUTES, SITE, ready } = await import(pathToFileURL(path.join(SSR_DIR, entryFile)).href);
await ready;
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

// Archivo JS del diccionario de cada idioma (para precargarlo: la pagina lo necesita para hidratar).
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, ".vite", "manifest.json"), "utf8"));
const dictChunk = (lang) => {
  const entry = manifest[`src/i18n/${lang}.json`];
  if (!entry) throw new Error(`sin chunk del diccionario ${lang}`);
  return `/${entry.file}`;
};

const attr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const text = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function headFor(meta) {
  const ogTitle = meta.ogTitle || meta.title;
  const tags = [
    `<meta name="description" content="${attr(meta.description)}" />`,
    `<link rel="canonical" href="${attr(meta.url)}" />`,
    ...meta.alternates.map(([hreflang, href]) => `<link rel="alternate" hreflang="${hreflang}" href="${attr(href)}" />`),
    `<meta property="og:url" content="${attr(meta.url)}" />`,
    `<meta property="og:title" content="${attr(ogTitle)}" />`,
    `<meta property="og:description" content="${attr(meta.description)}" />`,
    `<meta property="og:locale" content="${meta.ogLocale}" />`,
    ...meta.ogLocaleAlternates.map((l) => `<meta property="og:locale:alternate" content="${l}" />`),
    `<meta property="og:image:alt" content="${attr(meta.ogImageAlt)}" />`,
    `<meta name="twitter:title" content="${attr(ogTitle)}" />`,
    `<meta name="twitter:description" content="${attr(meta.description)}" />`,
    `<link rel="modulepreload" href="${dictChunk(meta.lang)}" />`
  ];
  if (meta.preloadImage) {
    const { href, srcset, sizes } = meta.preloadImage;
    tags.push(`<link rel="preload" as="image" href="${attr(href)}" imagesrcset="${attr(srcset)}" imagesizes="${attr(sizes)}" fetchpriority="high" />`);
  }
  if (meta.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>`);
  }
  return tags.join("\n    ");
}

function page(html, title, head, htmlLang, extra = (s) => s) {
  const out = template
    .replace('<html lang="es"', `<html lang="${htmlLang}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${text(title)}</title>`)
    .replace("<!--app-head-->", head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  if (!out.includes(`<div id="root">${html.slice(0, 40)}`)) throw new Error("no se pudo insertar el HTML");
  return extra(out);
}

const written = [];
for (const route of ROUTES) {
  const { html, meta } = render(route);
  if (!meta) throw new Error(`ruta sin metadatos: ${route}`);
  const file = route === "/" ? path.join(DIST, "index.html") : path.join(DIST, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(html, meta.title, headFor(meta), meta.htmlLang));
  written.push(route);
}

// 404: misma barra y pie (en espanol), sin indexar.
const notFound = render("/404");
fs.writeFileSync(
  path.join(DIST, "404.html"),
  page(
    notFound.html,
    SITE.NOT_FOUND_META.title,
    [`<meta name="description" content="${attr(SITE.NOT_FOUND_META.description)}" />`, `<link rel="modulepreload" href="${dictChunk("es")}" />`].join("\n    "),
    "es",
    (s) => s.replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex" />')
  )
);

// Sitemap: cada pagina en los tres idiomas con sus alternativas (hreflang), y las legales.
const LEGAL = ["/privacidad", "/terminos", "/borrar-datos"];
const today = new Date().toISOString().slice(0, 10);
const abs = (p) => `${SITE.SITE_URL}${p === "/" ? "/" : p}`;
const loc = (lang, base) => (lang === "es" ? base : base === "/" ? `/${lang}` : `/${lang}${base}`);
const urls = [];
for (const base of [...BASE_ROUTES, ...LEGAL]) {
  const alts = ["es", "en", "fr"].map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(loc(l, base))}" />`);
  alts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(base)}" />`);
  const priority = base === "/" ? "1.0" : LEGAL.includes(base) ? "0.3" : "0.9";
  for (const lang of ["es", "en", "fr"]) {
    urls.push(`  <url>\n    <loc>${abs(loc(lang, base))}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n${alts.join("\n")}\n  </url>`);
  }
}
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`
);

fs.rmSync(SSR_DIR, { recursive: true, force: true });
console.log(`prerender: ${written.length} rutas (${written.join(", ")}) + 404 + sitemap (${urls.length} URL)`);
