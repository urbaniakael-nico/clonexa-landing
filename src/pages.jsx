// Paginas propias: industria, "¿Que es Clonexa?" y 404. Se prerenderizan a HTML en el build.
import React from "react";
import { SHOTS, SOCIAL, waLink } from "./content.js";
import { INDUSTRY_PAGES, industryGreeting } from "./industries.js";
import { Breadcrumbs, DemoForm, ExternalLink, FaqList, SectionHead, ShotImage } from "./layout.jsx";
import { ABOUT_META, ABOUT_PATH, INDUSTRY_LINKS } from "./site.js";

function OtherIndustries({ current }) {
  return (
    <section className="wrap section" aria-labelledby="otras-titulo">
      <SectionHead id="otras-titulo" kicker="MÁS INDUSTRIAS" title="Clonexa también trabaja con" />
      <ul className="industryLinks">
        {INDUSTRY_LINKS.filter(([href]) => href !== current).map(([href, label, icon]) => (
          <li key={href}>
            <a href={href}>
              <span aria-hidden="true">{icon}</span> {label}
            </a>
          </li>
        ))}
        <li>
          <a href={ABOUT_PATH}>
            <span aria-hidden="true">💡</span> ¿Qué es Clonexa?
          </a>
        </li>
      </ul>
    </section>
  );
}

export function IndustryPage({ page }) {
  const greeting = industryGreeting(page);
  const path = `/${page.slug}`;
  return (
    <>
      <Breadcrumbs label={page.name} />
      <section className="wrap pageHero" data-wa-hide>
        <p className="kicker">CLONEXA PARA {page.name.toUpperCase()}</p>
        <h1>{page.h1}</h1>
        {page.intro.map((text, i) => (
          <p key={i} className={i === 0 ? "lead" : "pageText"}>
            {text}
          </p>
        ))}
        <div className="heroActions">
          <a href="#agenda" className="btn">
            Agenda tu demo
          </a>
          <ExternalLink href={waLink(greeting)} className="btn btnGhost" data-wa={`hero-${page.slug}`}>
            Escríbenos por WhatsApp
          </ExternalLink>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="funciona-titulo">
        <SectionHead
          id="funciona-titulo"
          kicker="ASÍ FUNCIONA"
          title={`Así funciona Clonexa en ${page.name.toLowerCase()}`}
          sub="Pantallas reales de Clonexa con datos de ejemplo."
        />
        <ol className="flowSteps">
          {page.steps.map((step, i) => {
            const phone = SHOTS[step.shot].frame === "phone";
            return (
              <li key={step.shot} className={`flowStep${phone ? " flowPhone" : ""}`}>
                <div className="flowText">
                  <p className="pill">PASO {i + 1}</p>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <figure className="flowShot">
                  <a href={SHOTS[step.shot].src} target="_blank" rel="noopener" aria-label={`Ampliar captura: ${step.title}`}>
                    <ShotImage id={step.shot} sizes={phone ? "210px" : "(max-width: 760px) 92vw, 640px"} />
                  </a>
                </figure>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="para-quien-titulo">
        <SectionHead id="para-quien-titulo" kicker="PARA QUIÉN ES" title="¿Para qué negocios sirve?" />
        <p className="pageText">{page.fit}</p>
      </section>

      <section className="wrap section" aria-labelledby="modulos-titulo">
        <SectionHead
          id="modulos-titulo"
          kicker="MÓDULOS"
          title={`Módulos de Clonexa para ${page.name.toLowerCase()}`}
          sub="Usas los que necesitas y se conectan entre sí. Si te falta algo, lo construimos a la medida."
        />
        <ul className="moduleGrid">
          {page.modules.map(([name, text]) => (
            <li className="card" key={name}>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap section" aria-labelledby="faq-titulo">
        <SectionHead id="faq-titulo" kicker="PREGUNTAS" title="Preguntas frecuentes" />
        <FaqList items={page.faq} />
      </section>

      <DemoForm
        greeting={greeting}
        page={page.slug}
        sub={`Te mostramos Clonexa funcionando con un negocio como el tuyo. 20 minutos, sin compromiso. Cotiza tu sistema para ${page.name.toLowerCase()}.`}
      />
      <OtherIndustries current={path} />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <Breadcrumbs label="¿Qué es Clonexa?" />
      <article className="wrap pageHero aboutPage" data-wa-hide>
        <p className="kicker">SOBRE CLONEXA</p>
        <h1>{ABOUT_META.h1}</h1>
        <p className="lead">
          Clonexa es un software en la nube (SaaS) hecho en Bogotá, Colombia, que conecta en un solo sistema los
          pedidos, el inventario, la caja, el personal, los turnos, la nómina y los reportes de los negocios.
        </p>
        <p className="pageText">
          En vez de tener un programa para la caja, otro para el inventario, una hoja de cálculo para la nómina y los
          pedidos regados en chats, Clonexa reúne todo en un solo lugar. Se usa desde el navegador del celular, la
          tableta o el computador, sin instalar nada, y cada negocio lo ve con su marca y sus colores.
        </p>
        <figure className="aboutShot">
          <ShotImage id="hero-caja" sizes="(max-width: 760px) 92vw, 760px" />
          <figcaption>Caja de un restaurante en Clonexa (pantalla real con datos de ejemplo).</figcaption>
        </figure>

        <h2>¿Para quién es?</h2>
        <p className="pageText">
          Clonexa trabaja con negocios que tienen operación diaria y equipos que se mueven: desde un restaurante con
          meseros y cocina hasta una empresa con call center, bodega y vendedores. Estas son las industrias con
          soluciones listas:
        </p>
        <ul className="industryLinks">
          {INDUSTRY_LINKS.map(([href, label, icon]) => (
            <li key={href}>
              <a href={href}>
                <span aria-hidden="true">{icon}</span> {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="pageText">
          También construimos sistemas a la medida para tiendas y cadenas, distribuidoras y tiendas en línea, sobre la
          misma base de Clonexa.
        </p>

        <h2>¿Cómo se implementa?</h2>
        <p className="pageText">
          Empezamos con un diagnóstico de cómo trabaja tu negocio hoy. Si una solución lista te sirve, la configuramos
          con tu información y queda funcionando en días. Si necesitas algo propio, lo diseñamos contigo, te mostramos
          las pantallas antes de construir y lo entregamos por etapas, módulo por módulo. Durante todo el proceso te
          acompañamos y capacitamos a tu equipo, y el soporte sigue por WhatsApp.
        </p>

        <h2>¿Qué la diferencia?</h2>
        <ul className="aboutList">
          <li>
            <strong>Todo conectado:</strong> el pedido, la cocina, la caja, el inventario y los reportes son el mismo
            sistema, no programas sueltos.
          </li>
          <li>
            <strong>Se adapta a tu proceso:</strong> se arma por módulos y lo que falta se construye a la medida.
          </li>
          <li>
            <strong>Usuarios ilimitados:</strong> tarifa plana según los módulos, sin cobro por cada usuario.
          </li>
          <li>
            <strong>Sin equipos especiales:</strong> funciona en el celular, la tableta o el computador que ya tienes.
          </li>
          <li>
            <strong>Hecho en Colombia:</strong> pensado para cómo trabajan los negocios aquí. La factura electrónica DIAN
            llega próximamente.
          </li>
        </ul>

        <h2>¿Quién es Nexa?</h2>
        <p className="pageText">
          Nexa es la presentadora de Clonexa, creada con inteligencia artificial. Aparece en nuestros videos y redes para
          explicar cómo funciona el sistema. Siempre se identifica como una presentadora creada con IA.
        </p>

        <h2>Contacto</h2>
        <p className="pageText">
          Escríbenos por{" "}
          <ExternalLink href={waLink("Hola Clonexa, quiero saber más sobre Clonexa.")} data-wa="que-es-clonexa">
            WhatsApp
          </ExternalLink>{" "}
          o al correo <a href="mailto:clonexasaas@gmail.com">clonexasaas@gmail.com</a>. Estamos en Bogotá, Colombia, y
          puedes seguirnos en{" "}
          {SOCIAL.map((item, i) => (
            <React.Fragment key={item.id}>
              {i > 0 && (i === SOCIAL.length - 1 ? " y " : ", ")}
              <ExternalLink href={item.url}>{item.label}</ExternalLink>
            </React.Fragment>
          ))}
          .
        </p>
        <p className="disclaimer">
          Clonexa, la empresa de software de Bogotá, no tiene relación con medicamentos de nombre parecido.
        </p>
      </article>
      <DemoForm page="que-es-clonexa" />
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="wrap pageHero notFound">
      <p className="kicker">ERROR 404</p>
      <h1>Esta página no existe</h1>
      <p className="lead">Puede que el enlace esté mal escrito o que la página ya no esté. Estas te pueden servir:</p>
      <ul className="industryLinks">
        <li>
          <a href="/">
            <span aria-hidden="true">🏠</span> Inicio
          </a>
        </li>
        <li>
          <a href={ABOUT_PATH}>
            <span aria-hidden="true">💡</span> ¿Qué es Clonexa?
          </a>
        </li>
        {INDUSTRY_PAGES.map((page) => (
          <li key={page.slug}>
            <a href={`/${page.slug}`}>
              <span aria-hidden="true">{page.icon}</span> {page.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="heroActions">
        <ExternalLink href={waLink("Hola Clonexa, quiero agendar una demo gratis.")} className="btn" data-wa="404">
          Escríbenos por WhatsApp
        </ExternalLink>
      </div>
    </section>
  );
}
