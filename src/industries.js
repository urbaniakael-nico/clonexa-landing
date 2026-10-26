// Paginas por industria: solo las que tienen pantallas reales de Clonexa en tema claro.
// Textos en espanol sencillo y solo con funciones que existen.

export const INDUSTRY_PAGES = [
  {
    slug: "restaurantes",
    fit: "Sirve para restaurantes de comida a la mesa, comidas rápidas, cafeterías y negocios con domicilios, tengan una sola sede o varias. Si tu restaurante trabaja de una forma particular, ajustamos los módulos a tu proceso.",
    icon: "🍽️",
    name: "Restaurantes",
    business: "restaurante",
    title: "Restaurantes | Clonexa",
    description:
      "Sistema para restaurantes: pedidos por QR y desde el celular del mesero, pantalla de cocina, caja, cierre del día, inventario y reportes. Agenda tu demo.",
    h1: "Sistema para restaurantes: pedidos, cocina y caja conectados",
    intro: [
      "En un restaurante con movimiento, cada pedido pasa por muchas manos. El cliente le dice al mesero, el mesero lo anota en una comanda, la cocina interpreta la letra y al final la caja arma la cuenta de memoria. En cada paso se puede perder un plato, cobrar de menos o dejar a una mesa esperando. Al cierre, cuadrar la caja y saber qué se vendió toma un tiempo que nadie tiene.",
      "Clonexa conecta todo ese recorrido en un solo sistema. El cliente puede pedir desde el código QR de su mesa o el mesero toma el pedido en su celular. La cocina lo recibe al instante en una pantalla ordenada por columnas y con el tiempo de cada comanda, junto con los domicilios. La caja encuentra la cuenta de cada mesa ya armada y cobra en efectivo, transferencia o tarjeta. Al final del día, el cierre de caja muestra lo vendido y lo cobrado por cada método.",
      "No necesitas comprar equipos especiales: funciona en los celulares, tabletas y computadores que ya tienes. Lo configuramos con tu menú, tus mesas, tu marca y tus colores, y te acompañamos mientras tu equipo aprende a usarlo."
    ],
    steps: [
      { shot: "rest-qr", title: "El cliente pide desde el QR de la mesa", text: "Escanea el código con su celular, ve el menú por categorías con sus precios, arma su pedido y lo confirma. No tiene que descargar ninguna aplicación." },
      { shot: "rest-mesero", title: "El mesero toma el pedido en su celular", text: "Busca la categoría, toca el plato y lo envía a cocina. Se acaban las comandas de papel y la letra que nadie entiende." },
      { shot: "rest-cocina", title: "La cocina lo recibe al instante", text: "Cada comanda llega a la pantalla de cocina en la columna Pedido nuevo, pasa a Preparando y luego a Listo, con el tiempo que lleva cada una. Los domicilios llegan a la misma pantalla." },
      { shot: "rest-cuenta", title: "La caja cobra la cuenta exacta", text: "La cuenta de la mesa ya tiene todo lo que se pidió. Se cobra en efectivo, transferencia o tarjeta sin sumar a mano." },
      { shot: "rest-cierre", title: "Cierre del día sin descuadres", text: "Al terminar, el cierre de caja muestra el total vendido, los productos, los pedidos cobrados y cuánto entró por cada método de pago." }
    ],
    modules: [
      ["Menú QR por mesa", "el cliente ve el menú y pide desde su celular."],
      ["Panel del mesero", "pedidos desde el celular, directo a cocina."],
      ["Pantalla de cocina", "comandas en columnas y con tiempos."],
      ["Domicilios", "llegan a cocina junto con las mesas."],
      ["Caja y cierre del día", "cobros por método y cierre de caja."],
      ["Inventario", "productos y existencias del negocio."],
      ["Reportes", "qué se vende, cuánto y cómo pagan."],
      ["Turnos y nómina", "horas del equipo y pago del periodo."]
    ],
    faq: [
      ["¿Necesito comprar equipos especiales?", "No. Clonexa funciona en el navegador de los celulares, tabletas y computadores que ya tienes. Si quieres una pantalla para la cocina, sirve cualquier tableta o televisor con navegador."],
      ["¿Mis clientes deben descargar una aplicación para pedir por QR?", "No. Al escanear el código QR de la mesa se abre el menú en el navegador del celular y desde ahí arman y confirman su pedido."],
      ["¿Cobran por cada mesero o usuario?", "No. Es una tarifa plana: todo tu equipo usa Clonexa sin costo extra por usuario. El valor depende de los módulos que necesites; cotiza tu sistema por WhatsApp."],
      ["¿Tiene factura electrónica DIAN?", "La factura electrónica DIAN está en desarrollo y llega próximamente. Mientras tanto, Clonexa maneja tus pedidos, tu caja, tu inventario y tus reportes."],
      ["¿Cuánto tarda en quedar funcionando?", "Las soluciones listas para restaurantes quedan funcionando en días: configuramos tu menú, tus mesas y tu marca, y capacitamos a tu equipo."]
    ]
  },
  {
    slug: "bares",
    fit: "Sirve para bares, gastrobares, discotecas y negocios de noche que atienden por mesas y por barra, y que quieren pedidos más rápidos, cuentas claras y clientes que se quedan más tiempo. Si tu bar tiene una dinámica propia, como eventos o rondas especiales, lo ajustamos a la medida.",
    icon: "🍸",
    name: "Bares",
    business: "bar",
    title: "Bares | Clonexa",
    description:
      "Sistema para bares: pedidos por QR desde la mesa, pantalla de barra, juegos en vivo en el TV, cobros por mesa y cierre por día de negocio. Agenda tu demo.",
    h1: "Sistema para bares: pedidos por QR, barra y juegos en vivo",
    intro: [
      "En un bar lleno, el mesero no da abasto, los pedidos se gritan por encima de la música y la barra pierde la cuenta de qué mesa pidió qué. Al final de la noche toca reconstruir las cuentas, y como el cierre llega después de la medianoche, las ventas quedan partidas entre dos fechas y los números no cuadran.",
      "Clonexa ordena la noche. Cada mesa tiene su código QR: los clientes ven la carta, piden desde su celular, revisan la cuenta de la mesa y hasta piden la canción que quieren escuchar. La barra ve cada pedido en una pantalla, de pendiente a entregado, y la caja cobra la cuenta exacta de cada mesa. El cierre se hace por día de negocio, así que lo vendido en la madrugada queda en la misma noche.",
      "Para que la gente se quede y vuelva, Clonexa tiene juegos en vivo: los clientes juegan desde su celular y la tabla de posiciones sale en el televisor del bar, con el premio de la ronda. Todo funciona en los equipos que ya tienes, con tu marca y tus colores."
    ],
    steps: [
      { shot: "bar-qr", title: "Piden desde la mesa con el QR", text: "El cliente abre la carta en su celular, agrega cocteles o cervezas, ve la cuenta total de la mesa y puede pedir una canción." },
      { shot: "bar-barra", title: "La barra ve cada pedido en vivo", text: "Los pedidos llegan por mesa a la pantalla de barra y pasan por Pendiente, Alistando, Entregado y Cerrado. Nadie tiene que gritar el pedido." },
      { shot: "bar-juegos", title: "Juegos en vivo en el televisor", text: "Los clientes juegan desde el celular y la pantalla del bar muestra el juego, el tiempo, el premio y la tabla de jugadores." },
      { shot: "bar-cierre", title: "Cierre por día de negocio", text: "El cierre de caja reúne lo vendido en la noche aunque cierres de madrugada, con las ventas de barra y lo cobrado por método." }
    ],
    modules: [
      ["Carta QR por mesa", "pedidos, cuenta de la mesa y pedir canción."],
      ["Pantalla de barra", "pedidos por mesa con su estado."],
      ["Juegos en vivo", "juegos desde el celular con la tabla en el TV."],
      ["Fidelización", "premios para que tus clientes vuelvan."],
      ["Caja y cierre", "cobros por mesa y cierre por día de negocio."],
      ["Inventario", "existencias de licores y productos."],
      ["Reportes", "ventas de la noche y por método de pago."]
    ],
    faq: [
      ["¿Los clientes necesitan una aplicación para pedir o jugar?", "No. Con el QR de la mesa se abre la carta en el navegador del celular, y los juegos en vivo también se juegan desde el navegador."],
      ["¿Qué pasa con las ventas después de medianoche?", "Clonexa cierra por día de negocio: lo que vendes en la madrugada queda en la misma noche, no partido en dos fechas."],
      ["¿Qué necesito para mostrar los juegos en el televisor?", "Un televisor o pantalla con navegador, o un computador conectado a él. La pantalla de juegos se abre como una página web."],
      ["¿Cobran por usuario?", "No. Tarifa plana con usuarios ilimitados; el valor depende de los módulos. Cotiza tu sistema por WhatsApp."],
      ["¿Tiene factura electrónica DIAN?", "Está en desarrollo y llega próximamente."]
    ]
  },
  {
    slug: "talleres-y-fabricas",
    fit: "Sirve para talleres de confección, satélites que trabajan para marcas, fábricas pequeñas y cualquier operación que produzca por referencias o lotes y pague por tiempo trabajado. El dueño ve en un solo lugar cuánto produce el taller, cuánto le cuesta la mano de obra de cada prenda y cuánto debe pagar en la quincena, sin esperar a que alguien termine de sumar planillas. Si tu proceso tiene pasos propios, como control de calidad o entregas parciales al cliente, lo construimos a la medida sobre la misma base.",
    icon: "🧵",
    name: "Talleres y fábricas",
    business: "taller o fábrica",
    title: "Talleres y fábricas | Clonexa",
    description:
      "Sistema para talleres y fábricas: tablero del taller con PIN, tiempo por referencia, producción por lote y nómina por horas. Agenda tu demo de Clonexa.",
    h1: "Sistema para talleres y fábricas: tiempo, producción y nómina",
    intro: [
      "En un taller de confección o una pequeña fábrica, saber quién trabajó en qué y cuánto tiempo le tomó suele depender de planillas en papel. Al final de la quincena alguien pasa horas sumando turnos, horas extra y pausas para calcular la nómina, y nadie sabe con certeza cuánto cuesta producir cada prenda o cómo va cada lote.",
      "Clonexa pone una tableta en el taller. Cada persona entra con su PIN, escoge la referencia en la que va a trabajar y empieza su turno; si hace una pausa, el sistema la registra. Con eso, el tablero de producción muestra las prendas cerradas, el avance de cada lote, los días que lleva cada uno y la mano de obra por prenda, sin que nadie tenga que pasar datos a mano.",
      "Esas mismas horas pasan a la nómina: horas ordinarias, extras y el total a pagar del periodo, con el detalle de cada turno por persona. Y desde lo producido se pueden sacar cotizaciones y cuentas de cobro para tus clientes."
    ],
    steps: [
      { shot: "taller-tablero", title: "El tablero del taller", text: "En la tableta se ve quién está trabajando, quién está en pausa y quién no ha empezado, con el tiempo de cada uno." },
      { shot: "taller-pin", title: "Cada quien entra con su PIN", text: "La persona escribe su PIN de cuatro dígitos, escoge la referencia en la que va a trabajar y empieza su turno." },
      { shot: "taller-produccion", title: "Producción por lote", text: "Prendas cerradas en la semana o el mes, lotes en proceso con su avance, días por lote y mano de obra por prenda." },
      { shot: "taller-nomina", title: "La nómina sale de las horas reales", text: "Horas ordinarias y extra, descuentos y total a pagar del periodo, con el detalle de los turnos de cada persona." }
    ],
    modules: [
      ["Tablero del taller", "tableta con PIN para cada persona."],
      ["Referencias", "en qué trabaja cada quien y cuánto tiempo."],
      ["Producción", "prendas cerradas, lotes y mano de obra por prenda."],
      ["Nómina", "periodos, horas ordinarias y extra, total a pagar."],
      ["Cotizaciones y cuentas de cobro", "documentos en PDF desde lo producido."],
      ["Personal", "colaboradores, roles y turnos."]
    ],
    faq: [
      ["¿Qué necesito para el tablero del taller?", "Una tableta o computador con navegador en el taller. Cada persona entra con su PIN; no necesita usuario ni contraseña."],
      ["¿La nómina se calcula sola?", "Clonexa toma las horas registradas en los turnos, separa ordinarias y extra y calcula el total del periodo. Tú revisas y cierras el periodo."],
      ["¿Sirve para fábricas que no son de confección?", "Sí, si trabajas por referencias o lotes y necesitas medir tiempo y producción. Revisamos tu proceso y lo ajustamos a la medida."],
      ["¿Cobran por cada operario?", "No. Tarifa plana con usuarios ilimitados; cotiza tu sistema por WhatsApp."],
      ["¿Tiene factura electrónica DIAN?", "Está en desarrollo y llega próximamente."]
    ]
  },
  {
    slug: "call-centers",
    fit: "Sirve para empresas que atienden y venden por teléfono servicios que luego hay que programar y cobrar: transporte especial, turismo, eventos y servicios empresariales, entre otros. Lo implementamos por etapas: primero la supervisión de asesores y el registro de llamadas, luego las cotizaciones y los tickets, y después la tesorería y los contratos. Así tu equipo empieza a usarlo rápido y cada etapa se prueba con la operación real antes de pasar a la siguiente.",
    icon: "🎧",
    name: "Call centers",
    business: "call center",
    title: "Call centers | Clonexa",
    description:
      "Sistema para call centers que venden servicios: asesores en vivo, llamadas y resultados, cotizaciones y tickets, contratos y tesorería. Agenda tu demo.",
    h1: "Sistema para call centers: asesores, cotizaciones y tesorería conectados",
    intro: [
      "Cuando un call center vende servicios, la información suele quedar repartida: las llamadas en una hoja, las cotizaciones en documentos sueltos, los servicios aprobados en otro lado y los pagos en la contabilidad. El supervisor no sabe en tiempo real qué está haciendo cada asesor, y tesorería se entera tarde de lo que hay que cobrar.",
      "Clonexa reúne la operación en un solo sistema. El supervisor ve a cada asesor con su estado (en llamada, disponible o en pausa), cuántas llamadas lleva, cuántas cotizaciones y tickets salieron de ellas y cuánto duran. Cuando un cliente pide precio, la cotización se genera en el sistema; si la aprueba, se convierte en ticket u orden de servicio, se programa y se sigue hasta que se cumple.",
      "Tesorería revisa los tickets antes de facturar, ve lo que está listo para cobrar, el crédito disponible de cada contrato y las facturas por vencer. Así ventas, operación y dinero hablan el mismo idioma. Es una solución que construimos a la medida de cada operación, sobre la base de Clonexa."
    ],
    steps: [
      { shot: "ej-callcenter", title: "El supervisor ve a cada asesor", text: "Llamadas, tickets y cotizaciones del periodo, duración promedio y la lista de asesores con su estado y sus resultados." },
      { shot: "ej-tickets", title: "La cotización se vuelve servicio", text: "Las cotizaciones y los tickets se imprimen con original y copia, se conectan a un contrato o aval y cambian de estado: aprobada, programada, en ruta." },
      { shot: "ej-tesoreria", title: "Tesorería revisa y cobra", text: "Tickets por revisar, listos para facturar, crédito disponible de los contratos y facturas por cobrar en una sola bandeja." }
    ],
    modules: [
      ["Supervisión de asesores", "estado en vivo, llamadas y resultados."],
      ["Registro de llamadas", "resultado, duración y campaña de cada llamada."],
      ["Cotizaciones y tickets", "documentos imprimibles con original y copia."],
      ["Contratos y avales", "saldos de cada cliente con contrato."],
      ["Tesorería y pagos", "revisión, facturación y cartera por cobrar."],
      ["Personal y turnos", "jornada y pausas de cada asesor."]
    ],
    faq: [
      ["¿Para qué tipo de call center sirve?", "Para equipos que venden o agendan servicios por teléfono y necesitan pasar de la llamada a la cotización, al servicio y al cobro. Lo ajustamos a tu proceso."],
      ["¿El supervisor puede ver a los asesores en vivo?", "Sí. Ve el estado de cada asesor (en llamada, disponible o en pausa), sus llamadas, cotizaciones, tickets y la duración de sus llamadas."],
      ["¿Se pueden imprimir las cotizaciones y los tickets?", "Sí. Se generan en PDF para imprimir con original y copia, y pueden quedar conectados a un contrato o aval del cliente."],
      ["¿Cobran por asesor?", "No. Tarifa plana con usuarios ilimitados. Al ser a la medida, se cotiza por etapas según tu operación."],
      ["¿Tiene factura electrónica DIAN?", "Está en desarrollo y llega próximamente."]
    ]
  },
  {
    slug: "personal-en-campo",
    fit: "Sirve para empresas de montajes, instalaciones, obras, mantenimiento, redes, seguridad y cualquier operación con técnicos o cuadrillas que trabajan fuera de la oficina. El supervisor deja de llamar uno por uno para saber dónde está cada persona, bodega sabe qué material salió y para qué obra, y administración recibe las horas trabajadas sin tener que reconstruirlas desde los chats. Lo configuramos con tus zonas de trabajo, tus materiales y tu equipo, y lo vamos ampliando por etapas según lo que necesite tu operación.",
    icon: "🦺",
    name: "Personal en campo",
    business: "operación en campo",
    title: "Personal en campo | Clonexa",
    description:
      "Sistema para equipos en campo: inicio de turno con ubicación, pausas, zonas de trabajo y solicitud de material con órdenes. Agenda tu demo de Clonexa.",
    h1: "Sistema para personal en campo: turnos, ubicación y materiales",
    intro: [
      "Cuando tu equipo trabaja fuera de la oficina, en obras, montajes o instalaciones, es difícil saber a qué hora empezó cada persona, si está en el lugar correcto y qué material se llevó. Las horas se reportan por chat, las pausas no se registran y el material sale de la bodega sin una orden clara, así que al final nadie sabe dónde quedó.",
      "Con Clonexa, cada técnico inicia su turno desde el celular y el sistema registra la hora y si está dentro de su zona de trabajo. El supervisor ve en vivo quién está activo, quién está en pausa y cuánto tiempo lleva cada uno, sin llamar a nadie.",
      "Cuando el equipo necesita material, lo pide en el sistema y queda una orden con número. Bodega la aprueba y la entrega, y al entregarla se descuenta del inventario; si el material vuelve, la devolución se registra contra esa misma orden. Las horas trabajadas quedan listas para la nómina."
    ],
    steps: [
      { shot: "campo-inicio", title: "Inicio de operación con ubicación", text: "El supervisor ve a los colaboradores activos y en pausa, el tiempo de cada uno y si están dentro de su zona de trabajo. Si alguien está en pausa se ve cuánto lleva, y al cerrar el turno las horas quedan registradas para la nómina." },
      { shot: "campo-materiales", title: "Solicitud de material con orden", text: "Cada pedido de material queda como una orden con número, quién lo pidió, la cantidad, el destino y su estado: pendiente, aprobada, entregada o devuelta." }
    ],
    modules: [
      ["CRM Campo", "turnos, pausas y tiempo de cada colaborador en vivo."],
      ["GPS por zonas", "si el colaborador está dentro de su zona de trabajo."],
      ["Materiales", "órdenes de material, entregas y devoluciones."],
      ["Inventario", "existencias que se descuentan al entregar."],
      ["Turnos y nómina", "horas trabajadas y pago del periodo."],
      ["Bot de Telegram", "el equipo inicia y cierra su turno desde Telegram."]
    ],
    faq: [
      ["¿Los técnicos necesitan instalar una aplicación?", "No necesariamente. Pueden usar el navegador del celular o el bot de Telegram para iniciar y cerrar su turno."],
      ["¿Cómo se sabe si están en el lugar correcto?", "Con el módulo de GPS por zonas: el sistema indica si el colaborador está dentro o fuera de la zona de trabajo que le corresponde. Las zonas se configuran para cada obra o sede, y el supervisor ve en vivo quién está dentro y quién fuera."],
      ["¿Cómo se controla el material?", "Cada solicitud queda como una orden con número. Al entregarla se descuenta del inventario y la devolución se registra contra esa orden."],
      ["¿Cobran por cada técnico?", "No. Tarifa plana con usuarios ilimitados; cotiza tu sistema por WhatsApp."],
      ["¿Tiene factura electrónica DIAN?", "Está en desarrollo y llega próximamente."]
    ]
  }
];

// Industrias del inicio que aun no tienen pagina (sin pantallas reales suficientes en claro).
export const INDUSTRIES_WITHOUT_PAGE = ["Tiendas y cadenas", "Distribuidoras", "Tiendas en línea"];

export function industryGreeting(page) {
  return `Hola, quiero una demo de Clonexa para mi ${page.business}.`;
}
