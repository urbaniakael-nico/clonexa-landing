// Secciones "en vivo" de la landing: portada con video 3D, "Asi funciona por dentro", simulacion,
// "Disena tu negocio en 3D", juguetes y reels. Todo se puede prerenderizar: lo que depende del
// navegador (videos, temporizadores, azar) solo corre en useEffect.
import React from "react";
import { sendEvent } from "./analytics.js";
import { HERO_CHECKS, SOCIAL, WA_GENERAL, solutionWhatsapp } from "./content.js";
import { SOCIAL_ICONS } from "./icons.jsx";
import { ExternalLink, SectionHead, ShotImage } from "./layout.jsx";
import {
  CARTA_MINI,
  CARTA_MOMENTS,
  DESIGN_3D,
  HERO_ORDERS,
  HERO_SALES_START,
  HERO_SONGS,
  HERO_POSTER_SIZES,
  HERO_VIDEO,
  INSIDE_TABS,
  NICHE_STRIP,
  REELS,
  SCENE_SRC,
  SIM_TABS,
  driftKpi,
  kpiText,
  mmss,
  pesos,
  simAction
} from "./live.js";

// ---------- utilidades ----------

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return undefined;
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// true mientras el elemento esta en pantalla (con margen) y la pestana del navegador esta visible.
export function useActive(ref, rootMargin = "0px") {
  const [inView, setInView] = React.useState(false);
  const [pageVisible, setPageVisible] = React.useState(true);
  React.useEffect(() => {
    const node = ref.current;
    const onVis = () => setPageVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    let observer;
    if (node && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
      observer.observe(node);
    } else setInView(true);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      observer?.disconnect();
    };
  }, [ref, rootMargin]);
  return inView && pageVisible;
}

// Intervalo que solo corre mientras `running`.
function useTicker(running, ms, fn) {
  const saved = React.useRef(fn);
  saved.current = fn;
  React.useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => saved.current(), ms);
    return () => clearInterval(id);
  }, [running, ms]);
}

// Celular con la carta en video REAL (carta-mini.mp4), arrancando en el plato pedido.
// Carga diferida: el video se pide solo cuando el celular se acerca a la pantalla y se pausa fuera de ella.
export function CartaPhone({ moment = "ceviche", badge, className = "", children, label }) {
  const box = React.useRef(null);
  const video = React.useRef(null);
  const active = useActive(box, "150px");
  const reduced = useReducedMotion();
  const { start, poster } = CARTA_MOMENTS[moment];

  React.useEffect(() => {
    const v = video.current;
    if (!v) return;
    // El poster (primer cuadro del plato) tambien es diferido: no compite con la portada.
    if (active && !v.getAttribute("poster")) v.setAttribute("poster", poster);
    if (reduced) return;
    if (!active) {
      v.pause();
      return;
    }
    if (!v.getAttribute("src")) {
      v.addEventListener(
        "loadedmetadata",
        () => {
          try {
            v.currentTime = start;
          } catch (_) {}
        },
        { once: true }
      );
      v.src = CARTA_MINI;
    }
    v.play?.()?.catch?.(() => {});
  }, [active, reduced, start, poster]);

  return (
    <div className={`cphone ${className}`} ref={box}>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        data-moment={moment}
        width="300"
        height="650"
        aria-label={label || "Carta en video de un restaurante de ejemplo en el celular del cliente"}
      />
      {badge && <span className="vbadge">{badge}</span>}
      {children}
    </div>
  );
}

function TabList({ tabs, active, setActive, label, idPrefix }) {
  const refs = React.useRef({});
  function onKeyDown(event) {
    const index = tabs.findIndex((tab) => tab.id === active);
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActive(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  }
  return (
    <div className="ltabs" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(node) => {
            refs.current[tab.id] = node;
          }}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${tab.id}`}
          aria-selected={tab.id === active}
          aria-controls={`${idPrefix}-panel`}
          tabIndex={tab.id === active ? 0 : -1}
          className="ltab"
          onClick={() => setActive(tab.id)}
        >
          <span aria-hidden="true">{tab.icon}</span> {tab.label}
        </button>
      ))}
    </div>
  );
}

// ---------- 1) Portada ----------

function HeroVideo() {
  const box = React.useRef(null);
  const video = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const [ready, setReady] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  // El video se pide despues de cargar la pagina (no compite con el primer pintado).
  React.useEffect(() => {
    if (document.readyState === "complete") {
      const t = setTimeout(() => setReady(true), 200);
      return () => clearTimeout(t);
    }
    const onLoad = () => setTimeout(() => setReady(true), 200);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  React.useEffect(() => {
    const v = video.current;
    if (!v || reduced || !ready) return;
    if (!active) {
      v.pause();
      return;
    }
    if (!v.getAttribute("src")) v.src = window.innerWidth < 760 ? HERO_VIDEO.small : HERO_VIDEO.large;
    v.play?.()?.catch?.(() => {});
  }, [active, reduced, ready]);

  return (
    <div className="heroVideo" ref={box}>
      <img
        className="heroPoster"
        src={HERO_VIDEO.poster}
        srcSet={`${HERO_VIDEO.posterSm} 800w, ${HERO_VIDEO.poster} 1280w`}
        sizes={HERO_POSTER_SIZES}
        width="1280"
        height="720"
        alt={HERO_VIDEO.alt}
        fetchPriority="high"
      />
      <video
        ref={video}
        className={playing ? "on" : ""}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
      />
    </div>
  );
}

function HeroToasts() {
  const box = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const [tick, setTick] = React.useState(0);
  const [sales, setSales] = React.useState(HERO_SALES_START);
  useTicker(active && !reduced, 3200, () => {
    setTick((t) => t + 1);
    setSales((s) => s + 12000 + Math.round(Math.random() * 60) * 1000);
  });
  const order = HERO_ORDERS[tick % HERO_ORDERS.length];
  const song = HERO_SONGS[Math.floor(tick / 2) % HERO_SONGS.length];
  return (
    <div className="heroToasts" ref={box} aria-hidden="true">
      <span className="lpill livePill">
        <i /> EN VIVO <span className="liveExtra">· video</span>
      </span>
      <span className="lpill tOrder" key={`o${tick}`}>
        {order[0]} {order[1]}
        <small>hace 3 s · {order[2]}</small>
      </span>
      <span className="lpill tSales">
        💵 Ventas hoy <b>{pesos(sales)}</b>
      </span>
      <span className="lpill tSong" key={`s${song[0]}`}>
        🎶 Canción pedida
        <small>
          {song[0]} · {song[1]}
        </small>
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="wrap lhero" data-wa-hide>
      <div className="lheroCopy">
        <p className="kicker">SOFTWARE PARA NEGOCIOS · EN TIEMPO REAL</p>
        <h1>
          Tu negocio, <span className="grad">en vivo.</span>
        </h1>
        <p className="lead">
          Pedidos, caja, inventario, turnos y nómina en un solo sistema… y lo ves funcionando en{" "}
          <strong>3D, en tiempo real</strong>, desde el celular o un televisor.
        </p>
        <div className="heroActions">
          <a href="#en-vivo" className="btn">
            <span aria-hidden="true">▶</span> Ver la demo en vivo
          </a>
          <ExternalLink href={WA_GENERAL} className="btn btnGhost" data-wa="hero">
            <span aria-hidden="true">💬</span> Hablar por WhatsApp
          </ExternalLink>
        </div>
        <ul className="lchecks">
          {HERO_CHECKS.map((item) => (
            <li key={item}>
              <span className="checkMark" aria-hidden="true">
                ✓
              </span>{" "}
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="lheroShow">
        <div className="lheroFrame">
          <HeroVideo />
          <HeroToasts />
        </div>
        <CartaPhone moment="nachos" className="heroPhone" badge="▶ Carta en video" />
      </div>
    </section>
  );
}

export function NicheStrip() {
  return (
    <nav className="wrap nicheStrip" aria-label="Negocios">
      <ul>
        {NICHE_STRIP.map(([icon, label, href]) => (
          <li key={label}>
            <a href={href}>
              <span aria-hidden="true">{icon}</span> {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ---------- 2) Asi funciona por dentro ----------

function InsideToast({ tab }) {
  const box = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const [i, setI] = React.useState(0);
  useTicker(active && !reduced, 3600, () => setI((n) => n + 1));
  const [icon, text] = tab.toasts[i % tab.toasts.length];
  return (
    <div className="insideToastBox" ref={box} aria-hidden="true">
      <span className="lpill insideToast" key={`${tab.id}-${i}`}>
        {icon} {text} <small>hace 2 s</small>
      </span>
    </div>
  );
}

export function Inside({ initial = "restaurante", level = 2 }) {
  const [active, setActive] = React.useState(initial);
  const tab = INSIDE_TABS.find((t) => t.id === active) || INSIDE_TABS[0];

  // Enlaces "#negocio-<id>" (franja de nichos) abren su pestana.
  React.useEffect(() => {
    function fromHash() {
      const m = /^#negocio-([a-z]+)$/.exec(window.location.hash);
      if (m && INSIDE_TABS.some((t) => t.id === m[1])) {
        setActive(m[1]);
        document.getElementById("soluciones")?.scrollIntoView();
      }
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <section id="soluciones" className="wrap section" aria-labelledby="dentro-titulo">
      <SectionHead
        id="dentro-titulo"
        level={level}
        kicker="ASÍ FUNCIONA POR DENTRO"
        title={
          <>
            El sistema real, <span className="grad gradInline">no una presentación.</span>
          </>
        }
        sub="Pantallas reales de empresas demo. Elige tu negocio y mira el recorrido completo."
      />
      <TabList tabs={INSIDE_TABS} active={active} setActive={setActive} label="Tipo de negocio" idPrefix="dentro" />
      <div className="lcard inside" role="tabpanel" id="dentro-panel" aria-labelledby={`dentro-tab-${tab.id}`}>
        <div className="insideCopy">
          <ol className="insideSteps">
            {tab.steps.map(([title, text], index) => (
              <li key={title}>
                <span className="stepN" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <ExternalLink href={solutionWhatsapp(tab)} className="btn" data-wa={`dentro-${tab.id}`}>
            Quiero verlo con mi negocio
          </ExternalLink>
          {tab.page && (
            <p className="tabMore">
              <a href={tab.page}>Ver todo para {tab.label.toLowerCase()} →</a>
            </p>
          )}
        </div>
        <div className={`insideShow${tab.carta ? " withPhone" : ""}`}>
          <div className="laptop">
            <div className="laptopScreen">
              <ShotImage key={tab.shot} id={tab.shot} sizes="(max-width: 760px) 88vw, 640px" />
            </div>
            <div className="laptopBase" aria-hidden="true" />
          </div>
          {tab.carta && <CartaPhone key={`phone-${tab.id}`} moment={tab.carta} className="insidePhone" badge="▶ Carta en video" />}
          <InsideToast key={`toast-${tab.id}`} tab={tab} />
        </div>
      </div>
    </section>
  );
}

// ---------- 3) Simulacion en vivo ----------

function initialSim(tab) {
  return {
    states: tab.labels.map(() => 0),
    timers: tab.labels.map((_, i) => 20 + ((i * 47) % 230)),
    kpis: Object.fromEntries(tab.kpis.map((k) => [k.id, k.value]))
  };
}

function SimStage({ tab }) {
  const box = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const running = active && !reduced;
  const [sim, setSim] = React.useState(() => initialSim(tab));
  const [toast, setToast] = React.useState(null);
  const [flash, setFlash] = React.useState(-1);

  // Contadores mm:ss de las etiquetas "{t}".
  useTicker(running, 1000, () =>
    setSim((s) => ({ ...s, timers: s.timers.map((t, i) => (tab.labels[i][2 + s.states[i]].includes("{t}") ? t + 1 : t)) }))
  );

  // Cada pocos segundos cambia una etiqueta y se mueve una cifra.
  useTicker(running, 2600, () =>
    setSim((s) => {
      const i = Math.floor(Math.random() * tab.labels.length);
      const states = [...s.states];
      const timers = [...s.timers];
      const count = tab.labels[i].length - 2;
      if (count > 1) {
        states[i] = (states[i] + 1) % count;
        timers[i] = 0;
      }
      const kpi = tab.kpis[Math.floor(Math.random() * tab.kpis.length)];
      setFlash(i);
      return { states, timers, kpis: { ...s.kpis, [kpi.id]: driftKpi(kpi, s.kpis[kpi.id]) } };
    })
  );

  React.useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(t);
  }, [toast]);

  function act() {
    const result = simAction(tab.id, sim.kpis);
    const i = Math.floor(Math.random() * tab.labels.length);
    setSim((s) => {
      const states = [...s.states];
      const timers = [...s.timers];
      const count = tab.labels[i].length - 2;
      if (count > 1) states[i] = (states[i] + 1) % count;
      timers[i] = 0;
      return { states, timers, kpis: result.kpis };
    });
    setFlash(i);
    setToast({ text: result.toast, key: Date.now() });
    sendEvent("sim_action", { niche: tab.id });
  }

  const scene = SCENE_SRC(tab.scene);
  return (
    <>
      <div className="simCopy">
        <p className="kicker">{tab.label.toUpperCase()}</p>
        <h3>{tab.title}</h3>
        <ul className="simPoints">
          {tab.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <button type="button" className={`btn simAction sim-${tab.id}`} onClick={act}>
          {tab.action}
        </button>
        {tab.page && (
          <p className="tabMore">
            <a href={tab.page}>Ver todo para {tab.label.toLowerCase()} →</a>
          </p>
        )}
      </div>
      <div className="simShow" ref={box}>
        <figure className={`scene${running ? " sceneRun" : ""}`}>
          <img
            src={scene.src}
            srcSet={`${scene.srcSm} 768w, ${scene.src} 1280w`}
            sizes="(max-width: 760px) 92vw, 700px"
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            alt={`Escena 3D de ${tab.label.toLowerCase()} de ejemplo con su personal y sus mesas o puestos de trabajo`}
          />
          <div className="sceneLabels" aria-hidden="true">
            {tab.zones.map(([x, y, text]) => (
              <span key={text} className="zone" style={{ left: `${x}%`, top: `${y}%` }}>
                {text}
              </span>
            ))}
            {tab.labels.map((label, i) => {
              const text = label[2 + sim.states[i]].replace("{t}", mmss(sim.timers[i]));
              const on = /QR activo|En llamada|Cosiendo|Preparando|Llevando|Sonando|pidió|✓/.test(text);
              return (
                <span
                  key={i}
                  className={`tag${on ? " tagOn" : ""}${/⚠|Pausa|pausa/.test(text) ? " tagWarn" : ""}${flash === i ? " tagFlash" : ""}${label[0] > 80 ? " tagR" : label[0] < 14 ? " tagL" : ""}`}
                  style={{ left: `${label[0]}%`, top: `${label[1]}%` }}
                >
                  {text}
                </span>
              );
            })}
          </div>
          {toast && (
            <span className="lpill simToast" key={toast.key}>
              {toast.text}
            </span>
          )}
          <p className="srOnly" aria-live="polite">
            {toast ? toast.text : ""}
          </p>
        </figure>
        <dl className="kpis">
          {tab.kpis.map((k) => (
            <div key={k.id} className={`kpi kpi-${k.color}`}>
              <dt>{k.label}</dt>
              <dd>{kpiText(k, sim.kpis[k.id])}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

export function LiveSim({ initial = "callcenter", level = 2 }) {
  const [active, setActive] = React.useState(initial);
  const tab = SIM_TABS.find((t) => t.id === active) || SIM_TABS[0];
  return (
    <section id="en-vivo" className="wrap section" aria-labelledby="envivo-titulo">
      <SectionHead
        id="envivo-titulo"
        level={level}
        kicker="SIMULACIÓN EN VIVO"
        title={
          <>
            Mira cómo se vería <span className="grad gradInline">el tuyo</span>
          </>
        }
        sub="Empresas demo funcionando con el mismo sistema que usan nuestros clientes. Es una simulación: toca el botón y mira qué pasa."
      />
      <TabList tabs={SIM_TABS} active={active} setActive={setActive} label="Simulación por negocio" idPrefix="sim" />
      <div className="lcard sim" role="tabpanel" id="sim-panel" aria-labelledby={`sim-tab-${tab.id}`}>
        <SimStage key={tab.id} tab={tab} />
      </div>
    </section>
  );
}

// ---------- 4) Disena tu negocio en 3D ----------

export function Design3D() {
  const { main, templates, characters, points } = DESIGN_3D;
  return (
    <section id="disena" className="wrap section" aria-labelledby="disena-titulo">
      <SectionHead
        id="disena-titulo"
        kicker="NUEVO · DISEÑA TU NEGOCIO EN 3D"
        title={
          <>
            Arma tu local como en <span className="grad gradInline">un videojuego.</span>
          </>
        }
        sub="Elige una plantilla, mueve paredes y muebles, viste a tu equipo con su uniforme y conéctalo con tus datos reales. Lo que diseñas es lo que ves en vivo."
      />
      <div className="design">
        <figure className="lcard designMain">
          <img
            src={main.src}
            srcSet={`${main.srcSm} 640w, ${main.src} 1200w`}
            sizes="(max-width: 860px) 92vw, 680px"
            width={main.width}
            height={main.height}
            alt={main.alt}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="designSide">
          <ul className="characters">
            {characters.map((c) => (
              <li key={c.label}>
                <img src={c.src} width={c.width} height={c.height} alt={c.alt} loading="lazy" decoding="async" />
                <strong>{c.label}</strong>
              </li>
            ))}
          </ul>
          <figure className="lcard designTemplates">
            <img
              src={templates.src}
              srcSet={`${templates.srcSm} 480w, ${templates.src} 800w`}
              sizes="(max-width: 860px) 92vw, 440px"
              width={templates.width}
              height={templates.height}
              alt={templates.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
      <ul className="feat3">
        {points.map(([title, text]) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- 5) Los juguetes de Clonexa ----------

const LOMO = 46000;

function OrderToy() {
  const box = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const [count, setCount] = React.useState(3);
  const [tap, setTap] = React.useState(0);
  useTicker(active && !reduced, 2600, () => {
    setCount((c) => (c >= 3 ? 2 : c + 1));
    setTap((t) => t + 1);
  });
  function add() {
    setCount((c) => (c >= 6 ? 2 : c + 1));
    setTap((t) => t + 1);
  }
  const total = 99000 + (count - 3) * LOMO;
  return (
    <div className="toyStage" ref={box}>
      <CartaPhone moment="lomo" className="toyPhone" label="Carta en video: lomo a la parrilla con el botón para agregar al pedido de la mesa 7" />
      <button type="button" className={`toyAdd${tap % 2 ? " tapA" : " tapB"}`} onClick={add}>
        ＋ Agregar · Mesa 7
      </button>
      <span className="toyBag" aria-live="polite">
        🛒 Tu pedido ({count}) · {pesos(total)}
      </span>
    </div>
  );
}

export function Toys() {
  return (
    <section id="funciones" className="wrap section" aria-labelledby="juguetes-titulo">
      <SectionHead
        id="juguetes-titulo"
        kicker="LOS JUGUETES DE CLONEXA"
        title={
          <>
            Lo que tus clientes y tu equipo <span className="grad gradInline">van a amar</span>
          </>
        }
      />
      <ul className="toys">
        <li className="lcard toy">
          <div className="toyStage">
            <CartaPhone moment="ceviche" className="toyPhone" badge="▶ video" />
          </div>
          <h3>🎬 Carta en video con QR</h3>
          <p>Cada plato en video antes de pedir. Se antoja más… y piden más.</p>
          <a href="/restaurantes#carta-video" className="toyLink">
            Ver la carta en video con QR →
          </a>
        </li>
        <li className="lcard toy">
          <OrderToy />
          <h3>📲 Pide desde la mesa</h3>
          <p>Escanean, piden y la cuenta sale exacta por mesa.</p>
        </li>
        <li className="lcard toy">
          <div className="toyShot">
            <ShotImage id="campo-inicio" sizes="(max-width: 760px) 46vw, 280px" />
          </div>
          <h3>📍 Turnos con GPS</h3>
          <p>Tu equipo marca entrada y salida; tú ves quién llegó y dónde está.</p>
        </li>
        <li className="lcard toy">
          <div className="toyShot">
            <ShotImage id="taller-produccion" sizes="(max-width: 760px) 46vw, 280px" />
          </div>
          <h3>🧵 Producción y nómina</h3>
          <p>Lotes, horas y pagos calculados en minutos, sin hojas de cálculo.</p>
        </li>
      </ul>
    </section>
  );
}

// ---------- 6) Miralo en 15 segundos ----------

function ReelViewer({ reel, onClose }) {
  const close = React.useRef(null);
  React.useEffect(() => {
    const previous = document.activeElement;
    close.current?.focus();
    function onKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        close.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.classList.add("noScroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("noScroll");
      previous?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="reelModal" role="dialog" aria-modal="true" aria-label={`Video: ${reel.label}, en vivo`} onClick={onClose}>
      <div className="reelBox" onClick={(e) => e.stopPropagation()}>
        <video src={reel.src} poster={reel.poster} controls autoPlay playsInline width="540" height="960" />
        <button type="button" ref={close} className="reelClose" onClick={onClose} aria-label="Cerrar video">
          ✕
        </button>
      </div>
    </div>
  );
}

const FOLLOW_TEXT = { instagram: "Instagram @clonexaapp", tiktok: "TikTok @clonexxa", facebook: "Facebook", linkedin: "LinkedIn", youtube: "YouTube" };

export function Reels() {
  const [open, setOpen] = React.useState(null);
  const onClose = React.useCallback(() => setOpen(null), []);
  return (
    <section id="reels" className="wrap section" aria-labelledby="reels-titulo">
      <SectionHead
        id="reels-titulo"
        kicker="MÍRALO EN 15 SEGUNDOS"
        title={
          <>
            Clonexa, <span className="grad gradInline">en acción.</span>
          </>
        }
        sub="Los mismos videos que publicamos en redes. Síguenos para ver un negocio nuevo cada día."
      />
      <ul className="reels">
        {REELS.map((reel) => (
          <li key={reel.id}>
            <button
              type="button"
              className="reel"
              onClick={() => {
                setOpen(reel);
                sendEvent("reel_open", { reel: reel.id });
              }}
            >
              <img src={reel.poster} width="360" height="640" alt="" loading="lazy" decoding="async" />
              <span className="reelPlay" aria-hidden="true">
                ▶
              </span>
              <span className="reelLabel">
                {reel.label}
                <span className="srOnly">: ver el video de 15 segundos</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <ul className="followRow">
        {SOCIAL.map((item) => {
          const Icon = SOCIAL_ICONS[item.id];
          return (
            <li key={item.id}>
              <ExternalLink href={item.url} className={`followBtn social-${item.id}`} data-follow={item.id}>
                <Icon /> {FOLLOW_TEXT[item.id]}
              </ExternalLink>
            </li>
          );
        })}
      </ul>
      {open && <ReelViewer reel={open} onClose={onClose} />}
    </section>
  );
}

