import React from "react";
import { sendEvent, trackPageView } from "./analytics.js";
import {
  BUSINESS_TYPES,
  CASES,
  COMPARISON,
  DEMO_TABS,
  FAQ,
  FLOW_STEPS,
  HERO_CHECKS,
  LEGAL_LINKS,
  NAV_LINKS,
  NEXA_VIDEO_POSTER,
  NEXA_VIDEO_URL,
  PLANS,
  PROBLEMS,
  SHOTS,
  SOCIAL,
  WA_GENERAL,
  demoRequestMessage,
  planWhatsapp,
  tabWhatsapp,
  waLink
} from "./content.js";
import { validateDemoForm } from "./form.js";
import { SOCIAL_ICONS, WhatsappIcon } from "./icons.jsx";

const THEME_KEY = "clonexa_theme";

function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function useTheme() {
  const [theme, setThemeState] = React.useState(currentTheme);

  React.useEffect(() => {
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

function Logo({ className = "" }) {
  return (
    <span className={`logo ${className}`}>
      <img className="logoDark" src="/brand/clonexa-logo.svg" alt="Clonexa" width="181" height="32" />
      <img className="logoLight" src="/brand/clonexa-logo-claro.svg" alt="Clonexa" width="181" height="32" />
    </span>
  );
}

function ExternalLink({ href, className, children, ...rest }) {
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
        <span aria-hidden="true">🌙</span> Oscuro
      </button>
      <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
        <span aria-hidden="true">☀️</span> Claro
      </button>
    </div>
  );
}

function Header({ theme, setTheme }) {
  return (
    <header className="wrap nav">
      <a href="#inicio" className="navBrand" aria-label="Clonexa, ir al inicio">
        <Logo />
      </a>
      <nav className="navLinks" aria-label="Secciones">
        {NAV_LINKS.map(([href, label]) => (
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
      </div>
    </header>
  );
}

function NexaVideo() {
  const ref = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);

  function play() {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    setPlaying(true);
    video.play().catch(() => setPlaying(false));
  }

  return (
    <figure className="nexa">
      <div className="phone">
        <video
          ref={ref}
          className="nexaVideo"
          src={NEXA_VIDEO_URL}
          poster={NEXA_VIDEO_POSTER}
          muted
          playsInline
          preload="none"
          controls={playing}
          aria-label="Video: Nexa te presenta Clonexa"
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <button type="button" className="nexaPlay" onClick={play}>
            <span className="nexaCircle" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </span>
            <strong>Nexa te presenta Clonexa</strong>
            <span className="srOnly">Reproducir video sin sonido</span>
          </button>
        )}
      </div>
      <figcaption>Nexa es una presentadora creada con IA</figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <section id="inicio" className="wrap hero">
      <div className="heroCopy">
        <p className="tag">Mucho más que un POS · Sistema operativo para tu negocio</p>
        <h1>
          Todo tu negocio, <span className="grad">no solo la caja.</span>
        </h1>
        <p className="lead">
          Pedidos, cocina, caja, inventario, turnos, nómina, clientes y reportes en un solo sistema. Se adapta a tu
          forma de trabajar. Tarifa plana, con usuarios ilimitados.
        </p>
        <div className="heroActions">
          <a href="#agenda" className="btn">
            Agenda tu demo gratis
          </a>
          <a href="#demo" className="btn btnGhost">
            <span aria-hidden="true">▶</span> Ver demo en vivo
          </a>
        </div>
        <ul className="checks">
          {HERO_CHECKS.map(([bold, rest]) => (
            <li key={bold + rest}>
              <span className="checkMark" aria-hidden="true">
                ✓
              </span>{" "}
              {bold && <strong>{bold}</strong>}
              {rest}
            </li>
          ))}
        </ul>
      </div>
      <NexaVideo />
    </section>
  );
}

function BusinessStrip() {
  return (
    <section id="negocios" className="wrap strip" aria-label="Tipos de negocio">
      <ul>
        {BUSINESS_TYPES.map(([icon, label]) => (
          <li key={label}>
            <span aria-hidden="true">{icon}</span> {label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionHead({ kicker, title, sub, id }) {
  return (
    <div className="sectionHead">
      <p className="kicker">{kicker}</p>
      <h2 id={id}>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </div>
  );
}

function Problems() {
  return (
    <section className="wrap section" aria-labelledby="problema-titulo">
      <SectionHead
        id="problema-titulo"
        kicker="EL PROBLEMA"
        title="¿Te suena familiar?"
        sub="Lo que vemos en casi todos los negocios antes de Clonexa."
      />
      <div className="grid3">
        {PROBLEMS.map((item) => (
          <article className="card" key={item.title}>
            <div className="cardIcon" aria-hidden="true">
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// Captura real en marco de celular o de pantalla; sin archivo, "Captura proximamente".
function Shot({ id, frame = "screen", label, sizes }) {
  const shot = SHOTS[id];
  const [failed, setFailed] = React.useState(false);
  const ready = shot?.src && !failed;
  return (
    <div className={`shot shot-${frame}`}>
      <div className="shotFrame">
        {ready ? (
          <img
            src={shot.src}
            srcSet={`${shot.src.replace(".webp", "-sm.webp")} ${Math.round(shot.width / 2)}w, ${shot.src} ${shot.width}w`}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            loading="lazy"
            decoding="async"
            sizes={sizes}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="shotSoon" role="img" aria-label={`${label}: captura próximamente`}>
            <span className="shotSoonLabel">{label}</span>
            <span>Captura próximamente</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Flow() {
  return (
    <section className="wrap section" aria-labelledby="flujo-titulo">
      <SectionHead
        id="flujo-titulo"
        kicker="CÓMO FUNCIONA"
        title="Un pedido, de principio a fin"
        sub="Del celular del mesero a la caja y al reporte, sin papeles y en tiempo real."
      />
      <ol className="grid4 flow">
        {FLOW_STEPS.map((step, index) => (
          <li className="card flowCard" key={step.title}>
            <Shot id={step.shot} frame={step.frame} label={step.label} sizes={step.frame === "phone" ? "140px" : "(max-width: 520px) 92vw, (max-width: 1040px) 45vw, 270px"} />
            <p className="step">PASO {index + 1}</p>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DemoTabs() {
  const [active, setActive] = React.useState(DEMO_TABS[0].id);
  const tabRefs = React.useRef({});
  const current = DEMO_TABS.find((tab) => tab.id === active) || DEMO_TABS[0];

  function onKeyDown(event) {
    const index = DEMO_TABS.findIndex((tab) => tab.id === active);
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % DEMO_TABS.length;
    if (event.key === "ArrowLeft") next = (index - 1 + DEMO_TABS.length) % DEMO_TABS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = DEMO_TABS.length - 1;
    if (next === null) return;
    event.preventDefault();
    const id = DEMO_TABS[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  }

  return (
    <section id="demo" className="wrap section" aria-labelledby="demo-titulo">
      <div className="demoBox">
        <SectionHead
          id="demo-titulo"
          kicker="DEMO EN VIVO"
          title="Míralo funcionando en tu tipo de negocio"
          sub="Pantallas reales de Clonexa. Elige tu negocio."
        />
        <div className="tabs" role="tablist" aria-label="Tipo de negocio" onKeyDown={onKeyDown}>
          {DEMO_TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={tab.id === active}
              aria-controls={`panel-${tab.id}`}
              tabIndex={tab.id === active ? 0 : -1}
              className="tab"
              onClick={() => setActive(tab.id)}
            >
              <span aria-hidden="true">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        <div
          className="tabPanel"
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
        >
          <div>
            <ul className="benefits">
              {current.items.map(([bold, rest]) => (
                <li key={bold}>
                  <strong>{bold}</strong>
                  {rest}
                </li>
              ))}
            </ul>
            <ExternalLink href={tabWhatsapp(current)} className="btn" data-wa={current.id}>
              Quiero verlo en mi {current.business}
            </ExternalLink>
          </div>
          <Shot key={current.id} id={current.shot} label={current.label} sizes="(max-width: 760px) 92vw, 620px" />
        </div>
      </div>
    </section>
  );
}

function Mark({ value }) {
  if (value === "yes")
    return (
      <span className="yes">
        <span aria-hidden="true">✓</span>
        <span className="srOnly">Sí</span>
      </span>
    );
  if (value === "no")
    return (
      <span className="no">
        <span aria-hidden="true">—</span>
        <span className="srOnly">No</span>
      </span>
    );
  if (value === "soon") return <span className="soon">PRÓXIMAMENTE</span>;
  return <span>{value}</span>;
}

function Comparison() {
  return (
    <section className="wrap section" aria-labelledby="diferencia-titulo">
      <SectionHead
        id="diferencia-titulo"
        kicker="LA DIFERENCIA"
        title="Clonexa vs. un POS común"
        sub="Un POS te ayuda a cobrar. Clonexa te ayuda a manejar todo el negocio."
      />
      <table className="compare">
        <thead>
          <tr>
            <th scope="col">
              <span className="srOnly">Función</span>
            </th>
            <th scope="col">POS común</th>
            <th scope="col" className="cx">
              Clonexa
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map(([feature, pos, clonexa]) => (
            <tr key={feature}>
              <th scope="row">{feature}</th>
              <td>
                <Mark value={pos} />
              </td>
              <td className="cx">
                <Mark value={clonexa} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Cases() {
  return (
    <section className="wrap section" aria-labelledby="casos-titulo">
      <SectionHead
        id="casos-titulo"
        kicker="CASOS REALES"
        title="Negocios que ya trabajan con Clonexa"
        sub="Resultados que nos cuentan nuestros clientes."
      />
      <div className="grid3">
        {CASES.map((item) => (
          <article className="card case" key={item.title}>
            <p className="big">{item.big}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="planes" className="wrap section" aria-labelledby="planes-titulo">
      <SectionHead
        id="planes-titulo"
        kicker="PLANES"
        title="Un precio fijo. Usuarios ilimitados."
        sub="Pagas una mensualidad fija según los módulos que necesitas. Sin cobro por usuario ni por caja."
      />
      <div className="plans">
        {PLANS.map((plan) => (
          <article className={`plan${plan.recommended ? " planRec" : ""}`} key={plan.id}>
            {plan.recommended && <p className="badge">RECOMENDADO</p>}
            <h3>{plan.name}</h3>
            <p className="planFor">{plan.for}</p>
            <ul>
              {plan.items.map(([text, bold]) => (
                <li key={text}>
                  <span className="checkMark" aria-hidden="true">
                    ✓
                  </span>{" "}
                  {bold ? <strong>{text}</strong> : text}
                </li>
              ))}
            </ul>
            <ExternalLink
              href={planWhatsapp(plan)}
              className={`btn btnBlock${plan.recommended ? "" : " btnGhost"}`}
              data-wa={`plan-${plan.id}`}
              aria-label={`${plan.cta}: ${plan.name}`}
            >
              {plan.cta}
            </ExternalLink>
          </article>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = React.useState(-1);
  return (
    <section id="preguntas" className="wrap section" aria-labelledby="faq-titulo">
      <SectionHead id="faq-titulo" kicker="PREGUNTAS" title="Preguntas frecuentes" />
      <div className="faq">
        {FAQ.map(([question, answer], index) => {
          const isOpen = open === index;
          return (
            <div className={`faqItem${isOpen ? " faqOpen" : ""}`} key={question}>
              <h3>
                <button
                  type="button"
                  id={`faq-q-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${index}`}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span>{question}</span>
                  <span className="faqIcon" aria-hidden="true" />
                </button>
              </h3>
              <div id={`faq-a-${index}`} role="region" aria-labelledby={`faq-q-${index}`} hidden={!isOpen}>
                <p>{answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const EMPTY_FORM = { name: "", business: "", whatsapp: "" };

function DemoForm() {
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
    sendEvent("demo_request", { form: "agenda-demo", ...data });
    const link = waLink(demoRequestMessage(data));
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
            Te mostramos Clonexa funcionando con un negocio como el tuyo. 20 minutos, sin compromiso.
          </p>
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
            {field("business", "Nombre y tipo de negocio", {
              autoComplete: "organization",
              placeholder: "Ej: La Brasa, asadero"
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

function Follow() {
  return (
    <section className="wrap follow" aria-labelledby="siguenos-titulo">
      <h2 id="siguenos-titulo">Síguenos y recibe descuentos exclusivos</h2>
      <p>Tips para tu negocio, novedades de Clonexa y promociones solo para seguidores.</p>
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

function Footer() {
  return (
    <footer className="wrap footer">
      <Logo className="logoSmall" />
      <p>© 2026 Clonexa · Bogotá, Colombia</p>
      <nav aria-label="Legal" className="footerLegal">
        {LEGAL_LINKS.map(([href, label], index) => (
          <React.Fragment key={href}>
            {index > 0 && <span aria-hidden="true"> · </span>}
            <a href={href}>{label}</a>
          </React.Fragment>
        ))}
      </nav>
    </footer>
  );
}

// Boton flotante: se esconde mientras el formulario esta en pantalla.
function FloatingWhatsapp() {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    const target = document.getElementById("agenda");
    if (!target || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return (
    <ExternalLink
      href={WA_GENERAL}
      className={`waFloat${hidden ? " waHidden" : ""}`}
      aria-label="Escríbenos por WhatsApp"
      data-wa="flotante"
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
    >
      <WhatsappIcon />
    </ExternalLink>
  );
}

export default function App() {
  const [theme, setTheme] = useTheme();

  React.useEffect(() => {
    trackPageView();
  }, []);

  return (
    <>
      <a href="#contenido" className="skip">
        Saltar al contenido
      </a>
      <Header theme={theme} setTheme={setTheme} />
      <main id="contenido">
        <Hero />
        <BusinessStrip />
        <Problems />
        <Flow />
        <DemoTabs />
        <Comparison />
        <Cases />
        <Plans />
        <Faq />
        <DemoForm />
        <Follow />
      </main>
      <Footer />
      <FloatingWhatsapp />
    </>
  );
}
