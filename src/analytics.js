// Analitica de la landing: envia eventos al backend de Clonexa
// (/api/v1/landing-analytics/events) con utm_* y referrer.

export const LANDING_TRACKING_ENDPOINT =
  "https://clonexa-backend-production.up.railway.app/api/v1/landing-analytics/events";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const UTM_STORAGE_KEY = "clonexa_landing_utm";

function safeStorage(name) {
  try {
    return window[name] || null;
  } catch (_) {
    return null;
  }
}

function getStorageId(storage, key, prefix) {
  try {
    const current = storage.getItem(key);
    if (current) return current;
    const next = `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    storage.setItem(key, next);
    return next;
  } catch (_) {
    return `${prefix}-${Date.now().toString(36)}`;
  }
}

// utm_* de la URL actual; si no vienen, los primeros que trajo esta sesion.
export function readUtm(search = window.location.search) {
  const params = new URLSearchParams(search || "");
  const fromUrl = {};
  UTM_KEYS.forEach((key) => {
    const value = (params.get(key) || "").trim();
    if (value) fromUrl[key] = value;
  });
  const session = safeStorage("sessionStorage");
  if (Object.keys(fromUrl).length) {
    try {
      session?.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
    } catch (_) {}
    return fromUrl;
  }
  try {
    const saved = JSON.parse(session?.getItem(UTM_STORAGE_KEY) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch (_) {
    return {};
  }
}

export function buildEvent(eventType, extra = {}) {
  const utm = readUtm();
  const payload = {
    event_type: eventType,
    url: window.location.href,
    path: window.location.pathname || "/",
    title: document.title,
    referrer: document.referrer,
    visitor_id: getStorageId(safeStorage("localStorage"), "clonexa_landing_visitor_id", "vis"),
    session_id: getStorageId(safeStorage("sessionStorage"), "clonexa_landing_session_id", "ses"),
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    platform: navigator.platform || "",
    device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    extra: {
      landing: "clonexa-public",
      tracker: "v3",
      host: window.location.host,
      userAgent: navigator.userAgent,
      ...extra
    }
  };
  UTM_KEYS.forEach((key) => {
    payload[key] = utm[key] || "";
  });
  return payload;
}

export function sendEvent(eventType, extra) {
  const body = JSON.stringify(buildEvent(eventType, extra));
  let sent = false;
  try {
    sent = Boolean(navigator.sendBeacon?.(LANDING_TRACKING_ENDPOINT, body));
  } catch (_) {
    sent = false;
  }
  if (!sent) {
    fetch(LANDING_TRACKING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {});
  }
}

export function trackPageView() {
  if (window.__clonexaLandingTrackedV3) return;
  window.__clonexaLandingTrackedV3 = true;
  sendEvent("page_view", { focus: "landing-v3" });
}
