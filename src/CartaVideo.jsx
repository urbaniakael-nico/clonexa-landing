// Seccion "Tu carta en video con QR" (arriba de la pagina) para visitas de la prospeccion de
// restaurantes. Se decide en el navegador (useEffect): el HTML prerenderizado no cambia.
import React from "react";
import { sendEvent } from "./analytics.js";
import { CARTA_VIDEO, cartaWhatsapp } from "./cartaVideo.js";
import { ExternalLink } from "./layout.jsx";

export default function CartaVideoSection({ code }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const video = ref.current;
    if (video) video.play?.().catch(() => {});
  }, []);
  return (
    <section id="carta-video" className="wrap cartaVideo" aria-labelledby="carta-video-titulo">
      <div className="cartaCopy">
        <p className="kicker">CARTA EN VIDEO CON QR</p>
        <h2 id="carta-video-titulo">
          Tus platos <span className="grad">en video</span>, desde el QR de la mesa
        </h2>
        <p className="sub">
          Tus clientes escanean el QR de la mesa y ven tus platos en video, de frente y de perfil, y piden desde el
          celular. Sin descargar nada. Los clips salen de fotos y videos de tu propio celular.
        </p>
        <ul className="cartaPoints">
          <li>Un plato que se ve bien se vende solo.</li>
          <li>El pedido llega directo a la cocina o a la barra.</li>
          <li>Cambias la carta cuando quieras, sin reimprimir.</li>
        </ul>
        <div className="heroActions">
          <ExternalLink
            href={cartaWhatsapp(code)}
            className="btn"
            onClick={() => sendEvent("carta_video_whatsapp", { code: code || "" })}
          >
            Escríbenos por WhatsApp
          </ExternalLink>
          <a href="/restaurantes" className="btn btnGhost">
            Ver todo para restaurantes
          </a>
        </div>
      </div>
      <div className="cartaShow">
        <figure className="nexa">
          <div className="phone">
            <video
              ref={ref}
              className="nexaVideo"
              src={CARTA_VIDEO.src}
              poster={CARTA_VIDEO.poster}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              aria-label="Demo: carta en video de un restaurante de ejemplo"
            />
          </div>
          <figcaption>Demo con un restaurante de ejemplo (datos inventados).</figcaption>
        </figure>
        <div className="cartaQr">
          <img src={CARTA_VIDEO.qr} width="132" height="132" alt="Código QR para ver esta demo en tu celular" />
          <p>Escanéalo con tu celular y míralo como lo verían tus clientes.</p>
        </div>
      </div>
    </section>
  );
}
