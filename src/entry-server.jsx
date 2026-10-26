// Entrada del prerender: HTML de cada ruta y sus metadatos.
import React from "react";
import { renderToString } from "react-dom/server";
import Root from "./Root.jsx";
import { NOT_FOUND_META, OG_IMAGE, ROUTES, SITE_URL, pageMeta } from "./site.js";

export { ROUTES };

export function render(path) {
  const html = renderToString(
    <React.StrictMode>
      <Root path={path} />
    </React.StrictMode>
  );
  const meta = pageMeta(path);
  return { html, meta: meta ? { ...meta, url: `${SITE_URL}${meta.path === "/" ? "/" : meta.path}` } : null };
}

export const SITE = { SITE_URL, OG_IMAGE, NOT_FOUND_META };
