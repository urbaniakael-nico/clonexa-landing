// Datos de la landing "Tu negocio, en vivo": portada, "Asi funciona por dentro", simulacion en vivo,
// "Disena tu negocio en 3D", juguetes y reels. Todo es de empresas demo con datos de ejemplo.
// La simulacion corre solo en el navegador (sin backend).

const MEDIA = "/en-vivo";

// Video de la portada: escena 3D del bar animada. Dos tamanos (celular / computador) y su portada.
export const HERO_VIDEO = {
  small: `${MEDIA}/hero-bar-640.mp4`,
  large: `${MEDIA}/hero-bar-960.mp4`,
  poster: `${MEDIA}/hero-bar-poster.webp`,
  posterSm: `${MEDIA}/hero-bar-poster-640.webp`,
  alt: "Escena 3D en vivo de un bar de ejemplo: mesas con clientes, barra, pista de baile y pantalla de canciones pedidas"
};

// Carta en video real (la misma de /restaurantes, en tamano chico para los celulares de la pagina).
// Momentos de cada plato: ceviche 0-3 s, nachos 3-6,5 s, lomo 6,5-9 s, hamburguesa 9,5-12 s.
export const CARTA_MINI = `${MEDIA}/carta-mini.mp4`;
export const CARTA_MOMENTS = {
  ceviche: { start: 0, poster: `${MEDIA}/carta-ceviche.webp` },
  nachos: { start: 3.5, poster: `${MEDIA}/carta-nachos.webp` },
  lomo: { start: 7.8, poster: `${MEDIA}/carta-lomo.webp` },
  hamburguesa: { start: 9.5, poster: `${MEDIA}/carta-hamburguesa.webp` }
};

// Avisos flotantes de la portada: cada uno cambia solo cada pocos segundos.
export const HERO_ORDERS = [
  ["🍺", "Mesa 4 pidió 2 cervezas", "directo a la barra"],
  ["🍸", "Mesa 2 pidió 3 cocteles", "directo a la barra"],
  ["🍟", "Mesa 9 pidió una picada", "directo a cocina"],
  ["🍺", "Barra pidió 4 cervezas", "cuenta de barra"]
];
export const HERO_SONGS = [
  ["Mesa 7", "en cola #2"],
  ["Mesa 3", "en cola #3"],
  ["Mesa 11", "en cola #4"]
];
export const HERO_SALES_START = 2468000;

export function pesos(value) {
  return `$ ${Math.round(value).toLocaleString("es-CO").replace(/,/g, ".")}`;
}

// Franja de nichos de la portada: pagina propia o pestana de "Asi funciona por dentro".
export const NICHE_STRIP = [
  ["🍽️", "Restaurantes", "/restaurantes"],
  ["🍸", "Bares", "/bares"],
  ["🧵", "Talleres", "/talleres-y-fabricas"],
  ["🎧", "Call centers", "/call-centers"],
  ["📍", "Equipos en campo", "/personal-en-campo"],
  ["🛍️", "Tiendas", "/#negocio-tienda"],
  ["🛵", "Domicilios", "/restaurantes"]
];

// "Asi funciona por dentro": pantallas reales (public/capturas) por nicho.
export const INSIDE_TABS = [
  {
    id: "restaurante",
    icon: "🍽️",
    label: "Restaurante",
    business: "restaurante",
    page: "/restaurantes",
    shot: "rest-cocina",
    carta: "hamburguesa",
    toasts: [
      ["🛎️", "Mesa 7 · nuevo pedido"],
      ["🛵", "Domicilio #19 · a cocina"],
      ["✅", "Mesa 3 · pedido listo"]
    ],
    steps: [
      ["El cliente pide con el QR", "Desde su mesa, con la carta en video. Sin descargar nada."],
      ["Llega directo a cocina", "Cada comanda con su tiempo: nuevo, preparando, listo."],
      ["La caja cuadra sola", "Cuenta exacta por mesa y cierre del día con un toque."]
    ]
  },
  {
    id: "bar",
    icon: "🍸",
    label: "Bar",
    business: "bar",
    page: "/bares",
    shot: "bar-barra",
    carta: "nachos",
    toasts: [
      ["🍺", "Mesa 4 · 2 cervezas"],
      ["🎶", "Mesa 7 · pidió canción"],
      ["🍸", "Barra · 3 cocteles"]
    ],
    steps: [
      ["Piden desde la mesa", "Con el QR y la carta en video. Y hasta piden la canción."],
      ["La barra lo ve al instante", "Cada mesa con su total y los pedidos nuevos resaltados."],
      ["Cierras la noche cuadrada", "Cierre por día de negocio, aunque cierres a las 4 a. m."]
    ]
  },
  {
    id: "taller",
    icon: "🧵",
    label: "Taller",
    business: "taller o fábrica",
    page: "/talleres-y-fabricas",
    shot: "taller-produccion",
    toasts: [
      ["🧵", "REF 2041 · 36 de 50 prendas"],
      ["⏱️", "Operaria 3 · inició turno"],
      ["✅", "Lote REF 2038 · cerrado"]
    ],
    steps: [
      ["Cada quien entra con su PIN", "En la tableta del taller. Sin usuarios ni contraseñas."],
      ["Ves cada lote avanzar", "Prendas cerradas, avance y mano de obra por prenda."],
      ["La nómina sale sola", "Horas ordinarias y extra del periodo, listas para pagar."]
    ]
  },
  {
    id: "campo",
    icon: "📍",
    label: "Campo",
    business: "operación en campo",
    page: "/personal-en-campo",
    shot: "campo-inicio",
    toasts: [
      ["📍", "Técnico 4 · entrada con GPS"],
      ["📦", "Orden de material · aprobada"],
      ["⏸️", "Técnico 2 · en pausa"]
    ],
    steps: [
      ["Marcan entrada con GPS", "Desde el celular, con su ubicación y su zona de trabajo."],
      ["Ves quién está dónde", "Activos, en pausa o fuera de zona, en vivo."],
      ["El material queda con orden", "Pedido, entregado o devuelto, siempre con número."]
    ]
  },
  {
    id: "callcenter",
    icon: "🎧",
    label: "Call center",
    business: "call center",
    page: "/call-centers",
    shot: "ej-callcenter",
    toasts: [
      ["📞", "Agente 3 · en llamada"],
      ["🧾", "Cotización · aprobada"],
      ["✅", "Agente 5 · cerró venta"]
    ],
    steps: [
      ["Cada asesor en vivo", "En llamada, disponible o en pausa, con su tiempo."],
      ["La llamada se vuelve venta", "De la llamada a la cotización y al servicio programado."],
      ["Tesorería cobra a tiempo", "Lo listo para facturar, en una sola bandeja."]
    ]
  },
  {
    id: "tienda",
    icon: "🛍️",
    label: "Tienda",
    business: "tienda",
    page: null,
    shot: "ej-ventas",
    toasts: [
      ["🛍️", "Venta registrada · Tienda 2"],
      ["📦", "Bodega · pedido alistado"],
      ["🎯", "Meta del mes · 78 %"]
    ],
    steps: [
      ["Cada venta suma a la meta", "El vendedor la registra desde el celular."],
      ["Bodega abastece a tiempo", "Las tiendas piden y siguen el estado del pedido."],
      ["Gerencia lo ve todo junto", "Ventas, tiendas y metas en un solo tablero."]
    ]
  }
];

// Simulacion en vivo: escena 3D (public/en-vivo/escena-*.webp) con etiquetas en HTML que cambian solas.
// Cada etiqueta: [x %, y %, estados...]. "{t}" se reemplaza por un contador mm:ss.
// Las zonas son texto fijo. Las cifras se mueven solas y con el boton de accion.
export const SIM_TABS = [
  {
    id: "restaurante",
    icon: "🍽️",
    label: "Restaurante",
    page: "/restaurantes",
    scene: "restaurante",
    title: "Cada mesa, cada pedido, en tiempo real",
    points: ["📲 Mesas que piden con el QR", "👨‍🍳 Cocina con el tiempo de cada comanda", "🛵 Domicilios en la misma pantalla", "💵 Caja y ventas del día al instante"],
    action: "🛎️ Simular pedido",
    labels: [
      [33.06, 43.16, "Mesa 1 · QR activo", "Mesa 1 · pidió 2 platos", "Mesa 1 · comiendo"],
      [44.94, 44.6, "Mesa 2 · libre", "Mesa 2 · QR activo", "Mesa 2 · pidió 3 platos"],
      [57.17, 46.09, "Mesa 3 · QR activo", "Mesa 3 · pidió bebidas", "Mesa 3 · pidió la cuenta"],
      [28.88, 55.47, "Mesa 4 · QR activo", "Mesa 4 · pedido en camino", "Mesa 4 · comiendo"],
      [42.21, 57.31, "Mesa 5 · libre", "Mesa 5 · QR activo", "Mesa 5 · pidió 2 platos"],
      [56, 59.22, "Mesa 6 · libre", "Mesa 6 · QR activo", "Mesa 6 · pidió postre"],
      [23.91, 70.09, "Mesa 7 · QR activo", "Mesa 7 · pidió 4 platos", "Mesa 7 · comiendo"],
      [38.96, 72.46, "Mesa 8 · libre", "Mesa 8 · QR activo", "Mesa 8 · pidió 2 platos"],
      [23.14, 23.04, "Parrillero · Mesa 7 · 2 picadas", "Parrillero · Mesa 4 · lomo", "Parrillero · Domicilio #20"],
      [33.5, 24.05, "Cocina · Domicilio #19", "Cocina · Mesa 1 · listo", "Cocina · Mesa 5 · preparando"],
      [77.54, 33.26, "Caja · Cobrando Mesa 2", "Caja · Cobró Mesa 3", "Caja · Disponible"],
      [50.35, 43.17, "Mesero · Llevando pedido · Mesa 4", "Mesero · Tomando pedido · Mesa 8", "Mesero · Llevando pedido · Mesa 1"],
      [88.04, 64.46, "Domiciliario · Saliendo · #18", "Domiciliario · En camino · #18", "Domiciliario · Entregado · #18"]
    ],
    zones: [[28.48, 41.95, "COCINA Y PARRILLA"], [36.71, 93.34, "SALÓN"], [83, 88.69, "CAJA Y DOMICILIOS"]],
    kpis: [
      { id: "mesas", label: "Mesas activas", value: 5, color: "amber", min: 3, max: 8 },
      { id: "pedidos", label: "Pedidos hoy", value: 48, color: "green", grow: true },
      { id: "cocina", label: "En cocina", value: 3, color: "sky", min: 1, max: 7 },
      { id: "ventas", label: "Ventas hoy", value: 1920000, color: "pink", money: true, grow: true }
    ]
  },
  {
    id: "bar",
    icon: "🍸",
    label: "Bar",
    page: "/bares",
    scene: "bar",
    title: "La noche entera, mesa por mesa",
    points: ["🍺 Pedidos por QR directo a la barra", "🎶 Canciones pedidas desde la mesa", "🧾 Cuenta exacta de cada mesa", "🌙 Cierre por día de negocio"],
    action: "🍺 Pedir desde la mesa",
    labels: [
      [34.64, 35.89, "Mesa 1 · QR activo", "Mesa 1 · pidió 2 cervezas", "Mesa 1 · pidió canción"],
      [46.74, 37.02, "Mesa 2 · libre", "Mesa 2 · QR activo", "Mesa 2 · pidió 3 cocteles"],
      [31.07, 45.88, "Mesa 3 · libre", "Mesa 3 · QR activo", "Mesa 3 · pidió una picada"],
      [44.61, 47.3, "Mesa 4 · QR activo", "Mesa 4 · pidió 2 cervezas", "Mesa 4 · cuenta $ 86.000"],
      [58.58, 48.76, "Mesa 5 · QR activo", "Mesa 5 · pidió canción", "Mesa 5 · pidió 4 shots"],
      [26.51, 58.63, "Mesa 6 · libre", "Mesa 6 · QR activo", "Mesa 6 · pidió 2 cocteles"],
      [41.88, 60.48, "Mesa 7 · QR activo", "Mesa 7 · pidió canción", "Mesa 7 · pidió 1 botella"],
      [57.8, 62.39, "Mesa 8 · QR activo", "Mesa 8 · pidió 3 cervezas", "Mesa 8 · pidió la cuenta"],
      [74.31, 64.37, "Mesa 9 · libre", "Mesa 9 · QR activo", "Mesa 9 · pidió nachos"],
      [16.78, 26.77, "Barman · Preparando 3 productos · Mesa 7", "Barman · Preparando 2 cocteles · Mesa 2", "Barman · Entregó · Mesa 4"],
      [79.91, 23.1, "DJ · Sonando: Noche de salsa", "DJ · Sigue: canción de la Mesa 7", "DJ · Sonando: pedida por Mesa 5"],
      [50.7, 44.09, "Mesero · Llevando pedido · Mesa 7", "Mesero · Llevando pedido · Mesa 2", "Mesero · Cobrando · Mesa 8"]
    ],
    zones: [],
    kpis: [
      { id: "mesas", label: "Mesas abiertas", value: 5, color: "amber", min: 3, max: 9 },
      { id: "pedidos", label: "Pedidos", value: 37, color: "green", grow: true },
      { id: "canciones", label: "Canciones en cola", value: 3, color: "sky", min: 1, max: 6 },
      { id: "ventas", label: "Ventas hoy", value: 2468000, color: "pink", money: true, grow: true }
    ]
  },
  {
    id: "taller",
    icon: "🧵",
    label: "Taller",
    page: "/talleres-y-fabricas",
    scene: "taller",
    title: "Cada máquina, cada lote, en tiempo real",
    points: ["🔢 Cada persona entra con su PIN", "🧵 Avance de cada lote en vivo", "⏸️ Pausas y tiempo por referencia", "💰 Nómina con las horas reales"],
    action: "🧵 Cerrar lote",
    labels: [
      [18, 29.76, "Operario · Cosiendo · REF 2041", "Operario · 12 prendas · REF 2041", "Operario · Revisando · REF 2041"],
      [26.59, 30.68, "Operaria · Cosiendo · REF 2041", "Operaria · 9 prendas · REF 2041", "Operaria · En pausa · 5 min"],
      [44.34, 32.58, "Operaria · Cosiendo · REF 2041", "Operaria · 14 prendas · REF 2041", "Operaria · Cosiendo · REF 2041"],
      [22.36, 39.75, "Operaria · Cosiendo · REF 2041", "Operaria · 11 prendas · REF 2041", "Operaria · Cosiendo · REF 2041"],
      [72.89, 33.82, "Corte · Preparando lote", "Corte · Lote REF 2042 listo", "Corte · Preparando lote"],
      [10.76, 51.82, "Operaria · En pausa · 12 min", "Operaria · Volvió · REF 2041", "Operaria · Cosiendo · REF 2041"],
      [36.29, 33.65, "Máquina libre", "Operaria · Inició turno · PIN ✓", "Operaria · Cosiendo · REF 2041"],
      [53.78, 35.57, "Máquina libre", "Máquina libre", "Operario · Inició turno · PIN ✓"],
      [33.19, 42.77, "Máquina libre", "Operaria · Inició turno · PIN ✓", "Operaria · Cosiendo · REF 2041"]
    ],
    zones: [[32.61, 52.85, "PRODUCCIÓN"], [72.94, 51.21, "CORTE"], [73.71, 62.67, "LISTO PARA ENVÍO"], [6.99, 82.43, "CAFÉ · PAUSAS"]],
    kpis: [
      { id: "prendas", label: "Prendas hoy", value: 112, color: "green", grow: true },
      { id: "lotes", label: "Lotes en proceso", value: 4, color: "amber", min: 3, max: 6 },
      { id: "pausa", label: "En pausa", value: 1, color: "sky", min: 0, max: 3 },
      { id: "avance", label: "Avance REF 2041", value: 72, color: "pink", percent: true, grow: true, max: 98 }
    ]
  },
  {
    id: "campo",
    icon: "📍",
    label: "Campo",
    page: "/personal-en-campo",
    scene: "campo",
    title: "Tu equipo en la calle, como si lo vieras",
    points: ["📍 Entrada y salida con GPS", "🗺️ Quién está dentro o fuera de su zona", "⏸️ Pausas y tiempo de cada técnico", "📦 Material con orden y número"],
    action: "📍 Marcar entrada con GPS",
    labels: [
      [39.69, 35.57, "Norte · Técnico · Rack A3 · cableado", "Norte · Técnico · Rack A3 · listo ✓", "Norte · Técnico · Rack A4 · cableado"],
      [29.44, 34.65, "Norte · Técnico · Rack A6 · cableado", "Norte · Técnico · En pausa · 4 min", "Norte · Técnico · Rack A6 · cableado"],
      [16.71, 41.24, "Norte · Supervisor · Revisando avance", "Norte · Supervisor · Aprobó material", "Norte · Supervisor · Revisando avance"],
      [17.41, 48.96, "Norte · Almacén · Llevando material", "Norte · Almacén · Orden #214 entregada", "Norte · Almacén · Disponible"],
      [61.83, 37.54, "Sur · Técnico · Rack C1", "Sur · Técnico · Rack C1 · listo ✓", "Sur · Técnico · Rack C2"],
      [72.77, 38.52, "Sur · Técnico · Rack C4", "Sur · Técnico · Pidió material", "Sur · Técnico · Rack C4"],
      [83.61, 47.73, "Sur · Supervisor · Revisando avance", "Sur · Supervisor · 15 en turno", "Sur · Supervisor · Revisando avance"],
      [90.29, 25.78, "Sur · Técnico · ⚠ Fuera de perímetro", "Sur · Técnico · Volvió a su zona ✓", "Sur · Técnico · Rack D4"]
    ],
    zones: [[15.69, 84.43, "SEDE NORTE"], [77.55, 93.08, "SEDE SUR"]],
    kpis: [
      { id: "turno", label: "En turno", value: 30, color: "green", min: 26, max: 40 },
      { id: "fuera", label: "Fuera de zona", value: 1, color: "amber", min: 0, max: 2 },
      { id: "pausa", label: "En pausa", value: 2, color: "sky", min: 0, max: 4 },
      { id: "material", label: "Material entregado", value: 14, color: "pink", grow: true }
    ]
  },
  {
    id: "callcenter",
    icon: "🎧",
    label: "Call center",
    page: "/call-centers",
    scene: "call-center",
    title: "Cada llamada, cada agente, en tiempo real",
    points: ["📞 Cola de llamadas con tiempo de espera", "🎧 Estado de cada agente", "💰 Ventas y cotizaciones", "📊 Metas del día"],
    action: "📞 Simular llamada entrante",
    labels: [
      [27.27, 36.82, "Agente 1 · En llamada · {t}"],
      [19.8, 51.62, "Agente 2 · En llamada · {t}"],
      [42.66, 37.4, "Agente 3 · Disponible", "Agente 3 · En llamada · {t}"],
      [39.34, 52.57, "Agente 4 · En llamada · {t}", "Agente 4 · Cotizó ✓"],
      [58.39, 37.99, "Agente 5 · Cerró venta ✓", "Agente 5 · Disponible", "Agente 5 · En llamada · {t}"],
      [59.43, 53.54, "Agente 6 · En llamada · {t}"],
      [74.46, 38.6, "Agente 7 · Pausa · 3 min", "Agente 7 · Disponible", "Agente 7 · En llamada · {t}"],
      [80.08, 54.54, "Agente 8 · En llamada · {t}", "Agente 8 · Cerró venta ✓"],
      [89.48, 43.49, "Supervisor · 7 en llamada · meta 80 %", "Supervisor · meta 82 %", "Supervisor · meta 84 %"]
    ],
    zones: [[35.44, 95.37, "AGENTES"], [88.99, 74.17, "SUPERVISIÓN"]],
    kpis: [
      { id: "cola", label: "En cola", value: 4, color: "amber", min: 1, max: 7 },
      { id: "llamada", label: "En llamada", value: 7, color: "green", min: 5, max: 8 },
      { id: "espera", label: "Espera prom.", value: 38, color: "sky", seconds: true, min: 20, max: 70 },
      { id: "ventas", label: "Ventas hoy", value: 23, color: "pink", grow: true }
    ]
  }
];

export const SCENE_SRC = (scene) => ({
  src: `${MEDIA}/escena-${scene}.webp`,
  srcSm: `${MEDIA}/escena-${scene}-768.webp`
});

export function mmss(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function kpiText(kpi, value) {
  if (kpi.money) return pesos(value);
  if (kpi.percent) return `${Math.round(value)} %`;
  if (kpi.seconds) return `${Math.floor(value / 60)}:${String(Math.round(value) % 60).padStart(2, "0")}`;
  return String(Math.round(value));
}

// Paso automatico de una cifra: las que crecen solo suben; las demas se mueven +-1 dentro de su rango.
export function driftKpi(kpi, value, rand = Math.random) {
  if (kpi.money) return value + Math.round((18000 + rand() * 70000) / 1000) * 1000;
  if (kpi.grow) {
    const next = value + (rand() < 0.6 ? 1 : 0);
    return kpi.max ? Math.min(kpi.max, next) : next;
  }
  const step = kpi.seconds ? Math.round(rand() * 8 - 4) : rand() < 0.5 ? -1 : 1;
  return Math.max(kpi.min ?? 0, Math.min(kpi.max ?? Infinity, value + step));
}

// Efecto del boton de accion de cada nicho: cifras nuevas + aviso visible.
export function simAction(tabId, kpis, rand = Math.random) {
  const next = { ...kpis };
  let toast;
  if (tabId === "restaurante") {
    const mesa = 1 + Math.floor(rand() * 8);
    next.pedidos += 1;
    next.cocina = Math.min(9, next.cocina + 1);
    next.ventas += 30000 + Math.round(rand() * 60) * 1000;
    toast = `🛎️ Mesa ${mesa} · nuevo pedido · directo a cocina`;
  } else if (tabId === "bar") {
    const mesa = 1 + Math.floor(rand() * 9);
    next.pedidos += 1;
    next.ventas += 24000 + Math.round(rand() * 50) * 1000;
    toast = `🍺 Mesa ${mesa} pidió 2 cervezas · directo a la barra`;
  } else if (tabId === "taller") {
    next.prendas += 50;
    next.avance = 0;
    toast = "✅ Lote REF 2041 cerrado · 50 prendas · listo para envío";
  } else if (tabId === "campo") {
    next.turno += 1;
    toast = "📍 Técnico 31 marcó entrada con GPS · dentro de su zona ✓";
  } else if (tabId === "callcenter") {
    next.cola += 1;
    next.llamada = Math.min(8, next.llamada + 1);
    toast = "📞 Llamada entrante · asignada al Agente 3";
  }
  return { kpis: next, toast };
}

// "Disena tu negocio en 3D".
export const DESIGN_3D = {
  main: { src: `${MEDIA}/constructor-amueblar.webp`, srcSm: `${MEDIA}/constructor-amueblar-640.webp`, width: 1200, height: 720,
    alt: "Modo constructor de Clonexa: plano 3D de un restaurante de ejemplo con mesas, cocina y barra, y el catálogo de muebles para arrastrar" },
  templates: { src: `${MEDIA}/constructor-plantillas.webp`, srcSm: `${MEDIA}/constructor-plantillas-480.webp`, width: 800, height: 336,
    alt: "Plantillas del constructor: bar, restaurante, taller, call center, bodega u oficina para empezar en un toque" },
  characters: [
    { src: `${MEDIA}/personaje-humano.webp`, width: 320, height: 373, label: "🧍 Humano", alt: "Personaje humano con uniforme de bodega en el editor de personajes" },
    { src: `${MEDIA}/personaje-caricatura.webp`, width: 320, height: 349, label: "🙂 Caricatura", alt: "Personaje estilo caricatura en el editor de personajes" }
  ],
  points: [
    ["🏗️ Plantillas listas", "Bar, restaurante, taller, call center, bodega u oficina. O desde cero con tus medidas."],
    ["🎨 Con tu marca", "Un toque y el local queda con tus colores: letrero, luces, muebles y uniformes."],
    ["🔗 Conectado de verdad", "Cada mesa, máquina o escritorio se mueve con los datos reales de tu negocio."]
  ]
};

// "Miralo en 15 segundos": reels verticales que publicamos en redes.
export const REELS = [
  ["restaurante", "Restaurante"],
  ["bar", "Bar"],
  ["taller", "Taller"],
  ["callcenter", "Call center"],
  ["campo", "Campo"],
  ["domicilios", "Domicilios"]
].map(([id, label]) => ({ id, label, src: `${MEDIA}/reels/en-vivo-${id}.mp4`, poster: `${MEDIA}/reels/en-vivo-${id}.webp` }));
