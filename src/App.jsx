import React from "react";
import { sendEvent, trackPageView } from "./analytics.js";
import {
  BUILDER_DEFAULT,
  BUILDER_MODULES,
  CASES,
  COMMERCE_ITEMS,
  COMPARISON,
  EXAMPLE_STEPS,
  FAQ,
  HERO_CHECKS,
  HERO_SHOT,
  INDUSTRIES,
  LEGAL_LINKS,
  NAV_LINKS,
  NEXA_VIDEO_POSTER,
  NEXA_VIDEO_URL,
  PATHS,
  PLANS,
  PLAN_CTA,
  PROCESS,
  SHOTS,
  SOCIAL,
  SOLUTIONS,
  WA_GENERAL,
  builderSummary,
  builderWhatsapp,
  demoRequestMessage,
  planWhatsapp,
  solutionWhatsapp,
  waLink
} from "./content.js";
import { validateDemoForm } from "./form.js";
import { SOCIAL_ICONS, WhatsappIcon } from "./icons.jsx";

const THEME_KEY = "clonexa_theme";
// Tiempo de cada paso en los recorridos automaticos.
const STEP_MS = 5000;

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

function prefersReducedMotion() {
  return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
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

function Header({ theme, setTheme }) {
  return (
    <div className="navBar">
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
    </div>
  );
}

// Captura real de Clonexa: celular (390 px) o pantalla (1280 px), con su version pequena.
function ShotImage({ id, sizes, eager = false, className = "" }) {
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
      fetchpriority={eager ? "high" : undefined}
      decoding={eager ? "sync" : "async"}
    />
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
              <svg viewBox="0 0 24 24" width="26" height="26">
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
        <p className="kicker">SOFTWARE A LA MEDIDA · EN LA NUBE</p>
        <h1>
          Si tu negocio lo hace, <span className="grad">Clonexa lo conecta.</span>
        </h1>
        <p className="lead">
          Desde un restaurante hasta una distribuidora con call center, bodega, rutas y vendedores: construimos el
          sistema que tu operación necesita y lo conectamos todo en un solo lugar.
        </p>
        <div className="heroActions">
          <a href="#agenda" className="btn">
            Agenda tu demo gratis
          </a>
          <a href="#arma" className="btn btnGhost">
            <span aria-hidden="true">🧩</span> Arma tu sistema
          </a>
        </div>
        <ul className="checks">
          {HERO_CHECKS.map((parts) => (
            <li key={parts.join("")}>
              <span className="checkMark" aria-hidden="true">
                ✓
              </span>{" "}
              {parts.length === 3 ? (
                <>
                  <strong>{parts[0]}</strong>
                  {parts[1]}
                  <strong>{parts[2]}</strong>
                </>
              ) : (
                parts[1]
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="heroShow">
        <div className="heroScreen">
          <ShotImage id={HERO_SHOT} eager sizes="(max-width: 760px) 92vw, (max-width: 1180px) 50vw, 600px" />
        </div>
        <NexaVideo />
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="wrap strip" aria-label="Industrias">
      <ul>
        {INDUSTRIES.map(([icon, label]) => (
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

function TwoPaths() {
  return (
    <section id="medida" className="wrap section" aria-labelledby="caminos-titulo">
      <SectionHead
        id="caminos-titulo"
        kicker="DOS CAMINOS"
        title={
          <>
            Empieza con lo listo. <span className="grad gradInline">Crece a la medida.</span>
          </>
        }
        sub="No te vendemos un programa cerrado. Clonexa se arma por módulos: usas lo que ya funciona y construimos lo que tu operación necesita, conectado con todo lo demás."
      />
      <div className="paths">
        {PATHS.map((path) => (
          <article className={`card path path-${path.id}`} key={path.id}>
            <p className="pill">{path.tag}</p>
            <h3>{path.title}</h3>
            <p>{path.text}</p>
            <ul>
              {path.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href={path.cta[0]} className={`btn${path.id === "listo" ? " btnGhost" : ""}`}>
              {path.cta[1]}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function Builder() {
  const [selected, setSelected] = React.useState(BUILDER_DEFAULT);
  const { chosen, level, percent } = builderSummary(selected);

  function toggle(name) {
    setSelected((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  return (
    <section id="arma" className="wrap section" aria-labelledby="arma-titulo">
      <SectionHead
        id="arma-titulo"
        kicker="INTERACTIVO"
        title="Arma tu sistema en 30 segundos"
        sub="Toca lo que necesita tu empresa. Te armamos la propuesta y te mostramos la demo con eso conectado."
      />
      <div className="builder">
        <ul className="chips" aria-label="Módulos">
          {BUILDER_MODULES.map(([icon, name]) => (
            <li key={name}>
              <button type="button" className="chip" aria-pressed={selected.includes(name)} onClick={() => toggle(name)}>
                <span aria-hidden="true">{icon}</span> {name}
              </button>
            </li>
          ))}
        </ul>
        <div className="result">
          <h3>Tu sistema Clonexa</h3>
          <p className="resultSub" aria-live="polite">
            {chosen.length ? `${chosen.length} módulos conectados entre sí · un solo sistema` : "Elige al menos un módulo"}
          </p>
          <ul className="stack" aria-label="Módulos elegidos">
            {chosen.map(([icon, name]) => (
              <li className="blk" key={name}>
                <span className="dot" aria-hidden="true" />
                <span aria-hidden="true">{icon}</span> {name}
              </li>
            ))}
          </ul>
          <div className="meter">
            <span>Tipo de proyecto: {level || "—"}</span>
            <div className="meterBar" aria-hidden="true">
              <b style={{ width: `${percent}%` }} />
            </div>
          </div>
          {chosen.length ? (
            <ExternalLink href={builderWhatsapp(selected)} className="btn btnBlock" data-wa="arma-tu-sistema">
              <span aria-hidden="true">💬</span> Cotizar este sistema por WhatsApp
            </ExternalLink>
          ) : (
            <button type="button" className="btn btnBlock" disabled>
              <span aria-hidden="true">💬</span> Cotizar este sistema por WhatsApp
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// Recorrido por pasos con capturas reales: flechas, pasos y avance automatico (pausable).
function Sequence({ steps, label, variant = "solution", legend }) {
  const ref = React.useRef(null);
  const inView = useInView(ref);
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(() => !prefersReducedMotion());
  const [held, setHeld] = React.useState(false);
  const running = playing && !held && inView && steps.length > 1;
  const step = steps[index];

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

function Example() {
  return (
    <section id="ejemplo" className="wrap section" aria-labelledby="ejemplo-titulo">
      <div className="demoBox">
        <SectionHead
          id="ejemplo-titulo"
          kicker="EJEMPLO EN ACCIÓN"
          title="Tiendas, call center, bodega y gerencia en un solo sistema"
        />
        <Sequence
          steps={EXAMPLE_STEPS}
          label="Ejemplo en acción"
          variant="example"
          legend="Ejemplo ilustrativo con datos inventados."
        />
      </div>
    </section>
  );
}

function Solutions() {
  const [active, setActive] = React.useState(SOLUTIONS[0].id);
  const tabRefs = React.useRef({});
  const current = SOLUTIONS.find((tab) => tab.id === active) || SOLUTIONS[0];

  function onKeyDown(event) {
    const index = SOLUTIONS.findIndex((tab) => tab.id === active);
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % SOLUTIONS.length;
    if (event.key === "ArrowLeft") next = (index - 1 + SOLUTIONS.length) % SOLUTIONS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = SOLUTIONS.length - 1;
    if (next === null) return;
    event.preventDefault();
    const id = SOLUTIONS[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  }

  return (
    <section id="soluciones" className="wrap section" aria-labelledby="soluciones-titulo">
      <SectionHead
        id="soluciones-titulo"
        kicker="SOLUCIONES LISTAS"
        title="Míralo funcionando en tu tipo de negocio"
        sub="Pantallas reales de Clonexa con datos de ejemplo."
      />
      <div className="tabs" role="tablist" aria-label="Tipo de negocio" onKeyDown={onKeyDown}>
        {SOLUTIONS.map((tab) => (
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
      <div className="tabPanel" role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
        <div className="tabSide">
          <ul className="benefits">
            {current.items.map(([bold, rest]) => (
              <li key={bold}>
                <strong>{bold}</strong>
                {rest}
              </li>
            ))}
          </ul>
          <ExternalLink href={solutionWhatsapp(current)} className="btn" data-wa={current.id}>
            Quiero verlo en mi {current.business}
          </ExternalLink>
        </div>
        <Sequence key={current.id} steps={current.steps} label={current.label} />
      </div>
    </section>
  );
}

function Commerce() {
  return (
    <section className="wrap section" aria-labelledby="tienda-titulo">
      <div className="card commerce">
        <div>
          <SectionHead
            id="tienda-titulo"
            kicker="COMERCIO ELECTRÓNICO"
            title="Tu propia tienda en línea o marketplace"
            sub="Catálogo, carrito, pagos en línea, varios vendedores, envíos y seguimiento del pedido, conectados a tu bodega, tu caja y tus reportes. Sin pagar comisión por cada venta a una plataforma ajena."
          />
          <ExternalLink
            href={waLink("Hola Clonexa, quiero cotizar mi tienda en línea.")}
            className="btn"
            data-wa="tienda-en-linea"
          >
            Quiero mi tienda en línea
          </ExternalLink>
        </div>
        <ul className="commerceList">
          {COMMERCE_ITEMS.map((item) => (
            <li key={item}>
              <span className="checkMark" aria-hidden="true">
                ✓
              </span>{" "}
              {item}
            </li>
          ))}
        </ul>
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
        title="Software genérico vs. Clonexa"
        sub="Un programa genérico te obliga a trabajar como él quiere. Clonexa se adapta a como trabaja tu empresa."
      />
      <table className="compare">
        <thead>
          <tr>
            <th scope="col">
              <span className="srOnly">Función</span>
            </th>
            <th scope="col">Software genérico</th>
            <th scope="col" className="cx">
              Clonexa
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map(([feature, generic, clonexa]) => (
            <tr key={feature}>
              <th scope="row">{feature}</th>
              <td>
                <Mark value={generic} />
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

function Process() {
  return (
    <section className="wrap section" aria-labelledby="proceso-titulo">
      <SectionHead
        id="proceso-titulo"
        kicker="CÓMO TRABAJAMOS"
        title="De la idea a tu sistema funcionando"
        sub="Construimos por etapas: empiezas a usarlo rápido y lo vamos ampliando contigo."
      />
      <ol className="grid4">
        {PROCESS.map(([title, text], index) => (
          <li className="card" key={title}>
            <span className="num" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
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
        sub="Mensualidad fija según los módulos. Los desarrollos a la medida se cotizan por etapas."
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
              aria-label={`${PLAN_CTA}: ${plan.name}`}
            >
              {PLAN_CTA}
            </ExternalLink>
          </article>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = React.useState(0);
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
            Te mostramos Clonexa funcionando con una empresa como la tuya. 20 minutos, sin compromiso.
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

function Follow() {
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

// Boton flotante: se esconde mientras el formulario o el pie estan en pantalla
// y, en celular, mientras se ve el hero (no tapa el video de Nexa).
function FloatingWhatsapp() {
  const [hidden, setHidden] = React.useState(() => Boolean(window.matchMedia?.("(max-width: 760px)").matches));
  React.useEffect(() => {
    const mobile = Boolean(window.matchMedia?.("(max-width: 760px)").matches);
    const targets = [mobile && document.getElementById("inicio"), document.getElementById("agenda"), document.querySelector(".footer")].filter(
      Boolean
    );
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
        href={WA_GENERAL}
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
        <Industries />
        <TwoPaths />
        <Builder />
        <Example />
        <Solutions />
        <Commerce />
        <Comparison />
        <Process />
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
