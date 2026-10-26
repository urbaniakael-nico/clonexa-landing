// Piezas compartidas por todas las paginas: tema, barra, pie, capturas, recorridos,
// preguntas, formulario de demo y WhatsApp flotante. Todo se puede renderizar en el
// servidor (prerender): nada lee window/document durante el render.
import React from "react";
import { sendEvent } from "./analytics.js";
import { LEGAL_LINKS, SHOTS, SOCIAL, WA_GENERAL, demoRequestMessage, waLink } from "./content.js";
import { validateDemoForm } from "./form.js";
import { SOCIAL_ICONS, WhatsappIcon } from "./icons.jsx";
import { ABOUT_PATH, INDUSTRY_LINKS } from "./site.js";

const THEME_KEY = "clonexa_theme";
// Tiempo de cada paso en los recorridos automaticos.
const STEP_MS = 5000;

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

// true mientras el elemento esta en pantalla (los recorridos solo avanzan si se ven).
function useInView(ref) {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
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

const SECTION_LINKS = [
  ["/#arma", "Arma tu sistema"],
  ["/#ejemplo", "Ejemplo en acción"],
  ["/#planes", "Planes"]
];

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
            <summary>Industrias</summary>
            <ul className="dropList">
              {INDUSTRY_LINKS.map(([href, label, icon]) => (
                <li key={href}>
                  <a href={href} {...aria(href)}>
                    <span aria-hidden="true">{icon}</span> {label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
          <a href={ABOUT_PATH} {...aria(ABOUT_PATH)}>
            ¿Qué es Clonexa?
          </a>
          {SECTION_LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="navRight">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
          <a href="#agenda" className="btn btnSmall navCta">
            Agenda tu demo
          </a>
          <details className="mobileMenu" ref={menu}>
            <summary aria-label="Menú">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <nav className="mobilePanel" aria-label="Menú">
              <p className="mobileTitle">Industrias</p>
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
                <li>
                  <a href={ABOUT_PATH}>¿Qué es Clonexa?</a>
                </li>
                {SECTION_LINKS.map(([href, label]) => (
                  <li key={href}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
                <li>
                  <a href="#agenda" className="btn btnBlock">
                    Agenda tu demo
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

// Recorrido por pasos con capturas reales: flechas, pasos y avance automatico (pausable).
export function Sequence({ steps, label, variant = "solution", legend }) {
  const ref = React.useRef(null);
  const inView = useInView(ref);
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [held, setHeld] = React.useState(false);
  const running = playing && !held && inView && steps.length > 1;
  const step = steps[index];

  React.useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  React.useEffect(() => {
    if (!running) return undefined;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % steps.length), STEP_MS);
    return () => clearTimeout(timer);
  }, [running, index, steps.length]);

  const go = (next) => setIndex((next + steps.length) % steps.length);
  const phone = SHOTS[step.shot].frame === "phone";

  return (
    <div
      ref={ref}
      className={`seq seq-${variant}${running ? " seqRunning" : ""}`}
      style={{ "--step-ms": `${STEP_MS}ms` }}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
    >
      <div className="seqTop">
        <ol className="seqSteps" aria-label={`Pasos: ${label}`}>
          {steps.map((item, i) => (
            <li key={item.shot}>
              <button type="button" aria-current={i === index ? "step" : undefined} onClick={() => go(i)}>
                <span className="seqNum">PASO {i + 1}</span>
                <span className="seqTitle">{item.title}</span>
                <span className="seqProgress" aria-hidden="true" key={i === index ? `on-${index}` : "off"} />
              </button>
            </li>
          ))}
        </ol>
        {steps.length > 1 && (
          <button type="button" className="seqPlay" aria-pressed={playing} onClick={() => setPlaying((p) => !p)}>
            <span aria-hidden="true">{playing ? "⏸" : "▶"}</span> Recorrido automático
          </button>
        )}
      </div>
      <div className="seqStage">
        <div className="seqText">
          <p className="pill">
            PASO {index + 1} DE {steps.length}
          </p>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          {legend && <p className="legend">{legend}</p>}
          {steps.length > 1 && (
            <div className="seqArrows">
              <button type="button" onClick={() => go(index - 1)} aria-label="Paso anterior">
                ←
              </button>
              <button type="button" onClick={() => go(index + 1)} aria-label="Paso siguiente">
                →
              </button>
            </div>
          )}
        </div>
        <div className={`seqMedia${phone ? " seqMediaPhone" : ""}`}>
          {steps.map((item, i) => {
            const active = i === index;
            const shot = SHOTS[item.shot];
            return (
              <a
                key={item.shot}
                href={shot.src}
                target="_blank"
                rel="noopener"
                className={`seqShot${active ? " seqShotOn" : ""}`}
                aria-hidden={active ? undefined : true}
                tabIndex={active ? undefined : -1}
                aria-label={active ? `Ampliar captura: ${item.title}` : undefined}
              >
                <ShotImage id={item.shot} sizes={shot.frame === "phone" ? "260px" : "(max-width: 760px) 92vw, 720px"} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Preguntas frecuentes (acordeon). La primera abierta.
export function FaqList({ items, idPrefix = "faq" }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div className="faq">
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

// Formulario "Agenda tu demo": evento demo_request + abre WhatsApp con los datos.
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
          <h2 id="agenda-titulo">Agenda tu demo gratis</h2>
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
              Quiero mi demo
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function Follow() {
  return (
    <section className="wrap follow" aria-labelledby="siguenos-titulo">
      <h2 id="siguenos-titulo">Síguenos y obtén descuento en tu desarrollo</h2>
      <p>Tips para tu negocio, novedades de Clonexa y promociones exclusivas para seguidores.</p>
      <ul className="social">
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
    </section>
  );
}

export function Footer() {
  return (
    <footer className="wrap footer">
      <div className="footerTop">
        <div className="footerBrand">
          <Logo className="logoSmall" />
          <p>Software a la medida, en la nube, hecho en Bogotá.</p>
        </div>
        <nav aria-label="Industrias" className="footerCol">
          <p className="footerTitle">Industrias</p>
          <ul>
            {INDUSTRY_LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Clonexa" className="footerCol">
          <p className="footerTitle">Clonexa</p>
          <ul>
            <li>
              <a href={ABOUT_PATH}>¿Qué es Clonexa?</a>
            </li>
            {SECTION_LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="footerBottom">
        <p>© 2026 Clonexa · Bogotá, Colombia</p>
        <nav aria-label="Legal" className="footerLegal">
          {LEGAL_LINKS.map(([href, label], index) => (
            <React.Fragment key={href}>
              {index > 0 && <span aria-hidden="true"> · </span>}
              <a href={href}>{label}</a>
            </React.Fragment>
          ))}
        </nav>
      </div>
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
        <WhatsappIcon />
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
