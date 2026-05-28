import React from "react";
import {
  ArrowRight,
  Building2,
  BarChart3,
  CheckCircle2,
  Database,
  Factory,
  FileText,
  Globe2,
  Layers3,
  LineChart,
  Mail,
  MapPinned,
  Network,
  ShieldCheck,
  Store,
  Users,
  Workflow,
  Zap
} from "lucide-react";

const traction = [
  {
    label: "Functional clients",
    value: "2",
    note: "Velvet and Mundo Case operating on CLONEXA."
  },
  {
    label: "Markets touched",
    value: "3",
    note: "Mexico, Colombia and the U.S."
  },
  {
    label: "Deployment model",
    value: "6 mo.",
    note: "Paid implementation phase before SaaS subscription."
  },
  {
    label: "Next expansion",
    value: "Field Ops",
    note: "Field operations client currently in negotiation."
  }
];

const clientCases = [
  {
    name: "Velvet",
    region: "Mexico / Colombia / U.S.",
    icon: Factory,
    title: "Production workflows",
    description:
      "Velvet uses CLONEXA to manage production references, progress, productive time, sessions and operational tracking.",
    modules: ["Production", "References", "Workforce", "Productive time"]
  },
  {
    name: "Mundo Case",
    region: "LATAM / U.S.",
    icon: Store,
    title: "Commercial operations",
    description:
      "Mundo Case uses CLONEXA for sales reports, store closings, top sellers, revenue tracking and workforce workflows.",
    modules: ["Sales reports", "Stores", "Commercial closing", "Workforce"]
  }
];

const modules = [
  {
    name: "Production",
    icon: Factory,
    text: "References, quantities, progress, productive time and operational detail."
  },
  {
    name: "Commercial",
    icon: Store,
    text: "Sales reports, store closings, top sellers, revenue and archive flows."
  },
  {
    name: "Field Ops",
    icon: MapPinned,
    text: "Tasks, evidence, field teams, route activity and operational control."
  },
  {
    name: "Workforce",
    icon: Users,
    text: "Teams, roles, sessions, activity, productivity and responsibilities."
  },
  {
    name: "Dashboards",
    icon: BarChart3,
    text: "Live operating views, KPIs, summaries, rankings and management reports."
  },
  {
    name: "Assembly",
    icon: FileText,
    text: "QR access, voting, meeting control, formal decisions and PDF minutes."
  }
];

const businessModel = [
  {
    market: "LATAM / Mexico",
    deployment: "MXN $13,500 / month",
    after: "MXN $6,000 / month",
    yearOne: "MXN $117,000",
    arr: "MXN $72,000 ARR"
  },
  {
    market: "United States",
    deployment: "USD $2,500 / month",
    after: "USD $1,200 / month",
    yearOne: "USD $22,200",
    arr: "USD $14,400 ARR"
  }
];

const operatingStack = [
  "Company creation",
  "Tenant management",
  "Users and roles",
  "Permissions",
  "Module activation",
  "Operational workflows",
  "Dashboards",
  "Reports",
  "Auditability",
  "Document outputs"
];

const risks = [
  {
    risk: "Custom software perception",
    answer:
      "Every client runs on the same SaaS core. What changes is the configuration of modules, workflows, roles and dashboards."
  },
  {
    risk: "Too many verticals",
    answer:
      "The verticals are not separate products. They are module configurations built on the same reusable operating infrastructure."
  },
  {
    risk: "Implementation effort",
    answer:
      "The first 6 months are monetized as a paid deployment phase that covers onboarding, setup and operational configuration."
  }
];

function App() {
  return (
    <main className="app">
      <nav className="nav">
        <a href="#top" className="brand" aria-label="CLONEXA home">
          <div className="brandMark">
            <span>C</span>
          </div>
          <div>
            <strong>CLONEXA</strong>
            <small>Investor Brief</small>
          </div>
        </a>

        <div className="navLinks">
          <a href="#traction">Traction</a>
          <a href="#product">Product</a>
          <a href="#model">Business Model</a>
          <a href="#moat">Moat</a>
          <a href="#contact" className="navButton">Request deck</a>
        </div>
      </nav>

      <section id="top" className="hero section">
        <div className="heroCopy">
          <div className="pill">
            <span className="dot"></span>
            Functional clients live · Modular SaaS · Pre-seed ready
          </div>

          <h1>
            The modular SaaS operating system for fragmented business operations.
          </h1>

          <p className="heroText">
            CLONEXA turns real company operations into configurable digital
            platforms using one reusable SaaS core and multiple operational
            modules. Already operating with functional clients across Mexico,
            Colombia and the U.S.
          </p>

          <div className="heroActions">
            <a href="#contact" className="button primary">
              Request investor deck <ArrowRight size={18} />
            </a>
            <a href="#traction" className="button secondary">
              See traction
            </a>
          </div>

          <div className="proofLine">
            <span>Not a concept.</span>
            <span>Not a software agency.</span>
            <span>One SaaS core, configured per operation.</span>
          </div>
        </div>

        <div className="heroConsole">
          <div className="consoleTop">
            <div>
              <strong>CLONEXA Command Center</strong>
              <span>Multi-tenant SaaS control</span>
            </div>
            <div className="statusLive">Live</div>
          </div>

          <div className="consoleGrid">
            <div className="consoleCard active">
              <Building2 size={20} />
              <strong>Companies</strong>
              <span>Velvet · Mundo Case</span>
            </div>
            <div className="consoleCard">
              <Layers3 size={20} />
              <strong>Modules</strong>
              <span>Production · Sales · Field</span>
            </div>
            <div className="consoleCard">
              <Users size={20} />
              <strong>Users</strong>
              <span>Roles and permissions</span>
            </div>
            <div className="consoleCard">
              <ShieldCheck size={20} />
              <strong>Audit</strong>
              <span>Traceable operations</span>
            </div>
          </div>

          <div className="miniDashboard">
            <div className="dashHeader">
              <span>Operational activity</span>
              <strong>Today</strong>
            </div>

            <div className="bars">
              <div className="barRow">
                <span>Production workflows</span>
                <div className="barTrack">
                  <div className="barFill w88"></div>
                </div>
              </div>
              <div className="barRow">
                <span>Sales reports</span>
                <div className="barTrack">
                  <div className="barFill w72"></div>
                </div>
              </div>
              <div className="barRow">
                <span>Workforce activity</span>
                <div className="barTrack">
                  <div className="barFill w64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="traction" className="section tractionSection">
        <div className="sectionHead">
          <span className="kicker">Traction</span>
          <h2>CLONEXA is already operating inside real companies.</h2>
          <p>
            We are no longer validating only a concept. Velvet and Mundo Case
            are using CLONEXA to manage real production, commercial and workforce
            workflows. A field operations deployment is currently in negotiation.
          </p>
        </div>

        <div className="tractionGrid">
          {traction.map((item) => (
            <div className="metricCard" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.note}</p>
            </div>
          ))}
        </div>

        <div className="clientGrid">
          {clientCases.map((client) => {
            const Icon = client.icon;

            return (
              <div className="clientCard" key={client.name}>
                <div className="clientTop">
                  <div className="clientIcon">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3>{client.name}</h3>
                    <span>{client.region}</span>
                  </div>
                </div>

                <h4>{client.title}</h4>
                <p>{client.description}</p>

                <div className="tagRow">
                  {client.modules.map((module) => (
                    <span key={module}>{module}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section problemSection">
        <div className="problemCopy">
          <span className="kicker">Problem</span>
          <h2>Most SMEs still operate through disconnected tools.</h2>
          <p>
            Their real operations live across WhatsApp, spreadsheets, manual
            reports, isolated dashboards, emails and custom workflows. The result
            is poor visibility, slow decisions, duplicated work and operations
            that are difficult to audit.
          </p>
        </div>

        <div className="problemList">
          <div>
            <CheckCircle2 size={20} />
            <span>Manual reporting creates delays and errors.</span>
          </div>
          <div>
            <CheckCircle2 size={20} />
            <span>Generic SaaS tools do not match the real operation.</span>
          </div>
          <div>
            <CheckCircle2 size={20} />
            <span>Custom software is slow, expensive and hard to maintain.</span>
          </div>
          <div>
            <CheckCircle2 size={20} />
            <span>Management lacks real-time operational traceability.</span>
          </div>
        </div>
      </section>

      <section id="product" className="section productSection">
        <div className="sectionHead">
          <span className="kicker">Product</span>
          <h2>One SaaS core. Multiple operational modules.</h2>
          <p>
            CLONEXA does not rebuild software from zero for every company.
            Every client runs on the same SaaS infrastructure. What changes is
            the configuration of modules, workflows, roles, dashboards and
            operational rules.
          </p>
        </div>

        <div className="productShowcase">
          <div className="screenCard productionScreen">
            <div className="screenTop">
              <span>Production Module</span>
              <strong>Velvet</strong>
            </div>

            <h3>Productive Summary</h3>

            <div className="screenStats">
              <div>
                <span>Active references</span>
                <strong>14</strong>
              </div>
              <div>
                <span>Productive time</span>
                <strong>105h</strong>
              </div>
              <div>
                <span>Closed quantity</span>
                <strong>56</strong>
              </div>
            </div>

            <div className="screenBars">
              <div>
                <span>Dreamy Jacket / SM</span>
                <div className="barTrack">
                  <div className="barFill w100"></div>
                </div>
              </div>
              <div>
                <span>Koi Jacket / ML</span>
                <div className="barTrack">
                  <div className="barFill w100"></div>
                </div>
              </div>
              <div>
                <span>Garden Jacket / ML</span>
                <div className="barTrack">
                  <div className="barFill w46"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="screenCard commercialScreen">
            <div className="screenTop">
              <span>Commercial Module</span>
              <strong>Mundo Case</strong>
            </div>

            <h3>Sales Reports</h3>

            <div className="screenStats">
              <div>
                <span>Reports</span>
                <strong>7</strong>
              </div>
              <div>
                <span>Current cut</span>
                <strong>$791k</strong>
              </div>
              <div>
                <span>Top seller</span>
                <strong>Angela</strong>
              </div>
            </div>

            <div className="reportList">
              <div>
                <strong>Sales · 2026-05-23</strong>
                <span>Sent · Revenue $25,220</span>
              </div>
              <div>
                <strong>Stores · 2026-05-28</strong>
                <span>Sent · Revenue $6,998</span>
              </div>
              <div>
                <strong>Sales · 2026-05-20</strong>
                <span>Archived · Revenue $8,860</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modulesGrid">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <div className="moduleCard" key={module.name}>
                <div className="moduleIcon">
                  <Icon size={22} />
                </div>
                <h3>{module.name}</h3>
                <p>{module.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section architectureSection">
        <div>
          <span className="kicker">SaaS Infrastructure</span>
          <h2>Built as a multi-tenant operating layer.</h2>
          <p>
            CLONEXA has a central admin console to create companies, activate
            packages, manage users, configure access, monitor modules and
            control the health of each client workspace.
          </p>
        </div>

        <div className="stackGrid">
          {operatingStack.map((item) => (
            <div className="stackItem" key={item}>
              <Zap size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="model" className="section modelSection">
        <div className="sectionHead">
          <span className="kicker">Business Model</span>
          <h2>Paid deployment phase + recurring SaaS subscription.</h2>
          <p>
            The first 6 months monetize implementation value: setup, onboarding,
            support and module configuration. After deployment, the client moves
            into a recurring SaaS subscription.
          </p>
        </div>

        <div className="pricingGrid">
          {businessModel.map((row) => (
            <div className="pricingCard" key={row.market}>
              <h3>{row.market}</h3>

              <div className="priceLine">
                <span>First 6 months</span>
                <strong>{row.deployment}</strong>
              </div>

              <div className="priceLine">
                <span>After deployment</span>
                <strong>{row.after}</strong>
              </div>

              <div className="priceLine mutedLine">
                <span>Year 1 revenue per client</span>
                <strong>{row.yearOne}</strong>
              </div>

              <div className="priceLine mutedLine">
                <span>Post-deployment ARR</span>
                <strong>{row.arr}</strong>
              </div>
            </div>
          ))}
        </div>

        <p className="disclaimer">
          Current commercial terms are under negotiation. They should be
          presented as early commercial validation until contracts are signed and
          payments are received.
        </p>
      </section>

      <section id="moat" className="section moatSection">
        <div className="sectionHead">
          <span className="kicker">Why this can scale</span>
          <h2>Every deployment strengthens the module library.</h2>
          <p>
            CLONEXA is not trying to become a services company. The strategy is
            to convert repeated operational needs into reusable modules that
            reduce implementation time for the next client.
          </p>
        </div>

        <div className="moatGrid">
          <div className="moatCard">
            <Network size={26} />
            <h3>Reusable core</h3>
            <p>
              Companies, users, roles, permissions, workflows, dashboards and
              auditability are shared across clients.
            </p>
          </div>

          <div className="moatCard">
            <Database size={26} />
            <h3>Operational data layer</h3>
            <p>
              As companies operate inside CLONEXA, the platform becomes the
              source of truth for daily execution.
            </p>
          </div>

          <div className="moatCard">
            <Workflow size={26} />
            <h3>Module expansion</h3>
            <p>
              New client needs expand the reusable module library instead of
              creating one-off custom software.
            </p>
          </div>

          <div className="moatCard">
            <LineChart size={26} />
            <h3>Higher retention potential</h3>
            <p>
              Once CLONEXA manages operational workflows, reports and decisions,
              switching costs increase.
            </p>
          </div>
        </div>
      </section>

      <section className="section riskSection">
        <div>
          <span className="kicker">Investor objections</span>
          <h2>The hard questions, answered directly.</h2>
        </div>

        <div className="riskList">
          {risks.map((item) => (
            <div className="riskItem" key={item.risk}>
              <h3>{item.risk}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section roadmapSection">
        <div className="sectionHead">
          <span className="kicker">Next milestones</span>
          <h2>From functional deployments to repeatable SaaS sales.</h2>
        </div>

        <div className="roadmap">
          <div>
            <span>Now</span>
            <h3>Functional clients live</h3>
            <p>Velvet and Mundo Case operating production and commercial workflows.</p>
          </div>

          <div>
            <span>Next 30 days</span>
            <h3>Close field operations client</h3>
            <p>Validate field teams, tasks, evidence and operational traceability.</p>
          </div>

          <div>
            <span>Next 60 days</span>
            <h3>Convert usage into paid contracts</h3>
            <p>Formalize paid deployment terms and recurring SaaS subscriptions.</p>
          </div>

          <div>
            <span>Next 90 days</span>
            <h3>Standardize repeatable packages</h3>
            <p>Reduce onboarding time and define repeatable vertical packages.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="section contactSection">
        <div className="contactCard">
          <div>
            <span className="kicker">Investor access</span>
            <h2>CLONEXA is moving from product validation to early commercial validation.</h2>
            <p>
              We have functional clients, international usage, active paid
              negotiations and a SaaS model designed around deployment revenue
              plus recurring subscriptions.
            </p>
          </div>

          <div className="contactActions">
            <a
              href="mailto:clonexasaas@gmail.com?subject=CLONEXA%20Investor%20Deck%20Request&body=Hi%20CLONEXA%20team%2C%20I%20would%20like%20to%20review%20the%20investor%20deck%20and%20demo."
              className="button primary"
            >
              <Mail size={18} />
              Request investor deck
            </a>

            <a
              href="mailto:clonexasaas@gmail.com?subject=CLONEXA%20Demo%20Request&body=Hi%20CLONEXA%20team%2C%20I%20would%20like%20to%20schedule%20a%20demo."
              className="button secondary"
            >
              Schedule demo
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="brand footerBrand">
          <div className="brandMark">
            <span>C</span>
          </div>
          <div>
            <strong>CLONEXA</strong>
            <small>Operate · Measure · Decide · Audit</small>
          </div>
        </div>

        <div className="footerMeta">
          <span>Modular SaaS Operating System</span>
          <span>clonexasaas@gmail.com</span>
        </div>
      </footer>
    </main>
  );
}

export default App;