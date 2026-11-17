// Estructura de la landing "Tu negocio, en vivo": portada, "Asi funciona por dentro", simulacion en vivo,
// "Disena tu negocio en 3D", juguetes y reels. Los textos estan en src/i18n/<idioma>.json (t.hero,
// t.inside, t.sim...); aqui quedan archivos, coordenadas y cifras. Todo es de empresas demo.
// La simulacion corre solo en el navegador (sin backend).
import { fill, money } from "./i18n/core.js";

const MEDIA = "/en-vivo";

// Video de la portada: escena 3D del bar animada. Dos tamanos (celular / computador) y su portada.
export const HERO_VIDEO = {
  small: `${MEDIA}/hero-bar-640.mp4`,
  large: `${MEDIA}/hero-bar-960.mp4`,
  poster: `${MEDIA}/hero-bar-poster.webp`,
  posterSm: `${MEDIA}/hero-bar-poster-800.webp`
};

// Ancho del poster en pantalla (el mismo en la precarga del <head> y en la imagen).
export const HERO_POSTER_SIZES = "(max-width: 1040px) 92vw, 640px";

// Carta en video real (la misma de /restaurantes, en tamano chico para los celulares de la pagina).
// Momentos de cada plato: ceviche 0-3 s, nachos 3-6,5 s, lomo 6,5-9 s, hamburguesa 9,5-12 s.
export const CARTA_MINI = `${MEDIA}/carta-mini.mp4`;
export const CARTA_MOMENTS = {
  ceviche: { start: 0, poster: `${MEDIA}/carta-ceviche.webp` },
  nachos: { start: 3.5, poster: `${MEDIA}/carta-nachos.webp` },
  lomo: { start: 7.8, poster: `${MEDIA}/carta-lomo.webp` },
  hamburguesa: { start: 9.5, poster: `${MEDIA}/carta-hamburguesa.webp` }
};

// Ventas del dia en la portada (en pesos; en ingles y frances se muestran en dolares).
export const HERO_SALES_START = 2468000;

// Franja de nichos de la portada: pagina propia o pestana de "Asi funciona por dentro".
// [icono, id de texto (t.niches.items), ruta base o ancla del inicio].
export const NICHE_STRIP = [
  ["🍽️", "restaurantes", "/restaurantes"],
  ["🍸", "bares", "/bares"],
  ["🧵", "talleres", "/talleres-y-fabricas"],
  ["🎧", "callcenters", "/call-centers"],
  ["📍", "campo", "/personal-en-campo"],
  ["🛍️", "tiendas", "#negocio-tienda"],
  ["🛵", "domicilios", "/restaurantes"]
];

// "Asi funciona por dentro": pantallas reales (public/capturas) por nicho. Textos en t.inside.tabs[id].
export const INSIDE_TABS = [
  { id: "restaurante", icon: "🍽️", page: "/restaurantes", shot: "rest-cocina", carta: "hamburguesa" },
  { id: "bar", icon: "🍸", page: "/bares", shot: "bar-barra", carta: "nachos" },
  { id: "taller", icon: "🧵", page: "/talleres-y-fabricas", shot: "taller-produccion" },
  { id: "campo", icon: "📍", page: "/personal-en-campo", shot: "campo-inicio" },
  { id: "callcenter", icon: "🎧", page: "/call-centers", shot: "ej-callcenter" },
  { id: "tienda", icon: "🛍️", page: null, shot: "ej-ventas" }
];

// Simulacion en vivo: escena 3D (public/en-vivo/escena-*.webp) con etiquetas en HTML que cambian solas.
// Las posiciones [x %, y %] estan aqui; los estados de cada etiqueta en t.sim.tabs[id].labels (mismo
// orden). En los textos, "+" al inicio = estado activo (verde), "!" = alerta (ambar), "{t}" = contador.
// Las cifras se mueven solas y con el boton de accion. Montos en pesos (ver money()).
export const SIM_TABS = [
  {
    id: "restaurante",
    icon: "🍽️",
    page: "/restaurantes",
    scene: "restaurante",
    pos: [[33.06, 43.16], [44.94, 44.6], [57.17, 46.09], [28.88, 55.47], [42.21, 57.31], [56, 59.22], [23.91, 70.09], [38.96, 72.46],
      [23.14, 23.04], [33.5, 24.05], [77.54, 33.26], [50.35, 43.17], [88.04, 64.46]],
    zones: [[28.48, 41.95], [36.71, 93.34], [83, 88.69]],
    kpis: [
      { id: "mesas", value: 5, color: "amber", min: 3, max: 8 },
      { id: "pedidos", value: 48, color: "green", grow: true },
      { id: "cocina", value: 3, color: "sky", min: 1, max: 7 },
      { id: "ventas", value: 1920000, color: "pink", money: true, grow: true }
    ]
  },
  {
    id: "bar",
    icon: "🍸",
    page: "/bares",
    scene: "bar",
    pos: [[34.64, 35.89], [46.74, 37.02], [31.07, 45.88], [44.61, 47.3], [58.58, 48.76], [26.51, 58.63], [41.88, 60.48], [57.8, 62.39],
      [74.31, 64.37], [16.78, 26.77], [79.91, 23.1], [50.7, 44.09]],
    zones: [],
    kpis: [
      { id: "mesas", value: 5, color: "amber", min: 3, max: 9 },
      { id: "pedidos", value: 37, color: "green", grow: true },
      { id: "canciones", value: 3, color: "sky", min: 1, max: 6 },
      { id: "ventas", value: 2468000, color: "pink", money: true, grow: true }
    ]
  },
  {
    id: "taller",
    icon: "🧵",
    page: "/talleres-y-fabricas",
    scene: "taller",
    pos: [[18, 29.76], [26.59, 30.68], [44.34, 32.58], [22.36, 39.75], [72.89, 33.82], [10.76, 51.82], [36.29, 33.65], [53.78, 35.57], [33.19, 42.77]],
    zones: [[32.61, 52.85], [72.94, 51.21], [73.71, 62.67], [6.99, 82.43]],
    kpis: [
      { id: "prendas", value: 112, color: "green", grow: true },
      { id: "lotes", value: 4, color: "amber", min: 3, max: 6 },
      { id: "pausa", value: 1, color: "sky", min: 0, max: 3 },
      { id: "avance", value: 72, color: "pink", percent: true, grow: true, max: 98 }
    ]
  },
  {
    id: "campo",
    icon: "📍",
    page: "/personal-en-campo",
    scene: "campo",
    pos: [[39.69, 35.57], [29.44, 34.65], [16.71, 41.24], [17.41, 48.96], [61.83, 37.54], [72.77, 38.52], [83.61, 47.73], [90.29, 25.78]],
    zones: [[15.69, 84.43], [77.55, 93.08]],
    kpis: [
      { id: "turno", value: 30, color: "green", min: 26, max: 40 },
      { id: "fuera", value: 1, color: "amber", min: 0, max: 2 },
      { id: "pausa", value: 2, color: "sky", min: 0, max: 4 },
      { id: "material", value: 14, color: "pink", grow: true }
    ]
  },
  {
    id: "callcenter",
    icon: "🎧",
    page: "/call-centers",
    scene: "call-center",
    pos: [[27.27, 36.82], [19.8, 51.62], [42.66, 37.4], [39.34, 52.57], [58.39, 37.99], [59.43, 53.54], [74.46, 38.6], [80.08, 54.54], [89.48, 43.49]],
    zones: [[35.44, 95.37], [88.99, 74.17]],
    kpis: [
      { id: "cola", value: 4, color: "amber", min: 1, max: 7 },
      { id: "llamada", value: 7, color: "green", min: 5, max: 8 },
      { id: "espera", value: 38, color: "sky", seconds: true, min: 20, max: 70 },
      { id: "ventas", value: 23, color: "pink", grow: true }
    ]
  }
];

export const SCENE_SRC = (scene) => ({
  src: `${MEDIA}/escena-${scene}.webp`,
  srcSm: `${MEDIA}/escena-${scene}-768.webp`
});

export function mmss(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// Texto de una etiqueta: quita el marcador (+ activo, ! alerta) y llena el contador.
export function labelState(raw, seconds) {
  const text = String(raw);
  const kind = text[0] === "+" ? "on" : text[0] === "!" ? "warn" : "";
  return { kind, text: (kind ? text.slice(1) : text).replace("{t}", mmss(seconds)) };
}

export function kpiText(kpi, value, lang = "es") {
  if (kpi.money) return money(lang, value);
  if (kpi.percent) return `${Math.round(value)} %`;
  if (kpi.seconds) return `${Math.floor(value / 60)}:${String(Math.round(value) % 60).padStart(2, "0")}`;
  return String(Math.round(value));
}

// Paso automatico de una cifra: las que crecen solo suben; las demas se mueven +-1 dentro de su rango.
export function driftKpi(kpi, value, rand = Math.random) {
  if (kpi.money) return value + Math.round((18000 + rand() * 70000) / 1000) * 1000;
  if (kpi.grow) {
    const next = value + (rand() < 0.6 ? 1 : 0);
    return kpi.max ? Math.min(kpi.max, next) : next;
  }
  const step = kpi.seconds ? Math.round(rand() * 8 - 4) : rand() < 0.5 ? -1 : 1;
  return Math.max(kpi.min ?? 0, Math.min(kpi.max ?? Infinity, value + step));
}

// Efecto del boton de accion de cada nicho: cifras nuevas + aviso visible (t.sim.tabs[id].toast).
export function simAction(tabId, kpis, rand = Math.random, template = "") {
  const next = { ...kpis };
  let n = "";
  if (tabId === "restaurante") {
    n = 1 + Math.floor(rand() * 8);
    next.pedidos += 1;
    next.cocina = Math.min(9, next.cocina + 1);
    next.ventas += 30000 + Math.round(rand() * 60) * 1000;
  } else if (tabId === "bar") {
    n = 1 + Math.floor(rand() * 9);
    next.pedidos += 1;
    next.ventas += 24000 + Math.round(rand() * 50) * 1000;
  } else if (tabId === "taller") {
    next.prendas += 50;
    next.avance = 0;
  } else if (tabId === "campo") {
    next.turno += 1;
  } else if (tabId === "callcenter") {
    next.cola += 1;
    next.llamada = Math.min(8, next.llamada + 1);
  }
  return { kpis: next, toast: fill(template, { n }) };
}

// "Disena tu negocio en 3D" (alt y textos en t.design).
export const DESIGN_3D = {
  main: { src: `${MEDIA}/constructor-amueblar.webp`, srcSm: `${MEDIA}/constructor-amueblar-640.webp`, width: 1200, height: 720 },
  templates: { src: `${MEDIA}/constructor-plantillas.webp`, srcSm: `${MEDIA}/constructor-plantillas-480.webp`, width: 800, height: 336 },
  characters: [
    { src: `${MEDIA}/personaje-humano.webp`, width: 320, height: 373 },
    { src: `${MEDIA}/personaje-caricatura.webp`, width: 320, height: 349 }
  ]
};

// "Miralo en 15 segundos": reels verticales que publicamos en redes (titulos en t.reels.items).
export const REELS = ["restaurante", "bar", "taller", "callcenter", "campo", "domicilios"].map((id) => ({
  id,
  src: `${MEDIA}/reels/en-vivo-${id}.mp4`,
  poster: `${MEDIA}/reels/en-vivo-${id}.webp`
}));
