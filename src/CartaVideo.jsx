// Seccion "Tu carta en video con QR" (arriba de /restaurantes en cada idioma, y en las demas paginas
// para visitas de la prospeccion de restaurantes). Textos en t.carta.
import React from "react";
import { sendEvent } from "./analytics.js";
import { CARTA_DEMO_URL, CARTA_VIDEO, cartaWhatsapp } from "./cartaVideo.js";
import { useI18n } from "./i18n/index.jsx";
import { ExternalLink } from "./layout.jsx";

export default function CartaVideoSection({ code }) {
  const { t, href } = useI18n();
  const c = t.carta;
  const ref = React.useRef(null);
  React.useEffect(() => {
    const video = ref.current;
    if (video) video.play?.().catch(() => {});
  }, []);
  return (
    <section id="carta-video" className="wrap cartaVideo" aria-labelledby="carta-video-titulo">
      <div className="cartaCopy">
        <p className="kicker">{c.kicker}</p>
        <h2 id="carta-video-titulo">
          {c.title1}
          <span className="nowrap">
            <span className="grad">{c.titleGrad}</span>
            {c.titleComma}
          </span>
          {c.title2}
        </h2>
        <p className="sub">{c.sub}</p>
        <ul className="cartaPoints">
          {c.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="heroActions">
          <ExternalLink href={cartaWhatsapp(t, code)} className="btn" onClick={() => sendEvent("carta_video_whatsapp", { code: code || "" })}>
            {c.wa}
          </ExternalLink>
          <a href={href("/restaurantes")} className="btn btnGhost">
            {c.seeAll}
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
              aria-label={c.videoLabel}
            />
          </div>
          <figcaption>{c.caption}</figcaption>
        </figure>
        <div className="cartaQr">
          <img src={CARTA_VIDEO.qr} width="132" height="132" alt={c.qrAlt} />
          <p>
            <span className="qrDesk">{c.qrText}</span>
            <a href={CARTA_DEMO_URL} target="_blank" rel="noopener noreferrer">
              <span className="qrDesk">{c.openHere}</span>
              <span className="qrMobile">{c.openMobile}</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
