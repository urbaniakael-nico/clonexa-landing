// Metadatos de cada pagina por idioma (title, description, canonical, hreflang, og) y JSON-LD.
// Solo lo usa el prerender (servidor): importa los tres diccionarios.
import es from "./i18n/es.json";
import en from "./i18n/en.json";
import fr from "./i18n/fr.json";
import { HTML_LANG, LANGS, OG_LOCALE, localize, splitLang } from "./i18n/index.jsx";
import { HERO_POSTER_SIZES, HERO_VIDEO } from "./live.js";
import { SOCIAL } from "./content.js";
import { ABOUT_PATH, BASE_ROUTES, SITE_URL, industryBySlug } from "./site.js";

export const DICTS = { es, en, fr };

const sameAs = SOCIAL.map((item) => item.url.replace(/[?&]utm_source=web$/, ""));
const IN_LANGUAGE = { es: "es", en: "en", fr: "fr" };

export const abs = (path) => `${SITE_URL}${path === "/" ? "/" : path}`;

function organization(t) {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Clonexa",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    description: t.meta.orgDescription,
    // La direccion solo vive aqui (datos estructurados, no visibles).
    areaServed: [
      { "@type": "Country", name: "Colombia" },
      { "@type": "Country", name: "United States" }
    ],
    address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
    email: "clonexasaas@gmail.com",
    sameAs
  };
}

function website(lang) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Clonexa",
    alternateName: ["Clonexa SaaS", "clonexa.com.co"],
    url: `${SITE_URL}/`,
    inLanguage: IN_LANGUAGE[lang],
    publisher: { "@id": `${SITE_URL}/#organization` }
  };
}

const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes });

function breadcrumb(t, lang, base, name) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.common.crumbs.home, item: abs(localize(lang, "/")) },
      { "@type": "ListItem", position: 2, name, item: abs(localize(lang, base)) }
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

// Versiones de una pagina en los tres idiomas (hreflang) + x-default (espanol).
export function alternates(base) {
  return [...LANGS.map((lang) => [HTML_LANG[lang], abs(localize(lang, base))]), ["x-default", abs(base)]];
}

// Metadatos de una ruta; null si la ruta no existe (404).
export function pageMeta(pathname) {
  const { lang, base } = splitLang(pathname);
  const t = DICTS[lang];
  if (!BASE_ROUTES.includes(base)) return null;
  const common = { lang, base, path: localize(lang, base), url: abs(localize(lang, base)), htmlLang: HTML_LANG[lang], ogLocale: OG_LOCALE[lang],
    ogLocaleAlternates: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]), ogImageAlt: t.meta.ogImageAlt, alternates: alternates(base) };
  if (base === "/") {
    return {
      ...common,
      title: t.meta.home.title,
      description: t.meta.home.description,
      ogTitle: t.meta.home.ogTitle,
      // Poster de la portada (elemento LCP): se precarga desde el <head>.
      preloadImage: { href: HERO_VIDEO.posterSm, srcset: `${HERO_VIDEO.posterSm} 800w, ${HERO_VIDEO.poster} 1280w`, sizes: HERO_POSTER_SIZES },
      jsonLd: graph(organization(t), website(lang), faqPage(t.faq.items))
    };
  }
  if (base === ABOUT_PATH) {
    return {
      ...common,
      title: t.meta.about.title,
      description: t.meta.about.description,
      jsonLd: graph(
        {
          "@type": "AboutPage",
          "@id": `${abs(localize(lang, ABOUT_PATH))}#page`,
          url: abs(localize(lang, ABOUT_PATH)),
          name: t.meta.about.title,
          inLanguage: IN_LANGUAGE[lang],
          about: { "@id": `${SITE_URL}/#organization` },
          isPartOf: { "@id": `${SITE_URL}/#website` }
        },
        organization(t),
        breadcrumb(t, lang, ABOUT_PATH, t.about.crumb)
      )
    };
  }
  const industry = industryBySlug(base);
  const page = t.industries[industry.slug];
  return {
    ...common,
    title: page.title,
    description: page.description,
    jsonLd: graph(breadcrumb(t, lang, base, page.name), faqPage(page.faq))
  };
}

export function notFoundMeta() {
  return es.meta.notFound;
}
