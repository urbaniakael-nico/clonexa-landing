// Piezas compartidas por todas las paginas: tema, barra, pie, capturas, recorridos,
// preguntas, formulario de demo y WhatsApp flotante. Todo se puede renderizar en el
// servidor (prerender): nada lee window/document durante el render.
import React from "react";
import { sendEvent } from "./analytics.js";
import { CTA_LABEL, LEGAL_LINKS, NAV_LINKS, SHOTS, SOCIAL, WA_GENERAL, demoRequestMessage, waLink } from "./content.js";
import { validateDemoForm } from "./form.js";
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
      <img className="logoLight" src="/brand/clonexa-logo-claro.svg" alt="Clonexa" width="181" height="32" />
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
  return (
    <div className="themeSwitch" role="group" aria-label="Tema de la página">
      <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
        <span aria-hidden="true">🌙</span>
        <span className="themeLabel"> Oscuro</span>
      </button>
      <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
        <span aria-hidden="true">☀️</span>
        <span className="themeLabel"> Claro</span>
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

export function Header({ theme, setTheme, current }) {
  const industries = React.useRef(null);
  const menu = React.useRef(null);
  useCloseDetails(industries);
  useCloseDetails(menu);
  const aria = (href) => (href === current ? { "aria-current": "page" } : {});

  return (
    <div className="navBar">
      <header className="wrap nav">
        <a href="/" className="navBrand" aria-label="Clonexa, ir al inicio">
          <Logo />
        </a>
        <nav className="navLinks" aria-label="Secciones">
          <details className="navDrop" ref={industries}>
            <summary>Negocios</summary>
            <ul className="dropList">
              {INDUSTRY_LINKS.map(([href, label, icon]) => (
                <li key={href}>
                  <a href={href} {...aria(href)}>
                    <span aria-hidden="true">{icon}</span> {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={ABOUT_PATH} {...aria(ABOUT_PATH)}>
                  <span aria-hidden="true">💡</span> ¿Qué es Clonexa?
                </a>
              </li>
            </ul>
          </details>
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="navRight">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
          <a href="#agenda" className="btn btnSmall navCta">
            {CTA_LABEL}
          </a>
          <details className="mobileMenu" ref={menu}>
            <summary aria-label="Menú">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <nav className="mobilePanel" aria-label="Menú">
              <p className="mobileTitle">Negocios</p>
              <ul>
                {INDUSTRY_LINKS.map(([href, label, icon]) => (
                  <li key={href}>
                    <a href={href} {...aria(href)}>
                      <span aria-hidden="true">{icon}</span> {label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="mobileMore">
                {NAV_LINKS.map(([href, label]) => (
                  <li key={href}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
                <li>
                  <a href={ABOUT_PATH}>¿Qué es Clonexa?</a>
                </li>
                <li>
                  <a href="#agenda" className="btn btnBlock">
                    {CTA_LABEL}
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
  const shot = SHOTS[id];
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
        aria-label={shot.alt}
      />
    );
  }
  return (
    <img
      className={`shotImg shot-${shot.frame} ${className}`}
      src={shot.src}
      srcSet={`${shot.srcSm} ${shot.smWidth}w, ${shot.src} ${shot.width}w`}
      sizes={sizes}
      alt={shot.alt}
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

// Formulario de demo ("Pide tu demo gratis"): evento demo_request + abre WhatsApp con los datos.
// En las paginas de industria el mensaje empieza con la industria.
export function DemoForm({ greeting, page = "inicio", sub }) {
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
    sendEvent("demo_request", { form: "agenda-demo", page, ...data });
    const link = waLink(demoRequestMessage(data, greeting));
    window.open(link, "_blank", "noopener");
    setSentLink(link);
    setForm(EMPTY_FORM);
  }

  const field = (id, label, props) => (
    <div className="field">
      <label htmlFor={`demo-${id}`}>{label}</label>
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
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <section id="agenda" className="wrap section" aria-labelledby="agenda-titulo">
      <div className="cta">
        <div>
          <h2 id="agenda-titulo">
            ¿Lo vemos con <span className="grad gradInline">tu negocio</span>?
          </h2>
          <p className="ctaSub">
            {sub || "Te mostramos Clonexa funcionando con una empresa como la tuya. 20 minutos, sin compromiso."}
          </p>
          {greeting && (
            <ExternalLink href={waLink(greeting)} className="ctaWa" data-wa={`demo-${page}`}>
              <WhatsappIcon /> Escríbenos por WhatsApp
            </ExternalLink>
          )}
        </div>
        {sentLink ? (
          <div className="thanks" role="status">
            <h3>¡Gracias! Ya casi está.</h3>
            <p>Abrimos WhatsApp con tus datos para coordinar la demo. Si no se abrió, toca el botón.</p>
            <ExternalLink href={sentLink} className="btn btnBlock" data-wa="formulario">
              Abrir WhatsApp
            </ExternalLink>
            <button type="button" className="linkButton" onClick={() => setSentLink("")}>
              Enviar otra solicitud
            </button>
          </div>
        ) : (
          <form className="demoForm" onSubmit={submit} noValidate>
            {field("name", "Tu nombre", { autoComplete: "name", placeholder: "Tu nombre" })}
            {field("business", "Empresa y tipo de negocio", {
              autoComplete: "organization",
              placeholder: "Ej: La Brasa, restaurante"
            })}
            {field("whatsapp", "WhatsApp", {
              type: "tel",
              inputMode: "tel",
              autoComplete: "tel",
              placeholder: "Tu número de WhatsApp"
            })}
            <button type="submit" className="btn btnBlock">
              {CTA_LABEL}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="wrap footer">
      <div className="footerRow">
        <Logo className="logoSmall" />
        <p>© 2026 Clonexa</p>
        <nav aria-label="Legal" className="footerLegal">
          {LEGAL_LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <ul className="footerSocial" aria-label="Redes de Clonexa">
          {SOCIAL.map((item) => {
            const Icon = SOCIAL_ICONS[item.id];
            return (
              <li key={item.id}>
                <ExternalLink href={item.url} className={`social-${item.id}`} aria-label={`Clonexa en ${item.label}`}>
                  <Icon />
                </ExternalLink>
              </li>
            );
          })}
        </ul>
      </div>
      <nav aria-label="Negocios" className="footerNiches">
        {INDUSTRY_LINKS.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
        <a href={ABOUT_PATH}>¿Qué es Clonexa?</a>
      </nav>
    </footer>
  );
}

// Boton flotante: se esconde mientras el formulario o el pie estan en pantalla
// y, en celular, mientras se ve el encabezado (no tapa el video ni el titulo).
export function FloatingWhatsapp({ message }) {
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
    <aside aria-label="Contacto por WhatsApp">
      <ExternalLink
        href={message ? waLink(message) : WA_GENERAL}
        className={`waFloat${hidden ? " waHidden" : ""}`}
        aria-label="Escríbenos por WhatsApp"
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
  return (
    <nav className="wrap crumbs" aria-label="Ruta de navegación">
      <ol>
        <li>
          <a href="/">Inicio</a>
        </li>
        <li aria-current="page">{label}</li>
      </ol>
    </nav>
  );
}
