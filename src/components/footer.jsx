import { WHATSAPP_URL, WHATSAPP_DISPLAY } from "../../shared/site-contact";
import { track } from "../lib/analytics";

export default function Footer({ contactEmail }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#hero" aria-label="Quantara Techs, inicio">
            <img
              src="/assets/logo-wordmark.svg"
              alt="Quantara Techs"
              width="150"
              height="48"
              loading="lazy"
            />
          </a>
          <p>
            Software, automatización e integraciones para que tu operación
            avance contigo.
          </p>
        </div>
        <div>
          <h2>Explora</h2>
          <a href="#services">Servicios</a>
          <a href="#projects">Soluciones</a>
          <a href="#process">Cómo trabajamos</a>
          <a href="#faq">Preguntas frecuentes</a>
        </div>
        <div>
          <h2>Hablemos de tu proyecto</h2>
          <p>El primer paso es entender lo que necesitas.</p>
          <a className="text-link" href="#contact" data-placement="footer">
            Cuéntanos tu idea
          </a>
          {contactEmail && (
            <a className="footer-email" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          )}
          <a
            className="footer-whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { placement: "footer" })}
          >
            WhatsApp: {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} Quantara Techs. Todos los derechos
          reservados.
        </p>
        <a href="#hero">Volver al inicio</a>
      </div>
    </footer>
  );
}
