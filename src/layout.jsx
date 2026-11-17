// Piezas compartidas por todas las paginas: tema, barra, selector de idioma, pie, capturas,
// preguntas, formulario de demo, aviso de idioma y WhatsApp flotante. Todo se puede renderizar en
// el servidor (prerender): nada lee window/document durante el render.
import React from "react";
import { sendEvent } from "./analytics.js";
import { LEGAL_SLUGS, NAV_IDS, SHOTS, SOCIAL, demoRequestMessage, waGeneral, waLink } from "./content.js";
import { whenIdle } from "./defer.jsx";
import { validateDemoForm } from "./form.js";
import { LANGS, LANG_NAMES, LANG_SHORT, localize, saveLang, savedLang, useI18n } from "./i18n/index.jsx";
import { SOCIAL_ICONS, WhatsappIcon } from "./icons.jsx";
import { ABOUT_PATH, INDUSTRY_LINKS } from "./site.js";

const THEME_KEY = "clonexa_theme";

// En el servidor y en el primer render del navegador el tema es "dark" (igual en los dos para
// hidratar sin diferencias); despues del montaje se toma el que ya fijo index.html.
export function useTheme() {
  const [theme, setThemeState] = React.useState("dark");

  React.useEffect(() => {
    setThemeState(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (_) {}
    if (saved) return undefined;
    // Sin eleccion guardada: sigue el tema del sistema.
    const media = window.matchMedia?.("(prefers-color-scheme: light)");
    if (!media) return undefined;
    const onChange = () => {
      const next = media.matches ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      setThemeState(next);
    };
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  function setTheme(next) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_) {}
    setThemeState(next);
  }

  return [theme, setTheme];
}

export function Logo({ className = "" }) {
  return (
    <span className={`logo ${className}`}>
      <img className="logoDark" src="/brand/clonexa-logo.svg" alt="Clonexa" width="181" height="32" />
      <img className="logoLight" src="/brand/clonexa-logo-claro.svg" alt="Clonexa" width="181" height="32" loading="lazy" />
    </span>
  );
}

export function ExternalLink({ href, className, children, ...rest }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function ThemeSwitch({ theme, setTheme }) {
  const { t } = useI18n();
  return (
    <div className="themeSwitch" role="group" aria-label={t.common.theme.group}>
      <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
        <span aria-hidden="true">🌙</span>
        <span className="themeLabel"> {t.common.theme.dark}</span>
      </button>
      <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
        <span aria-hidden="true">☀️</span>
        <span className="themeLabel"> {t.common.theme.light}</span>
      </button>
    </div>
  );
}

// Lleva a la MISMA pagina en otro idioma (conserva ?utm y #seccion) y recuerda la eleccion.
function goToLang(event, lang, base) {
  saveLang(lang);
  const extra = window.location.search + window.location.hash;
  if (extra) {
    event.preventDefault();
    window.location.href = localize(lang, base) + extra;
  }
}

// Selector ES · EN · FR (compacto). Se usa en la barra, en el menu del celular y en el pie.
export function LangSwitch({ className = "" }) {
  const { t, lang, base } = useI18n();
  return (
    <nav className={`langSwitch ${className}`} aria-label={t.common.lang.label}>
      {LANGS.map((l) => (
        <a
          key={l}
          href={localize(l, base)}
          hrefLang={l}
          lang={l}
          title={LANG_NAMES[l]}
          aria-label={LANG_NAMES[l]}
          aria-current={l === lang ? "true" : undefined}
          onClick={(event) => goToLang(event, l, base)}
        >
          {LANG_SHORT[l]}
        </a>
      ))}
    </nav>
  );
}

// Primera visita con el navegador en ingles o frances (y sin eleccion guardada): aviso pequeno con
// un boton para ver la misma pagina en ese idioma. No redirige solo (malo para SEO).
const NOTICE = {
  en: { question: "View in English?", yes: "Yes", close: "Close" },
  fr: { question: "Voir en français ?", yes: "Oui", close: "Fermer" },
  es: { question: "¿Ver en español?", yes: "Sí", close: "Cerrar" }
};

export function LangNotice() {
  const { lang, base } = useI18n();
  const [target, setTarget] = React.useState(null);
  React.useEffect(
    () =>
      whenIdle(() => {
        if (savedLang()) return;
        const first = String((navigator.languages && navigator.languages[0]) || navigator.language || "").slice(0, 2).toLowerCase();
        if ((first === "en" || first === "fr") && first !== lang) setTarget(first);
      }, 4000),
    [lang]
  );
  if (!target) return null;
  const text = NOTICE[target];
  return (
    <div className="langNotice" role="region" aria-label={text.question} lang={target}>
      <span>{text.question}</span>
      <a href={localize(target, base)} hrefLang={target} className="btn btnSmall" onClick={(event) => goToLang(event, target, base)}>
        {text.yes}
      </a>
      <button
        type="button"
        className="langNoticeClose"
        aria-label={text.close}
        onClick={() => {
          saveLang(lang);
          setTarget(null);
        }}
      >
        ✕
      </button>
    </div>
  );
}

// Cierra un <details> al hacer clic fuera o con Escape.
function useCloseDetails(ref) {
  React.useEffect(() => {
    function onPointer(event) {
      if (ref.current?.open && !ref.current.contains(event.target)) ref.current.open = false;
    }
    function onKey(event) {
      if (event.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref]);
}

export function Header({ theme, setTheme }) {
  const { t, base, href, anchor } = useI18n();
  const industries = React.useRef(null);
  const menu = React.useRef(null);
  useCloseDetails(industries);
  useCloseDetails(menu);
  const aria = (path) => (path === base ? { "aria-current": "page" } : {});
  const nav = t.common.nav;

  return (
    <div className="navBar">
      <header className="wrap nav">
        <a href={href("/")} className="navBrand" aria-label={t.common.logoHome}>
          <Logo />
        </a>
        <nav className="navLinks" aria-label={nav.sections}>
          <details className="navDrop" ref={industries}>
            <summary>{nav.business}</summary>
            <ul className="dropList">
              {INDUSTRY_LINKS.map(([path, slug, icon]) => (
                <li key={path}>
                  <a href={href(path)} {...aria(path)}>
                    <span aria-hidden="true">{icon}</span> {t.industries[slug].name}
                  </a>
                </li>
              ))}
              <li>
                <a href={href(ABOUT_PATH)} {...aria(ABOUT_PATH)}>
                  <span aria-hidden="true">💡</span> {nav.about}
                </a>
              </li>
            </ul>
          </details>
          {NAV_IDS.map((id) => (
            <a key={id} href={anchor(id)}>
              {nav.links[id]}
            </a>
          ))}
        </nav>
        <div className="navRight">
          <LangSwitch className="langNav" />
          <ThemeSwitch theme={theme} setTheme={setTheme} />
          <a href="#agenda" className="btn btnSmall navCta">
            {t.common.ctaNav}
          </a>
          <details className="mobileMenu" ref={menu}>
            <summary aria-label={nav.menu}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <nav className="mobilePanel" aria-label={nav.menu}>
              <LangSwitch className="langMobile" />
              <p className="mobileTitle">{nav.business}</p>
              <ul>
                {INDUSTRY_LINKS.map(([path, slug, icon]) => (
                  <li key={path}>
                    <a href={href(path)} {...aria(path)}>
                      <span aria-hidden="true">{icon}</span> {t.industries[slug].name}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="mobileMore">
                {NAV_IDS.map((id) => (
                  <li key={id}>
                    <a href={anchor(id)}>{nav.links[id]}</a>
                  </li>
                ))}
                <li>
                  <a href={href(ABOUT_PATH)}>{nav.about}</a>
                </li>
                <li>
                  <a href="#agenda" className="btn btnBlock">
                    {t.common.cta}
                  </a>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </header>
    </div>
  );
}

export function SectionHead({ kicker, title, sub, id, level = 2 }) {
  const Heading = `h${level}`;
  return (
    <div className="sectionHead">
      <p className="kicker">{kicker}</p>
      <Heading id={id}>{title}</Heading>
      {sub && <p className="sub">{sub}</p>}
    </div>
  );
}

// Captura real de Clonexa: celular (390 px) o pantalla (1280 px), con su version pequena.
export function ShotImage({ id, sizes, eager = false, className = "" }) {
  const { t } = useI18n();
  const shot = SHOTS[id];
  const alt = t.shots[id];
  if (shot.video) {
    return (
      <video
        className={`shotImg shot-${shot.frame} shotVideo ${className}`}
        src={shot.video}
        poster={shot.src}
        width={shot.width}
        height={shot.height}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }
  return (
    <img
      className={`shotImg shot-${shot.frame} ${className}`}
      src={shot.src}
      srcSet={`${shot.srcSm} ${shot.smWidth}w, ${shot.src} ${shot.width}w`}
      sizes={sizes}
      alt={alt}
      width={shot.width}
      height={shot.height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding={eager ? "sync" : "async"}
    />
  );
}

// Preguntas frecuentes (acordeon). La primera abierta.
export function FaqList({ items, idPrefix = "faq", twoColumns = false }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div className={`faq${twoColumns ? " faqTwo" : ""}`}>
      {items.map(([question, answer], index) => {
        const isOpen = open === index;
        return (
          <div className={`faqItem${isOpen ? " faqOpen" : ""}`} key={question}>
            <h3>
              <button
                type="button"
                id={`${idPrefix}-q-${index}`}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-a-${index}`}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                <span>{question}</span>
                <span className="faqIcon" aria-hidden="true" />
              </button>
            </h3>
            <div id={`${idPrefix}-a-${index}`} role="region" aria-labelledby={`${idPrefix}-q-${index}`} hidden={!isOpen}>
              <p>{answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const EMPTY_FORM = { name: "", business: "", whatsapp: "" };

// Formulario de demo ("Pide tu demo gratis"): evento demo_request (con utm, codigo de prospecto e
// idioma) + abre WhatsApp con los datos. En las paginas de industria el mensaje empieza con la industria.
export function DemoForm({ greeting, page = "inicio", sub }) {
  const { t, lang } = useI18n();
  const f = t.form;
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [errors, setErrors] = React.useState({});
  const [sentLink, setSentLink] = React.useState("");

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    const found = validateDemoForm(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`demo-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    const data = { name: form.name.trim(), business: form.business.trim(), whatsapp: form.whatsapp.trim() };
    sendEvent("demo_request", { form: "agenda-demo", page, lang, ...data });
    const link = waLink(demoRequestMessage(t, data, greeting));
    window.open(link, "_blank", "noopener");
    setSentLink(link);
    setForm(EMPTY_FORM);
  }

  const field = (id, props) => (
    <div className="field">
      <label htmlFor={`demo-${id}`}>{f[id]}</label>
      <input
        id={`demo-${id}`}
        value={form[id]}
        onChange={update(id)}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `demo-${id}-error` : undefined}
        {...props}
      />
      {errors[id] && (
        <p className="fieldError" id={`demo-${id}-error`}>
          {f.errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <section id="agenda" className="wrap section" aria-labelledby="agenda-titulo">
      <div className="cta">
        <div>
          <h2 id="agenda-titulo">
            {f.title1}
            <span className="grad gradInline">{f.titleGrad}</span>
            {f.title2}
          </h2>
          <p className="ctaSub">{sub || f.sub}</p>
          {greeting && (
            <ExternalLink href={waLink(greeting)} className="ctaWa" data-wa={`demo-${page}`}>
              <WhatsappIcon /> {t.common.wa.write}
            </ExternalLink>
          )}
        </div>
        {sentLink ? (
          <div className="thanks" role="status">
            <h3>{f.thanksTitle}</h3>
            <p>{f.thanksText}</p>
            <ExternalLink href={sentLink} className="btn btnBlock" data-wa="formulario">
              {f.openWa}
            </ExternalLink>
            <button type="button" className="linkButton" onClick={() => setSentLink("")}>
              {f.again}
            </button>
          </div>
        ) : (
          <form className="demoForm" onSubmit={submit} noValidate>
            {field("name", { autoComplete: "name", placeholder: f.namePh })}
            {field("business", { autoComplete: "organization", placeholder: f.businessPh })}
            {field("whatsapp", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: f.whatsappPh })}
            <button type="submit" className="btn btnBlock">
              {t.common.cta}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const { t, href, fill } = useI18n();
  const ft = t.common.footer;
  return (
    <footer className="wrap footer">
      <div className="footerRow">
        <Logo className="logoSmall" />
        <p>© 2026 Clonexa</p>
        <nav aria-label={ft.legal} className="footerLegal">
          {LEGAL_SLUGS.map((slug) => (
            <a key={slug} href={href(`/${slug}`)}>
              {t.common.legalLinks[slug]}
            </a>
          ))}
        </nav>
        <LangSwitch className="langFooter" />
        <ul className="footerSocial" aria-label={ft.social}>
          {SOCIAL.map((item) => {
            const Icon = SOCIAL_ICONS[item.id];
            return (
              <li key={item.id}>
                <ExternalLink href={item.url} className={`social-${item.id}`} aria-label={fill(ft.on, { network: item.label })}>
                  <Icon />
                </ExternalLink>
              </li>
            );
          })}
        </ul>
      </div>
      <nav aria-label={ft.business} className="footerNiches">
        {INDUSTRY_LINKS.map(([path, slug]) => (
          <a key={path} href={href(path)}>
            {t.industries[slug].name}
          </a>
        ))}
        <a href={href(ABOUT_PATH)}>{t.common.nav.about}</a>
      </nav>
    </footer>
  );
}

// Boton flotante: se esconde mientras el formulario o el pie estan en pantalla
// y, en celular, mientras se ve el encabezado (no tapa el video ni el titulo).
export function FloatingWhatsapp({ message }) {
  const { t } = useI18n();
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    const mobile = Boolean(window.matchMedia?.("(max-width: 760px)").matches);
    const targets = [
      mobile && document.querySelector("[data-wa-hide]"),
      document.getElementById("agenda"),
      document.querySelector(".footer")
    ].filter(Boolean);
    if (!targets.length || !("IntersectionObserver" in window)) return undefined;
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
        setHidden(visible.size > 0);
      },
      { threshold: 0.05 }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  return (
    <aside aria-label={t.common.wa.region}>
      <ExternalLink
        href={message ? waLink(message) : waGeneral(t)}
        className={`waFloat${hidden ? " waHidden" : ""}`}
        aria-label={t.common.wa.write}
        data-wa="flotante"
        tabIndex={hidden ? -1 : undefined}
        aria-hidden={hidden || undefined}
      >
        <WhatsappIcon /> <span className="waText">WhatsApp</span>
      </ExternalLink>
    </aside>
  );
}

// Migas de pan visibles: Inicio > pagina.
export function Breadcrumbs({ label }) {
  const { t, href } = useI18n();
  return (
    <nav className="wrap crumbs" aria-label={t.common.crumbs.label}>
      <ol>
        <li>
          <a href={href("/")}>{t.common.crumbs.home}</a>
        </li>
        <li aria-current="page">{label}</li>
      </ol>
    </nav>
  );
}
