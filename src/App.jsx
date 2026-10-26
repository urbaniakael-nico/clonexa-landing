// Inicio de la landing (secciones). La barra, el pie y el formulario estan en layout.jsx.
import React from "react";
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
  NEXA_VIDEO_POSTER,
  NEXA_VIDEO_URL,
  PATHS,
  PLANS,
  PLAN_CTA,
  PROCESS,
  SOLUTIONS,
  builderSummary,
  builderWhatsapp,
  planWhatsapp,
  solutionWhatsapp,
  waLink
} from "./content.js";
import { DemoForm, ExternalLink, FaqList, Follow, SectionHead, Sequence, ShotImage } from "./layout.jsx";

function NexaVideo() {
  const ref = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);

  // El toque en "play" permite sonido; si el navegador lo bloquea, arranca sin sonido.
  // Ademas de los controles nativos hay un boton de sonido propio: en el celular del hero
  // (132 px) Chrome esconde el boton de volumen de sus controles.
  function play() {
    const video = ref.current;
    if (!video) return;
    video.muted = false;
    setPlaying(true);
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => setPlaying(false));
    });
  }

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
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
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onEnded={() => setPlaying(false)}
        />
        {playing && (
          <button type="button" className="nexaSound" onClick={toggleSound} aria-label={muted ? "Activar sonido" : "Silenciar"}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
              {muted ? (
                <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              )}
            </svg>
          </button>
        )}
        {!playing && (
          <button type="button" className="nexaPlay" onClick={play}>
            <span className="nexaCircle" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </span>
            <strong>Nexa te presenta Clonexa</strong>
            <span className="srOnly">Reproducir video</span>
          </button>
        )}
      </div>
      <figcaption>Nexa es una presentadora creada con IA</figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <section id="inicio" className="wrap hero" data-wa-hide>
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
        {INDUSTRIES.map(([icon, label, href]) => (
          <li key={label}>
            {href ? (
              <a href={href}>
                <span aria-hidden="true">{icon}</span> {label}
              </a>
            ) : (
              <span>
                <span aria-hidden="true">{icon}</span> {label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
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
          {current.page && (
            <p className="tabMore">
              <a href={current.page}>Ver todo sobre Clonexa para {current.label.toLowerCase()} →</a>
            </p>
          )}
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
  return (
    <section id="preguntas" className="wrap section" aria-labelledby="faq-titulo">
      <SectionHead id="faq-titulo" kicker="PREGUNTAS" title="Preguntas frecuentes" />
      <FaqList items={FAQ} />
    </section>
  );
}

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
