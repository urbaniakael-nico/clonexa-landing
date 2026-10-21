// Paginas legales: encabezado y pie compartidos y rutas limpias.
// /privacidad, /terminos y /borrar-datos responden con y sin "/" final;
// /privacy, /terms y /data-deletion redirigen (301) a su version en espanol.

export const LEGAL_PAGES = {
  privacidad: "Privacidad",
  terminos: "Términos",
  "borrar-datos": "Borrar mis datos"
};

export const LEGAL_REDIRECTS = {
  privacy: "privacidad",
  terms: "terminos",
  "data-deletion": "borrar-datos"
};

const MENU_ICON =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
const CLOSE_ICON =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

const SECTIONS = [
  ["/#demo", "Demo en vivo"],
  ["/#negocios", "Negocios"],
  ["/#planes", "Planes"],
  ["/#preguntas", "Preguntas"]
];

function brand(footer) {
  return `<a href="/" class="brand${footer ? " brandFooter" : ""}" aria-label="Clonexa, ir al inicio">
      <img class="legalLogo" src="/brand/clonexa-logo.svg" alt="Clonexa" width="181" height="32" />
    </a>`;
}

export function legalLinks(current) {
  return Object.entries(LEGAL_PAGES)
    .map(([slug, label]) => {
      const aria = slug === current ? ' aria-current="page"' : "";
      return `<a href="/${slug}"${aria}>${label}</a>`;
    })
    .join(' <span aria-hidden="true">·</span> ');
}

export function legalHeader() {
  const links = SECTIONS.map(([href, label]) => `<a href="${href}">${label}</a>`).join("\n        ");
  return `<nav class="nav">
      ${brand(false)}
      <div class="navLinks">
        ${links}
        <a href="/#agenda" class="navCta">Agenda tu demo</a>
      </div>
      <button class="menuButton" type="button" data-menu-open aria-label="Abrir menu">${MENU_ICON}</button>
    </nav>
    <div class="mobileMenu" data-menu hidden>
      <button class="closeButton" type="button" data-menu-close aria-label="Cerrar menu">${CLOSE_ICON}</button>
      ${SECTIONS.map(([href, label]) => `<a href="${href}">${label}</a>`).join("\n      ")}
      <a href="/#agenda">Agenda tu demo</a>
    </div>`;
}

export function legalFooter(current) {
  return `<footer class="footer">
      ${brand(true)}
      <div class="footerRight">
        <span>© 2026 Clonexa · Bogotá, Colombia</span>
        <nav class="footerLegal" aria-label="Legal">${legalLinks(current)}</nav>
      </div>
    </footer>`;
}

// Devuelve la ruta a servir (o la redireccion) para una URL de las paginas legales.
export function resolveLegalPath(url) {
  const [path, query = ""] = url.split("?");
  const match = /^\/([a-z-]+)\/?$/.exec(path);
  if (!match) return null;
  const slug = match[1];
  if (LEGAL_REDIRECTS[slug]) {
    return { redirect: `/${LEGAL_REDIRECTS[slug]}${query ? `?${query}` : ""}` };
  }
  if (LEGAL_PAGES[slug]) {
    return { rewrite: `/${slug}/index.html${query ? `?${query}` : ""}` };
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
        return html
          .replace("<!--LEGAL_HEADER-->", legalHeader())
          .replace("<!--LEGAL_FOOTER-->", legalFooter(current));
      }
    }
  };
}
