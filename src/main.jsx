import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { splitLang } from "./i18n/index.jsx";
import Root from "./Root.jsx";
import "./landing.css";
import "./live.css";

// Solo se descarga el diccionario del idioma de la pagina (cada uno es su propio archivo JS).
const DICTS = {
  es: () => import("./i18n/es.json"),
  en: () => import("./i18n/en.json"),
  fr: () => import("./i18n/fr.json")
};

// En produccion el HTML ya viene prerenderizado (se hidrata); en desarrollo se renderiza aqui.
const path = window.location.pathname;
const { lang } = splitLang(path);
DICTS[lang]().then((mod) => {
  const container = document.getElementById("root");
  const app = (
    <React.StrictMode>
      <Root path={path} dict={mod.default} />
    </React.StrictMode>
  );
  if (container.hasChildNodes()) hydrateRoot(container, app);
  else createRoot(container).render(app);
});
