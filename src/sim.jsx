// "Mira como se veria el tuyo": simulacion en vivo por nicho. Va en su propio archivo JS: el
// navegador lo descarga y lo hidrata solo cuando la seccion se acerca a la pantalla (ver defer.jsx).
import React from "react";
import { sendEvent } from "./analytics.js";
import { useI18n } from "./i18n/index.jsx";
import { SectionHead } from "./layout.jsx";
import { GradTitle, TabList, useActive, useReducedMotion, useTicker } from "./live.jsx";
import { SCENE_SRC, SIM_TABS, driftKpi, kpiText, labelState, simAction } from "./live.js";

function initialSim(tab, labels) {
  return {
    states: labels.map(() => 0),
    timers: labels.map((_, i) => 20 + ((i * 47) % 230)),
    kpis: Object.fromEntries(tab.kpis.map((k) => [k.id, k.value]))
  };
}

function SimStage({ tab }) {
  const { t, lang, href, fill } = useI18n();
  const text = t.sim.tabs[tab.id];
  const labels = text.labels;
  const box = React.useRef(null);
  const active = useActive(box);
  const reduced = useReducedMotion();
  const running = active && !reduced;
  const [sim, setSim] = React.useState(() => initialSim(tab, labels));
  const [toast, setToast] = React.useState(null);
  const [flash, setFlash] = React.useState(-1);

  // Contadores mm:ss de las etiquetas "{t}".
  useTicker(running, 1000, () =>
    setSim((s) => ({ ...s, timers: s.timers.map((v, i) => (labels[i][s.states[i]].includes("{t}") ? v + 1 : v)) }))
  );

  // Cada pocos segundos cambia una etiqueta y se mueve una cifra.
  useTicker(running, 2600, () =>
    setSim((s) => {
      const i = Math.floor(Math.random() * labels.length);
      const states = [...s.states];
      const timers = [...s.timers];
      if (labels[i].length > 1) {
        states[i] = (states[i] + 1) % labels[i].length;
        timers[i] = 0;
      }
      const kpi = tab.kpis[Math.floor(Math.random() * tab.kpis.length)];
      setFlash(i);
      return { states, timers, kpis: { ...s.kpis, [kpi.id]: driftKpi(kpi, s.kpis[kpi.id]) } };
    })
  );

  React.useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(id);
  }, [toast]);

  function act() {
    const result = simAction(tab.id, sim.kpis, Math.random, text.toast);
    const i = Math.floor(Math.random() * labels.length);
    setSim((s) => {
      const states = [...s.states];
      const timers = [...s.timers];
      if (labels[i].length > 1) states[i] = (states[i] + 1) % labels[i].length;
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
        <p className="kicker">{text.label.toUpperCase()}</p>
        <h3>{text.title}</h3>
        <ul className="simPoints">
          {text.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <button type="button" className={`btn simAction sim-${tab.id}`} onClick={act}>
          {text.action}
        </button>
        {tab.page && (
          <p className="tabMore">
            <a href={href(tab.page)}>{fill(t.common.seeAll, { name: text.label.toLowerCase() })}</a>
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
            alt={fill(t.sim.sceneAlt, { name: text.label.toLowerCase() })}
          />
          <div className="sceneLabels" aria-hidden="true">
            {text.zones.map((zone, i) => (
              <span key={`z${i}`} className="zone" style={{ left: `${tab.zones[i][0]}%`, top: `${tab.zones[i][1]}%` }}>
                {zone}
              </span>
            ))}
            {labels.map((states, i) => {
              const [x, y] = tab.pos[i];
              const { kind, text: shown } = labelState(states[sim.states[i]], sim.timers[i]);
              return (
                <span
                  key={i}
                  className={`tag${kind === "on" ? " tagOn" : ""}${kind === "warn" ? " tagWarn" : ""}${flash === i ? " tagFlash" : ""}${x > 80 ? " tagR" : x < 14 ? " tagL" : ""}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {shown}
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
              <dt>{text.kpis[k.id]}</dt>
              <dd>{kpiText(k, sim.kpis[k.id], lang)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

export default function LiveSim({ initial = "callcenter", level = 2 }) {
  const { t } = useI18n();
  const [active, setActive] = React.useState(initial);
  const tab = SIM_TABS.find((x) => x.id === active) || SIM_TABS[0];
  return (
    <section id="en-vivo" className="wrap section" aria-labelledby="envivo-titulo">
      <SectionHead id="envivo-titulo" level={level} kicker={t.sim.kicker} title={<GradTitle a={t.sim.title1} grad={t.sim.titleGrad} />} sub={t.sim.sub} />
      <TabList tabs={SIM_TABS} active={active} setActive={setActive} label={t.sim.tabsLabel} idPrefix="sim" labelOf={(x) => t.sim.tabs[x.id].label} />
      <div className="lcard sim" role="tabpanel" id="sim-panel" aria-labelledby={`sim-tab-${tab.id}`}>
        <SimStage key={tab.id} tab={tab} />
      </div>
    </section>
  );
}
