// Rutas del sitio, metadatos de cada pagina (title, description, canonical, og) y JSON-LD.
// Lo usan la app (navegacion) y el prerender (HTML listo para Google).
import { SOCIAL } from "./content.js";
import { INDUSTRY_PAGES } from "./industries.js";

export const SITE_URL = "https://www.clonexa.com.co";
export const ABOUT_PATH = "/que-es-clonexa";
export const OG_IMAGE = `${SITE_URL}/og-clonexa.png`;

export const INDUSTRY_LINKS = INDUSTRY_PAGES.map((page) => [`/${page.slug}`, page.name, page.icon]);

// Rutas prerenderizadas (ademas de /404).
export const ROUTES = ["/", ABOUT_PATH, ...INDUSTRY_LINKS.map(([href]) => href)];

export function normalizePath(pathname) {
  const clean = String(pathname || "/").split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
}

export function industryBySlug(path) {
  return INDUSTRY_PAGES.find((page) => `/${page.slug}` === path) || null;
}

const sameAs = SOCIAL.map((item) => item.url.replace(/[?&]utm_source=web$/, ""));

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Clonexa",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    "Clonexa es un software en la nube (SaaS) hecho en Bogotá, Colombia, que conecta en un solo sistema los pedidos, el inventario, la caja, el personal, los turnos, la nómina y los reportes de los negocios.",
  areaServed: { "@type": "Country", name: "Colombia" },
  address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
  email: "clonexasaas@gmail.com",
  sameAs
};

const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Clonexa",
  alternateName: ["Clonexa SaaS", "clonexa.com.co"],
  url: `${SITE_URL}/`,
  inLanguage: "es-CO",
  publisher: { "@id": `${SITE_URL}/#organization` }
};

const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes });

function breadcrumb(path, name) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` }
    ]
  };
}

function faqPage(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  };
}

export const ABOUT_META = {
  title: "¿Qué es Clonexa? | Software en la nube hecho en Bogotá",
  description:
    "Clonexa es un software en la nube (SaaS) hecho en Bogotá que conecta pedidos, inventario, caja, personal, turnos, nómina y reportes de los negocios.",
  h1: "¿Qué es Clonexa?"
};

// Metadatos de una ruta; null si la ruta no existe (404).
export function pageMeta(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") {
    return {
      path,
      title: "Clonexa | Sistema para restaurantes, bares, talleres y más",
      description:
        "Clonexa: soluciones listas y sistemas a la medida para restaurantes, bares, talleres, tiendas, call centers y personal en campo. Agenda tu demo gratis.",
      ogTitle: "Clonexa | Si tu negocio lo hace, Clonexa lo conecta",
      jsonLd: graph(ORGANIZATION, WEBSITE)
    };
  }
  if (path === ABOUT_PATH) {
    return {
      path,
      title: ABOUT_META.title,
      description: ABOUT_META.description,
      jsonLd: graph(
        {
          "@type": "AboutPage",
          "@id": `${SITE_URL}${ABOUT_PATH}#page`,
          url: `${SITE_URL}${ABOUT_PATH}`,
          name: ABOUT_META.title,
          inLanguage: "es-CO",
          about: { "@id": `${SITE_URL}/#organization` },
          isPartOf: { "@id": `${SITE_URL}/#website` }
        },
        ORGANIZATION,
        breadcrumb(ABOUT_PATH, "¿Qué es Clonexa?")
      )
    };
  }
  const industry = industryBySlug(path);
  if (industry) {
    return {
      path,
      title: industry.title,
      description: industry.description,
      jsonLd: graph(breadcrumb(path, industry.name), faqPage(industry.faq))
    };
  }
  return null;
}

export const NOT_FOUND_META = {
  title: "Página no encontrada | Clonexa",
  description: "Esta página no existe. Mira las industrias en las que trabaja Clonexa o agenda tu demo."
};
