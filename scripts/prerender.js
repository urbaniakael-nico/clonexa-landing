// Prerender: despues de `vite build` (cliente) y `vite build --ssr` (servidor), escribe el HTML
// de cada ruta en dist/<ruta>/index.html con su head propio, y dist/404.html.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SSR_DIR = path.join(ROOT, "dist-ssr");

const entryFile = fs.readdirSync(SSR_DIR).find((f) => /^entry-server\.m?js$/.test(f));
const { render, ROUTES, SITE } = await import(pathToFileURL(path.join(SSR_DIR, entryFile)).href);
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

const attr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const text = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function headFor(meta) {
  const ogTitle = meta.ogTitle || meta.title;
  const tags = [
    `<meta name="description" content="${attr(meta.description)}" />`,
    `<link rel="canonical" href="${attr(meta.url)}" />`,
    `<meta property="og:url" content="${attr(meta.url)}" />`,
    `<meta property="og:title" content="${attr(ogTitle)}" />`,
    `<meta property="og:description" content="${attr(meta.description)}" />`,
    `<meta name="twitter:title" content="${attr(ogTitle)}" />`,
    `<meta name="twitter:description" content="${attr(meta.description)}" />`
  ];
  if (meta.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>`);
  }
  return tags.join("\n    ");
}

function page(html, title, head, extra = (s) => s) {
  const out = template
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
  fs.writeFileSync(file, page(html, meta.title, headFor(meta)));
  written.push(route);
}

// 404: misma barra y pie, sin indexar.
const notFound = render("/404");
fs.writeFileSync(
  path.join(DIST, "404.html"),
  page(
    notFound.html,
    SITE.NOT_FOUND_META.title,
    `<meta name="description" content="${attr(SITE.NOT_FOUND_META.description)}" />`,
    (s) => s.replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex" />')
  )
);

fs.rmSync(SSR_DIR, { recursive: true, force: true });
console.log(`prerender: ${written.join(", ")} + 404`);
