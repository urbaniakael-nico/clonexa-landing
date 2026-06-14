import React from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Factory,
  FileText,
  LockKeyhole,
  Mail,
  MapPinned,
  Menu,
  PackageSearch,
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
  videoIa: "/clonexa-media/video-ia.mp4",
  legacyVideo: "/clonexa-media/video-landing-clonexa-69a6bf95e6.mp4",
  production: "/clonexa-media/produccion-ia.jpg",
  stores: "/clonexa-media/tiendas-ia.jpg",
  hospitality: "/clonexa-media/bares-pedidos-ia.jpg",
  field: "/clonexa-media/campo-ia.jpg",
  reports: "/clonexa-media/reportes-ia.jpg",
  shoplink: "/clonexa-media/tienda-virtual-ia.jpg",
  assembly: "/clonexa-media/asambleas-ia.jpg"
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
    id: "shoplink",
    label: "Catalogo / Tienda",
    title: "Tienda publica, catalogo y pedidos conectados",
    icon: ShoppingBag,
    image: MEDIA.shoplink,
    text:
      "Activa tienda publica, productos, precios, stock visible, pedidos, clientes y seguimiento comercial desde el mismo panel.",
    bullets: ["Catalogo asistido", "Carrito y pedidos", "CRM web", "Inventario visible"]
  },
  {
    id: "ai",
    label: "Asistente IA",
    title: "IA operativa conectada a cada modulo activo",
    icon: Bot,
    image: MEDIA.reports,
    text:
      "El asistente ya no solo conversa: guia registros, consulta datos, entrega estados, arma reportes y evita omitir campos clave.",
    bullets: ["WhatsApp y panel", "Flujos asistidos", "Consultas por vocabulario", "Cancelacion y atras"]
  },
  {
    id: "production",
    label: "Produccion",
    title: "Referencias, produccion y avance con control real",
    icon: Factory,
    image: MEDIA.production,
    text:
      "Referencias comerciales con categoria, color, SKU, precio, meta, estado activo y asistencia para crear o archivar.",
    bullets: ["Referencias activas", "SKU y precios", "Metas operativas", "Avance por referencia"]
  },
  {
    id: "stores",
    label: "Tiendas",
    title: "Ventas, cierre comercial y fuerza operativa",
    icon: Store,
    image: MEDIA.stores,
    text:
      "Consulta mejores vendedores, top tiendas, ventas por area, cierre enviado, metas, nomina y workforce desde CLONEXA.",
    bullets: ["Cierres comerciales", "Ventas vs meta", "Workforce", "Nomina"]
  },
  {
    id: "hospitality",
    label: "Hospitality",
    title: "QR, pedidos, mesas, stock y fidelizacion",
    icon: QrCode,
    image: MEDIA.hospitality,
    text:
      "Mesas QR con clave, pedidos, cuentas abiertas, stock, concursos, sorteos, pollas y reportes semanales o mensuales.",
    bullets: ["QR por mesa", "Pedidos y cuentas", "Stock critico", "Fidelizacion"]
  },
  {
    id: "field",
    label: "Campo / GPS",
    title: "Materiales, ubicaciones y parametros GPS",
    icon: MapPinned,
    image: MEDIA.field,
    text:
      "Gestiona materiales, inventario, entradas, salidas, autorizaciones, GPS activo y puntos permitidos con asistencia.",
    bullets: ["Inventario", "Adjuntar factura", "GPS activo", "Materiales"]
  },
  {
    id: "reports",
    label: "Reportes",
    title: "Reportes descargables con estilo dashboard",
    icon: BarChart3,
    image: MEDIA.reports,
    text:
      "PDFs por rango, por categoria o super archivo con graficas, tablas auditables, colores de marca y resumen ejecutivo.",
    bullets: ["PDF dashboard", "Graficas", "Rangos asistidos", "Super archivo"]
  },
  {
    id: "assembly",
    label: "Asambleas",
    title: "Votaciones, QR, control de acceso y actas",
    icon: Vote,
    image: MEDIA.assembly,
    text:
      "Publica preguntas, controla tiempos, registra participantes, valida acceso y descarga actas con resultado auditable.",
    bullets: ["Acceso QR", "Votacion en vivo", "Resultados", "Actas PDF"]
  }
];

const aiHighlights = [
  {
    icon: Bot,
    title: "Asistencia por modulo",
    text: "La IA reconoce frases como agregar inventario, modificar stock, precio de referencia, configurar GPS o reporte mensual."
  },
  {
    icon: Workflow,
    title: "Flujos sin omitir campos",
    text: "Guia paso a paso datos criticos: SKU, color, precio, correo, descuentos, fechas, cantidades, facturas y estados."
  },
  {
    icon: FileText,
    title: "Reportes listos para descargar",
    text: "Genera PDFs presentables tipo dashboard con indicadores, graficas, tablas y rangos asistidos."
  },
  {
    icon: ShieldCheck,
    title: "Operacion blindada",
    text: "Cada vertical conserva permisos, trazabilidad, auditoria, estados activos y acciones como guardar, archivar o deshabilitar."
  }
];

const metricCards = [
  ["Verticales conectadas", "ShopLink, produccion, retail, campo, hospitality y asambleas"],
  ["IA operativa", "Panel y WhatsApp con consultas, registros y reportes asistidos"],
  ["Datos completos", "Referencias, workforce, inventario, stock, QR, GPS y fidelizacion"],
  ["Salida ejecutiva", "PDFs tipo dashboard con marca, rangos, tablas y graficas"]
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
        <span className="eyebrow">{featured ? "Nuevo video" : "Demo anterior"}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <video className="demoVideo" controls playsInline preload="metadata" poster={poster}>
        <source src={src} />
        Tu navegador no puede reproducir este video.
      </video>
    </article>
  );
}

function VerticalCard({ vertical }) {
  const Icon = vertical.icon;

  return (
    <article className="verticalCard">
      <img src={vertical.image} alt={`${vertical.title} en CLONEXA`} />
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
          <a href="#video">Video IA</a>
          <a href="#verticals">Verticales</a>
          <a href="#assistant">IA</a>
          <a href="#core">Core</a>
          <a href="#contact" className="navCta">Solicitar demo</a>
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

          <a onClick={() => setMenuOpen(false)} href="#video">Video IA</a>
          <a onClick={() => setMenuOpen(false)} href="#verticals">Verticales</a>
          <a onClick={() => setMenuOpen(false)} href="#assistant">IA</a>
          <a onClick={() => setMenuOpen(false)} href="#core">Core</a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Solicitar demo</a>
        </div>
      )}

      <section id="top" className="hero">
        <img className="heroImage" src={MEDIA.reports} alt="CLONEXA dashboard con IA y reportes" />
        <div className="heroOverlay" />
        <div className="heroContent">
          <div className="pill">
            <span className="pulse" />
            Actualizacion IA + verticales
          </div>

          <h1>CLONEXA</h1>
          <p className="heroLead">
            Sistema operativo SaaS con asistente IA para operar tiendas, produccion,
            campo, hospitality, catalogo publico, stock, QR, GPS, reportes y asambleas.
          </p>

          <div className="heroActions">
            <a href="#video" className="button primary">
              Ver video IA <PlayCircle size={18} />
            </a>
            <a href="#verticals" className="button secondary">
              Ver verticales <ArrowRight size={18} />
            </a>
          </div>

          <div className="heroBadges">
            <span>Asistente IA</span>
            <span>WhatsApp</span>
            <span>Reportes PDF</span>
            <span>ShopLink</span>
            <span>QR + GPS</span>
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
          <span className="kicker">Video principal</span>
          <h2>Primero la actualizacion de IA. Luego la demo original.</h2>
          <p>
            La landing ahora muestra primero el nuevo video de CLONEXA IA y conserva
            el video anterior como respaldo comercial.
          </p>
        </div>

        <div className="videoGrid">
          <VideoBlock
            featured
            title="CLONEXA IA y verticales activas"
            text="Resumen nuevo del asistente, los modulos enlazados y la operacion por vertical."
            src={MEDIA.videoIa}
            poster={MEDIA.reports}
          />
          <VideoBlock
            title="Demo operativa CLONEXA"
            text="Material anterior conservado para mostrar el recorrido base del producto."
            src={MEDIA.legacyVideo}
            poster={MEDIA.production}
          />
        </div>
      </section>

      <section id="verticals" className="section verticalsSection">
        <div className="sectionHead">
          <span className="kicker">Verticales actualizadas</span>
          <h2>Una sola base CLONEXA, varias operaciones listas para activar.</h2>
          <p>
            Cada vertical se muestra con su imagen nueva y con las funciones mas
            importantes que ya se integraron al asistente IA.
          </p>
        </div>

        <div className="verticalGrid">
          {activeVerticals.map((vertical) => (
            <VerticalCard key={vertical.id} vertical={vertical} />
          ))}
        </div>
      </section>

      <section id="assistant" className="section assistantSection">
        <div className="assistantCopy">
          <span className="kicker">Asistente CLONEXA</span>
          <h2>La IA responde, guia y ejecuta segun los modulos reales de cada empresa.</h2>
          <p className="sectionText">
            El asistente detecta solo modulos activos, entiende vocabulario operativo
            y acompana formularios completos: referencias, workforce, inventario,
            stock, GPS, QR, reportes, hospitality y fidelizacion.
          </p>
          <div className="assistantActions">
            <a className="button primary" href="#contact">
              Activar demo IA <ArrowRight size={18} />
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
            modulos, dashboards, auditoria y documentos descargables.
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
          <span className="kicker">Demo privada</span>
          <h2>Mostramos la vertical exacta que necesita tu empresa.</h2>
          <p>
            Agenda una revision de CLONEXA IA, ShopLink, produccion, tiendas,
            hospitality, campo, reportes, QR, GPS, stock o asambleas.
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
