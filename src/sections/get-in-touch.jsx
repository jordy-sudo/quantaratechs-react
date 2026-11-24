import { useRef, useState } from "react";
import {
  CheckCircle2,
  Mail,
  LoaderCircle,
  MessageSquare,
  X,
} from "lucide-react";
import { SERVICES, LIMITS } from "../../shared/contact";
import { track } from "../lib/analytics";
import { WHATSAPP_URL, WHATSAPP_DISPLAY } from "../../shared/site-contact";

export default function Contact({ service, onServiceChange, contactEmail }) {
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [reference, setReference] = useState("");
  const privacy = useRef(null);
  const sending = useRef(false);
  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setFeedback("");
    setReference("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (result?.requestId) setReference(result.requestId);
      if (!response.ok)
        throw new Error(
          result?.message ||
            "No pudimos enviar tu mensaje. Inténtalo de nuevo o utiliza el correo de contacto.",
        );
      if (!result?.requestId)
        throw new Error(
          "No pudimos confirmar el envío. Escríbenos por correo para comprobarlo antes de volver a enviar.",
        );
      setStatus("success");
      setFeedback(result.message);
      setReference(result.requestId);
      track("generate_lead", { service: data.service, method: "contact_form" });
      form.reset();
      onServiceChange("not-sure");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error.name === "AbortError"
          ? "La confirmación está tardando más de lo esperado. Puedes escribirnos por correo para comprobar tu consulta antes de volver a enviarla."
          : error.message,
      );
      track("contact_error", { service: data.service });
    } finally {
      clearTimeout(timeout);
      sending.current = false;
    }
  }
  return (
    <section
      className="section container contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-copy">
        <p className="eyebrow">Construyamos el siguiente paso</p>
        <h2 id="contact-title">Tu proyecto empieza con una conversación.</h2>
        <p>
          Cuéntanos qué quieres mejorar. Revisaremos tu consulta y te
          responderemos al correo que nos indiques para definir cómo avanzar.
        </p>
        <div className="next-steps">
          <MessageSquare size={23} aria-hidden="true" />
          <div>
            <h3>¿Qué sucede después?</h3>
            <ol>
              <li>Revisamos tu necesidad y el contexto de tu empresa.</li>
              <li>Te contactamos para aclarar los detalles.</li>
              <li>Definimos el alcance y una propuesta de trabajo.</li>
            </ol>
          </div>
        </div>
        {contactEmail && (
          <div className="direct-contact">
            <span>¿Prefieres escribirnos directamente?</span>
            <a href={`mailto:${contactEmail}`}>
              <Mail size={19} aria-hidden="true" />
              {contactEmail}
            </a>
          </div>
        )}
        <div className="direct-contact contact-whatsapp">
          <span>También podemos conversar por WhatsApp</span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("whatsapp_click", { placement: "contact_section" })
            }
          >
            <img
              src="/assets/whatsapp.svg"
              width="19"
              height="19"
              alt=""
              aria-hidden="true"
            />
            {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>
      <form
        className="contact-form"
        onSubmit={submit}
        aria-label="Cuéntanos tu proyecto"
        aria-busy={status === "sending"}
      >
        <div className="form-intro">
          <h3>Cuéntanos tu proyecto</h3>
          <p>Nombre, correo y mensaje son obligatorios.</p>
        </div>
        <fieldset disabled={status === "sending"}>
          <legend className="sr-only">Datos de contacto y proyecto</legend>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="contact-name">
                Nombre <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder="Tu nombre"
                required
                minLength={2}
                maxLength={LIMITS.name}
              />
            </div>
            <div className="field">
              <label htmlFor="contact-email">
                Correo electrónico <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@empresa.com"
                required
                maxLength={LIMITS.email}
              />
            </div>
            <div className="field">
              <label htmlFor="contact-company">
                Empresa <span className="optional">(opcional)</span>
              </label>
              <input
                id="contact-company"
                name="company"
                autoComplete="organization"
                placeholder="Nombre de tu empresa"
                maxLength={LIMITS.company}
              />
            </div>
            <div className="field">
              <label htmlFor="contact-service">¿Qué necesitas?</label>
              <div className="select-wrap">
                <select
                  id="contact-service"
                  name="service"
                  value={service}
                  onChange={(event) => onServiceChange(event.target.value)}
                >
                  {SERVICES.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field field-full">
              <label htmlFor="contact-message">
                Tu proyecto <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="¿Qué proceso te gustaría automatizar o qué solución necesitas construir?"
                required
                minLength={LIMITS.messageMin}
                maxLength={LIMITS.message}
                aria-describedby="message-help"
              />
              <p id="message-help" className="field-hint">
                Incluye al menos 20 caracteres para ayudarnos a entender tu
                idea.
              </p>
            </div>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="contact-website">Deja este campo vacío</label>
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          </div>
        </fieldset>
        <p className="privacy-note">
          Usaremos tus datos para responder a esta consulta.{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => privacy.current.showModal()}
          >
            Información de privacidad
          </button>
        </p>
        <div role="status" aria-live="polite" aria-atomic="true">
          {feedback && (
            <div className={`form-feedback ${status}`}>
              {status === "success" && (
                <CheckCircle2 size={20} aria-hidden="true" />
              )}
              <div>
                <p>{feedback}</p>
                {reference && (
                  <p className="request-reference">Referencia: {reference}</p>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          className="button button-primary submit-button"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" && (
            <LoaderCircle className="spinner" size={18} aria-hidden="true" />
          )}
          {status === "sending" ? "Enviando tu mensaje…" : "Enviar mi consulta"}
        </button>
      </form>
      <dialog
        className="content-dialog"
        ref={privacy}
        aria-labelledby="privacy-title"
        onClick={(event) => {
          if (event.target === privacy.current) privacy.current.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Cerrar información de privacidad"
          onClick={() => privacy.current.close()}
        >
          <X aria-hidden="true" />
        </button>
        <p className="eyebrow">Tu consulta</p>
        <h2 id="privacy-title">Cómo usamos tus datos</h2>
        <p>
          Quantara Techs recibe el nombre, correo, mensaje y los datos
          opcionales que incluyas para analizar tu solicitud y responderte.
        </p>
        <p>
          La consulta se envía al buzón de contacto de la empresa mediante su
          proveedor de correo. Este formulario no te suscribe a publicidad.
        </p>
        <p>
          Evita incluir contraseñas o información confidencial en el mensaje.
          Puedes solicitar información sobre tu consulta o pedir la eliminación
          de tus datos a través del correo de contacto.
        </p>
        {contactEmail && (
          <a className="text-link" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        )}
      </dialog>
    </section>
  );
}
