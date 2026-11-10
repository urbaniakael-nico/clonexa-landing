// Carta en video con QR: cuando la visita viene de la prospeccion de Nexa a restaurantes
// (utm_medium=prospeccion y campaña <zona>-<tipo> de comida) o con #carta-video, la landing muestra
// arriba la demo de la carta video y el boton de WhatsApp con el codigo del negocio.
// El codigo (utm_content) liga la conversacion al negocio; no es un dato personal.

import { waLink } from "./content.js";

export const CARTA_PAGE = "/restaurantes";
// Carta REAL de la empresa demo Brasa & Maiz (datos inventados), la misma que imprime
// scripts/menu_video_demo.py del backend.
export const CARTA_DEMO_URL = "https://clonexa-backend-production.up.railway.app/carta-qr?t=KS6rM9ZZyYpyOKdyvBBzXwqLA88KDuXd";
export const CARTA_TYPES = ["restaurante", "comidas-rapidas", "cafe", "panaderia"];
export const CARTA_VIDEO = {
  src: "/clonexa-media/carta-video-demo.mp4",
  poster: "/clonexa-media/carta-video-demo-poster.webp",
  qr: "/clonexa-media/carta-video-qr.svg"
};

function clean(value) {
  return String(value || "").trim();
}

// { show, code } desde ?utm_*, los utm guardados de la sesion y el #hash.
export function cartaVideoTarget({ search = "", hash = "", saved = {} } = {}) {
  const params = new URLSearchParams(search || "");
  const pick = (key) => clean(params.get(key)) || clean(saved[key]);
  const medium = pick("utm_medium").toLowerCase();
  const campaign = pick("utm_campaign").toLowerCase();
  const content = pick("utm_content").toUpperCase();
  const fromProspect = medium === "prospeccion" && CARTA_TYPES.some((t) => campaign === t || campaign.endsWith(`-${t}`));
  const code = medium === "prospeccion" && /^[A-Z0-9]{6}$/.test(content) ? content : "";
  return { show: fromProspect || clean(hash).toLowerCase() === "#carta-video", code };
}

export function cartaWhatsapp(code) {
  const text = code ? `Hola, vi la carta video (código ${code})` : "Hola, vi la carta video de Clonexa y quiero una demo";
  return waLink(text); // el numero vive solo en content.js
}
