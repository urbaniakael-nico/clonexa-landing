const CLONEXA_ANALYTICS_API_BASE = "https://clonexa-backend-production.up.railway.app";

const CLONEXA_ANALYTICS_ENDPOINT =
  CLONEXA_ANALYTICS_API_BASE.replace(/\/+$/, "") + "/api/v1/public/landing/events";

const CLONEXA_ALLOWED_EVENTS = new Set([
  "page_view",
  "section_view",
  "assembly_view",
  "video_play",
  "video_complete",
  "cta_click",
  "email_click",
  "demo_request"
]);

function cxUuid() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return "cx-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

function cxGetVisitorId() {
  const key = "clonexa_landing_visitor_id";
  let value = localStorage.getItem(key);

  if (!value) {
    value = cxUuid();
    localStorage.setItem(key, value);
  }

  return value;
}

function cxGetSessionId() {
  const key = "clonexa_landing_session_id";
  let value = sessionStorage.getItem(key);

  if (!value) {
    value = cxUuid();
    sessionStorage.setItem(key, value);
  }

  return value;
}

function cxDeviceType() {
  const width = window.innerWidth || 0;
  if (width < 760) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}

function cxBrowser() {
  const ua = navigator.userAgent || "";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if (ua.includes("Firefox/")) return "Firefox";
  return "unknown";
}

function cxParams() {
  const params = new URLSearchParams(window.location.search || "");
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || ""
  };
}

function cxSource() {
  const params = new URLSearchParams(window.location.search || "");
  const utm = params.get("utm_source");
  if (utm) return utm;

  const ref = document.referrer || "";
  if (!ref) return "direct";

  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "referral";
  }
}

function cxPayload(eventType, extra = {}) {
  const utm = cxParams();

  return {
    event_type: eventType,
    visitor_id: cxGetVisitorId(),
    session_id: cxGetSessionId(),
    path: window.location.pathname + window.location.search + window.location.hash,
    source: cxSource(),
    referrer: document.referrer || "",
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    device_type: cxDeviceType(),
    browser: cxBrowser(),
    section: extra.section || "",
    metadata: {
      title: document.title || "",
      href: window.location.href,
      language: navigator.language || "",
      ...extra.metadata
    }
  };
}

function cxTrack(eventType, extra = {}) {
  if (!CLONEXA_ALLOWED_EVENTS.has(eventType)) return;

  const body = JSON.stringify(cxPayload(eventType, extra));

  fetch(CLONEXA_ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    mode: "cors"
  }).catch(() => {});
}

function cxTrackPageView() {
  cxTrack("page_view", {
    section: "top",
    metadata: {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  });
}

function cxTrackSections() {
  const seen = new Set();

  const sectionMap = [
    ["#video", "video"],
    ["#systems", "systems"],
    ["#assembly-focus", "assembly"],
    ["#assembly", "assembly"],
    ["#core", "core"],
    ["#how", "how"],
    ["#contact", "contact"]
  ];

  const targets = sectionMap
    .map(([selector, name]) => {
      const node = document.querySelector(selector);
      return node ? { node, name } : null;
    })
    .filter(Boolean);

  if (!targets.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = targets.find((item) => item.node === entry.target);
      if (!target || seen.has(target.name)) return;

      seen.add(target.name);

      if (target.name === "assembly") {
        cxTrack("assembly_view", { section: "assembly" });
      } else {
        cxTrack("section_view", { section: target.name });
      }
    });
  }, { threshold: 0.35 });

  targets.forEach((item) => observer.observe(item.node));
}

function cxTrackClicks() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a,button");
    if (!link) return;

    const text = String(link.textContent || "").trim().slice(0, 120);
    const href = link.getAttribute("href") || "";

    if (href.startsWith("mailto:")) {
      cxTrack("email_click", {
        section: "contact",
        metadata: { text, href }
      });
      return;
    }

    const isDemo =
      href.includes("#contact") ||
      text.toLowerCase().includes("demo") ||
      text.toLowerCase().includes("solicitar");

    if (isDemo) {
      cxTrack("cta_click", {
        section: "cta",
        metadata: { text, href }
      });
    }
  }, true);
}

function cxTrackVideo() {
  const videos = Array.from(document.querySelectorAll("video"));
  if (!videos.length) return;

  videos.forEach((video, index) => {
    let started = false;
    let completed = false;

    video.addEventListener("play", () => {
      if (started) return;
      started = true;

      cxTrack("video_play", {
        section: "video",
        metadata: {
          index,
          src: video.currentSrc || video.src || ""
        }
      });
    });

    video.addEventListener("ended", () => {
      if (completed) return;
      completed = true;

      cxTrack("video_complete", {
        section: "video",
        metadata: {
          index,
          src: video.currentSrc || video.src || ""
        }
      });
    });
  });
}

function cxBootAnalytics() {
  cxTrackPageView();
  cxTrackSections();
  cxTrackClicks();
  cxTrackVideo();

  window.addEventListener("hashchange", () => {
    cxTrack("section_view", {
      section: window.location.hash.replace("#", "") || "hash"
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", cxBootAnalytics);
} else {
  cxBootAnalytics();
}