// "Disena tu negocio en 3D", "Los juguetes de Clonexa" y "Miralo en 15 segundos" (reels con visor).
// Van en su propio archivo JS: se descargan y se hidratan cuando cada seccion se acerca a la pantalla.
import React from "react";
import { sendEvent } from "./analytics.js";
import { SOCIAL } from "./content.js";
import { SOCIAL_ICONS } from "./icons.jsx";
import { useI18n } from "./i18n/index.jsx";
import { ExternalLink, SectionHead, ShotImage } from "./layout.jsx";
import { CartaPhone, GradTitle, useActive, useReducedMotion, useTicker } from "./live.jsx";
import { DESIGN_3D, REELS } from "./live.js";

// ---------- 4) Disena tu negocio en 3D ----------

export function Design3D() {
  const { t } = useI18n();
  const d = t.design;
  const { main, templates, characters } = DESIGN_3D;
  return (
    <section id="disena" className="wrap section" aria-labelledby="disena-titulo">
      <SectionHead id="disena-titulo" kicker={d.kicker} title={<GradTitle a={d.title1} grad={d.titleGrad} />} sub={d.sub} />
      <div className="design">
        <figure className="lcard designMain">
          <img
            src={main.src}
            srcSet={`${main.srcSm} 640w, ${main.src} 1200w`}
            sizes="(max-width: 860px) 92vw, 680px"
            width={main.width}
            height={main.height}
            alt={d.mainAlt}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="designSide">
          <ul className="characters">
            {characters.map((c, i) => (
              <li key={c.src}>
                <img src={c.src} width={c.width} height={c.height} alt={d.characters[i][1]} loading="lazy" decoding="async" />
                <strong>{d.characters[i][0]}</strong>
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
              alt={d.templatesAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
      <ul className="feat3">
        {d.points.map(([title, text]) => (
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
  const { t, money, fill } = useI18n();
  const o = t.toys.order;
  const box = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const [count, setCount] = React.useState(3);
  const [tap, setTap] = React.useState(0);
  useTicker(active && !reduced, 2600, () => {
    setCount((c) => (c >= 3 ? 2 : c + 1));
    setTap((n) => n + 1);
  });
  function add() {
    setCount((c) => (c >= 6 ? 2 : c + 1));
    setTap((n) => n + 1);
  }
  const total = 99000 + (count - 3) * LOMO;
  return (
    <div className="toyStage" ref={box}>
      <CartaPhone moment="lomo" className="toyPhone" label={o.phoneLabel} />
      <button type="button" className={`toyAdd${tap % 2 ? " tapA" : " tapB"}`} onClick={add}>
        {o.add}
      </button>
      <span className="toyBag" aria-live="polite">
        {fill(o.bag, { count, total: money(total) })}
      </span>
    </div>
  );
}

export function Toys() {
  const { t, href } = useI18n();
  const y = t.toys;
  return (
    <section id="funciones" className="wrap section" aria-labelledby="juguetes-titulo">
      <SectionHead id="juguetes-titulo" kicker={y.kicker} title={<GradTitle a={y.title1} grad={y.titleGrad} />} />
      <ul className="toys">
        <li className="lcard toy">
          <div className="toyStage">
            <CartaPhone moment="ceviche" className="toyPhone" badge={y.carta.badge} />
          </div>
          <h3>{y.carta.title}</h3>
          <p>{y.carta.text}</p>
          <a href={`${href("/restaurantes")}#carta-video`} className="toyLink">
            {y.carta.link}
          </a>
        </li>
        <li className="lcard toy">
          <OrderToy />
          <h3>{y.order.title}</h3>
          <p>{y.order.text}</p>
        </li>
        <li className="lcard toy">
          <div className="toyShot">
            <ShotImage id="campo-inicio" sizes="(max-width: 760px) 46vw, 280px" />
          </div>
          <h3>{y.gps.title}</h3>
          <p>{y.gps.text}</p>
        </li>
        <li className="lcard toy">
          <div className="toyShot">
            <ShotImage id="taller-produccion" sizes="(max-width: 760px) 46vw, 280px" />
          </div>
          <h3>{y.prod.title}</h3>
          <p>{y.prod.text}</p>
        </li>
      </ul>
    </section>
  );
}

// ---------- 6) Miralo en 15 segundos ----------

function ReelViewer({ reel, name, onClose }) {
  const { t, fill } = useI18n();
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
    <div className="reelModal" role="dialog" aria-modal="true" aria-label={fill(t.reels.dialog, { name })} onClick={onClose}>
      <div className="reelBox" onClick={(e) => e.stopPropagation()}>
        <video src={reel.src} poster={reel.poster} controls autoPlay playsInline width="540" height="960" />
        <button type="button" ref={close} className="reelClose" onClick={onClose} aria-label={t.reels.close}>
          ✕
        </button>
      </div>
    </div>
  );
}

export function Reels() {
  const { t } = useI18n();
  const r = t.reels;
  const [open, setOpen] = React.useState(null);
  const onClose = React.useCallback(() => setOpen(null), []);
  return (
    <section id="reels" className="wrap section" aria-labelledby="reels-titulo">
      <SectionHead id="reels-titulo" kicker={r.kicker} title={<GradTitle a={r.title1} grad={r.titleGrad} />} sub={r.sub} />
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
                {r.items[reel.id]}
                <span className="srOnly">{r.watch}</span>
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
                <Icon /> {r.follow[item.id]}
              </ExternalLink>
            </li>
          );
        })}
      </ul>
      {open && <ReelViewer reel={open} name={r.items[open.id]} onClose={onClose} />}
    </section>
  );
}
