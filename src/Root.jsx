// Escoge la pagina por ruta e idioma y la envuelve con barra, pie, aviso de idioma y WhatsApp flotante.
// El mismo componente se usa en el prerender (servidor) y al hidratar (navegador).
import React from "react";
import { readUtm, trackPageView } from "./analytics.js";
import HomePage from "./App.jsx";
import CartaVideoSection from "./CartaVideo.jsx";
import { CARTA_PAGE, cartaVideoTarget } from "./cartaVideo.js";
import { whenIdle } from "./defer.jsx";
import { I18nProvider, splitLang } from "./i18n/index.jsx";
import { industryGreeting } from "./industries.js";
import { FloatingWhatsapp, Footer, Header, LangNotice, useTheme } from "./layout.jsx";
import { AboutPage, IndustryPage, NotFoundPage } from "./pages.jsx";
import { ABOUT_PATH, industryBySlug } from "./site.js";

// Las paginas van memorizadas: los cambios de estado de Shell (tema, carta en video) no les llegan.
// Asi las secciones con hidratacion diferida (defer.jsx) conservan su HTML del servidor hasta
// hidratarse (una actualizacion a una seccion aun no hidratada haria que React la borre).
const Home = React.memo(HomePage);
const About = React.memo(AboutPage);
const Industry = React.memo(IndustryPage);
const NotFound = React.memo(NotFoundPage);

function Shell({ base, dict }) {
  const [theme, setTheme] = useTheme();
  const industry = industryBySlug(base);

  // Carta video arriba: siempre en /restaurantes (tambien en el HTML prerenderizado) y, en las demas
  // paginas, para visitas de la prospeccion de restaurantes (o #carta-video).
  const [carta, setCarta] = React.useState({ show: false, code: "" });

  React.useEffect(() => {
    const target = cartaVideoTarget({ search: window.location.search, hash: window.location.hash, saved: readUtm() });
    if (target.show) setCarta(target);
    // La analitica no compite con la carga de la pagina.
    return whenIdle(() => trackPageView(), 2000);
  }, []);

  React.useEffect(() => {
    if (carta.show && window.location.hash === "#carta-video") document.getElementById("carta-video")?.scrollIntoView();
  }, [carta.show]);

  let page;
  if (base === "/") page = <Home />;
  else if (base === ABOUT_PATH) page = <About />;
  else if (industry) page = <Industry page={industry} />;
  else page = <NotFound />;

  return (
    <>
      <a href="#contenido" className="skip">
        {dict.common.skip}
      </a>
      <Header theme={theme} setTheme={setTheme} />
      <main id="contenido">
        {(base === CARTA_PAGE || carta.show) && <CartaVideoSection code={carta.code} />}
        {page}
      </main>
      <Footer />
      <LangNotice />
      <FloatingWhatsapp message={industry ? industryGreeting(dict, industry.slug) : undefined} />
    </>
  );
}

export default function Root({ path, dict }) {
  const { lang, base } = splitLang(path);
  return (
    <I18nProvider lang={lang} dict={dict} base={base}>
      <Shell base={base} dict={dict} />
    </I18nProvider>
  );
}
