// Inicio de la landing "Tu negocio, en vivo." (secciones en el orden de la maqueta aprobada).
// La barra, el pie y el formulario estan en layout.jsx; las secciones en vivo en live.jsx.
import React from "react";
import {
  BUILDER_DEFAULT,
  BUILDER_MODULES,
  COMMERCE_ITEMS,
  FAQ,
  PLANS,
  PLAN_CTA,
  PROCESS,
  WHY,
  builderSummary,
  builderWhatsapp,
  planWhatsapp,
  waLink
} from "./content.js";
import { DemoForm, ExternalLink, FaqList, SectionHead } from "./layout.jsx";
import { Design3D, Hero, Inside, LiveSim, NicheStrip, Reels, Toys } from "./live.jsx";

function Builder() {
  const [selected, setSelected] = React.useState(BUILDER_DEFAULT);
  const { chosen, level, percent } = builderSummary(selected);

  function toggle(name) {
    setSelected((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  return (
    <div id="arma" className="lcard builderCard" aria-labelledby="arma-titulo" role="region">
      <p className="kicker">INTERACTIVO</p>
      <h2 id="arma-titulo" className="cardTitle">
        Arma tu sistema en 30 s
      </h2>
      <p className="sub">Toca lo que necesitas y te mostramos la demo con eso conectado.</p>
      <ul className="chips" aria-label="Módulos">
        {BUILDER_MODULES.map(([icon, name]) => (
          <li key={name}>
            <button type="button" className="chip" aria-pressed={selected.includes(name)} onClick={() => toggle(name)}>
              <span aria-hidden="true">{icon}</span> {name}
            </button>
          </li>
        ))}
      </ul>
      <div className="meter">
        <span aria-live="polite">
          {chosen.length ? `${chosen.length} módulos conectados · ${level}` : "Elige al menos un módulo"}
        </span>
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
  );
}

function HowWeWork() {
  return (
    <div className="lcard howCard" role="region" aria-labelledby="proceso-titulo">
      <p className="kicker">CÓMO TRABAJAMOS</p>
      <h2 id="proceso-titulo" className="cardTitle">
        De la idea a tu sistema funcionando
      </h2>
      <ol className="howSteps">
        {PROCESS.map(([title, text], index) => (
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
      <h3 className="whyTitle">Por qué Clonexa</h3>
      <ul className="whyList">
        {WHY.map(([bold, rest]) => (
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
  return (
    <section id="planes" className="wrap section" aria-labelledby="planes-titulo">
      <SectionHead
        id="planes-titulo"
        kicker="PLANES"
        title={
          <>
            Precio fijo. <span className="grad gradInline">Usuarios ilimitados.</span>
          </>
        }
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
      <div className="lcard commerce">
        <div>
          <p className="kicker">COMERCIO ELECTRÓNICO</p>
          <h3>Tu propia tienda en línea o marketplace</h3>
          <p className="sub">
            Catálogo, carrito, pagos en línea, varios vendedores y envíos, conectados a tu bodega, tu caja y tus reportes.
            Sin pagar comisión por cada venta a una plataforma ajena.
          </p>
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
        <ExternalLink href={waLink("Hola Clonexa, quiero cotizar mi tienda en línea.")} className="btn btnGhost" data-wa="tienda-en-linea">
          Quiero mi tienda en línea
        </ExternalLink>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="preguntas" className="wrap section" aria-labelledby="faq-titulo">
      <SectionHead
        id="faq-titulo"
        kicker="PREGUNTAS FRECUENTES"
        title={
          <>
            Lo que todos <span className="grad gradInline">nos preguntan</span>
          </>
        }
      />
      <FaqList items={FAQ} twoColumns />
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
      <BuildAndProcess />
      <Plans />
      <Faq />
      <DemoForm />
    </>
  );
}
