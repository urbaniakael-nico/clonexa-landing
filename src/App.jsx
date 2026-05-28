import React from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  FileText,
  KeyRound,
  Layers3,
  LockKeyhole,
  Mail,
  MapPinned,
  Menu,
  QrCode,
  ShieldCheck,
  Store,
  Users,
  Vote,
  X,
  Zap
} from "lucide-react";

const LOGO_PATH = "/clonexa-logo.png";

const modules = [
  {
    name: "Production OS",
    label: "Producción",
    icon: Factory,
    description:
      "Control de referencias, avance, cantidades cerradas, tiempos productivos, sesiones y detalle operativo.",
    proof: "Validado en flujos reales de producción."
  },
  {
    name: "Commercial OS",
    label: "Ventas y tiendas",
    icon: Store,
    description:
      "Reportes de ventas, cierres de tienda, consolidado comercial, top vendedores, estados y archivo operativo.",
    proof: "Validado en cierres comerciales y reportes."
  },
  {
    name: "Hospitality QR OS",
    label: "Bares y restaurantes",
    icon: QrCode,
    description:
      "Mesas por QR, pedidos, cuentas abiertas, inventario, stock, fidelización y flujo operativo de barra o cocina.",
    proof: "Validado como sistema QR funcional."
  },
  {
    name: "Field & Materials OS",
    label: "Campo, GPS y materiales",
    icon: MapPinned,
    description:
      "Entradas y salidas de materiales, solicitudes, entregas, devoluciones, GPS, asistencia, payroll y bitácora.",
    proof: "Validado en trazabilidad operativa de campo."
  },
  {
    name: "Assembly OS",
    label: "Asambleas",
    icon: Vote,
    description:
      "Acceso por QR, registro, votaciones, control de tiempos, decisiones formales, auditoría y actas PDF.",
    proof: "Módulo listo para decisiones formales."
  }
];

const coreItems = [
  "Multiempresa / tenants",
  "Usuarios y roles",
  "Permisos",
  "Módulos configurables",
  "Dashboards",
  "Reportes",
  "Auditoría",
  "Salidas PDF",
  "Operación en tiempo real",
  "Branding por cliente"
];

const steps = [
  {
    number: "01",
    title: "Creamos la empresa",
    text: "Se configura el espacio del cliente, usuarios, accesos, permisos, branding y estructura inicial."
  },
  {
    number: "02",
    title: "Activamos módulos",
    text: "Se seleccionan módulos preconstruidos según la operación: producción, ventas, QR, campo o asambleas."
  },
  {
    number: "03",
    title: "Configuramos flujos",
    text: "Ajustamos roles, reglas, paneles, formularios, reportes y vistas según el proceso real del cliente."
  },
  {
    number: "04",
    title: "Operar, medir y auditar",
    text: "La empresa empieza a operar desde un sistema digital con datos, trazabilidad y control."
  }
];

const problems = [
  "Operaciones repartidas entre WhatsApp, Excel, formularios, correos y software aislado.",
  "Reportes manuales que llegan tarde, incompletos o sin trazabilidad.",
  "Procesos reales que no encajan en herramientas genéricas.",
  "Desarrollos a medida lentos, costosos y difíciles de mantener."
];

function Brand({ footer = false }) {
  const [logoOk, setLogoOk] = React.useState(Boolean(LOGO_PATH));

  return (
    <a href="#top" className={`brand ${footer ? "brandFooter" : ""}`}>
      {logoOk ? (
        <img
          className="brandLogo"
          src={LOGO_PATH}
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

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <main className="app">
      <nav className="nav">
        <Brand />

        <div className="navLinks">
          <a href="#modules">Módulos</a>
          <a href="#core">Core SaaS</a>
          <a href="#proof">Producto</a>
          <a href="#how">Cómo funciona</a>
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

          <a onClick={() => setMenuOpen(false)} href="#modules">Módulos</a>
          <a onClick={() => setMenuOpen(false)} href="#core">Core SaaS</a>
          <a onClick={() => setMenuOpen(false)} href="#proof">Producto</a>
          <a onClick={() => setMenuOpen(false)} href="#how">Cómo funciona</a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Solicitar demo</a>
        </div>
      )}

      <section id="top" className="hero section">
        <div className="heroCopy">
          <div className="pill">
            <span className="pulse"></span>
            SaaS modular · operaciones reales · módulos configurables
          </div>

          <h1>
            Un solo sistema operativo SaaS para digitalizar operaciones empresariales reales.
          </h1>

          <p className="heroText">
            CLONEXA convierte procesos fragmentados en plataformas digitales funcionales usando
            un core SaaS reutilizable y módulos configurables para producción, ventas, QR,
            campo, materiales y decisiones formales.
          </p>

          <div className="heroActions">
            <a href="#contact" className="button primary">
              Solicitar demo <ArrowRight size={18} />
            </a>
            <a href="#modules" className="button secondary">
              Ver módulos validados
            </a>
          </div>

          <div className="heroBadges">
            <span>5 sistemas operativos funcionales</span>
            <span>Un mismo core SaaS</span>
            <span>Configuración por operación</span>
          </div>
        </div>

        <div className="heroVisual">
          <div className="commandCard">
            <div className="commandHeader">
              <div>
                <strong>CLONEXA Command Center</strong>
                <span>Multiempresa · módulos · usuarios · auditoría</span>
              </div>
              <div className="liveTag">Live</div>
            </div>

            <div className="commandGrid">
              <div className="commandItem active">
                <Building2 size={20} />
                <strong>Tenants</strong>
                <span>Empresas configuradas</span>
              </div>

              <div className="commandItem">
                <Layers3 size={20} />
                <strong>Módulos</strong>
                <span>Producción · QR · Campo</span>
              </div>

              <div className="commandItem">
                <Users size={20} />
                <strong>Roles</strong>
                <span>Accesos y permisos</span>
              </div>

              <div className="commandItem">
                <ShieldCheck size={20} />
                <strong>Auditoría</strong>
                <span>Operación trazable</span>
              </div>
            </div>

            <div className="systemFlow">
              <div>
                <span>Production</span>
                <div className="flowTrack"><div className="flowFill w88"></div></div>
              </div>
              <div>
                <span>Commercial</span>
                <div className="flowTrack"><div className="flowFill w74"></div></div>
              </div>
              <div>
                <span>Field & Materials</span>
                <div className="flowTrack"><div className="flowFill w64"></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section trustSection">
        <div className="trustCard">
          <span>Producto ya operando en flujos reales</span>
          <strong>Producción · Ventas · QR Hospitality · Campo y materiales · Asambleas</strong>
          <p>
            CLONEXA no es una landing conceptual. Es una infraestructura SaaS modular que ya
            soporta distintos tipos de operación sobre una misma base reutilizable.
          </p>
        </div>
      </section>

      <section className="section problemSection">
        <div>
          <span className="kicker">Problema</span>
          <h2>Las empresas no fallan por falta de trabajo. Fallan por operar fragmentadas.</h2>
          <p className="sectionText">
            Muchas empresas tienen procesos reales funcionando, pero la operación vive repartida
            entre herramientas desconectadas. Eso genera errores, reportes tardíos, poca visibilidad
            y decisiones sin evidencia.
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

      <section id="modules" className="section modulesSection">
        <div className="sectionHead">
          <span className="kicker">Módulos validados</span>
          <h2>Cinco operaciones distintas. Un mismo core SaaS.</h2>
          <p>
            CLONEXA no es una colección de proyectos aislados. Cada módulo comparte tenants,
            usuarios, roles, permisos, dashboards, reportes y trazabilidad.
          </p>
        </div>

        <div className="modulesGrid">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <div className="moduleCard" key={module.name}>
                <div className="moduleTop">
                  <div className="moduleIcon">
                    <Icon size={24} />
                  </div>
                  <span>{module.label}</span>
                </div>

                <h3>{module.name}</h3>
                <p>{module.description}</p>

                <div className="proofTag">
                  <Zap size={15} />
                  {module.proof}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="core" className="section coreSection">
        <div className="coreCopy">
          <span className="kicker">Core SaaS</span>
          <h2>No construimos desde cero por cliente. Configuramos módulos sobre la misma infraestructura.</h2>
          <p className="sectionText">
            Cada empresa opera sobre el mismo core SaaS de CLONEXA. Lo que cambia es la configuración
            de módulos, flujos, roles, dashboards y reglas operativas según la realidad del negocio.
          </p>
        </div>

        <div className="coreGrid">
          {coreItems.map((item) => (
            <div className="coreItem" key={item}>
              <LockKeyhole size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="proof" className="section proofSection">
        <div className="sectionHead">
          <span className="kicker">Producto</span>
          <h2>Vistas operativas listas para trabajar, medir y auditar.</h2>
          <p>
            La landing pública muestra vistas anonimizadas y datos demostrativos. La demo privada
            permite revisar flujos reales sin exponer información sensible de clientes.
          </p>
        </div>

        <div className="screensGrid">
          <div className="screen production">
            <div className="screenHeader">
              <span>Production OS</span>
              <strong>Resumen productivo</strong>
            </div>

            <div className="stats">
              <div>
                <span>Referencias</span>
                <strong>14</strong>
              </div>
              <div>
                <span>Tiempo productivo</span>
                <strong>105h</strong>
              </div>
              <div>
                <span>Avance</span>
                <strong>21%</strong>
              </div>
            </div>

            <div className="miniBars">
              <div><span>Dreamy Jacket</span><div className="flowTrack"><div className="flowFill w100"></div></div></div>
              <div><span>Koi Jacket</span><div className="flowTrack"><div className="flowFill w88"></div></div></div>
              <div><span>Garden Jacket</span><div className="flowTrack"><div className="flowFill w44"></div></div></div>
            </div>
          </div>

          <div className="screen qr">
            <div className="screenHeader">
              <span>Hospitality QR OS</span>
              <strong>Mesa QR</strong>
            </div>

            <div className="qrGrid">
              {["Barra", "Mesa 1", "Mesa 2", "Mesa 3"].map((table) => (
                <div className="qrCard" key={table}>
                  <div className="fakeQr">
                    <QrCode size={54} />
                  </div>
                  <strong>{table}</strong>
                  <span>Libre · Cuenta $0</span>
                </div>
              ))}
            </div>
          </div>

          <div className="screen field">
            <div className="screenHeader">
              <span>Field & Materials OS</span>
              <strong>Tablas auditables</strong>
            </div>

            <div className="tableMock">
              <div className="tableHead">
                <span>Orden</span>
                <span>Material</span>
                <span>Status</span>
                <span>GPS</span>
              </div>

              {["Cable de fibra", "Cable telefónico", "Cable HDMI", "Kit instalación"].map((row, index) => (
                <div className="tableRow" key={row}>
                  <span>MAT-000{index + 1}</span>
                  <span>{row}</span>
                  <span>{index % 2 === 0 ? "Delivered" : "Pending"}</span>
                  <span>OK</span>
                </div>
              ))}
            </div>
          </div>

          <div className="screen commercial">
            <div className="screenHeader">
              <span>Commercial OS</span>
              <strong>Reportes de ventas</strong>
            </div>

            <div className="reportCards">
              <div>
                <span>Cierres recibidos</span>
                <strong>7</strong>
              </div>
              <div>
                <span>Top vendedor</span>
                <strong>Equipo A</strong>
              </div>
              <div>
                <span>Estado</span>
                <strong>Enviado</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="section howSection">
        <div className="sectionHead">
          <span className="kicker">Cómo funciona</span>
          <h2>De operación dispersa a sistema digital configurable.</h2>
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

      <section className="section comparisonSection">
        <div className="comparisonCard">
          <div>
            <span className="kicker">La diferencia</span>
            <h2>CLONEXA no es software a medida. Es SaaS modular configurable.</h2>
          </div>

          <div className="comparisonGrid">
            <div>
              <h3>Software a medida</h3>
              <p>Se construye desde cero, depende de entregas largas, cuesta mantenerlo y cada cliente se vuelve un proyecto separado.</p>
            </div>

            <div className="highlightBox">
              <h3>CLONEXA</h3>
              <p>Usa un core SaaS compartido. Cada cliente activa módulos, flujos, roles y dashboards sobre una infraestructura reutilizable.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contactSection">
        <div className="contactCard">
          <div>
            <span className="kicker">Demo privada</span>
            <h2>¿Tu operación sigue repartida entre hojas, mensajes y reportes manuales?</h2>
            <p>
              Solicita una demo y revisamos qué módulos de CLONEXA pueden configurarse para tu operación.
              Los detalles comerciales se revisan de forma privada.
            </p>
          </div>

          <div className="contactActions">
            <a
              className="button primary"
              href="mailto:clonexasaas@gmail.com?subject=Solicitud%20de%20demo%20CLONEXA&body=Hola%2C%20quiero%20solicitar%20una%20demo%20de%20CLONEXA."
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