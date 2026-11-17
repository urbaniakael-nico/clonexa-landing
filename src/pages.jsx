// Paginas propias: industria, "¿Que es Clonexa?" y 404. Se prerenderizan a HTML en el build, en
// espanol, ingles y frances (textos en src/i18n/<idioma>.json).
import React from "react";
import { SHOTS, SOCIAL, waLink } from "./content.js";
import { Deferred } from "./defer.jsx";
import { useI18n } from "./i18n/index.jsx";
import { INDUSTRY_PAGES, industryGreeting } from "./industries.js";
import { Breadcrumbs, DemoForm, ExternalLink, FaqList, SectionHead, ShotImage } from "./layout.jsx";
import { Inside } from "./live.jsx";
import { LiveSim } from "./sections.jsx";
import { ABOUT_PATH, INDUSTRY_LINKS } from "./site.js";

function OtherIndustries({ current }) {
  const { t, href } = useI18n();
  const o = t.industryPage.others;
  return (
    <section id="otras" className="wrap section" aria-labelledby="otras-titulo">
      <SectionHead id="otras-titulo" kicker={o.kicker} title={o.title} />
      <ul className="industryLinks">
        {INDUSTRY_LINKS.filter(([path]) => path !== current).map(([path, slug, icon]) => (
          <li key={path}>
            <a href={href(path)}>
              <span aria-hidden="true">{icon}</span> {t.industries[slug].name}
            </a>
          </li>
        ))}
        <li>
          <a href={href(ABOUT_PATH)}>
            <span aria-hidden="true">💡</span> {t.common.nav.about}
          </a>
        </li>
      </ul>
    </section>
  );
}

// Botones grandes "Síguenos" (Instagram, TikTok y Facebook) en cada página de nicho:
// el mensaje de prospección invita a seguir a @clonexaapp.
const FOLLOW_NETWORKS = ["instagram", "tiktok", "facebook"];
const FOLLOW_HANDLE = { instagram: "@clonexaapp", tiktok: "@clonexxa", facebook: "Clonexa" };

function FollowUs() {
  const { t } = useI18n();
  const f = t.industryPage.follow;
  const items = FOLLOW_NETWORKS.map((id) => SOCIAL.find((s) => s.id === id)).filter(Boolean);
  return (
    <section id="siguenos" className="wrap section followTips" aria-labelledby="tips-titulo">
      <SectionHead id="tips-titulo" kicker={f.kicker} title={f.title} sub={f.sub} />
      <ul className="tipsBtns">
        {items.map((item) => (
          <li key={item.id}>
            <ExternalLink href={item.url} className={`btn tipsBtn tips-${item.id}`} data-follow={item.id}>
              {item.label} <span>{FOLLOW_HANDLE[item.id]}</span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Pestana de "Asi funciona por dentro" y de la simulacion con la que abre cada pagina de nicho.
const NICHE_TABS = {
  restaurantes: ["restaurante", "restaurante"],
  bares: ["bar", "bar"],
  "talleres-y-fabricas": ["taller", "taller"],
  "call-centers": ["callcenter", "callcenter"],
  "personal-en-campo": ["campo", "campo"]
};

function IndustryBody({ page, text }) {
  const { t, fill } = useI18n();
  const ip = t.industryPage;
  const name = text.name.toLowerCase();
  return (
    <>
      <section className="wrap section" aria-labelledby="como-titulo">
        <SectionHead id="como-titulo" kicker={ip.how.kicker} title={fill(ip.how.title, { name })} />
        {text.intro.slice(1).map((paragraph, i) => (
          <p key={i} className="pageText">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="wrap section" aria-labelledby="funciona-titulo">
        <SectionHead id="funciona-titulo" kicker={ip.flow.kicker} title={fill(ip.flow.title, { name })} sub={ip.flow.sub} />
        <ol className="flowSteps">
          {text.steps.map(([title, body], i) => {
            const id = page.shots[i];
            const phone = SHOTS[id].frame === "phone";
            return (
              <li key={id} className={`flowStep${phone ? " flowPhone" : ""}`}>
                <div className="flowText">
                  <p className="pill">{fill(ip.flow.step, { n: i + 1 })}</p>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <figure className="flowShot">
                  <a href={SHOTS[id].video || SHOTS[id].src} target="_blank" rel="noopener" aria-label={fill(ip.flow.zoom, { title })}>
                    <ShotImage id={id} sizes={phone ? "210px" : "(max-width: 760px) 92vw, 640px"} />
                  </a>
                </figure>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="para-quien-titulo">
        <SectionHead id="para-quien-titulo" kicker={ip.fit.kicker} title={ip.fit.title} />
        <p className="pageText">{text.fit}</p>
      </section>

      <section className="wrap section" aria-labelledby="modulos-titulo">
        <SectionHead id="modulos-titulo" kicker={ip.modules.kicker} title={fill(ip.modules.title, { name })} sub={ip.modules.sub} />
        <ul className="moduleGrid">
          {text.modules.map(([moduleName, body]) => (
            <li className="card" key={moduleName}>
              <h3>{moduleName}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="preguntas" className="wrap section" aria-labelledby="faq-titulo">
        <SectionHead id="faq-titulo" kicker={ip.faq.kicker} title={ip.faq.title} />
        <FaqList items={text.faq} />
      </section>
    </>
  );
}

export function IndustryPage({ page }) {
  const { t, fill } = useI18n();
  const text = t.industries[page.slug];
  const ip = t.industryPage;
  const greeting = industryGreeting(t, page.slug);
  const path = `/${page.slug}`;
  const [insideTab, simTab] = NICHE_TABS[page.slug] || ["restaurante", "restaurante"];
  return (
    <>
      <Breadcrumbs label={text.name} />
      <section className="wrap pageHero" data-wa-hide>
        <p className="kicker">{fill(ip.kicker, { name: text.name.toUpperCase() })}</p>
        <h1>{text.h1}</h1>
        <p className="lead">{text.intro[0]}</p>
        <div className="heroActions">
          <a href="#agenda" className="btn">
            {t.common.cta}
          </a>
          <ExternalLink href={waLink(greeting)} className="btn btnGhost" data-wa={`hero-${page.slug}`}>
            {t.common.wa.write}
          </ExternalLink>
        </div>
      </section>

      <Inside initial={insideTab} />
      <LiveSim initial={simTab} />

      <Deferred id="como-titulo">
        <IndustryBody page={page} text={text} />
      </Deferred>

      <FollowUs />

      <DemoForm greeting={greeting} page={page.slug} sub={fill(t.form.subIndustry, { name: text.name.toLowerCase() })} />
      <OtherIndustries current={path} />
    </>
  );
}

export function AboutPage() {
  const { t, href } = useI18n();
  const a = t.about;
  return (
    <>
      <Breadcrumbs label={a.crumb} />
      <article className="wrap pageHero aboutPage" data-wa-hide>
        <p className="kicker">{a.kicker}</p>
        <h1>{a.h1}</h1>
        <p className="lead">{a.lead}</p>
        <p className="pageText">{a.text1}</p>
        <figure className="aboutShot">
          <ShotImage id="hero-caja" sizes="(max-width: 760px) 92vw, 760px" />
          <figcaption>{a.shotCaption}</figcaption>
        </figure>

        <h2>{a.whoTitle}</h2>
        <p className="pageText">{a.whoText}</p>
        <ul className="industryLinks">
          {INDUSTRY_LINKS.map(([path, slug, icon]) => (
            <li key={path}>
              <a href={href(path)}>
                <span aria-hidden="true">{icon}</span> {t.industries[slug].name}
              </a>
            </li>
          ))}
        </ul>
        <p className="pageText">{a.alsoText}</p>

        <h2>{a.howTitle}</h2>
        <p className="pageText">{a.howText}</p>

        <h2>{a.diffTitle}</h2>
        <ul className="aboutList">
          {a.diff.map(([bold, rest]) => (
            <li key={bold}>
              <strong>{bold}</strong>
              {rest}
            </li>
          ))}
        </ul>

        <h2>{a.nexaTitle}</h2>
        <p className="pageText">{a.nexaText}</p>

        <h2>{a.contactTitle}</h2>
        <p className="pageText">
          {a.contact1}
          <ExternalLink href={waLink(a.waMessage)} data-wa="que-es-clonexa">
            WhatsApp
          </ExternalLink>
          {a.contact2}
          <a href="mailto:clonexasaas@gmail.com">clonexasaas@gmail.com</a>
          {a.contact3}
          {SOCIAL.map((item, i) => (
            <React.Fragment key={item.id}>
              {i > 0 && (i === SOCIAL.length - 1 ? a.and : ", ")}
              <ExternalLink href={item.url}>{item.label}</ExternalLink>
            </React.Fragment>
          ))}
          .
        </p>
        <p className="disclaimer">{a.disclaimer}</p>
      </article>
      <DemoForm page="que-es-clonexa" />
    </>
  );
}

export function NotFoundPage() {
  const { t, href } = useI18n();
  const n = t.notFound;
  return (
    <section className="wrap pageHero notFound">
      <p className="kicker">{n.kicker}</p>
      <h1>{n.h1}</h1>
      <p className="lead">{n.lead}</p>
      <ul className="industryLinks">
        <li>
          <a href={href("/")}>
            <span aria-hidden="true">🏠</span> {n.home}
          </a>
        </li>
        <li>
          <a href={href(ABOUT_PATH)}>
            <span aria-hidden="true">💡</span> {t.common.nav.about}
          </a>
        </li>
        {INDUSTRY_PAGES.map((page) => (
          <li key={page.slug}>
            <a href={href(`/${page.slug}`)}>
              <span aria-hidden="true">{page.icon}</span> {t.industries[page.slug].name}
            </a>
          </li>
        ))}
      </ul>
      <div className="heroActions">
        <ExternalLink href={waLink(n.waMessage)} className="btn" data-wa="404">
          {t.common.wa.write}
        </ExternalLink>
      </div>
    </section>
  );
}
