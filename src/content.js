// Estructura, enlaces y capturas de la landing ("Tu negocio, en vivo"). Los textos de cada idioma
// estan en src/i18n/<idioma>.json; aqui solo quedan ids, iconos, archivos y las funciones que arman
// los enlaces de WhatsApp con el texto del idioma (t = diccionario).
import { fill } from "./i18n/core.js";

// WhatsApp: solo enlaces wa.me, el numero nunca se muestra como texto.
const WHATSAPP_ID = "573144798220";

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_ID}?text=${encodeURIComponent(message)}`;
}

export function waGeneral(t) {
  return waLink(t.common.wa.general);
}

export function demoRequestMessage(t, { name, business, whatsapp }, greeting) {
  const m = t.form.message;
  return [greeting || m.greeting, `${m.name}: ${name}`, `${m.business}: ${business}`, `${m.whatsapp}: ${whatsapp}`].join("\n");
}

// Menu fijo: secciones del inicio (en el idioma de la pagina).
export const NAV_IDS = ["en-vivo", "disena", "funciones", "planes", "preguntas"];

// "Arma tu sistema": [icono, id, peso para el tipo de proyecto]. El nombre sale del diccionario.
export const BUILDER_MODULES = [
  ["🧾", "pedidos", 1],
  ["💵", "caja", 1],
  ["📦", "inventario", 1],
  ["🏭", "bodega", 2],
  ["🚚", "rutas", 2],
  ["🎧", "callcenter", 3],
  ["☎️", "telefonia", 3],
  ["🧑‍💼", "vendedores", 2],
  ["🏬", "tiendas", 2],
  ["🛒", "tiendaOnline", 3],
  ["🕐", "turnos", 1],
  ["💰", "nomina", 2],
  ["🤝", "crm", 1],
  ["🎁", "fidelizacion", 1],
  ["📈", "gerencia", 2],
  ["🤖", "bots", 2],
  ["🎮", "envivo", 2],
  ["🧱", "diseno3d", 1]
];

export const BUILDER_DEFAULT = ["pedidos", "inventario", "callcenter", "envivo"];

// level: "" | "lista" | "completa" | "medida" (el texto sale de t.builder.levels).
export function builderSummary(selected) {
  const chosen = BUILDER_MODULES.filter(([, id]) => selected.includes(id));
  const points = chosen.reduce((sum, [, , weight]) => sum + weight, 0);
  const level = !chosen.length ? "" : points <= 4 ? "lista" : points <= 10 ? "completa" : "medida";
  return { chosen, level, percent: Math.min(100, points * 6) };
}

export function builderWhatsapp(t, selected) {
  const names = BUILDER_MODULES.filter(([, id]) => selected.includes(id)).map(([, id]) => t.builder.modules[id]);
  return waLink(fill(t.builder.waMessage, { list: names.join(", ") }));
}

// Capturas reales de Clonexa (tema claro, empresas demo, datos inventados) en /public/capturas.
// Cada una tiene su version -sm.webp (smWidth px) para celular. El alt sale de t.shots[id].
const shot = (name, width, height, smWidth, frame = "screen") => ({
  src: `/capturas/${name}.webp`,
  srcSm: `/capturas/${name}-sm.webp`,
  width,
  height,
  smWidth,
  frame
});

// Carta nueva en video (demo Brasa & Maiz, datos inventados): en el marco de celular se reproduce
// el video; la portada es su primer cuadro.
const videoShot = (video, poster, width, height) => ({ src: poster, srcSm: poster, width, height, smWidth: width, frame: "phone", video });

export const SHOTS = {
  "rest-carta": videoShot("/clonexa-media/carta-video-demo.mp4", "/clonexa-media/carta-video-demo-poster.webp", 390, 844),
  "hero-caja": shot("hero-caja", 1600, 1000, 800),
  "rest-qr": shot("rest-qr", 780, 1688, 480, "phone"),
  "rest-mesero": shot("rest-mesero", 780, 1688, 480, "phone"),
  "rest-cocina": shot("rest-cocina", 1600, 1000, 800),
  "rest-cuenta": shot("rest-cuenta", 1600, 680, 800),
  "rest-cierre": shot("rest-cierre", 1600, 1000, 800),
  "bar-qr": shot("bar-qr", 780, 1688, 480, "phone"),
  "bar-barra": shot("bar-barra", 1600, 757, 800),
  "bar-juegos": shot("bar-juegos", 1600, 900, 800),
  "bar-cierre": shot("bar-cierre", 1600, 1000, 800),
  "taller-tablero": shot("taller-tablero", 1600, 700, 800),
  "taller-pin": shot("taller-pin", 1600, 1000, 800),
  "taller-produccion": shot("taller-produccion", 1600, 1125, 800),
  "taller-nomina": shot("taller-nomina", 1600, 1125, 800),
  "campo-inicio": shot("campo-inicio", 1600, 1125, 800),
  "campo-materiales": shot("campo-materiales", 1600, 1000, 800),
  "ej-aperturas": shot("ej-aperturas", 1600, 1125, 800),
  "ej-ventas": shot("ej-ventas", 1600, 1125, 800),
  "ej-callcenter": shot("ej-callcenter", 1600, 1125, 800),
  "ej-tickets": shot("ej-tickets", 1600, 1000, 800),
  "ej-solicitudes": shot("ej-solicitudes", 1600, 1125, 800),
  "ej-tesoreria": shot("ej-tesoreria", 1600, 1125, 800)
};

export const HERO_SHOT = "hero-caja";

export function solutionWhatsapp(t, business) {
  return waLink(fill(t.inside.waMessage, { business }));
}

// Planes (los textos en t.plans.items[id]).
export const PLAN_IDS = ["esencial", "completa", "medida"];
export const PLAN_RECOMMENDED = "completa";

export function planWhatsapp(t, id) {
  return waLink(fill(t.plans.waMessage, { name: t.plans.items[id].name }));
}

// Redes con utm_source=web para medir lo que llega desde la pagina.
const withUtm = (url) => `${url}${url.includes("?") ? "&" : "?"}utm_source=web`;

export const SOCIAL = [
  { id: "instagram", label: "Instagram", url: withUtm("https://www.instagram.com/clonexaapp") },
  { id: "facebook", label: "Facebook", url: withUtm("https://www.facebook.com/1397005896827159") },
  { id: "tiktok", label: "TikTok", url: withUtm("https://www.tiktok.com/@clonexxa") },
  { id: "linkedin", label: "LinkedIn", url: withUtm("https://www.linkedin.com/company/146691274") },
  { id: "youtube", label: "YouTube", url: withUtm("https://www.youtube.com/@CLONEXASAAS") }
];

// Paginas legales (el texto del enlace sale de t.common.legalLinks).
export const LEGAL_SLUGS = ["privacidad", "terminos", "borrar-datos"];
