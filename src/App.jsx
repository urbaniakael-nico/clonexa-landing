// Inicio de la landing "Tu negocio, en vivo." (secciones en el orden de la maqueta aprobada).
// La barra, el pie y el formulario estan en layout.jsx; la portada y "Asi funciona" en live.jsx.
// Todo lo que esta debajo de "Asi funciona" se hidrata (y lo mas pesado se descarga) solo cuando
// se acerca a la pantalla: la portada queda lista rapido.
import React from "react";
import { BUILDER_DEFAULT, BUILDER_MODULES, PLAN_IDS, PLAN_RECOMMENDED, builderSummary, builderWhatsapp, planWhatsapp, waLink } from "./content.js";
import { Deferred } from "./defer.jsx";
import { useI18n } from "./i18n/index.jsx";
import { DemoForm, ExternalLink, FaqList, SectionHead } from "./layout.jsx";
import { GradTitle, Hero, Inside, NicheStrip } from "./live.jsx";
import { Design3D, LiveSim, Reels, Toys } from "./sections.jsx";

function Builder() {
  const { t, fill } = useI18n();
  const b = t.builder;
  const [selected, setSelected] = React.useState(BUILDER_DEFAULT);
  const { chosen, level, percent } = builderSummary(selected);

  function toggle(id) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div id="arma" className="lcard builderCard" aria-labelledby="arma-titulo" role="region">
      <p className="kicker">{b.kicker}</p>
      <h2 id="arma-titulo" className="cardTitle">
        {b.title}
      </h2>
      <p className="sub">{b.sub}</p>
      <ul className="chips" aria-label={b.modulesLabel}>
        {BUILDER_MODULES.map(([icon, id]) => (
          <li key={id}>
            <button type="button" className="chip" aria-pressed={selected.includes(id)} onClick={() => toggle(id)}>
              <span aria-hidden="true">{icon}</span> {b.modules[id]}
            </button>
          </li>
        ))}
      </ul>
      <div className="meter">
        <span aria-live="polite">{chosen.length ? fill(b.connected, { n: chosen.length, level: b.levels[level] }) : b.choose}</span>
        <div className="meterBar" aria-hidden="true">
          <b style={{ width: `${percent}%` }} />
        </div>
      </div>
      {chosen.length ? (
        <ExternalLink href={builderWhatsapp(t, selected)} className="btn btnBlock" data-wa="arma-tu-sistema">
          <span aria-hidden="true">💬</span> {b.quote}
        </ExternalLink>
      ) : (
        <button type="button" className="btn btnBlock" disabled>
          <span aria-hidden="true">💬</span> {b.quote}
        </button>
      )}
    </div>
  );
}

function HowWeWork() {
  const { t } = useI18n();
  const h = t.how;
  return (
    <div className="lcard howCard" role="region" aria-labelledby="proceso-titulo">
      <p className="kicker">{h.kicker}</p>
      <h2 id="proceso-titulo" className="cardTitle">
        {h.title}
      </h2>
      <ol className="howSteps">
        {h.steps.map(([title, text], index) => (
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
      <h3 className="whyTitle">{h.whyTitle}</h3>
      <ul className="whyList">
        {h.why.map(([bold, rest]) => (
          <li key={bold}>
            <span className="checkMark" aria-hidden="true">
              ✓
            </span>{" "}
            <strong>{bold}</strong>
            {rest}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BuildAndProcess() {
  return (
    <section className="wrap section">
      <div className="two">
        <Builder />
        <HowWeWork />
      </div>
    </section>
  );
}

function Plans() {
  const { t, fill } = useI18n();
  const p = t.plans;
  const c = t.commerce;
  return (
    <section id="planes" className="wrap section" aria-labelledby="planes-titulo">
      <SectionHead id="planes-titulo" kicker={p.kicker} title={<GradTitle a={p.title1} grad={p.titleGrad} />} sub={p.sub} />
      <div className="plans">
        {PLAN_IDS.map((id) => {
          const plan = p.items[id];
          const rec = id === PLAN_RECOMMENDED;
          return (
            <article className={`plan${rec ? " planRec" : ""}`} key={id}>
              {rec && <p className="badge">{p.recommended}</p>}
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
                href={planWhatsapp(t, id)}
                className={`btn btnBlock${rec ? "" : " btnGhost"}`}
                data-wa={`plan-${id}`}
                aria-label={fill("{cta}: {name}", { cta: p.cta, name: plan.name })}
              >
                {p.cta}
              </ExternalLink>
            </article>
          );
        })}
      </div>
      <div className="lcard commerce">
        <div>
          <p className="kicker">{c.kicker}</p>
          <h3>{c.title}</h3>
          <p className="sub">{c.sub}</p>
        </div>
        <ul className="commerceList">
          {c.items.map((item) => (
            <li key={item}>
              <span className="checkMark" aria-hidden="true">
                ✓
              </span>{" "}
              {item}
            </li>
          ))}
        </ul>
        <ExternalLink href={waLink(c.waMessage)} className="btn btnGhost" data-wa="tienda-en-linea">
          {c.cta}
        </ExternalLink>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useI18n();
  return (
    <section id="preguntas" className="wrap section" aria-labelledby="faq-titulo">
      <SectionHead id="faq-titulo" kicker={t.faq.kicker} title={<GradTitle a={t.faq.title1} grad={t.faq.titleGrad} />} />
      <FaqList items={t.faq.items} twoColumns />
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <NicheStrip />
      <Inside />
      <LiveSim />
      <Design3D />
      <Toys />
      <Reels />
      <Deferred id="arma">
        <BuildAndProcess />
      </Deferred>
      <Deferred id="planes">
        <Plans />
      </Deferred>
      <Deferred id="preguntas">
        <Faq />
      </Deferred>
      {/* El formulario se hidrata de inmediato: se puede usar apenas carga la pagina. */}
      <DemoForm />
    </>
  );
}
