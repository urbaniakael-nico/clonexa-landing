// Paginas por industria: solo las que tienen pantallas reales de Clonexa en tema claro.
// Los textos (titulo, descripcion, H1, intro, pasos, modulos y preguntas) estan en
// src/i18n/<idioma>.json -> industries[slug]; aqui queda la estructura: ruta, icono y la captura
// de cada paso (en el mismo orden que t.industries[slug].steps).

export const INDUSTRY_PAGES = [
  { slug: "restaurantes", icon: "🍽️", shots: ["rest-carta", "rest-mesero", "rest-cocina", "rest-cuenta", "rest-cierre"] },
  { slug: "bares", icon: "🍸", shots: ["bar-qr", "bar-barra", "bar-juegos", "bar-cierre"] },
  { slug: "talleres-y-fabricas", icon: "🧵", shots: ["taller-tablero", "taller-pin", "taller-produccion", "taller-nomina"] },
  { slug: "call-centers", icon: "🎧", shots: ["ej-callcenter", "ej-tickets", "ej-tesoreria"] },
  { slug: "personal-en-campo", icon: "🦺", shots: ["campo-inicio", "campo-materiales"] }
];

// Industrias del inicio que aun no tienen pagina (sin pantallas reales suficientes en claro).
export const INDUSTRIES_WITHOUT_PAGE = ["Tiendas y cadenas", "Distribuidoras", "Tiendas en línea"];

// Saludo de WhatsApp de cada pagina de industria.
export function industryGreeting(t, slug) {
  return t.industryPage.greeting.replace("{business}", t.industries[slug].business);
}
