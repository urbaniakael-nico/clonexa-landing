import React from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Factory,
  FileText,
  Layers3,
  LockKeyhole,
  Mail,
  MapPinned,
  Menu,
  PlayCircle,
  QrCode,
  ShieldCheck,
  Store,
  Users,
  Vote,
  Workflow,
  X
} from "lucide-react";

const MEDIA = {
  logo: "/clonexa-logo.png",
  video: "/clonexa-media/video-landing-clonexa-69a6bf95e6.mp4",
  production: "/clonexa-media/produccion-referencias-control-701309b427.jpg",
  commercial: "/clonexa-media/tiendas-ventas-control-a47a941bde.jpg",
  qr: "/clonexa-media/bares-qr-fidelizacion-crm-panel-226aa7b281.jpg",
  field: "/clonexa-media/campo-gps-materiales-seguimientos-87ee002e1c.jpg",
  assembly: "/clonexa-media/bares-qr-fidelizacion-crm-panel-226aa7b281.jpg"
};

const LANDING_TRACKING_ENDPOINT =
  "https://clonexa-backend-production.up.railway.app/api/v1/landing-analytics/events";

function getStorageId(storage, key, prefix) {
  try {
    const current = storage.getItem(key);
    if (current) return current;
    const next = `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    storage.setItem(key, next);
    return next;
  } catch (_) {
    return `${prefix}-${Date.now().toString(36)}`;
  }
}

function trackLandingVisit() {
  if (window.__clonexaLandingTracked025R) return;
  window.__clonexaLandingTracked025R = true;

  const visitorId = getStorageId(localStorage, "clonexa_landing_visitor_id", "vis");
  const sessionId = getStorageId(sessionStorage, "clonexa_landing_session_id", "ses");
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const payload = {
    event_type: "page_view",
    url: window.location.href,
    path: window.location.pathname || "/",
    title: document.title,
    referrer: document.referrer,
    visitor_id: visitorId,
    session_id: sessionId,
    language: navigator.language || "",
    timezone,
    platform: navigator.platform || "",
    device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    extra: {
      landing: "clonexa-public",
      tracker: "025R",
      userAgent: navigator.userAgent
    }
  };

  const body = JSON.stringify(payload);
  const sent = navigator.sendBeacon?.(LANDING_TRACKING_ENDPOINT, body);
  if (!sent) {
    fetch(LANDING_TRACKING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {});
  }
}

const systems = [
  {
    id: "production",
    name: "Production OS",
    title: "Producción",
    icon: Factory,
    image: MEDIA.production,
    description:
      "Controla referencias, cantidades, avance, tiempos productivos, sesiones y detalle operativo en tiempo real.",
    bullets: ["Referencias activas", "Avance por producto", "Tiempo productivo", "Detalle auditable"]
  },
  {
    id: "commercial",
    name: "Commercial OS",
    title: "Ventas y tiendas",
    icon: Store,
    image: MEDIA.commercial,
    description:
      "Centraliza reportes de ventas, cierres de tienda, top vendedores, consolidado comercial y estados enviados o archivados.",
    bullets: ["Cierres comerciales", "Reportes de tienda", "Top vendedores", "Consolidado operativo"]
  },
  {
    id: "qr",
    name: "Hospitality QR OS",
    title: "Bares y restaurantes",
    icon: QrCode,
    image: MEDIA.qr,
    description:
      "Activa mesas QR, pedidos, cuentas abiertas, inventario, stock, fidelización y flujo operativo de barra o cocina.",
    bullets: ["Mesas QR", "Pedidos digitales", "Cuentas abiertas", "Inventario y stock"]
  },
  {
    id: "field",
    name: "Field & Materials OS",
    title: "Campo, materiales y GPS",
    icon: MapPinned,
    image: MEDIA.field,
    description:
      "Gestiona solicitudes, entregas, devoluciones, materiales, asistencia, GPS, payroll y bitácoras operativas.",
    bullets: ["Entradas y salidas", "GPS y evidencia", "Materiales", "Tablas auditables"]
  },
  {
    id: "assembly",
    name: "Assembly OS",
    title: "Asambleas",
    icon: Vote,
    image: MEDIA.assembly,
    description:
      "Organiza accesos, registros, votaciones, control de tiempos, decisiones formales, auditoría y actas PDF.",
    bullets: ["Acceso por QR", "Votaciones en vivo", "Cronómetro", "Actas PDF"]
  }
];

const steps = [
  {
    number: "01",
    title: "Entendemos tu operación",
    text: "Revisamos cómo trabajas hoy: procesos, usuarios, reportes, tareas, roles, ventas o producción."
  },
  {
    number: "02",
    title: "Activamos módulos",
    text: "Seleccionamos los módulos de CLONEXA que encajan con tu empresa: producción, ventas, QR, campo o asambleas."
  },
  {
    number: "03",
    title: "Configuramos flujos",
    text: "Adaptamos roles, formularios, dashboards, permisos y reportes sin construir todo desde cero."
  },
  {
    number: "04",
    title: "Operas con control",
    text: "Tu equipo empieza a trabajar desde un sistema digital con datos, trazabilidad y reportes."
  }
];

const problems = [
  "Operas con WhatsApp, Excel, formularios, correos o software desconectado.",
  "Los reportes llegan tarde, incompletos o sin evidencia.",
  "No tienes una vista clara de producción, ventas, campo o decisiones.",
  "Necesitas digitalizar tu operación sin pagar un desarrollo a medida desde cero."
];

function Brand({ footer = false }) {
  const [logoOk, setLogoOk] = React.useState(Boolean(MEDIA.logo));

  return (
    <a href="#top" className={`brand ${footer ? "brandFooter" : ""}`}>
      {logoOk ? (
        <img
          className="brandLogo"
          src={MEDIA.logo}
          alt="CLONEXA"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <div className="brandFallback">C</div>
      )}

      <div className="brandText">
        <strong>CLONEXA</strong>
        <span>Operate · Measure · Decide · Audit</span>
      </div>
    </a>
  );
}

function SystemCard({ system }) {
  const Icon = system.icon;

  return (
    <article className={`systemCard ${system.id === "assembly" ? "assemblyCard" : ""}`}>
      <div className="systemImageWrap">
        {system.image ? (
          <img src={system.image} alt={`${system.name} preview`} className="systemImage" />
        ) : (
          <div className="systemImageFallback">
            <Icon size={54} />
            <span>Preview del módulo</span>
          </div>
        )}
      </div>

      <div className="systemContent">
        <div className="systemTop">
          <div className="systemIcon">
            <Icon size={22} />
          </div>
          <span>{system.title}</span>
        </div>

        <h3>{system.name}</h3>
        <p>{system.description}</p>

        <div className="bulletGrid">
          {system.bullets.map((bullet) => (
            <div key={bullet}>
              <CheckCircle2 size={15} />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    trackLandingVisit();
  }, []);

  return (
    <main className="app">
      <nav className="nav">
        <Brand />

        <div className="navLinks">
          <a href="#video">Video</a>
          <a href="#systems">Sistemas</a>
          <a href="#assembly-focus">Asambleas</a>
          <a href="#how">Cómo funciona</a>
          <a href="#core">Core SaaS</a>
          <a href="#contact" className="navCta">Solicitar demo</a>
        </div>

        <button className="menuButton" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
          <Menu size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobileMenu">
          <button className="closeButton" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
            <X size={22} />
          </button>

          <a onClick={() => setMenuOpen(false)} href="#video">Video</a>
          <a onClick={() => setMenuOpen(false)} href="#systems">Sistemas</a>
          <a onClick={() => setMenuOpen(false)} href="#assembly-focus">Asambleas</a>
          <a onClick={() => setMenuOpen(false)} href="#how">Cómo funciona</a>
          <a onClick={() => setMenuOpen(false)} href="#core">Core SaaS</a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Solicitar demo</a>
        </div>
      )}

      <section id="top" className="hero section">
        <div className="heroCopy">
          <div className="pill">
            <span className="pulse"></span>
            SaaS modular para operaciones reales
          </div>

          <h1>
            Digitaliza producción, ventas, QR, campo y asambleas desde un solo sistema.
          </h1>

          <p className="heroText">
            CLONEXA ayuda a empresas que operan con procesos dispersos a convertir su operación
            real en una plataforma digital con módulos configurables, dashboards, reportes y trazabilidad.
          </p>

          <div className="heroActions">
            <a href="#contact" className="button primary">
              Solicitar demo <ArrowRight size={18} />
            </a>
            <a href="#video" className="button secondary">
              Ver cómo funciona <PlayCircle size={18} />
            </a>
          </div>

          <div className="heroBadges">
            <span>Producción</span>
            <span>Ventas</span>
            <span>QR Hospitality</span>
            <span>Campo y materiales</span>
            <span>Asambleas</span>
          </div>
        </div>

        <div className="heroVisual">
          <div className="operationCard">
            <div className="operationHeader">
              <div>
                <strong>CLONEXA Operating Layer</strong>
                <span>Un core SaaS · múltiples operaciones</span>
              </div>
              <div className="liveTag">Live</div>
            </div>

            <div className="operationGrid">
              <div className="operationItem active">
                <Factory size={22} />
                <strong>Producción</strong>
                <span>Referencias y tiempos</span>
              </div>
              <div className="operationItem">
                <Store size={22} />
                <strong>Ventas</strong>
                <span>Cierres y reportes</span>
              </div>
              <div className="operationItem">
                <QrCode size={22} />
                <strong>QR</strong>
                <span>Mesas y pedidos</span>
              </div>
              <div className="operationItem">
                <Vote size={22} />
                <strong>Asambleas</strong>
                <span>Votaciones y actas</span>
              </div>
            </div>

            <div className="operationFlow">
              <div>
                <span>Operación conectada</span>
                <div className="track"><div className="fill w90"></div></div>
              </div>
              <div>
                <span>Reportes y dashboards</span>
                <div className="track"><div className="fill w78"></div></div>
              </div>
              <div>
                <span>Decisiones trazables</span>
                <div className="track"><div className="fill w86"></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="video" className="section videoSection">
        <div className="sectionHead">
          <span className="kicker">Video demo</span>
          <h2>Así se ve CLONEXA en operación.</h2>
          <p>
            Mira cómo los módulos convierten procesos reales en flujos digitales para operar,
            medir, decidir y auditar desde una misma plataforma.
          </p>
        </div>

        <div className="videoShell">
          {MEDIA.video ? (
            <video
              className="demoVideo"
              controls
              playsInline
              preload="metadata"
              poster={MEDIA.production || MEDIA.commercial || MEDIA.qr || ""}
            >
              <source src={MEDIA.video} />
              Tu navegador no puede reproducir este video.
            </video>
          ) : (
            <div className="videoFallback">
              <PlayCircle size={72} />
              <h3>Video demo pendiente</h3>
              <p>Agrega un archivo MP4 o WEBM en la carpeta de medios para mostrarlo aquí.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section problemSection">
        <div>
          <span className="kicker">Problema</span>
          <h2>Tu empresa ya opera. El problema es que la operación está dispersa.</h2>
          <p className="sectionText">
            Muchas empresas no necesitan más hojas de cálculo ni otra herramienta aislada.
            Necesitan convertir sus procesos diarios en un sistema operativo digital que el equipo pueda usar.
          </p>
        </div>

        <div className="problemList">
          {problems.map((problem) => (
            <div className="problemItem" key={problem}>
              <CheckCircle2 size={20} />
              <span>{problem}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="systems" className="section systemsSection">
        <div className="sectionHead">
          <span className="kicker">Sistemas operativos validados</span>
          <h2>Elige el módulo que se parece a tu operación.</h2>
          <p>
            Cada sistema se configura sobre el mismo core SaaS de CLONEXA. No son proyectos separados:
            son módulos operativos reutilizables que se adaptan a distintos negocios.
          </p>
        </div>

        <div className="systemsGrid">
          {systems.map((system) => (
            <SystemCard key={system.id} system={system} />
          ))}
        </div>
      </section>

      <section id="assembly-focus" className="section assemblyFocus">
        <div className="assemblyCopy">
          <span className="kicker">CLONEXA Assembly</span>
          <h2>Asambleas con QR, clave, votación en vivo y acta PDF.</h2>
          <p className="sectionText">
            CLONEXA también digitaliza decisiones formales. El moderador publica preguntas,
            los asistentes ingresan con QR y clave, votan dentro del tiempo definido y el sistema
            deja resultados, porcentajes y acta descargable.
          </p>
        </div>

        <div className="assemblyPanel">
          <div className="assemblyHeader">
            <strong>Votación activa</strong>
            <span>04:00</span>
          </div>

          <div className="assemblyQuestion">
            <small>Pregunta publicada</small>
            <h3>¿Se aprueba la contratación de vigilancia?</h3>
          </div>

          <div className="assemblyVotes">
            <button>Sí</button>
            <button>No</button>
            <button>Abstención</button>
          </div>

          <div className="assemblyResults">
            <div><span>A favor</span><strong>68%</strong></div>
            <div><span>En contra</span><strong>24%</strong></div>
            <div><span>Abstención</span><strong>8%</strong></div>
          </div>
        </div>
      </section>

      <section id="how" className="section howSection">
        <div className="sectionHead">
          <span className="kicker">Cómo funciona</span>
          <h2>De operación manual a plataforma funcional.</h2>
        </div>

        <div className="stepsGrid">
          {steps.map((step) => (
            <div className="stepCard" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="core" className="section coreSection">
        <div>
          <span className="kicker">Core SaaS</span>
          <h2>No construimos todo desde cero. Configuramos módulos sobre una misma base.</h2>
          <p className="sectionText">
            CLONEXA opera sobre un core SaaS reutilizable: empresas, usuarios, roles, permisos,
            módulos, dashboards, reportes, auditoría y salidas documentales.
          </p>
        </div>

        <div className="coreGrid">
          {[
            ["Empresas", Building2],
            ["Usuarios y roles", Users],
            ["Permisos", LockKeyhole],
            ["Módulos", Layers3],
            ["Dashboards", BarChart3],
            ["Flujos", Workflow],
            ["Auditoría", ShieldCheck],
            ["Reportes PDF", FileText]
          ].map(([label, Icon]) => (
            <div className="coreItem" key={label}>
              <Icon size={20} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section differenceSection">
        <div className="differenceCard">
          <div>
            <span className="kicker">La diferencia</span>
            <h2>CLONEXA no es una app aislada ni un desarrollo a medida tradicional.</h2>
          </div>

          <div className="differenceGrid">
            <div>
              <h3>Antes</h3>
              <p>Procesos en Excel, WhatsApp, formularios, reportes manuales y decisiones sin trazabilidad.</p>
            </div>

            <div className="highlight">
              <h3>Con CLONEXA</h3>
              <p>Un sistema operativo SaaS configurable para que tu equipo opere, mida, reporte y audite desde un solo lugar.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contactSection">
        <div className="contactCard">
          <div>
            <span className="kicker">Demo privada</span>
            <h2>Cuéntanos cómo opera tu empresa y te mostramos qué módulo encaja.</h2>
            <p>
              Agenda una demo para revisar producción, ventas, QR hospitality, campo, materiales o asambleas.
              Los detalles comerciales se revisan de forma privada.
            </p>
          </div>

          <div className="contactActions">
            <a
              className="button primary"
              href="mailto:clonexasaas@gmail.com?subject=Solicitud%20de%20demo%20CLONEXA&body=Hola%2C%20quiero%20solicitar%20una%20demo%20de%20CLONEXA.%20Mi%20empresa%20necesita%20digitalizar%20la%20operaci%C3%B3n."
            >
              <Mail size={18} />
              Solicitar demo
            </a>

            <a className="button secondary" href="mailto:clonexasaas@gmail.com">
              clonexasaas@gmail.com
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <Brand footer />

        <div className="footerRight">
          <span>Sistema operativo SaaS modular</span>
          <span>Producción · Ventas · QR · Campo · Asambleas</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
