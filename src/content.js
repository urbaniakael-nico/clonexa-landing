// Textos, enlaces y capturas de la landing v3.

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
  ["#demo", "Demo en vivo"],
  ["#negocios", "Negocios"],
  ["#planes", "Planes"],
  ["#preguntas", "Preguntas"]
];

export const HERO_CHECKS = [
  ["Demo gratis", " de 20 min"],
  ["Instalación acompañada", ""],
  ["Usuarios ilimitados", ""],
  ["", "Soporte por WhatsApp"]
];

export const BUSINESS_TYPES = [
  ["🍽️", "Restaurantes"],
  ["🔥", "Asaderos"],
  ["🍸", "Bares"],
  ["🧵", "Talleres de confección"],
  ["🦺", "Personal en campo"]
];

export const PROBLEMS = [
  {
    icon: "📒",
    title: "Todo en cuadernos y chats",
    text: "Pedidos por WhatsApp, inventario en un cuaderno y la nómina en Excel. Nada habla con nada."
  },
  {
    icon: "🧾",
    title: "Pedidos que se pierden",
    text: "El mesero anota, la cocina no se entera y la caja no cuadra al final de la noche."
  },
  {
    icon: "⏱️",
    title: "Horas haciendo cuentas",
    text: "Turnos, horas extra y pagos calculados a mano cada quincena, con errores."
  }
];

// Capturas reales en /public/capturas. src null = "Captura próximamente".
export const SHOTS = {
  mesero: {
    src: "/capturas/mesero.webp",
    width: 780,
    height: 1688,
    alt: "Panel del mesero de Clonexa en el celular: platos de la categoría Asados con precio y el pedido en curso"
  },
  cocina: {
    src: "/capturas/cocina.webp",
    width: 1280,
    height: 800,
    alt: "Pantalla de cocina de Clonexa con las comandas en columnas Pedido nuevo, Preparando y Listo, con sus tiempos"
  },
  caja: {
    src: "/capturas/caja.webp",
    width: 1280,
    height: 800,
    alt: "Caja de Clonexa: total vendido, cobrado por método y las mesas abiertas con su estado y valor"
  },
  reporte: {
    src: "/capturas/reporte.webp",
    width: 1280,
    height: 800,
    alt: "Cierre de caja del día en Clonexa: total de ventas, productos vendidos y cobrado por método de pago"
  },
  restaurante: {
    src: "/capturas/restaurante.webp",
    width: 1280,
    height: 520,
    alt: "Cuenta de una mesa en la caja de Clonexa, armada con los pedidos del mesero y lista para cobrar"
  },
  bar: {
    src: "/capturas/bar.webp",
    width: 1280,
    height: 800,
    alt: "Juegos en vivo de Clonexa en la pantalla del bar: ruleta de la rifa con el número ganador y el premio"
  },
  taller: {
    src: "/capturas/taller.webp",
    width: 1280,
    height: 520,
    alt: "Tablero del taller de confección en Clonexa: quién está trabajando, en qué referencia y hace cuánto"
  },
  campo: {
    src: "/capturas/campo.webp",
    width: 1280,
    height: 800,
    alt: "Malla de turnos del personal en campo en Clonexa, publicada al bot para la semana"
  }
};

export const FLOW_STEPS = [
  { shot: "mesero", frame: "phone", label: "Panel del mesero", title: "El mesero pide", text: "Desde su celular o con el QR de la mesa." },
  { shot: "cocina", frame: "screen", label: "Pantalla de cocina", title: "Llega a cocina", text: "Al instante, en orden y con tiempos." },
  { shot: "caja", frame: "screen", label: "Caja", title: "Se cobra exacto", text: "La cuenta ya está armada. Sin descuadres." },
  { shot: "reporte", frame: "screen", label: "Reporte del día", title: "Inventario y reportes", text: "Se descuenta solo y ves qué vende y qué no." }
];

export const DEMO_TABS = [
  {
    id: "restaurantes",
    icon: "🍽️",
    label: "Restaurantes y asaderos",
    business: "restaurante",
    shot: "restaurante",
    items: [
      ["Pedidos del mesero", " desde el celular, sin comandas de papel"],
      ["Domicilios", " directo a cocina, sin pasar por chats"],
      ["Caja y cierre", " con la cuenta ya armada"],
      ["Inventario", " que se descuenta solo con cada venta"],
      ["Reportes del día", ": qué se vendió, cuánto y cómo pagaron"]
    ]
  },
  {
    id: "bares",
    icon: "🍸",
    label: "Bares",
    business: "bar",
    shot: "bar",
    items: [
      ["Pedidos por QR", " desde la mesa, directo a la barra"],
      ["Cobros exactos", " por mesa, sin contar botellas al final"],
      ["Música y juegos en vivo", " en la pantalla del bar"],
      ["Inventario de licores", " con alertas de faltantes"],
      ["Cierre por día de negocio", ", aunque cierres a las 4 am"]
    ]
  },
  {
    id: "talleres",
    icon: "🧵",
    label: "Talleres de confección",
    business: "taller",
    shot: "taller",
    items: [
      ["Turnos y tiempo", " por referencia"],
      ["Producción por lote", " con avance en tiempo real"],
      ["Nómina por horas", " o por producción en minutos"],
      ["Cotizaciones y cuentas de cobro", " desde lo producido"],
      ["Tableta del taller", " para que el equipo registre su trabajo"]
    ]
  },
  {
    id: "campo",
    icon: "🦺",
    label: "Personal en campo",
    business: "operación en campo",
    shot: "campo",
    items: [
      ["Inicio de operación", " con ubicación"],
      ["Material asignado", " por área"],
      ["Notas del trabajo", " desde el celular"],
      ["Avance por área", " para saber cómo va cada frente"],
      ["Bot de Telegram", " para supervisores"]
    ]
  }
];

export function tabWhatsapp(tab) {
  return waLink(`Hola Clonexa, quiero ver una demo de Clonexa para mi ${tab.business}.`);
}

// Fila: [funcion, POS comun, Clonexa]. "yes" = check, "soon" = PROXIMAMENTE.
export const COMPARISON = [
  ["Mesas, pedidos y caja", "yes", "yes"],
  ["Inventario", "yes", "yes"],
  ["Pedidos por QR y domicilios a cocina", "A veces", "yes"],
  ["Turnos y nómina por horas o producción", "no", "yes"],
  ["Producción por lote (talleres)", "no", "yes"],
  ["Personal en campo y bots de Telegram", "no", "yes"],
  ["Fidelización y juegos en vivo", "no", "yes"],
  ["Ajustes a la medida de tu negocio", "no", "yes"],
  ["Cobro por usuario", "Muchas veces", "Nunca · tarifa plana"],
  ["Factura electrónica DIAN", "yes", "soon"]
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
    text: "Asadero: pedidos desde el celular y domicilios directo a cocina, con inventario exacto."
  }
];

export const PLANS = [
  {
    id: "esencial",
    name: "Esencial",
    for: "Para empezar a ordenar el negocio",
    cta: "Cotiza este plan",
    items: [
      ["Pedidos, caja e inventario", true],
      ["Reportes del día", false],
      ["Usuarios ilimitados", false],
      ["Soporte por WhatsApp", false]
    ]
  },
  {
    id: "completa",
    name: "Operación completa",
    for: "Para negocios con equipo y turnos",
    cta: "Cotiza este plan",
    recommended: true,
    items: [
      ["Todo lo de Esencial", false],
      ["Turnos y nómina", true],
      ["QR en mesa y domicilios", true],
      ["Fidelización y clientes", false],
      ["Instalación y capacitación", false]
    ]
  },
  {
    id: "medida",
    name: "A la medida",
    for: "Talleres, campo y operaciones especiales",
    cta: "Hablemos",
    items: [
      ["Módulos según tu operación", false],
      ["Producción, personal en campo, bots", true],
      ["Tu marca y tus colores", false],
      ["Ajustes a la medida", false]
    ]
  }
];

export function planWhatsapp(plan) {
  return waLink(`Hola Clonexa, quiero cotizar el plan ${plan.name}.`);
}

export const FAQ = [
  [
    "¿Tiene factura electrónica DIAN?",
    "Está en desarrollo y llega próximamente. Mientras tanto, Clonexa maneja toda tu operación y tus reportes."
  ],
  ["¿Necesito comprar equipos?", "No. Funciona en el celular, la tableta o el computador que ya tienes."],
  [
    "¿Cuánto tarda en estar listo?",
    "Te acompañamos en la instalación y la capacitación del equipo; depende de los módulos que elijas."
  ],
  ["¿Cobran por cada usuario?", "No. Tarifa plana: todo tu equipo usa Clonexa sin costo extra por usuario."],
  ["¿Mis datos están seguros?", "Cada negocio tiene su espacio y sus datos separados, en la nube."],
  ["¿Y si mi negocio es diferente?", "Clonexa se arma por módulos y se ajusta a tu forma de trabajar."]
];

export const SOCIAL = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/clonexaapp" },
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/1397005896827159" },
  { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@clonexxa" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/146691274" },
  { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@CLONEXASAAS" }
];

export const LEGAL_LINKS = [
  ["/privacidad", "Privacidad"],
  ["/terminos", "Términos"],
  ["/borrar-datos", "Borrar mis datos"]
];
