import {
  MessageSquare,
  PanelsTopLeft,
  Code2,
  Settings2,
  Check,
} from "lucide-react";
import SectionTitle from "../components/section-title";
const steps = [
  {
    Icon: MessageSquare,
    title: "Entendemos tu operación",
    text: "Conversamos sobre tu proceso actual, las herramientas que usas y el problema que necesitas resolver.",
  },
  {
    Icon: PanelsTopLeft,
    title: "Definimos el camino",
    text: "Acordamos alcance, entregables y prioridades antes de empezar. Sabes qué vamos a construir y por qué.",
  },
  {
    Icon: Code2,
    title: "Construimos contigo",
    text: "Desarrollamos y validamos la solución con tu equipo para que responda a la forma real de trabajar.",
  },
  {
    Icon: Settings2,
    title: "Ponemos todo en marcha",
    text: "Preparamos la puesta en producción y definimos la documentación, capacitación y soporte que requiera el proyecto.",
  },
];
export default function Process() {
  return (
    <section
      className="section container"
      id="process"
      aria-labelledby="process-title"
    >
      <div className="process-intro">
        <SectionTitle
          eyebrow="Cómo trabajamos"
          title="Claridad en cada etapa. Cercanía en todo el proceso."
          description="La tecnología funciona mejor cuando entendemos a las personas que van a usarla."
          id="process-title"
        />
        <a
          className="button button-secondary"
          href="#contact"
          data-placement="process"
        >
          Conversemos sobre tu idea
        </a>
      </div>
      <ol className="process-grid">
        {steps.map(({ Icon, title, text }) => (
          <li key={title}>
            <span className="process-icon">
              <Icon size={23} aria-hidden="true" />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      <div className="principles">
        <p>Una solución bien construida también debe ser fácil de entender.</p>
        <div>
          <span>
            <Check size={17} aria-hidden="true" />
            Alcance acordado
          </span>
          <span>
            <Check size={17} aria-hidden="true" />
            Avances visibles
          </span>
          <span>
            <Check size={17} aria-hidden="true" />
            Documentación útil
          </span>
        </div>
      </div>
    </section>
  );
}
