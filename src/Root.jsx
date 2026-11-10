// Escoge la pagina por ruta y la envuelve con barra, pie y WhatsApp flotante.
// El mismo componente se usa en el prerender (servidor) y al hidratar (navegador).
import React from "react";
import { readUtm, trackPageView } from "./analytics.js";
import HomePage from "./App.jsx";
import CartaVideoSection from "./CartaVideo.jsx";
import { cartaVideoTarget } from "./cartaVideo.js";
import { industryGreeting } from "./industries.js";
import { FloatingWhatsapp, Footer, Header, useTheme } from "./layout.jsx";
import { AboutPage, IndustryPage, NotFoundPage } from "./pages.jsx";
import { ABOUT_PATH, industryBySlug, normalizePath } from "./site.js";

export default function Root({ path: rawPath }) {
  const path = normalizePath(rawPath);
  const [theme, setTheme] = useTheme();
  const industry = industryBySlug(path);

  // Carta video arriba solo para visitas de la prospeccion de restaurantes (o #carta-video).
  const [carta, setCarta] = React.useState({ show: false, code: "" });

  React.useEffect(() => {
    trackPageView();
    const target = cartaVideoTarget({ search: window.location.search, hash: window.location.hash, saved: readUtm() });
    if (target.show) setCarta(target);
  }, []);

  React.useEffect(() => {
    if (carta.show && window.location.hash === "#carta-video") document.getElementById("carta-video")?.scrollIntoView();
  }, [carta.show]);

  let page;
  if (path === "/") page = <HomePage />;
  else if (path === ABOUT_PATH) page = <AboutPage />;
  else if (industry) page = <IndustryPage page={industry} />;
  else page = <NotFoundPage />;

  return (
    <>
      <a href="#contenido" className="skip">
        Saltar al contenido
      </a>
      <Header theme={theme} setTheme={setTheme} current={path} />
      <main id="contenido">
        {carta.show && <CartaVideoSection code={carta.code} />}
        {page}
      </main>
      <Footer />
      <FloatingWhatsapp message={industry ? industryGreeting(industry) : undefined} />
    </>
  );
}
