export default function Footer({ contactEmail }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#hero" aria-label="QuantaraTechs, inicio">
            <img
              src="/assets/logo.png"
              alt="QuantaraTechs"
              width="139"
              height="40"
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
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} QuantaraTechs. Todos los derechos
          reservados.
        </p>
        <a href="#hero">Volver al inicio</a>
      </div>
    </footer>
  );
}
