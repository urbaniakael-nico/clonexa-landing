// Enlace corto de la prospeccion de Clonexa: clonexa.com.co/<letra>/<codigo>
//   r restaurantes · b bares · t talleres · c campo · s tiendas · l transporte
// El servidor pregunta al backend (servidor a servidor, con LANDING_LINK_TOKEN) a donde ir: la pagina del
// nicho con los utm de siempre (utm_source=instagram|facebook|email, utm_medium=prospeccion,
// utm_campaign=<zona>-<tipo>, utm_content=<codigo>). La visita cuenta la apertura del prospecto como hoy.
// Codigo inexistente: pagina principal, sin error. Si el backend no responde: pagina del nicho con
// utm_medium=prospeccion y utm_content (la apertura igual se cuenta).

export const SHORT_RE = /^\/(r|b|t|c|s|l)\/([A-Za-z0-9]{4,12})\/?$/;
export const NICHE_PAGE = {
  r: "/restaurantes#carta-video",
  b: "/bares",
  t: "/talleres-y-fabricas",
  c: "/personal-en-campo",
  s: "/#soluciones",
  l: "/#soluciones"
};
const DEFAULT_BACKEND = "https://clonexa-backend-production.up.railway.app";
const OWN_HOST = /^https:\/\/(www\.)?clonexa\.com\.co\//;

export function matchShortLink(url) {
  const urlPath = String(url || "/").split("?")[0].split("#")[0];
  const m = SHORT_RE.exec(urlPath);
  return m ? { letter: m[1], code: m[2].toUpperCase() } : null;
}

function fallback(letter, code) {
  const [page, hash] = NICHE_PAGE[letter].split("#");
  const q = new URLSearchParams({ utm_medium: "prospeccion", utm_content: code });
  return `${page}?${q.toString()}${hash ? `#${hash}` : ""}`;
}

// Devuelve la URL a la que se redirige (302). Nunca lanza.
export async function resolveShortLink(url, { fetchImpl = globalThis.fetch, backend = process.env.BACKEND_URL || DEFAULT_BACKEND,
  token = process.env.LANDING_LINK_TOKEN || "", timeoutMs = 2500 } = {}) {
  const hit = matchShortLink(url);
  if (!hit) return null;
  if (!token) return fallback(hit.letter, hit.code);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(`${backend.replace(/\/$/, "")}/api/v1/prospecting/link/${hit.letter}/${encodeURIComponent(hit.code)}`,
      { headers: { "X-Landing-Token": token, Accept: "application/json" }, signal: ctrl.signal });
    if (res.status === 404) return "/";
    if (!res.ok) return fallback(hit.letter, hit.code);
    const data = await res.json();
    const dest = String((data && data.destino) || "");
    return OWN_HOST.test(dest) ? dest : fallback(hit.letter, hit.code);
  } catch (_) {
    return fallback(hit.letter, hit.code);
  } finally {
    clearTimeout(timer);
  }
}
