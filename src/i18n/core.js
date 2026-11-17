// Idiomas de la landing (funciones puras, sin React): espanol (rutas actuales, por defecto), ingles
// (/en/...) y frances (/fr/...). Los textos viven en es.json / en.json / fr.json.

export const LANGS = ["es", "en", "fr"];
export const DEFAULT_LANG = "es";
export const LANG_NAMES = { es: "Español", en: "English", fr: "Français" };
export const LANG_SHORT = { es: "ES", en: "EN", fr: "FR" };
// Formato de numeros y codigos para SEO.
export const NUMBER_LOCALE = { es: "es-CO", en: "en-US", fr: "fr-FR" };
export const HTML_LANG = { es: "es", en: "en", fr: "fr" };
export const OG_LOCALE = { es: "es_CO", en: "en_US", fr: "fr_FR" };
export const LANG_KEY = "clonexa_lang";

// "/en/bares" -> { lang: "en", base: "/bares" }; "/bares" -> { lang: "es", base: "/bares" }.
export function splitLang(pathname) {
  const clean = String(pathname || "/").split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  const m = /^\/(en|fr)(\/.*)?$/.exec(clean);
  if (m) return { lang: m[1], base: m[2] || "/" };
  return { lang: DEFAULT_LANG, base: clean };
}

// Ruta de una pagina en un idioma: ("en", "/bares") -> "/en/bares"; ("en", "/") -> "/en".
export function localize(lang, base = "/") {
  const path = base || "/";
  if (lang === DEFAULT_LANG) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// Enlace a una seccion del inicio en el mismo idioma: ("en", "planes") -> "/en#planes".
export function homeAnchor(lang, id) {
  return `${localize(lang, "/")}#${id}`;
}

// "{n} modulos" -> "5 modulos".
export function fill(text, vars = {}) {
  return String(text).replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

// Montos demo: en espanol en pesos como siempre; en ingles y frances en dolares (pesos / 1000)
// con el formato de cada idioma: $ 2.468.000 · $2,468 · 2 468 $ US.
export function money(lang, cop) {
  if (lang === "es") return `$ ${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(cop)}`;
  const usd = Math.round(cop / 1000);
  if (lang === "fr") return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(usd)} $ US`;
  return `$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(usd)}`;
}

// Guarda la eleccion de idioma (el aviso de idioma ya no vuelve a salir).
export function saveLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (_) {}
}

export function savedLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return LANGS.includes(v) ? v : null;
  } catch (_) {
    return null;
  }
}
