import { Code2, Workflow, Database, Layers3 } from "lucide-react";
import SectionTitle from "../components/section-title";
const services = [
  {
    id: "software",
    Icon: Code2,
    title: "Software a medida",
    text: "Aplicaciones web que se adaptan a la forma en que trabaja tu empresa, desde una herramienta interna hasta un portal para tus clientes.",
    tags: ["Aplicaciones web", "Portales y CRM"],
  },
  {
    id: "automation",
    Icon: Workflow,
    title: "Automatización y bots",
    text: "Transformamos tareas repetitivas en flujos automáticos: consultas, validaciones, reportes y seguimiento de procesos.",
    tags: ["Bots especializados", "Flujos de trabajo"],
  },
  {
    id: "integrations",
    Icon: Database,
    title: "Integraciones y datos",
    text: "Conectamos APIs, archivos y bases de datos para que la información fluya entre tus herramientas y deje de depender de copiar y pegar.",
    tags: ["APIs e integraciones", "Datos unificados"],
  },
  {
    id: "platform",
    Icon: Layers3,
    title: "Power Platform y Azure",
    text: "Creamos aplicaciones con Power Apps, flujos con Power Automate y soluciones en Azure alineadas a las necesidades de tu operación.",
    tags: ["Power Apps y Automate", "Microsoft Azure"],
  },
];
export default function Services({ onChooseService }) {
  return (
    <section
      className="section container"
      id="services"
      aria-labelledby="services-title"
    >
      <SectionTitle
        eyebrow="Lo que hacemos"
        title="Tecnología a la medida de tu siguiente paso."
        description="Unimos procesos, software y datos para resolver necesidades concretas de tu negocio."
        id="services-title"
      />
      <div className="services-grid">
        {services.map(({ id, Icon, title, text, tags }) => (
          <article className="service-card" key={id}>
            <div className="service-icon">
              <Icon size={25} aria-hidden="true" />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <div className="service-tags">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a
              href="#contact"
              className="text-link"
              data-placement={`service-${id}`}
              onClick={() => onChooseService(id)}
            >
              Consultar este servicio
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
