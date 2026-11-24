import { WHATSAPP_URL } from "../../shared/site-contact";
import { track } from "../lib/analytics";

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-fab"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar asesoría por WhatsApp (se abre en una pestaña nueva)"
      onClick={() => track("whatsapp_click", { placement: "floating_button" })}
    >
      <span className="whatsapp-tooltip" aria-hidden="true">
        ¿Necesitas asesoría? Hablemos
      </span>
      <img
        src="/assets/whatsapp.svg"
        width="30"
        height="30"
        alt=""
        aria-hidden="true"
      />
    </a>
  );
}
