// Escoge la pagina por ruta y la envuelve con barra, pie y WhatsApp flotante.
// El mismo componente se usa en el prerender (servidor) y al hidratar (navegador).
import React from "react";
import { trackPageView } from "./analytics.js";
import HomePage from "./App.jsx";
import { industryGreeting } from "./industries.js";
import { FloatingWhatsapp, Footer, Header, useTheme } from "./layout.jsx";
import { AboutPage, IndustryPage, NotFoundPage } from "./pages.jsx";
import { ABOUT_PATH, industryBySlug, normalizePath } from "./site.js";

export default function Root({ path: rawPath }) {
  const path = normalizePath(rawPath);
  const [theme, setTheme] = useTheme();
  const industry = industryBySlug(path);

  React.useEffect(() => {
    trackPageView();
  }, []);

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
      <main id="contenido">{page}</main>
      <Footer />
      <FloatingWhatsapp message={industry ? industryGreeting(industry) : undefined} />
    </>
  );
}
