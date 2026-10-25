// Textos, enlaces y capturas de la landing v4.

// Video vertical de Nexa en el hero: cambiar aqui cuando este el video final.
export const NEXA_VIDEO_URL = "/nexa-prueba.mp4";
export const NEXA_VIDEO_POSTER = "/capturas/nexa-poster.webp";

// WhatsApp: solo enlaces wa.me, el numero nunca se muestra como texto.
const WHATSAPP_ID = "13468244098";

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_ID}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL = waLink("Hola Clonexa, quiero agendar una demo gratis de 20 minutos.");

export function demoRequestMessage({ name, business, whatsapp }) {
  return [
    "Hola Clonexa, quiero agendar mi demo gratis.",
    `Nombre: ${name}`,
    `Negocio: ${business}`,
    `WhatsApp: ${whatsapp}`
  ].join("\n");
}

export const NAV_LINKS = [
  ["#soluciones", "Soluciones"],
  ["#medida", "A la medida"],
  ["#arma", "Arma tu sistema"],
  ["#ejemplo", "Ejemplo en acción"],
  ["#planes", "Planes"]
];

export const HERO_CHECKS = [
  ["Listo", " o ", "a la medida"],
  ["", "Usuarios ilimitados"],
  ["", "Celular, tableta o PC"],
  ["", "Tu marca y tus colores"]
];

export const INDUSTRIES = [
  ["🍽️", "Restaurantes"],
  ["🍸", "Bares"],
  ["🧵", "Talleres y fábricas"],
  ["🚚", "Distribuidoras"],
  ["🏬", "Tiendas y cadenas"],
  ["🎧", "Call centers"],
  ["🦺", "Personal en campo"],
  ["🛒", "Tiendas en línea"]
];

export const PATHS = [
  {
    id: "listo",
    tag: "LISTO PARA USAR",
    title: "Soluciones probadas",
    text: "Módulos que ya operan en negocios reales. Se configuran con tu marca y quedan funcionando en días.",
    items: ["🧾 Pedidos y caja", "👨‍🍳 Cocina en vivo", "📦 Inventario", "🕐 Turnos y nómina", "📱 QR en mesa", "🎁 Fidelización", "📊 Reportes", "🤖 Bots de Telegram"],
    cta: ["#soluciones", "Ver soluciones →"]
  },
  {
    id: "medida",
    tag: "HECHO A LA MEDIDA",
    title: "Tu sistema, como lo imaginas",
    text: "Diseñamos y construimos el sistema completo de tu empresa, por etapas, sobre la misma base de Clonexa.",
    items: ["🎧 Call center", "🚚 Rutas y despachos", "🏭 Bodega y alistamiento", "🧑‍💼 Fuerza de ventas", "🏬 Red de tiendas", "🛒 Tienda en línea", "☎️ Telefonía", "📈 Tablero de gerencia"],
    cta: ["#arma", "Arma tu sistema →"]
  }
];

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
  ["🤖", "Bots y WhatsApp", 2]
];

export const BUILDER_DEFAULT = ["Pedidos", "Bodega", "Rutas", "Call center", "Gerencia"];

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

export const SHOTS = {
  "hero-caja": shot("hero-caja", 1600, 1000, 800, "Caja de Clonexa en un restaurante: total vendido, pedidos, ticket promedio, cobrado por método y las mesas abiertas con su estado"),
  "rest-qr": shot("rest-qr", 780, 1688, 480, "Menú QR de la mesa 7 en el celular del cliente: platos fuertes con precio y botones para agregar al pedido", "phone"),
  "rest-mesero": shot("rest-mesero", 780, 1688, 480, "Panel del mesero en el celular: categoría Platos fuertes con cada plato y su precio", "phone"),
  "rest-cocina": shot("rest-cocina", 1600, 1000, 800, "Pantalla de cocina de Clonexa: comandas de mesas y domicilios en columnas Pedido nuevo, Preparando y Listo, con sus tiempos"),
  "rest-cuenta": shot("rest-cuenta", 1600, 680, 800, "Cuenta de la mesa 7 en la caja: productos pedidos, total de la cuenta y cobro en efectivo, transferencia o tarjeta"),
  "rest-cierre": shot("rest-cierre", 1600, 1000, 800, "Cierre de caja del día en Clonexa: total de ventas, productos vendidos, pedidos cobrados y cobrado por método de pago"),
  "bar-qr": shot("bar-qr", 780, 1688, 480, "Menú QR del bar en el celular: cocteles con precio, cuenta de la mesa y pedir canción", "phone"),
  "bar-barra": shot("bar-barra", 1198, 1000, 800, "Pantalla de barra del bar: pedidos QR por mesa en columnas Pendiente, Alistando, Entregado y Cerrado"),
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

// Soluciones listas: cada pestana es un recorrido por pasos con capturas reales.
export const SOLUTIONS = [
  {
    id: "restaurantes",
    icon: "🍽️",
    label: "Restaurantes",
    business: "restaurante",
    items: [
      ["Pedidos por QR", " desde la mesa o con el mesero"],
      ["Cocina en vivo", " con tiempos por comanda"],
      ["Domicilios", " que llegan solos a la cocina"],
      ["Caja y cierre", " del día sin descuadres"],
      ["Inventario y reportes", ": qué se vende y qué no"]
    ],
    steps: [
      { shot: "rest-qr", title: "El cliente pide desde la mesa", text: "Escanea el QR de su mesa y arma su pedido desde el celular." },
      { shot: "rest-mesero", title: "El mesero toma el pedido", text: "Desde su celular, sin comandas de papel." },
      { shot: "rest-cocina", title: "Cocina lo recibe al instante", text: "En orden, con tiempos y con los domicilios en la misma pantalla." },
      { shot: "rest-cuenta", title: "La cuenta ya está armada", text: "La caja cobra la mesa exacta, en efectivo, transferencia o tarjeta." },
      { shot: "rest-cierre", title: "Cierre del día", text: "Total vendido, productos y cobrado por método, en un solo reporte." }
    ]
  },
  {
    id: "bares",
    icon: "🍸",
    label: "Bares",
    business: "bar",
    items: [
      ["Pedidos por QR", " desde la mesa, directo a la barra"],
      ["Cobros exactos", " por mesa"],
      ["Música y juegos en vivo", " en la pantalla del bar"],
      ["Inventario de licores", " con alertas"],
      ["Cierre por día de negocio", ", aunque cierres a las 4 a. m."]
    ],
    steps: [
      { shot: "bar-qr", title: "Piden desde la mesa", text: "Con el QR de la mesa: cocteles, la cuenta y hasta la canción." },
      { shot: "bar-barra", title: "La barra lo ve en vivo", text: "Cada pedido por mesa, de pendiente a entregado." },
      { shot: "bar-juegos", title: "Juegos en vivo en el TV", text: "Los clientes juegan desde el celular y la tabla sale en la pantalla del bar." },
      { shot: "bar-cierre", title: "Cierre por día de negocio", text: "Lo vendido en la noche queda en el mismo día, aunque cierres de madrugada." }
    ]
  },
  {
    id: "talleres",
    icon: "🧵",
    label: "Talleres y fábricas",
    business: "taller",
    items: [
      ["Tableta del taller", " con PIN para cada persona"],
      ["Turnos y tiempo", " por referencia"],
      ["Producción por lote", " con avance en vivo"],
      ["Nómina", " por horas o por producción"],
      ["Cotizaciones y cuentas de cobro", " desde lo producido"]
    ],
    steps: [
      { shot: "taller-tablero", title: "El tablero del taller", text: "En la tableta: quién trabaja, quién está en pausa y hace cuánto." },
      { shot: "taller-pin", title: "Cada quien entra con su PIN", text: "Escoge en qué referencia va a trabajar y empieza su turno." },
      { shot: "taller-produccion", title: "Producción por lote", text: "Prendas cerradas, avance de cada lote y mano de obra por prenda." },
      { shot: "taller-nomina", title: "La nómina sale sola", text: "Horas, extras y total a pagar del periodo, con el detalle por persona." }
    ]
  },
  {
    id: "campo",
    icon: "🦺",
    label: "Personal en campo",
    business: "operación en campo",
    items: [
      ["Inicio de operación", " con ubicación"],
      ["Quién está en cada zona", ", en vivo"],
      ["Solicitud de material", " desde el celular"],
      ["Pausas y tiempo", " por colaborador"],
      ["Bot de Telegram", " para el equipo"]
    ],
    steps: [
      { shot: "campo-inicio", title: "Inicio de operación", text: "Cada técnico inicia su turno y se ve si está dentro de su zona de trabajo." },
      { shot: "campo-materiales", title: "Solicitud de material", text: "El equipo pide material y se aprueba, entrega o devuelve con número de orden." }
    ]
  }
];

export function solutionWhatsapp(solution) {
  return waLink(`Hola Clonexa, quiero ver una demo de Clonexa para mi ${solution.business}.`);
}

// Ejemplo en accion: empresa demo con tiendas y call center.
export const EXAMPLE_STEPS = [
  {
    shot: "ej-aperturas",
    title: "Abren las tiendas",
    text: "Cada tienda abre cuando su equipo inicia turno. Gerencia ve qué tiendas abrieron y cuánta gente está trabajando en cada una."
  },
  {
    shot: "ej-ventas",
    title: "Se vende en tiendas y redes",
    text: "Cada vendedor registra sus ventas desde el celular. La meta del mes avanza sola, por vendedor y en total."
  },
  {
    shot: "ej-callcenter",
    title: "El call center llama y cotiza",
    text: "El supervisor ve a cada asesor en vivo: en llamada, disponible o en pausa, con sus llamadas, cotizaciones y tickets."
  },
  {
    shot: "ej-tickets",
    title: "La cotización se vuelve servicio",
    text: "Cuando el cliente aprueba, la cotización se convierte en ticket, se programa y se sigue hasta que el servicio se cumple."
  },
  {
    shot: "ej-solicitudes",
    title: "Bodega abastece las tiendas",
    text: "Si a una tienda le falta mercancía, la pide a bodega y sigue el estado: Enviada → Alistando → Lista → Recibida."
  },
  {
    shot: "ej-tesoreria",
    title: "Tesorería y gerencia en vivo",
    text: "Tesorería revisa los tickets antes de facturar y ve lo que está por cobrar; gerencia cierra el día con todo conectado."
  }
];

export const COMMERCE_ITEMS = ["Multi-vendedor y multi-tienda", "Ofertas, cupones y envío gratis", "Inventario sincronizado con la bodega"];

// Fila: [funcion, software generico, Clonexa]. "yes" = check, "soon" = PROXIMAMENTE.
export const COMPARISON = [
  ["Pedidos, caja e inventario", "yes", "yes"],
  ["Se adapta a tu proceso", "no", "yes"],
  ["Módulos nuevos a la medida (call center, rutas, tienda en línea…)", "no", "yes"],
  ["Todo conectado: tiendas, bodega, ventas y gerencia", "Varios programas", "Uno solo"],
  ["Cobro por usuario", "Casi siempre", "Nunca · tarifa plana"],
  ["Factura electrónica DIAN", "yes", "soon"]
];

export const PROCESS = [
  ["Diagnóstico", "Entendemos cómo trabaja tu empresa hoy y qué se te escapa."],
  ["Diseño", "Te mostramos las pantallas y el flujo antes de construir."],
  ["Construcción por etapas", "Entregamos módulo por módulo, probado y con tu equipo."],
  ["Acompañamiento", "Soporte por WhatsApp y mejoras continuas."]
];

export const CASES = [
  {
    big: "< 5 min",
    title: "para calcular la nómina",
    text: "Taller de confección en Bogotá: pagos por horas de producción y costo por referencia. Antes, a mano."
  },
  {
    big: "0",
    title: "botellas por contar al cierre",
    text: "Bar en Bogotá: cobros exactos, pedidos y canciones en tiempo real al barman."
  },
  {
    big: "0",
    title: "pedidos perdidos",
    text: "Restaurante: pedidos desde el celular y domicilios directo a cocina, con inventario exacto."
  }
];

export const PLANS = [
  {
    id: "esencial",
    name: "Esencial",
    for: "Para ordenar el negocio",
    items: [
      ["Pedidos, caja e inventario", true],
      ["Reportes del día", false],
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
      ["Turnos y nómina", true],
      ["QR, domicilios y fidelización", true],
      ["Instalación y capacitación", false]
    ]
  },
  {
    id: "medida",
    name: "Empresas a la medida",
    for: "Call center, rutas, red de tiendas, tienda en línea",
    items: [
      ["Diagnóstico y diseño", false],
      ["Desarrollo por etapas", true],
      ["Tablero de gerencia", false]
    ]
  }
];

export const PLAN_CTA = "Cotiza este plan";

export function planWhatsapp(plan) {
  return waLink(`Hola Clonexa, quiero cotizar el plan ${plan.name}.`);
}

export const FAQ = [
  [
    "¿Pueden construir un sistema que no está en esta página?",
    "Sí. Clonexa se arma por módulos. Si tu operación lo hace, lo diseñamos contigo y lo construimos por etapas, conectado a lo que ya tienes."
  ],
  [
    "¿Cuánto tarda?",
    "Las soluciones listas quedan funcionando en días. Un desarrollo a la medida se entrega por etapas para que lo uses desde temprano."
  ],
  ["¿Tiene factura electrónica DIAN?", "Está en desarrollo y llega próximamente."],
  ["¿Cobran por cada usuario?", "No. Tarifa plana: todo tu equipo usa Clonexa sin costo extra por usuario."],
  ["¿Necesito comprar equipos?", "No. Funciona en el celular, la tableta o el computador que ya tienes."]
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
