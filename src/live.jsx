// Secciones "en vivo" de arriba de la pagina (van en el paquete principal): portada con video 3D,
// franja de nichos y "Asi funciona por dentro", mas las piezas compartidas (celular con la carta
// en video, pestanas, temporizadores). La simulacion (sim.jsx) y "Disena en 3D", juguetes y reels
// (extras.jsx) se descargan aparte cuando se acercan a la pantalla.
// Todo se puede prerenderizar: lo que depende del navegador solo corre en useEffect.
import React from "react";
import { solutionWhatsapp, waGeneral } from "./content.js";
import { whenIdle } from "./defer.jsx";
import { useI18n } from "./i18n/index.jsx";
import { ExternalLink, SectionHead, ShotImage } from "./layout.jsx";
import { CARTA_MINI, CARTA_MOMENTS, HERO_POSTER_SIZES, HERO_SALES_START, HERO_VIDEO, INSIDE_TABS, NICHE_STRIP } from "./live.js";

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

// true cuando el navegador ya quedo quieto despues de cargar (para arrancar animaciones con JS).
export function useIdle() {
  const [idle, setIdle] = React.useState(false);
  React.useEffect(() => whenIdle(() => setIdle(true)), []);
  return idle;
}

// Intervalo que solo corre mientras `running`.
export function useTicker(running, ms, fn) {
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
  const { t } = useI18n();
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
        aria-label={label || t.hero.cartaLabel}
      />
      {badge && <span className="vbadge">{badge}</span>}
      {children}
    </div>
  );
}

export function TabList({ tabs, active, setActive, label, idPrefix, labelOf }) {
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
          <span aria-hidden="true">{tab.icon}</span> {labelOf(tab)}
        </button>
      ))}
    </div>
  );
}

export function GradTitle({ a, grad, b = "" }) {
  return (
    <>
      {a}
      <span className="grad gradInline">{grad}</span>
      {b}
    </>
  );
}

// ---------- 1) Portada ----------

function HeroVideo() {
  const { t } = useI18n();
  const box = React.useRef(null);
  const video = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const [ready, setReady] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  // El video se pide despues de cargar la pagina y con el navegador quieto (no compite con el
  // primer pintado ni con la hidratacion).
  React.useEffect(() => {
    let cancel = () => {};
    const go = () => {
      cancel = whenIdle(() => setReady(true), 3000);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      cancel();
    };
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
        alt={t.hero.videoAlt}
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

// Avisos flotantes de la portada: arrancan cuando la pagina ya esta quieta (requestIdleCallback).
function HeroToasts() {
  const { t, money } = useI18n();
  const box = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const idle = useIdle();
  const [tick, setTick] = React.useState(0);
  const [sales, setSales] = React.useState(HERO_SALES_START);
  useTicker(idle && active && !reduced, 3200, () => {
    setTick((n) => n + 1);
    setSales((s) => s + 12000 + Math.round(Math.random() * 60) * 1000);
  });
  const order = t.hero.orders[tick % t.hero.orders.length];
  const song = t.hero.songs[Math.floor(tick / 2) % t.hero.songs.length];
  return (
    <div className="heroToasts" ref={box} aria-hidden="true">
      <span className="lpill livePill">
        <i /> {t.hero.live} <span className="liveExtra">{t.hero.liveExtra}</span>
      </span>
      <span className="lpill tOrder" key={`o${tick}`}>
        {order[0]} {order[1]}
        <small>
          {t.hero.ago} · {order[2]}
        </small>
      </span>
      <span className="lpill tSales">
        💵 {t.hero.sales} <b>{money(sales)}</b>
      </span>
      <span className="lpill tSong" key={`s${song[0]}`}>
        🎶 {t.hero.song}
        <small>
          {song[0]} · {song[1]}
        </small>
      </span>
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();
  const h = t.hero;
  return (
    <section id="inicio" className="wrap lhero" data-wa-hide>
      <div className="lheroCopy">
        <p className="kicker">{h.kicker}</p>
        <h1>
          {h.title1}
          <span className="grad">{h.titleGrad}</span>
        </h1>
        <p className="lead">
          {h.lead1}
          <strong>{h.leadStrong}</strong>
          {h.lead2}
        </p>
        <div className="heroActions">
          <a href="#en-vivo" className="btn">
            <span aria-hidden="true">▶</span> {h.demo}
          </a>
          <ExternalLink href={waGeneral(t)} className="btn btnGhost" data-wa="hero">
            <span aria-hidden="true">💬</span> {t.common.wa.talk}
          </ExternalLink>
        </div>
        <ul className="lchecks">
          {h.checks.map((item) => (
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
        <CartaPhone moment="nachos" className="heroPhone" badge={h.cartaBadge} />
      </div>
    </section>
  );
}

export function NicheStrip() {
  const { t, href } = useI18n();
  return (
    <nav className="wrap nicheStrip" aria-label={t.niches.label}>
      <ul>
        {NICHE_STRIP.map(([icon, id, path]) => (
          <li key={id}>
            <a href={path.startsWith("#") ? path : href(path)}>
              <span aria-hidden="true">{icon}</span> {t.niches.items[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ---------- 2) Asi funciona por dentro ----------

function InsideToast({ toasts, ago }) {
  const box = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const idle = useIdle();
  const [i, setI] = React.useState(0);
  useTicker(idle && active && !reduced, 3600, () => setI((n) => n + 1));
  const [icon, text] = toasts[i % toasts.length];
  return (
    <div className="insideToastBox" ref={box} aria-hidden="true">
      <span className="lpill insideToast" key={i}>
        {icon} {text} <small>{ago}</small>
      </span>
    </div>
  );
}

export function Inside({ initial = "restaurante", level = 2 }) {
  const { t, href, fill } = useI18n();
  const [active, setActive] = React.useState(initial);
  const tab = INSIDE_TABS.find((x) => x.id === active) || INSIDE_TABS[0];
  const text = t.inside.tabs[tab.id];

  // Enlaces "#negocio-<id>" (franja de nichos) abren su pestana.
  React.useEffect(() => {
    function fromHash() {
      const m = /^#negocio-([a-z]+)$/.exec(window.location.hash);
      if (m && INSIDE_TABS.some((x) => x.id === m[1])) {
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
      <SectionHead id="dentro-titulo" level={level} kicker={t.inside.kicker} title={<GradTitle a={t.inside.title1} grad={t.inside.titleGrad} />} sub={t.inside.sub} />
      <TabList tabs={INSIDE_TABS} active={active} setActive={setActive} label={t.inside.tabsLabel} idPrefix="dentro" labelOf={(x) => t.inside.tabs[x.id].label} />
      <div className="lcard inside" role="tabpanel" id="dentro-panel" aria-labelledby={`dentro-tab-${tab.id}`}>
        <div className="insideCopy">
          <ol className="insideSteps">
            {text.steps.map(([title, body], index) => (
              <li key={title}>
                <span className="stepN" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <ExternalLink href={solutionWhatsapp(t, text.business)} className="btn" data-wa={`dentro-${tab.id}`}>
            {t.inside.cta}
          </ExternalLink>
          {tab.page && (
            <p className="tabMore">
              <a href={href(tab.page)}>{fill(t.common.seeAll, { name: text.label.toLowerCase() })}</a>
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
          {tab.carta && <CartaPhone key={`phone-${tab.id}`} moment={tab.carta} className="insidePhone" badge={t.hero.cartaBadge} />}
          <InsideToast key={`toast-${tab.id}`} toasts={text.toasts} ago={t.inside.ago} />
        </div>
      </div>
    </section>
  );
}
