// Textos, enlaces y capturas de la landing ("Tu negocio, en vivo").

// WhatsApp: solo enlaces wa.me, el numero nunca se muestra como texto.
const WHATSAPP_ID = "573144798220";

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_ID}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL = waLink("Hola Clonexa, quiero agendar una demo gratis de 20 minutos.");

export function demoRequestMessage({ name, business, whatsapp }, greeting = "Hola Clonexa, quiero agendar mi demo gratis.") {
  return [
    greeting,
    `Nombre: ${name}`,
    `Negocio: ${business}`,
    `WhatsApp: ${whatsapp}`
  ].join("\n");
}

// Menu fijo (en todas las paginas apunta a las secciones del inicio).
export const NAV_LINKS = [
  ["/#en-vivo", "En vivo 3D"],
  ["/#disena", "Diseña en 3D"],
  ["/#funciones", "Funciones"],
  ["/#planes", "Planes"],
  ["/#preguntas", "Preguntas"]
];

export const CTA_LABEL = "Pide tu demo gratis";

export const HERO_CHECKS = ["Usuarios ilimitados", "Tarifa plana", "Tu marca y tus colores", "Te ayudamos a pasar tus datos"];

// "Arma tu sistema": [icono, modulo, peso para el tipo de proyecto].
export const BUILDER_MODULES = [
  ["🧾", "Pedidos", 1],
  ["💵", "Caja", 1],
  ["📦", "Inventario", 1],
  ["🏭", "Bodega", 2],
  ["🚚", "Rutas", 2],
  ["🎧", "Call center", 3],
  ["☎️", "Telefonía", 3],
  ["🧑‍💼", "Vendedores", 2],
  ["🏬", "Red de tiendas", 2],
  ["🛒", "Tienda en línea", 3],
  ["🕐", "Turnos", 1],
  ["💰", "Nómina", 2],
  ["🤝", "Clientes (CRM)", 1],
  ["🎁", "Fidelización", 1],
  ["📈", "Gerencia", 2],
  ["🤖", "Bots y WhatsApp", 2],
  ["🎮", "En vivo 3D", 2],
  ["🧱", "Diseño 3D", 1]
];

export const BUILDER_DEFAULT = ["Pedidos", "Inventario", "Call center", "En vivo 3D"];

export function builderSummary(selected) {
  const chosen = BUILDER_MODULES.filter(([, name]) => selected.includes(name));
  const points = chosen.reduce((sum, [, , weight]) => sum + weight, 0);
  const level = !chosen.length ? "" : points <= 4 ? "Solución lista" : points <= 10 ? "Operación completa" : "Empresa a la medida";
  return { chosen, level, percent: Math.min(100, points * 6) };
}

export function builderWhatsapp(selected) {
  const names = BUILDER_MODULES.map(([, name]) => name).filter((name) => selected.includes(name));
  return waLink(`Hola Clonexa, quiero cotizar un sistema Clonexa con: ${names.join(", ")}.`);
}

// Capturas reales de Clonexa (tema claro, empresas demo, datos inventados) en /public/capturas.
// Cada una tiene su version -sm.webp (smWidth px) para celular.
const shot = (name, width, height, smWidth, alt, frame = "screen") => ({
  src: `/capturas/${name}.webp`,
  srcSm: `/capturas/${name}-sm.webp`,
  width,
  height,
  smWidth,
  alt,
  frame
});

// Carta nueva en video (demo Brasa & Maiz, datos inventados): en el marco de celular se reproduce
// el video; la portada es su primer cuadro.
const videoShot = (name, video, poster, width, height, alt) => ({
  src: poster, srcSm: poster, width, height, smWidth: width, alt, frame: "phone", video
});

export const SHOTS = {
  "rest-carta": videoShot("rest-carta", "/clonexa-media/carta-video-demo.mp4", "/clonexa-media/carta-video-demo-poster.webp", 390, 844,
    "Carta en video con QR en el celular del cliente: cada plato en video con su nombre, descripción y precio"),
  "hero-caja": shot("hero-caja", 1600, 1000, 800, "Caja de Clonexa en un restaurante: total vendido, pedidos, ticket promedio, cobrado por método y las mesas abiertas con su estado"),
  "rest-qr": shot("rest-qr", 780, 1688, 480, "Menú QR de la mesa 7 en el celular del cliente: platos fuertes con precio y botones para agregar al pedido", "phone"),
  "rest-mesero": shot("rest-mesero", 780, 1688, 480, "Panel del mesero en el celular: categoría Platos fuertes con cada plato y su precio", "phone"),
  "rest-cocina": shot("rest-cocina", 1600, 1000, 800, "Pantalla de cocina de Clonexa: comandas de mesas y domicilios en columnas Pedido nuevo, Preparando y Listo, con sus tiempos"),
  "rest-cuenta": shot("rest-cuenta", 1600, 680, 800, "Cuenta de la mesa 7 en la caja: productos pedidos, total de la cuenta y cobro en efectivo, transferencia o tarjeta"),
  "rest-cierre": shot("rest-cierre", 1600, 1000, 800, "Cierre de caja del día en Clonexa: total de ventas, productos vendidos, pedidos cobrados y cobrado por método de pago"),
  "bar-qr": shot("bar-qr", 780, 1688, 480, "Menú QR del bar en el celular: cocteles con precio, cuenta de la mesa y pedir canción", "phone"),
  "bar-barra": shot("bar-barra", 1600, 757, 800, "Panel de barra del bar: mesas y cuentas de barra abiertas con su total, los pedidos nuevos resaltados, botón + para agregar y las canciones pedidas por mesa"),
  "bar-juegos": shot("bar-juegos", 1600, 900, 800, "Juegos en vivo en el televisor del bar: juego Memoria relámpago con el tiempo, el premio y la tabla de jugadores"),
  "bar-cierre": shot("bar-cierre", 1600, 1000, 800, "Cierre de caja del día de negocio del bar: total de ventas, ventas de barra y cobrado por método"),
  "taller-tablero": shot("taller-tablero", 1600, 700, 800, "Tablero del taller en la tableta: quién está trabajando, en pausa o sin turno y hace cuánto"),
  "taller-pin": shot("taller-pin", 1600, 1000, 800, "Tablero del taller: la persona escribe su PIN de 4 dígitos en la tableta para empezar a trabajar"),
  "taller-produccion": shot("taller-produccion", 1600, 1125, 800, "Producción del taller en Clonexa: prendas cerradas, lotes en proceso con su avance, días por lote y mano de obra por prenda"),
  "taller-nomina": shot("taller-nomina", 1600, 1125, 800, "Nómina del taller en Clonexa: horas ordinarias y extra, total a pagar del periodo y el detalle de turnos por persona"),
  "campo-inicio": shot("campo-inicio", 1600, 1125, 800, "CRM Campo de Clonexa: operación en vivo con colaboradores activos y en pausa, su tiempo y su ubicación dentro de la zona de trabajo"),
  "campo-materiales": shot("campo-materiales", 1600, 1000, 800, "Materiales en Clonexa: órdenes de material pedidas por los técnicos con su estado, cantidad y destino"),
  "ej-aperturas": shot("ej-aperturas", 1600, 1125, 800, "CRM Campo de la empresa demo: personal activo, apertura de cada tienda y colaboradores por tienda con su tiempo"),
  "ej-ventas": shot("ej-ventas", 1600, 1125, 800, "Ventas en Clonexa: meta total del mes, avance de ventas contra la meta y cada vendedor con su meta"),
  "ej-callcenter": shot("ej-callcenter", 1600, 1125, 800, "Call center en Clonexa: llamadas, tickets y cotizaciones del periodo, duración promedio y cada asesor con su estado"),
  "ej-tickets": shot("ej-tickets", 1600, 1000, 800, "Cotizaciones y tickets en Clonexa: documentos con cliente, servicio, valor y estado En ruta, Programada o Aprobada"),
  "ej-solicitudes": shot("ej-solicitudes", 1600, 1125, 800, "Solicitudes a bodega en Clonexa: solicitudes de las tiendas, alistando, recibidas y el detalle de la solicitud 88"),
  "ej-tesoreria": shot("ej-tesoreria", 1600, 1125, 800, "Tesorería en Clonexa: tickets pendientes por revisar, listos para facturar, crédito disponible y facturas por cobrar")
};

export const HERO_SHOT = "hero-caja";

export function solutionWhatsapp(solution) {
  return waLink(`Hola Clonexa, quiero ver una demo de Clonexa para mi ${solution.business}.`);
}

export const COMMERCE_ITEMS = ["Multi-vendedor y multi-tienda", "Ofertas, cupones y envío gratis", "Inventario sincronizado con la bodega"];

export const PROCESS = [
  ["Diagnóstico", "Entendemos cómo trabaja tu empresa hoy y qué se te escapa."],
  ["Diseño", "Te mostramos las pantallas y el flujo antes de construir."],
  ["Construcción por etapas", "Entregamos módulo por módulo, probado y con tu equipo."],
  ["Acompañamiento", "Soporte por WhatsApp y mejoras continuas."]
];

// "Por que Clonexa" (sin cifras de clientes: solo lo que el sistema hace).
export const WHY = [
  ["Se adapta a tu proceso", ", no tú a él: se arma por módulos y lo que falta se construye."],
  ["Todo conectado", ": pedidos, caja, inventario, personal y reportes en un solo sistema."],
  ["Usuarios ilimitados", " con tarifa plana: no pagas por cada persona."],
  ["Módulos a la medida", ": call center, rutas, bodega, tienda en línea y lo que tu operación necesite."]
];

export const PLANS = [
  {
    id: "esencial",
    name: "Esencial",
    for: "Para ordenar el negocio",
    items: [
      ["Pedidos, caja e inventario", true],
      ["Reportes del día", false],
      ["Carta en video con QR", false],
      ["Usuarios ilimitados", false]
    ]
  },
  {
    id: "completa",
    name: "Operación completa",
    for: "Para negocios con equipo",
    recommended: true,
    items: [
      ["Todo lo de Esencial", false],
      ["Turnos y nómina", false],
      ["QR y domicilios", false],
      ["Negocio en vivo 3D", true],
      ["Diseño 3D del local y personajes", true]
    ]
  },
  {
    id: "medida",
    name: "A la medida",
    for: "Call center, rutas, red de tiendas",
    items: [
      ["Diagnóstico y diseño", false],
      ["Desarrollo por etapas", true],
      ["Tablero de gerencia", false],
      ["Tienda en línea o marketplace", false]
    ]
  }
];

export const PLAN_CTA = "Cotiza este plan";

export function planWhatsapp(plan) {
  return waLink(`Hola Clonexa, quiero cotizar el plan ${plan.name}.`);
}

// Preguntas frecuentes del inicio (tambien van como FAQPage en los datos estructurados).
// Respuestas cortas y solo con lo que el sistema hace hoy.
export const FAQ = [
  [
    "¿Cuánto cuesta?",
    "Una tarifa plana mensual según el plan, con usuarios ilimitados. Te damos el precio exacto después de ver tu negocio y los módulos que necesitas."
  ],
  [
    "¿Tengo que comprar equipos?",
    "No. Funciona en el navegador del celular, la tableta o el computador que ya tienes. Para la cocina, la barra o el televisor sirve cualquier pantalla con navegador."
  ],
  [
    "¿Me ayudan a pasar mis datos?",
    "Sí. Te ayudamos a cargar tu menú o tus productos, tu inventario y tu equipo, y capacitamos a tu gente para que arranque sin enredos."
  ],
  [
    "¿Funciona desde el celular?",
    "Sí. Se abre desde el navegador del celular, sin instalar nada. Tus clientes también piden desde su celular con el QR de la mesa."
  ],
  [
    "¿Mis datos están seguros?",
    "Tu información se guarda en la nube y viaja cifrada. Cada persona entra con su usuario o su PIN y ve solo lo que le toca. Y si lo pides, borramos tus datos."
  ],
  [
    "¿Qué pasa si se cae el internet?",
    "Clonexa trabaja en la nube, así que necesita conexión. Lo que ya registraste queda guardado; si se cae el wifi del local, puedes seguir con los datos del celular."
  ],
  [
    "¿Pueden construir un sistema que no está en esta página?",
    "Sí. Clonexa se arma por módulos. Si tu operación lo hace, lo diseñamos contigo y lo construimos por etapas, conectado a lo que ya tienes."
  ],
  [
    "¿Cuánto tarda?",
    "Las soluciones listas quedan funcionando en días. Un desarrollo a la medida se entrega por etapas para que lo uses desde temprano."
  ],
  ["¿Tiene factura electrónica DIAN?", "Está en desarrollo y llega próximamente."]
];

// Redes con utm_source=web para medir lo que llega desde la pagina.
const withUtm = (url) => `${url}${url.includes("?") ? "&" : "?"}utm_source=web`;

export const SOCIAL = [
  { id: "instagram", label: "Instagram", url: withUtm("https://www.instagram.com/clonexaapp") },
  { id: "facebook", label: "Facebook", url: withUtm("https://www.facebook.com/1397005896827159") },
  { id: "tiktok", label: "TikTok", url: withUtm("https://www.tiktok.com/@clonexxa") },
  { id: "linkedin", label: "LinkedIn", url: withUtm("https://www.linkedin.com/company/146691274") },
  { id: "youtube", label: "YouTube", url: withUtm("https://www.youtube.com/@CLONEXASAAS") }
];

export const LEGAL_LINKS = [
  ["/privacidad", "Privacidad"],
  ["/terminos", "Términos"],
  ["/borrar-datos", "Borrar mis datos"]
];
