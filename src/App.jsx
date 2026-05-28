import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Layers3,
  ShieldCheck,
  BarChart3,
  FileText,
  Users,
  Vote,
  Clock,
  QrCode,
  Building2,
  Workflow,
  Database,
  LockKeyhole,
  ClipboardCheck,
  Zap,
  Mail
} from "lucide-react";

import logo from "../assets/LOGO_CLONEXA.png";

const modules = [
  {
    name: "Field",
    description: "Operación técnica, GPS, tareas, rutas, materiales, reportes e incidencias."
  },
  {
    name: "Retail",
    description: "Tiendas, ventas, solicitudes, cierres, inventario y mini paneles operativos."
  },
  {
    name: "Production",
    description: "Producción, referencias, tiempos, costos, mantenimiento y trazabilidad."
  },
  {
    name: "Hospitality",
    description: "Mesas, pedidos, inventario, atención comercial y cierres diarios."
  },
  {
    name: "Media",
    description: "Operación comercial, flujos internos, responsables y seguimiento organizacional."
  },
  {
    name: "Assembly",
    description: "Asambleas, QR, clave dinámica, votación en vivo, cronómetro y acta PDF."
  }
];

const steps = [
  {
    number: "01",
    title: "Creamos la empresa",
    text: "Configuramos branding, usuarios, accesos, módulos y entorno operativo."
  },
  {
    number: "02",
    title: "Activamos módulos",
    text: "Seleccionamos módulos preconstruidos según la operación real del cliente."
  },
  {
    number: "03",
    title: "Acondicionamos flujos",
    text: "Adaptamos roles, reglas, paneles, formularios, bots, reportes y salidas."
  },
  {
    number: "04",
    title: "Opera en tiempo real",
    text: "La empresa queda conectada, medible y auditable desde una sola plataforma."
  }
];

const problems = [
  "Operaciones repartidas entre WhatsApp, Excel, correos y sistemas aislados.",
  "Reportes manuales, datos incompletos y decisiones sin evidencia.",
  "ERP genéricos que obligan al cliente a cambiar su forma de operar.",
  "Desarrollos a medida lentos, costosos y difíciles de mantener."
];

const benefits = [
  "Core SaaS reutilizable.",
  "Módulos preconstruidos y configurables.",
  "Implementación rápida.",
  "Roles, permisos y trazabilidad.",
  "Dashboards y reportes.",
  "Auditoría y salidas PDF."
];

function App() {
  return (
    <main className="page">
      <nav className="navbar">
        <a href="#top" className="brand">
          <img src={logo} alt="CLONEXA" className="brand-logo" />
          <span>CLONEXA</span>
        </a>

        <div className="nav-links">
          <a href="#problem">Problema</a>
          <a href="#how">Cómo funciona</a>
          <a href="#assembly">Assembly</a>
          <a href="#modules">Módulos</a>
          <a href="#contact" className="nav-cta">Solicitar demo</a>
        </div>
      </nav>

      <section id="top" className="hero section">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="pulse"></span>
            SaaS empresarial modular · configuración rápida
          </div>

          <h1>
            Replica la operación de una empresa en menos de 24 horas.
          </h1>

          <p className="hero-subtitle">
            CLONEXA es un sistema operativo empresarial SaaS que activa módulos
            acondicionados para digitalizar flujos, roles, reportes, decisiones
            y trazabilidad sin desarrollar software desde cero.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Solicitar demo <ArrowRight size={18} />
            </a>
            <a href="#how" className="btn btn-secondary">
              Ver cómo funciona
            </a>
          </div>

          <div className="trust-row">
            <div>
              <strong>Core modular</strong>
              <span>No software desde cero</span>
            </div>
            <div>
              <strong>24h</strong>
              <span>Primera versión funcional</span>
            </div>
            <div>
              <strong>SaaS</strong>
              <span>Escalable por empresa</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="logo-ring">
            <img src={logo} alt="CLONEXA" />
          </div>

          <div className="system-card main-system">
            <div className="system-header">
              <span>CLONEXA OS</span>
              <small>Live operation</small>
            </div>

            <div className="system-grid">
              <div className="mini-module active">Roles</div>
              <div className="mini-module">Ventas</div>
              <div className="mini-module">Inventario</div>
              <div className="mini-module">Reportes</div>
              <div className="mini-module active">Asambleas</div>
              <div className="mini-module">Auditoría</div>
            </div>

            <div className="data-panel">
              <div>
                <span>Workflows</span>
                <strong>18</strong>
              </div>
              <div>
                <span>Módulos</span>
                <strong>27+</strong>
              </div>
              <div>
                <span>Tiempo real</span>
                <strong>ON</strong>
              </div>
            </div>
          </div>

          <div className="orbit-card card-a">
            <ShieldCheck size={18} />
            Trazabilidad
          </div>
          <div className="orbit-card card-b">
            <BarChart3 size={18} />
            Dashboards
          </div>
          <div className="orbit-card card-c">
            <Workflow size={18} />
            Flujos
          </div>
        </div>
      </section>

      <section id="problem" className="section split">
        <div>
          <div className="section-kicker">El problema</div>
          <h2>Las empresas operan fragmentadas.</h2>
          <p className="section-text">
            Muchas pymes y organizaciones ya tienen procesos reales, pero viven
            dispersos entre herramientas genéricas, hojas de cálculo, mensajes,
            correos y desarrollos aislados.
          </p>
        </div>

        <div className="problem-list">
          {problems.map((problem) => (
            <div className="problem-item" key={problem}>
              <CheckCircle2 size={20} />
              <span>{problem}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section solution">
        <div className="section-kicker">La solución</div>
        <h2>Un sistema operativo empresarial, no otro software aislado.</h2>
        <p className="section-text centered">
          CLONEXA no obliga al cliente a adaptarse al software. CLONEXA configura
          módulos sobre un core común para convertir procesos reales en una
          operación digital conectada, medible y auditable.
        </p>

        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <div className="benefit-card" key={benefit}>
              <Zap size={18} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="section">
        <div className="section-kicker">Cómo funciona</div>
        <h2>De operación dispersa a plataforma funcional.</h2>
        <p className="section-text">
          La ventaja competitiva está en la velocidad de clonación operativa:
          usamos una base común y activamos módulos según cada empresa.
        </p>

        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="assembly" className="section assembly-section">
        <div className="assembly-copy">
          <div className="section-kicker">Gobernanza digital</div>
          <h2>CLONEXA Assembly: decisiones formales en tiempo real.</h2>
          <p className="section-text">
            Assembly permite gestionar asambleas, votaciones y decisiones
            formales con QR, clave de acceso, registro, preguntas en vivo,
            voto único, cronómetro, trazabilidad y acta PDF automática.
          </p>

          <div className="assembly-actions">
            <a href="#contact" className="btn btn-primary">
              Solicitar demo de Assembly <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="assembly-flow">
          <div className="flow-item">
            <QrCode size={20} />
            <span>QR + clave</span>
          </div>
          <div className="flow-line"></div>
          <div className="flow-item">
            <Users size={20} />
            <span>Registro</span>
          </div>
          <div className="flow-line"></div>
          <div className="flow-item">
            <Clock size={20} />
            <span>Cronómetro</span>
          </div>
          <div className="flow-line"></div>
          <div className="flow-item">
            <Vote size={20} />
            <span>Voto único</span>
          </div>
          <div className="flow-line"></div>
          <div className="flow-item">
            <FileText size={20} />
            <span>Acta PDF</span>
          </div>
        </div>
      </section>

      <section id="modules" className="section">
        <div className="section-kicker">Módulos adaptables</div>
        <h2>Una sola plataforma. Múltiples sistemas operativos.</h2>
        <p className="section-text">
          Cada vertical comparte core, datos, roles, auditoría y paneles. Lo que
          cambia es la configuración operativa de cada cliente.
        </p>

        <div className="modules-grid">
          {modules.map((module) => (
            <div className={`module-card ${module.name === "Assembly" ? "highlight" : ""}`} key={module.name}>
              <div className="module-icon">
                <Layers3 size={20} />
              </div>
              <h3>CLONEXA {module.name}</h3>
              <p>{module.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section architecture">
        <div>
          <div className="section-kicker">Arquitectura</div>
          <h2>SaaS listo para crecer.</h2>
          <p className="section-text">
            CLONEXA se basa en un core reutilizable que permite configurar
            empresas, usuarios, módulos, permisos, flujos, reportes y salidas
            documentales sin reconstruir el sistema desde cero.
          </p>
        </div>

        <div className="architecture-grid">
          <div className="architecture-card">
            <Building2 size={22} />
            <h3>Entrada</h3>
            <p>Empresa, branding, accesos y panel cliente.</p>
          </div>
          <div className="architecture-card">
            <LockKeyhole size={22} />
            <h3>Core</h3>
            <p>Usuarios, roles, permisos, módulos y reglas.</p>
          </div>
          <div className="architecture-card">
            <Database size={22} />
            <h3>Datos</h3>
            <p>Operación, reportes, auditoría y trazabilidad.</p>
          </div>
          <div className="architecture-card">
            <ClipboardCheck size={22} />
            <h3>Salidas</h3>
            <p>Dashboards, PDFs, reportes y evidencias.</p>
          </div>
        </div>
      </section>

      <section className="section demo-section" id="demo">
        <div className="demo-box">
          <div className="demo-icon">
            <BarChart3 size={30} />
          </div>
          <h2>Demo funcional disponible bajo solicitud.</h2>
          <p>
            Agenda una llamada de 15 minutos y te mostramos cómo CLONEXA puede
            convertir una operación real en módulos funcionales, trazables y
            preparados para escalar.
          </p>
          <a href="#contact" className="btn btn-primary">
            Pedir demo privada <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-card">
          <div>
            <div className="section-kicker">Contacto</div>
            <h2>¿Tu empresa todavía opera con procesos dispersos?</h2>
            <p>
              Solicita una demo y analizamos qué módulos de CLONEXA pueden
              activarse para tu operación.
            </p>
          </div>

          <div className="contact-actions">
            <a href="mailto:clonexasaas@gmail.com" className="contact-link">
              <Mail size={20} />
              clonexasaas@gmail.com
            </a>

            <a href="mailto:clonexasaas@gmail.com?subject=Solicitud%20de%20demo%20CLONEXA&body=Hola%2C%20quiero%20solicitar%20una%20demo%20de%20CLONEXA." className="btn btn-primary">
              Solicitar demo
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="brand footer-brand">
          <img src={logo} alt="CLONEXA" className="brand-logo" />
          <span>CLONEXA</span>
        </div>

        <p>Operar · Medir · Decidir · Auditar</p>
      </footer>
    </main>
  );
}

export default App;