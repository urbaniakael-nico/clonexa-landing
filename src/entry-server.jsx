// Entrada del prerender: HTML de cada ruta (en su idioma) y sus metadatos.
import React from "react";
import { renderToString } from "react-dom/server";
import { preloadAll } from "./defer.jsx";
import { splitLang } from "./i18n/index.jsx";
import Root from "./Root.jsx";
import { DICTS, notFoundMeta, pageMeta } from "./seo.js";
import { BASE_ROUTES, OG_IMAGE, ROUTES, SITE_URL } from "./site.js";

export { BASE_ROUTES, ROUTES };

// Las secciones que en el navegador se descargan aparte se cargan antes de prerenderizar.
export const ready = preloadAll();

export function render(path) {
  const { lang } = splitLang(path);
  const html = renderToString(
    <React.StrictMode>
      <Root path={path} dict={DICTS[lang]} />
    </React.StrictMode>
  );
  return { html, meta: pageMeta(path) };
}

export const SITE = { SITE_URL, OG_IMAGE, NOT_FOUND_META: notFoundMeta() };
