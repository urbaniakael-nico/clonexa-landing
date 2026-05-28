import React from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Factory,
  FileText,
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
    name: "Production",
    label: "Producción",
    icon: Factory,
    description:
      "Referencias, cantidades, avances, tiempos productivos, costos y seguimiento operativo."
  },
  {
    name: "Commercial / Retail",
    label: "Ventas y tiendas",
    icon: Store,
    description:
      "Ventas, cierres, solicitudes, reportes comerciales, tiendas, rankings y control diario."
  },
  {
    name: "Field & Materials",
    label: "Campo y materiales",
    icon: MapPinned,
    description:
      "Personal, GPS, solicitudes, entregas, devoluciones, inventario, bitácora y reportes."
  },
  {
    name: "Hospitality QR",
    label: "Bares y restaurantes",
    icon: QrCode,
    description:
      "Mesas por QR, pedidos, estados, inventario, cuentas, cierre de día y operación comercial."
  },
  {
    name: "Assembly",
    label: "Asambleas",
    icon: Vote,
    description:
      "QR, clave, registro de asistentes, votación en vivo, cronómetro, resultados y acta PDF."
  }
];

const coreItems = [
  "Empresas / tenants",
  "Usuarios y roles",
  "Módulos activos",
  "Branding por cliente",
  "Dashboards",
  "Reportes",
  "Auditoría",
  "PDF y evidencias"
];

const steps = [
  {
    number: "01",
    title: "Creamos la empresa",
    text: "Configuramos el espacio del cliente, usuarios, acceso, branding y estructura base."
  },
  {
    number: "02",
    title: "Activamos módulos",
    text: "Seleccionamos solo lo que la empresa necesita: producción, ventas, campo, QR o asambleas."
  },
  {
    number: "03",
    title: "Ajustamos el flujo",
    text: "Adaptamos roles, campos, paneles, reportes y reglas según la operación real."
  },
  {
    number: "04",
    title: "Opera en tiempo real",
    text: "La empresa empieza a trabajar con trazabilidad, métricas y evidencia desde una sola plataforma."
  }
];

const problems = [
  "Operación repartida entre WhatsApp, Excel, formularios, correos y sistemas sueltos.",
  "Reportes manuales, datos tardíos y poca trazabilidad.",
  "Herramientas genéricas que no se ajustan a la operación real.",
  "Desarrollos a medida lentos, costosos y difíciles de mantener."
];

const assemblyFlow = [
  "QR + clave",
  "Registro",
  "Pregunta en vivo",
  "Cronómetro",
  "Voto único",
  "Resultados",
  "Acta PDF"
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
          <a href="#assembly">Asambleas</a>
          <a href="#core">Core SaaS</a>
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
          <a onClick={() => setMenuOpen(false)} href="#assembly">Asambleas</a>
          <a onClick={() => setMenuOpen(false)} href="#core">Core SaaS</a>
          <a onClick={() => setMenuOpen(false)} href="#how">Cómo funciona</a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Solicitar demo</a>
        </div>
      )}

      <section id="top" className="hero section">
        <div className="heroCopy">
          <div className="pill">
            <span className="pulse"></span>
            SaaS modular · multiempresa · operación en tiempo real
          </div>

          <h1>
            CLONEXA replica operaciones reales con módulos adaptables.
          </h1>

          <p className="heroText">
            Un sistema operativo SaaS para convertir procesos fragmentados en operación digital:
            producción, ventas, campo, hospitality, reportes y asambleas desde una misma plataforma.
          </p>

          <div className="heroActions">
            <a href="#contact" className="button primary">
              Solicitar demo <ArrowRight size={18} />
            </a>
            <a href="#modules" className="button secondary">
              Ver módulos
            </a>
          </div>

          <div className="heroBadges">
            <span>Core SaaS común</span>
            <span>Módulos configurables</span>
            <span>Implementación rápida</span>
          </div>
        </div>

        <div className="heroVisual">
          <div className="commandCard">
            <div className="commandHeader">
              <div>
                <strong>CLONEXA Core</strong>
                <span>Empresas · módulos · usuarios · reportes</span>
              </div>
              <div className="liveTag">Live</div>
            </div>

            <div className="commandGrid">
              <div className="commandItem active">
                <Building2 size={19} />
                <strong>Empresa</strong>
                <span>Tenant configurado</span>
              </div>

              <div className="commandItem">
                <Layers3 size={19} />
                <strong>Módulos</strong>
                <span>Activos por necesidad</span>
              </div>

              <div className="commandItem">
                <Users size={19} />
                <strong>Usuarios</strong>
                <span>Roles y permisos</span>
              </div>

              <div className="commandItem">
                <ShieldCheck size={19} />
                <strong>Auditoría</strong>
                <span>Datos trazables</span>
              </div>
            </div>

            <div className="systemFlow">
              <div>
                <span>Operación configurada</span>
                <div className="flowTrack"><div className="flowFill w88"></div></div>
              </div>
              <div>
                <span>Reportes y KPIs</span>
                <div className="flowTrack"><div className="flowFill w74"></div></div>
              </div>
              <div>
                <span>Decisiones y actas</span>
                <div className="flowTrack"><div className="flowFill w64"></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section problemSection">
        <div>
          <span className="kicker">Problema</span>
          <h2>Las empresas operan con procesos dispersos.</h2>
          <p className="sectionText">
            Muchas operaciones funcionan, pero sus datos viven separados. CLONEXA conecta esos flujos
            en una plataforma modular que se adapta a cada empresa sin reconstruir todo desde cero.
          </p>
        </div>

        <div className="problemList">
          {problems.map((problem) => (
            <div className="problemItem" key={problem}>
              <CheckCircle2 size={18} />
              <span>{problem}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="section modulesSection">
        <div className="sectionHead">
          <span className="kicker">Módulos adaptables</span>
          <h2>Una plataforma. Diferentes operaciones.</h2>
          <p>
            CLONEXA no es una colección de sistemas separados. Cada vertical comparte el mismo core:
            empresas, usuarios, permisos, módulos, reportes y auditoría.
          </p>
        </div>

        <div className="modulesGrid">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <div className={`moduleCard ${module.name === "Assembly" ? "assemblyModule" : ""}`} key={module.name}>
                <div className="moduleTop">
                  <div className="moduleIcon">
                    <Icon size={22} />
                  </div>
                  <span>{module.label}</span>
                </div>

                <h3>{module.name}</h3>
                <p>{module.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="assembly" className="section assemblySection">
        <div className="assemblyCopy">
          <span className="kicker">CLONEXA Assembly</span>
          <h2>Asambleas con QR, votación en vivo y acta PDF.</h2>
          <p className="sectionText">
            CLONEXA también cubre decisiones formales. Cada asistente accede con QR y clave,
            se registra, vota preguntas publicadas en vivo y el sistema genera resultados y constancia.
          </p>

          <div className="assemblyChecks">
            <div><QrCode size={18} /> QR individual o por sesión</div>
            <div><Clock3 size={18} /> Cronómetro por pregunta</div>
            <div><Vote size={18} /> Voto único por asistente</div>
            <div><FileText size={18} /> Acta PDF descargable</div>
          </div>
        </div>

        <div className="assemblyPanel">
          <div className="assemblyPanelHeader">
            <strong>Votación activa</strong>
            <span>04:00 min</span>
          </div>

          <div className="questionBox">
            <small>Pregunta publicada por moderador</small>
            <h3>¿Se aprueba la contratación de vigilancia?</h3>
          </div>

          <div className="voteButtons">
            <button>Sí</button>
            <button>No</button>
            <button>Abstención</button>
          </div>

          <div className="resultPreview">
            <div><span>A favor</span><strong>68%</strong></div>
            <div><span>En contra</span><strong>24%</strong></div>
            <div><span>Abstención</span><strong>8%</strong></div>
          </div>

          <div className="assemblyFlow">
            {assemblyFlow.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="core" className="section coreSection">
        <div>
          <span className="kicker">Core SaaS</span>
          <h2>No hacemos un software diferente por cliente. Configuramos módulos sobre un mismo núcleo.</h2>
          <p className="sectionText">
            La proyección de CLONEXA es clara: un core SaaS multiempresa que permite activar
            capacidades por operación y replicar empresas con módulos acondicionados.
          </p>
        </div>

        <div className="coreGrid">
          {coreItems.map((item) => (
            <div className="coreItem" key={item}>
              <LockKeyhole size={15} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="proof" className="section proofSection">
        <div className="sectionHead">
          <span className="kicker">Producto</span>
          <h2>Vistas limpias para operar, medir y auditar.</h2>
          <p>
            La landing pública muestra flujos demostrativos. La demo privada permite revisar
            módulos activos, paneles, reportes y operación real sin exponer datos sensibles.
          </p>
        </div>

        <div className="screensGrid">
          <div className="screen production">
            <div className="screenHeader">
              <span>Production</span>
              <strong>Resumen productivo</strong>
            </div>

            <div className="stats">
              <div>
                <span>Referencias</span>
                <strong>14</strong>
              </div>
              <div>
                <span>Tiempo</span>
                <strong>105h</strong>
              </div>
              <div>
                <span>Avance</span>
                <strong>21%</strong>
              </div>
            </div>

            <div className="miniBars">
              <div><span>Referencia A</span><div className="flowTrack"><div className="flowFill w88"></div></div></div>
              <div><span>Referencia B</span><div className="flowTrack"><div className="flowFill w64"></div></div></div>
            </div>
          </div>

          <div className="screen operations">
            <div className="screenHeader">
              <span>Operations</span>
              <strong>Control operativo</strong>
            </div>

            <div className="tableMock">
              <div className="tableHead">
                <span>Orden</span>
                <span>Módulo</span>
                <span>Estado</span>
              </div>

              {["Materiales", "Ventas", "GPS", "Asamblea"].map((row, index) => (
                <div className="tableRow" key={row}>
                  <span>OP-000{index + 1}</span>
                  <span>{row}</span>
                  <span>{index % 2 === 0 ? "Activo" : "Pendiente"}</span>
                </div>
              ))}
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
              <p>Se construye desde cero, toma más tiempo, cuesta mantenerlo y cada cliente se vuelve un proyecto aislado.</p>
            </div>

            <div className="highlightBox">
              <h3>CLONEXA</h3>
              <p>Usa un core compartido. Cada cliente activa módulos, flujos, roles y dashboards según su operación.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contactSection">
        <div className="contactCard">
          <div>
            <span className="kicker">Demo privada</span>
            <h2>Convierte tu operación en un sistema digital modular.</h2>
            <p>
              Solicita una demo y revisamos qué módulos de CLONEXA pueden configurarse para tu empresa.
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
          <span>Producción · Ventas · Campo · QR · Asambleas</span>
        </div>
      </footer>
    </main>
  );
}

export default App;