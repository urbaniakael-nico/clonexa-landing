// Analitica: page_view y demo_request llevan utm_* y referrer al endpoint del backend.
import test from "node:test";
import assert from "node:assert/strict";

function fakeBrowser(search, referrer = "https://l.instagram.com/") {
  const store = () => {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
  };
  const beacons = [];
  globalThis.window = {
    location: { href: `https://clonexa.com.co/${search}`, pathname: "/", search, host: "clonexa.com.co" },
    localStorage: store(),
    sessionStorage: store(),
    screen: { width: 390, height: 844 },
    innerWidth: 390,
    innerHeight: 844
  };
  globalThis.document = { title: "Clonexa", referrer };
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { language: "es-CO", platform: "iPhone", userAgent: "Mobile", sendBeacon: (url, body) => beacons.push({ url, body: JSON.parse(body) }) || true }
  });
  return beacons;
}

test("page_view y demo_request con utm_* de la URL y el referrer", async () => {
  const beacons = fakeBrowser("?utm_source=instagram&utm_medium=social&utm_campaign=nexa-bio");
  const { sendEvent, trackPageView, LANDING_TRACKING_ENDPOINT } = await import(`../src/analytics.js?t=${Date.now()}`);
  trackPageView();
  trackPageView(); // una sola vez por carga
  sendEvent("demo_request", { form: "agenda-demo", name: "Ana", business: "La Brasa", whatsapp: "3001234567" });
  assert.equal(beacons.length, 2);
  assert.equal(LANDING_TRACKING_ENDPOINT, "https://clonexa-backend-production.up.railway.app/api/v1/landing-analytics/events");
  const [view, demo] = beacons.map((b) => b.body);
  assert.equal(view.event_type, "page_view");
  assert.equal(demo.event_type, "demo_request");
  for (const ev of [view, demo]) {
    assert.equal(ev.utm_source, "instagram");
    assert.equal(ev.utm_medium, "social");
    assert.equal(ev.utm_campaign, "nexa-bio");
    assert.equal(ev.referrer, "https://l.instagram.com/");
    assert.match(ev.url, /utm_source=instagram/);
  }
  assert.equal(demo.extra.business, "La Brasa");
  assert.equal(demo.extra.whatsapp, "3001234567");
});

test("sin utm en la URL se usan los de la sesion; sin nada, vacios", async () => {
  fakeBrowser("?utm_source=facebook");
  const mod = await import(`../src/analytics.js?t=${Date.now()}b`);
  assert.equal(mod.readUtm().utm_source, "facebook");
  window.location.search = "";
  assert.equal(mod.readUtm("").utm_source, "facebook", "se conserva en la sesion");
  fakeBrowser("");
  const fresh = await import(`../src/analytics.js?t=${Date.now()}c`);
  const ev = fresh.buildEvent("page_view");
  assert.equal(ev.utm_source, "");
  assert.equal(ev.utm_campaign, "");
});
