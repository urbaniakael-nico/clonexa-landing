// Rutas del sitio (sin textos: esos estan en los diccionarios). Lo usan la app y el prerender.
import { INDUSTRY_PAGES } from "./industries.js";
import { LANGS, localize } from "./i18n/core.js";

export const SITE_URL = "https://www.clonexa.com.co";
export const ABOUT_PATH = "/que-es-clonexa";
export const OG_IMAGE = `${SITE_URL}/og-clonexa-en-vivo.jpg`;

// [ruta base, slug, icono] de cada industria (el nombre sale de t.industries[slug].name).
export const INDUSTRY_LINKS = INDUSTRY_PAGES.map((page) => [`/${page.slug}`, page.slug, page.icon]);

// Paginas en espanol (ruta base); cada una existe tambien en /en y /fr.
export const BASE_ROUTES = ["/", ABOUT_PATH, ...INDUSTRY_LINKS.map(([href]) => href)];

// Rutas prerenderizadas (ademas de /404), en los tres idiomas.
export const ROUTES = LANGS.flatMap((lang) => BASE_ROUTES.map((base) => localize(lang, base)));

export function normalizePath(pathname) {
  const clean = String(pathname || "/").split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
}

export function industryBySlug(base) {
  return INDUSTRY_PAGES.find((page) => `/${page.slug}` === base) || null;
}
