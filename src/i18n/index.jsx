// Idiomas de la landing: contexto de React con el diccionario de la pagina. Las funciones puras
// (rutas, formatos) estan en core.js; los textos en es.json / en.json / fr.json (misma estructura;
// tests/i18n.test.js revisa que no falte ninguna clave). El navegador solo descarga el diccionario
// del idioma de la pagina.
import React from "react";
import { fill, homeAnchor, localize, money } from "./core.js";

export * from "./core.js";

const I18nContext = React.createContext(null);

export function I18nProvider({ lang, dict, base, children }) {
  const value = React.useMemo(
    () => ({
      lang,
      t: dict,
      base,
      href: (path) => localize(lang, path),
      anchor: (id) => homeAnchor(lang, id),
      money: (cop) => money(lang, cop),
      fill
    }),
    [lang, dict, base]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n fuera de I18nProvider");
  return ctx;
}
