import React from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CreditCard,
  Factory,
  FileText,
  LockKeyhole,
  Mail,
  MapPinned,
  Menu,
  PackageSearch,
  PhoneCall,
  PlayCircle,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  Vote,
  Workflow,
  X
} from "lucide-react";

const MEDIA = {
  logo: "/clonexa-logo.png",
  landingMain: "/clonexa-media/landing-main.mp4",
  videoIa: "/clonexa-media/video-ia.mp4",
  legacyVideo: "/clonexa-media/video-landing-clonexa-69a6bf95e6.mp4",
  transport: "/clonexa-media/vertical-transport.mp4",
  production: "/clonexa-media/vertical-production.mp4",
  stores: "/clonexa-media/vertical-stores.mp4",
  hospitality: "/clonexa-media/vertical-hospitality.mp4",
  field: "/clonexa-media/vertical-field.mp4",
  shoplink: "/clonexa-media/vertical-shoplink.mp4",
  assembly: "/clonexa-media/vertical-assembly.mp4",
  landingPoster: "/clonexa-media/poster-landing-main.png",
  videoIaPoster: "/clonexa-media/poster-video-ia.png",
  demoPoster: "/clonexa-media/poster-demo-comercial.png",
  transportPoster: "/clonexa-media/poster-transport.png",
  productionPoster: "/clonexa-media/poster-production.png",
  storesPoster: "/clonexa-media/poster-stores.png",
  hospitalityPoster: "/clonexa-media/poster-hospitality.png",
  fieldPoster: "/clonexa-media/poster-field.png",
  shoplinkPoster: "/clonexa-media/poster-shoplink.png",
  assemblyPoster: "/clonexa-media/poster-assembly.png"
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
  if (window.__clonexaLandingTracked026L) return;
  window.__clonexaLandingTracked026L = true;

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
      tracker: "026L",
      focus: "ai-verticals-landing",
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

const activeVerticals = [
  {
    id: "transport",
    label: "Call center transporte",
    title: "Llamadas, rutas, tickets, contratos y tesoreria",
    icon: PhoneCall,
    video: MEDIA.transport,
    poster: MEDIA.transportPoster,
    text:
      "Para operaciones con asesores, supervisores y tesoreria: registro de llamadas, bases asignadas, cotizaciones, tickets imprimibles, contratos con saldo y alertas de cupo.",
    bullets: ["Agentes", "Supervisor live", "Tickets", "Tesoreria"]
  },
  {
    id: "shoplink",
    label: "Tienda publica",
    title: "Catalogo online con pedidos y CRM conectado",
    icon: ShoppingBag,
    video: MEDIA.shoplink,
    poster: MEDIA.shoplinkPoster,
    text:
      "Activa una tienda publica con productos, precios, stock visible, carrito, pedidos, clientes, seguimiento comercial y reportes de venta.",
    bullets: ["Catalogo", "Carrito", "CRM web", "Stock visible"]
  },
  {
    id: "stores",
    label: "Retail y tiendas",
    title: "Ventas, metas, nomina y cierres diarios",
    icon: Store,
    video: MEDIA.stores,
    poster: MEDIA.storesPoster,
    text:
      "Controla tiendas, areas de venta, vendedores, metas, cierres enviados, ranking, solicitudes, minipaneles y stock inteligente para equipos comerciales.",
    bullets: ["Cierres", "Metas", "Nomina", "Mini paneles"]
  },
  {
    id: "production",
    label: "Produccion",
    title: "Referencias, produccion, cotizaciones y pagos",
    icon: Factory,
    video: MEDIA.production,
    poster: MEDIA.productionPoster,
    text:
      "Administra referencias con categoria, color, SKU, precio, meta, produccion, cotizaciones, ordenes de pago, CRM, workforce y nomina.",
    bullets: ["Referencias", "SKU", "Produccion", "Pagos"]
  },
  {
    id: "hospitality",
    label: "Hospitality",
    title: "QR, pedidos, mesas, stock y fidelizacion",
    icon: QrCode,
    video: MEDIA.hospitality,
    poster: MEDIA.hospitalityPoster,
    text:
      "Para bares y restaurantes: QR por mesa, clave de acceso, pedidos, cuentas abiertas, stock, sorteos, pollas, concursos y reportes descargables.",
    bullets: ["QR", "Pedidos", "Stock", "Fidelizacion"]
  },
  {
    id: "field",
    label: "Campo y GPS",
    title: "Inventario, materiales, ubicaciones y reportes",
    icon: MapPinned,
    video: MEDIA.field,
    poster: MEDIA.fieldPoster,
    text:
      "Gestiona personal de campo, materiales, entradas, salidas, autorizaciones, inventario, facturas adjuntas, GPS y puntos permitidos.",
    bullets: ["GPS", "Materiales", "Inventario", "Facturas"]
  },
  {
    id: "assembly",
    label: "Asambleas",
    title: "Votaciones, QR, control de acceso y actas",
    icon: Vote,
    video: MEDIA.assembly,
    poster: MEDIA.assemblyPoster,
    text:
      "Publica preguntas, valida participantes, controla tiempos, registra votos en vivo, genera resultados auditables y descarga actas.",
    bullets: ["Acceso QR", "Votacion", "Resultados", "Actas"]
  }
];

const demoModules = [
  "Asistente IA",
  "Call center",
  "Contratos / Avales",
  "Cotizaciones / Tickets",
  "Tesoreria",
  "Tienda publica",
  "CRM",
  "Stock",
  "Inventario",
  "QR",
  "GPS",
  "Reportes",
  "Nomina",
  "Workforce",
  "Fidelizacion",
  "Asambleas"
];

const aiHighlights = [
  {
    icon: Bot,
    title: "IA conectada al modulo real",
    text: "El asistente no inventa opciones: lee los modulos activos de la empresa y guia acciones con datos completos."
  },
  {
    icon: Workflow,
    title: "Flujos completos",
    text: "Agrega, modifica, consulta, archiva, imprime, descarga PDF y lleva estados sin omitir campos criticos."
  },
  {
    icon: CreditCard,
    title: "Control financiero",
    text: "Contratos, saldos, pagos, facturas, alertas de cupo y validaciones por tesoreria o supervisor."
  },
  {
    icon: ShieldCheck,
    title: "Operacion auditable",
    text: "Roles, permisos, minipaneles, registros, reportes y trazabilidad para crecer como SaaS."
  }
];

const metricCards = [
  ["IA por vertical", "Cada empresa ve solo sus modulos activos y sus flujos reales."],
  ["Operacion 360", "Ventas, llamadas, tickets, inventario, QR, GPS, pagos y reportes."],
  ["Demo personalizado", "El usuario elige vertical y modulos para recibir una muestra aplicada."],
  ["Vision SaaS", "Una base multiempresa lista para clientes, aliados e inversionistas."]
];

const flowSteps = [
  ["1", "El cliente ve la vertical", "Video corto, caso real y beneficios por industria."],
  ["2", "Elige los modulos", "Cuestionario simple con las piezas que necesita activar."],
  ["3", "Recibe una muestra", "Se prepara demo con su operacion, usuarios, permisos y datos."],
  ["4", "CLONEXA escala", "Panel, IA, minipaneles, reportes y auditoria en una sola base."]
];

const coreItems = [
  ["Empresas", Building2],
  ["Usuarios y roles", Users],
  ["Permisos", LockKeyhole],
  ["Modulos activos", PackageSearch],
  ["Dashboards", BarChart3],
  ["Flujos IA", Workflow],
  ["Auditoria", ShieldCheck],
  ["Reportes PDF", FileText]
];

const emptyDemoForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  vertical: "transport",
  modules: ["Asistente IA"],
  need: ""
};

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
        <span>AI Operating System</span>
      </div>
    </a>
  );
}

function VideoBlock({ title, text, src, poster, featured = false }) {
  return (
    <article className={`videoBlock ${featured ? "videoBlockFeatured" : ""}`}>
      <div className="videoCopy">
        <span className="eyebrow">{featured ? "IA operativa" : "Operacion real"}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <video className="demoVideo" controls playsInline preload="metadata" poster={poster}>
        <source src={src} type="video/mp4" />
        Tu navegador no puede reproducir este video.
      </video>
    </article>
  );
}

function VerticalCard({ vertical, watched, onVideoEnded, onRequestDemo }) {
  const Icon = vertical.icon;

  return (
    <article className="verticalCard">
      <div className="verticalMedia">
        <video
          className="verticalVideo"
          muted
          loop={false}
          playsInline
          preload="metadata"
          poster={vertical.poster}
          onEnded={() => onVideoEnded(vertical)}
          controls
        >
          <source src={vertical.video} type="video/mp4" />
        </video>
        <span className="videoPill">Caso real por vertical</span>
      </div>

      <div className="verticalBody">
        <div className="verticalTop">
          <span className="verticalIcon"><Icon size={18} /></span>
          <span>{vertical.label}</span>
        </div>
        <h3>{vertical.title}</h3>
        <p>{vertical.text}</p>
        <div className="chips">
          {vertical.bullets.map((bullet) => (
            <span key={bullet}>{bullet}</span>
          ))}
        </div>

        {watched && (
          <div className="videoDonePrompt">
            <strong>Te gustaria una demo personalizada?</strong>
            <span>Completa los modulos que necesitas y te enviamos una muestra aplicada.</span>
          </div>
        )}

        <button type="button" className="miniCta" onClick={() => onRequestDemo(vertical)}>
          Pedir demo de esta vertical <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function HighlightCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="highlightCard">
      <Icon size={24} />
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

function DemoQuestionnaire({ form, setForm, selectedVertical, onSubmit }) {
  const selected = activeVerticals.find((vertical) => vertical.id === form.vertical) || activeVerticals[0];

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleModule(moduleName) {
    setForm((current) => {
      const exists = current.modules.includes(moduleName);
      return {
        ...current,
        modules: exists
          ? current.modules.filter((module) => module !== moduleName)
          : [...current.modules, moduleName]
      };
    });
  }

  return (
    <section id="demo-request" className="section demoRequestSection">
      <div className="demoRequestCopy">
        <span className="kicker">Demo personalizado</span>
        <h2>Elige la vertical, marca los modulos y pide una muestra para tu operacion.</h2>
        <p className="sectionText">
          Despues de ver un video, CLONEXA te ayuda a aterrizar que necesitas:
          IA, paneles, usuarios, pagos, reportes, minipaneles, QR, GPS o control financiero.
        </p>

        <div className="selectedDemoCard">
          <span>Vertical seleccionada</span>
          <strong>{selected.title}</strong>
          <small>{selectedVertical ? "Seleccionada desde el video." : "Puedes cambiarla en el formulario."}</small>
        </div>
      </div>

      <form className="demoForm" onSubmit={onSubmit}>
        <div className="fieldGroup twoCols">
          <label>
            Nombre
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Tu nombre"
            />
          </label>
          <label>
            Empresa
            <input
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Nombre de empresa"
            />
          </label>
        </div>

        <div className="fieldGroup twoCols">
          <label>
            Correo
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="correo@empresa.com"
            />
          </label>
          <label>
            WhatsApp
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+57..."
            />
          </label>
        </div>

        <label>
          Vertical que quieres ver
          <select value={form.vertical} onChange={(event) => updateField("vertical", event.target.value)}>
            {activeVerticals.map((vertical) => (
              <option key={vertical.id} value={vertical.id}>{vertical.label}</option>
            ))}
          </select>
        </label>

        <div className="modulePicker">
          <span>Modulos necesarios</span>
          <div>
            {demoModules.map((moduleName) => (
              <button
                type="button"
                key={moduleName}
                className={form.modules.includes(moduleName) ? "moduleChip active" : "moduleChip"}
                onClick={() => toggleModule(moduleName)}
              >
                {moduleName}
              </button>
            ))}
          </div>
        </div>

        <label>
          Que muestra quieres recibir?
          <textarea
            value={form.need}
            onChange={(event) => updateField("need", event.target.value)}
            placeholder="Ej: necesito ver call center con 20 asesores, tickets, saldo de contrato, tesoreria y reportes."
          />
        </label>

        <button className="button primary demoSubmit" type="submit">
          Enviar solicitud de muestra <Mail size={18} />
        </button>
      </form>
    </section>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [watchedVertical, setWatchedVertical] = React.useState("");
  const [selectedVertical, setSelectedVertical] = React.useState("");
  const [demoForm, setDemoForm] = React.useState(emptyDemoForm);

  React.useEffect(() => {
    trackLandingVisit();
  }, []);

  function requestDemo(vertical) {
    setSelectedVertical(vertical.id);
    setDemoForm((current) => ({
      ...current,
      vertical: vertical.id,
      modules: Array.from(new Set([...current.modules, ...vertical.bullets, "Asistente IA"]))
    }));
    requestAnimationFrame(() => {
      document.getElementById("demo-request")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleVerticalEnded(vertical) {
    setWatchedVertical(vertical.id);
    requestDemo(vertical);
  }

  function submitDemo(event) {
    event.preventDefault();
    const vertical = activeVerticals.find((item) => item.id === demoForm.vertical) || activeVerticals[0];
    const subject = `Demo personalizado CLONEXA - ${vertical.label}`;
    const body = [
      "Hola CLONEXA, quiero una muestra personalizada.",
      "",
      `Nombre: ${demoForm.name || "Pendiente"}`,
      `Empresa: ${demoForm.company || "Pendiente"}`,
      `Correo: ${demoForm.email || "Pendiente"}`,
      `WhatsApp: ${demoForm.phone || "Pendiente"}`,
      `Vertical: ${vertical.label}`,
      `Modulos: ${demoForm.modules.join(", ") || "Pendiente"}`,
      "",
      "Necesidad:",
      demoForm.need || "Pendiente de describir"
    ].join("\n");

    window.location.href = `mailto:clonexasaas@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="app">
      <nav className="nav">
        <Brand />

        <div className="navLinks">
          <a href="#video">Video</a>
          <a href="#verticals">Verticales</a>
          <a href="#assistant">IA</a>
          <a href="#demo-request">Demo</a>
          <a href="#contact" className="navCta">Contactar</a>
        </div>

        <button className="menuButton" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
          <Menu size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobileMenu">
          <button className="closeButton" onClick={() => setMenuOpen(false)} aria-label="Cerrar menu">
            <X size={22} />
          </button>

          <a onClick={() => setMenuOpen(false)} href="#video">Video</a>
          <a onClick={() => setMenuOpen(false)} href="#verticals">Verticales</a>
          <a onClick={() => setMenuOpen(false)} href="#assistant">IA</a>
          <a onClick={() => setMenuOpen(false)} href="#demo-request">Demo</a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Contactar</a>
        </div>
      )}

      <section id="top" className="hero">
        <video
          className="heroVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={MEDIA.landingPoster}
        >
          <source src={MEDIA.landingMain} type="video/mp4" />
        </video>
        <div className="heroOverlay" />
        <div className="heroContent">
          <div className="pill">
            <span className="pulse" />
            IA + verticales + operacion real
          </div>

          <h1>CLONEXA</h1>
          <p className="heroLead">
            El sistema operativo con IA que convierte llamadas, ventas, tickets,
            pagos, inventario, QR, GPS, reportes y equipos en una operacion controlada.
          </p>

          <div className="heroActions">
            <a href="#video" className="button primary">
              Ver video principal <PlayCircle size={18} />
            </a>
            <a href="#demo-request" className="button secondary">
              Pedir muestra <ArrowRight size={18} />
            </a>
          </div>

          <div className="heroStats">
            <article>
              <strong>7 verticales</strong>
              <span>listas para demo</span>
            </article>
            <article>
              <strong>IA operativa</strong>
              <span>por modulo activo</span>
            </article>
            <article>
              <strong>SaaS modular</strong>
              <span>multiempresa y escalable</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section metricsSection">
        {metricCards.map(([title, text]) => (
          <article className="metricCard" key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </article>
        ))}
      </section>

      <section id="video" className="section videoSection">
        <div className="sectionHead">
          <span className="kicker">Primera impresion</span>
          <h2>CLONEXA convierte operacion dispersa en control real, IA y decisiones al instante.</h2>
          <p>
            Menos hojas sueltas, menos chats perdidos y menos aprobaciones manuales. Cada vertical conecta personal, ventas, pagos, reportes y automatizacion en un mismo sistema.
          </p>
        </div>

        <div className="videoGrid">
          <VideoBlock
            featured
            title="CLONEXA IA y verticales activas"
            text="La actualizacion principal: IA, paneles, reportes, datos y operaciones reales."
            src={MEDIA.videoIa}
            poster={MEDIA.videoIaPoster}
          />
          <VideoBlock
            title="Demo comercial CLONEXA"
            text="Material base conservado para reforzar la vision y el recorrido del producto."
            src={MEDIA.legacyVideo}
            poster={MEDIA.demoPoster}
          />
        </div>
      </section>

      <section className="section flowSection">
        <div className="sectionHead">
          <span className="kicker">Conversion</span>
          <h2>Del caos operativo a una muestra lista para decidir.</h2>
        </div>
        <div className="flowGrid">
          {flowSteps.map(([number, title, text]) => (
            <article className="flowCard" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="verticals" className="section verticalsSection">
        <div className="sectionHead">
          <span className="kicker">Verticales actualizadas</span>
          <h2>Una plataforma por vertical, conectada por IA y datos reales.</h2>
          <p>
            Cada vertical muestra como CLONEXA ordena el trabajo diario: atiende clientes, mide equipos, controla inventario, cobra, reporta y deja trazabilidad por rol.
          </p>
        </div>

        <div className="verticalGrid">
          {activeVerticals.map((vertical) => (
            <VerticalCard
              key={vertical.id}
              vertical={vertical}
              watched={watchedVertical === vertical.id}
              onVideoEnded={handleVerticalEnded}
              onRequestDemo={requestDemo}
            />
          ))}
        </div>
      </section>

      <DemoQuestionnaire
        form={demoForm}
        setForm={setDemoForm}
        selectedVertical={selectedVertical}
        onSubmit={submitDemo}
      />

      <section id="assistant" className="section assistantSection">
        <div className="assistantCopy">
          <span className="kicker">Asistente CLONEXA</span>
          <h2>La IA responde, guia y ejecuta segun los modulos reales de cada empresa.</h2>
          <p className="sectionText">
            El asistente detecta modulos activos, entiende vocabulario operativo
            y acompana formularios completos: referencias, workforce, inventario,
            stock, GPS, QR, reportes, hospitality, fidelizacion y transporte.
          </p>
          <div className="assistantActions">
            <a className="button primary" href="#demo-request">
              Configurar demo IA <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="assistantPanel" aria-label="Resumen IA CLONEXA">
          <div className="assistantTop">
            <Bot size={26} />
            <div>
              <strong>Asistente IA</strong>
              <span>Modulo conectado a datos reales</span>
            </div>
          </div>
          <div className="assistantMessages">
            <p>Necesito saber el precio de una referencia.</p>
            <p>Agregar inventario y adjuntar factura.</p>
            <p>Quien es el mejor vendedor de tienda?</p>
            <p>Activar QR mesa 5 e imprimir.</p>
            <p>Cuanto saldo le queda a este contrato?</p>
          </div>
        </div>
      </section>

      <section className="section highlightsSection">
        {aiHighlights.map((item) => (
          <HighlightCard key={item.title} item={item} />
        ))}
      </section>

      <section id="core" className="section coreSection">
        <div>
          <span className="kicker">Core SaaS</span>
          <h2>No es una app aislada. Es una capa operativa configurable.</h2>
          <p className="sectionText">
            CLONEXA mantiene una misma base de empresas, usuarios, permisos,
            modulos, dashboards, auditoria, documentos y reportes descargables.
          </p>
        </div>

        <div className="coreGrid">
          {coreItems.map(([label, Icon]) => (
            <article className="coreItem" key={label}>
              <Icon size={20} />
              <span>{label}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section contactSection">
        <div className="contactContent">
          <span className="kicker">Clientes y funders</span>
          <h2>Mostramos la vertical exacta que necesita cada operacion.</h2>
          <p>
            CLONEXA puede presentarse como plataforma para empresas que quieren
            ordenar procesos, y como SaaS modular para inversionistas que buscan
            verticales escalables con datos, IA y control.
          </p>
        </div>

        <div className="contactActions">
          <a
            className="button primary"
            href="mailto:clonexasaas@gmail.com?subject=Solicitud%20de%20demo%20CLONEXA%20IA&body=Hola%2C%20quiero%20solicitar%20una%20demo%20de%20CLONEXA%20IA%20y%20sus%20verticales."
          >
            <Mail size={18} />
            Solicitar demo
          </a>
          <a className="button secondary" href="mailto:clonexasaas@gmail.com">
            clonexasaas@gmail.com
          </a>
        </div>
      </section>

      <footer className="footer">
        <Brand footer />
        <div className="footerRight">
          <span>CLONEXA AI Operating System</span>
          <span>IA, verticales, dashboards, reportes y auditoria</span>
        </div>
      </footer>
    </main>
  );
}

export default App;


