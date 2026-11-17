// Paginas legales: encabezado y pie compartidos, rutas limpias e idiomas.
// /privacidad, /terminos y /borrar-datos (y /en/... y /fr/...) responden con y sin "/" final;
// /privacy, /terms y /data-deletion redirigen (301) a su version en espanol.
// Las versiones en ingles y frances son traducciones: si hay diferencias, prevalece la version en espanol.

export const LEGAL_LANGS = ["es", "en", "fr"];

export const LEGAL_PAGES = {
  privacidad: { es: "Privacidad", en: "Privacy", fr: "Confidentialité" },
  terminos: { es: "Términos", en: "Terms", fr: "Conditions" },
  "borrar-datos": { es: "Borrar mis datos", en: "Delete my data", fr: "Supprimer mes données" }
};

export const LEGAL_REDIRECTS = {
  privacy: "privacidad",
  terms: "terminos",
  "data-deletion": "borrar-datos"
};

const SITE_URL = "https://www.clonexa.com.co";
const OG_LOCALE = { es: "es_CO", en: "en_US", fr: "fr_FR" };
const SHORT = { es: "ES", en: "EN", fr: "FR" };
const NAMES = { es: "Español", en: "English", fr: "Français" };

const UI = {
  es: {
    sections: [["soluciones", "Negocios"], ["en-vivo", "En vivo 3D"], ["disena", "Diseña en 3D"], ["planes", "Planes"], ["preguntas", "Preguntas"]],
    cta: "Pide tu demo gratis",
    home: "Clonexa, ir al inicio",
    open: "Abrir menú",
    close: "Cerrar menú",
    lang: "Idioma"
  },
  en: {
    sections: [["soluciones", "Industries"], ["en-vivo", "Live 3D"], ["disena", "Design in 3D"], ["planes", "Pricing"], ["preguntas", "FAQ"]],
    cta: "Get your free demo",
    home: "Clonexa, go to home page",
    open: "Open menu",
    close: "Close menu",
    lang: "Language"
  },
  fr: {
    sections: [["soluciones", "Secteurs"], ["en-vivo", "En direct 3D"], ["disena", "Conception 3D"], ["planes", "Tarifs"], ["preguntas", "FAQ"]],
    cta: "Demandez votre démo gratuite",
    home: "Clonexa, aller à l’accueil",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
    lang: "Langue"
  }
};

const MENU_ICON =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
const CLOSE_ICON =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

// Ruta de una pagina en un idioma: ("en", "/privacidad") -> "/en/privacidad"; ("en", "/") -> "/en".
export function legalPath(lang, base) {
  if (lang === "es") return base;
  return base === "/" ? `/${lang}` : `/${lang}${base}`;
}

function brand(footer, lang) {
  return `<a href="${legalPath(lang, "/")}" class="brand${footer ? " brandFooter" : ""}" aria-label="${UI[lang].home}">
      <img class="legalLogo" src="/brand/clonexa-logo.svg" alt="Clonexa" width="181" height="32" />
    </a>`;
}

export function legalLinks(current, lang = "es") {
  return Object.entries(LEGAL_PAGES)
    .map(([slug, label]) => {
      const aria = slug === current ? ' aria-current="page"' : "";
      return `<a href="${legalPath(lang, `/${slug}`)}"${aria}>${label[lang]}</a>`;
    })
    .join(' <span aria-hidden="true">·</span> ');
}

function langLinks(current, lang) {
  return LEGAL_LANGS.map(
    (l) =>
      `<a href="${legalPath(l, `/${current}`)}" hreflang="${l}" lang="${l}" title="${NAMES[l]}"${l === lang ? ' aria-current="true"' : ""} data-lang-link="${l}">${SHORT[l]}</a>`
  ).join(" ");
}

export function legalHeader(lang = "es", current = "privacidad") {
  const ui = UI[lang];
  const home = legalPath(lang, "/");
  const links = ui.sections.map(([id, label]) => `<a href="${home}#${id}">${label}</a>`).join("\n        ");
  return `<nav class="nav">
      ${brand(false, lang)}
      <div class="navLinks">
        ${links}
        <span class="legalLang" aria-label="${ui.lang}">${langLinks(current, lang)}</span>
        <a href="${home}#agenda" class="navCta">${ui.cta}</a>
      </div>
      <button class="menuButton" type="button" data-menu-open aria-label="${ui.open}">${MENU_ICON}</button>
    </nav>
    <div class="mobileMenu" data-menu hidden>
      <button class="closeButton" type="button" data-menu-close aria-label="${ui.close}">${CLOSE_ICON}</button>
      ${ui.sections.map(([id, label]) => `<a href="${home}#${id}">${label}</a>`).join("\n      ")}
      <span class="legalLang" aria-label="${ui.lang}">${langLinks(current, lang)}</span>
      <a href="${home}#agenda">${ui.cta}</a>
    </div>`;
}

export function legalFooter(current, lang = "es") {
  return `<footer class="footer">
      ${brand(true, lang)}
      <div class="footerRight">
        <span>© 2026 Clonexa</span>
        <nav class="footerLegal" aria-label="Legal">${legalLinks(current, lang)}</nav>
        <span class="legalLang" aria-label="${UI[lang].lang}">${langLinks(current, lang)}</span>
      </div>
    </footer>`;
}

// canonical, hreflang (es/en/fr + x-default) y og:locale de una pagina legal.
export function legalHead(current, lang = "es") {
  const abs = (l) => `${SITE_URL}${legalPath(l, `/${current}`)}`;
  return [
    `<link rel="canonical" href="${abs(lang)}" />`,
    ...LEGAL_LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${abs("es")}" />`,
    `<meta property="og:url" content="${abs(lang)}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`
  ].join("\n    ");
}

// Devuelve la ruta a servir (o la redireccion) para una URL de las paginas legales.
export function resolveLegalPath(url) {
  const [path, query = ""] = url.split("?");
  const match = /^\/(?:(en|fr)\/)?([a-z-]+)\/?$/.exec(path);
  if (!match) return null;
  const lang = match[1] || "";
  const slug = match[2];
  if (!lang && LEGAL_REDIRECTS[slug]) {
    return { redirect: `/${LEGAL_REDIRECTS[slug]}${query ? `?${query}` : ""}` };
  }
  if (LEGAL_PAGES[slug]) {
    return { rewrite: `${lang ? `/${lang}` : ""}/${slug}/index.html${query ? `?${query}` : ""}` };
  }
  return null;
}

function legalMiddleware(req, res, next) {
  const resolved = resolveLegalPath(req.url || "/");
  if (resolved?.redirect) {
    res.statusCode = 301;
    res.setHeader("Location", resolved.redirect);
    res.end();
    return;
  }
  if (resolved?.rewrite) req.url = resolved.rewrite;
  next();
}

export function legalPagesPlugin() {
  return {
    name: "clonexa-legal-pages",
    configureServer(server) {
      server.middlewares.use(legalMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(legalMiddleware);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const current = /<body[^>]*data-legal="([a-z-]+)"/.exec(html)?.[1];
        if (!current) return html;
        const lang = /<body[^>]*data-lang="(en|fr)"/.exec(html)?.[1] || "es";
        return html
          .replace("<!--LEGAL_HEAD-->", legalHead(current, lang))
          .replace("<!--LEGAL_HEADER-->", legalHeader(lang, current))
          .replace("<!--LEGAL_FOOTER-->", legalFooter(current, lang));
      }
    }
  };
}
