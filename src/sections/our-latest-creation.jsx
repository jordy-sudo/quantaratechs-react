import { useRef, useState } from "react";
import { X, Check } from "lucide-react";
import SectionTitle from "../components/section-title";
const solutions = [
  {
    id: "commerce",
    service: "software",
    category: "COMERCIO DIGITAL",
    title: "Una tienda que conecta con tu operación.",
    description:
      "Catálogo, pedidos y gestión comercial en una experiencia pensada para tus clientes.",
    problem:
      "Los pedidos llegan por distintos canales y requieren registrar la misma información varias veces.",
    solution:
      "Una tienda con catálogo administrable y un flujo de pedidos conectado a tus herramientas de gestión.",
    objectives: [
      "Centralizar pedidos y productos",
      "Facilitar la compra desde el móvil",
      "Dar seguimiento al estado de cada pedido",
    ],
  },
  {
    id: "crm",
    service: "software",
    category: "GESTIÓN COMERCIAL",
    title: "Cada oportunidad, en el lugar correcto.",
    description:
      "Un CRM a medida para organizar clientes, oportunidades y seguimiento comercial.",
    problem:
      "La información comercial está dispersa entre hojas de cálculo, correos y conversaciones.",
    solution:
      "Un espacio compartido para consultar clientes, registrar oportunidades y coordinar el próximo contacto.",
    objectives: [
      "Organizar el seguimiento comercial",
      "Compartir información entre el equipo",
      "Visualizar las etapas de cada oportunidad",
    ],
  },
  {
    id: "process",
    service: "automation",
    category: "OPERACIONES",
    title: "Aprobaciones que siguen su curso.",
    description:
      "Solicitudes, validaciones y notificaciones conectadas en un flujo de trabajo.",
    problem:
      "Las aprobaciones dependen de mensajes manuales y es difícil conocer el estado de una solicitud.",
    solution:
      "Un flujo digital que aplica reglas, asigna responsables y comunica los cambios de estado.",
    objectives: [
      "Consultar el estado de las solicitudes",
      "Reducir seguimientos manuales",
      "Mantener un registro del proceso",
    ],
  },
];
function SolutionPreview({ type }) {
  return (
    <div className={`solution-preview ${type}`} aria-hidden="true">
      <div className="mini-topbar">
        <span className="mini-logo" />
        <span />
        <span />
        <span />
      </div>
      {type === "commerce" ? (
        <div className="mini-shop">
          <div className="mini-shop-title">
            <i />
            <i />
          </div>
          <div className="mini-products">
            {["a", "b", "c"].map((key) => (
              <div key={key}>
                <div className={`mini-product ${key}`} />
                <i />
                <i />
              </div>
            ))}
          </div>
        </div>
      ) : type === "crm" ? (
        <div className="mini-kanban">
          {["Nuevos", "En contacto", "Propuesta"].map((label, index) => (
            <div key={label}>
              <span>{label}</span>
              {Array.from({ length: index === 1 ? 3 : 2 }, (_, i) => (
                <div className="mini-lead" key={i}>
                  <b />
                  <i />
                  <i />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="mini-process">
          <div className="mini-process-title">
            Solicitud de aprobación<span>En revisión</span>
          </div>
          <div className="mini-form">
            <i />
            <i />
            <i />
          </div>
          <div className="mini-approval">
            <span>
              <Check size={13} />
              Recibida
            </span>
            <span>
              <Check size={13} />
              Validada
            </span>
            <span>Por aprobar</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default function Solutions({ onChooseService }) {
  const dialog = useRef(null);
  const [selected, setSelected] = useState(solutions[0]);
  function open(solution) {
    setSelected(solution);
    dialog.current.showModal();
  }
  return (
    <section
      className="section solutions-section"
      id="projects"
      aria-labelledby="solutions-title"
    >
      <div className="container">
        <SectionTitle
          eyebrow="De la necesidad a la solución"
          title="Así puede verse el siguiente paso de tu negocio."
          description="Explora estos ejemplos de solución. El alcance de tu proyecto se define a partir de tus procesos y objetivos."
          id="solutions-title"
        />
        <div className="solutions-grid">
          {solutions.map((solution) => (
            <article className="solution-card" key={solution.id}>
              <SolutionPreview type={solution.id} />
              <div className="solution-copy">
                <p className="card-eyebrow">{solution.category}</p>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <div className="solution-bottom">
                  <span>Ejemplo ilustrativo</span>
                  <button
                    onClick={() => open(solution)}
                    className="text-link"
                    aria-label={`Explorar solución: ${solution.category.toLowerCase()}`}
                  >
                    Explorar solución
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="content-dialog"
        aria-labelledby="solution-dialog-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Cerrar solución"
          onClick={() => dialog.current.close()}
        >
          <X aria-hidden="true" />
        </button>
        <p className="eyebrow">Ejemplo de solución · {selected.category}</p>
        <h2 id="solution-dialog-title">{selected.title}</h2>
        <h3>El reto</h3>
        <p>{selected.problem}</p>
        <h3>La solución</h3>
        <p>{selected.solution}</p>
        <h3>Objetivos del proyecto</h3>
        <ul className="check-list">
          {selected.objectives.map((item) => (
            <li key={item}>
              <Check size={18} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <p className="dialog-note">
          Ejemplo ilustrativo. Cada proyecto se define según las necesidades y
          herramientas de tu empresa.
        </p>
        <a
          className="button button-primary"
          href="#contact"
          data-placement={`solution-${selected.id}`}
          onClick={() => {
            onChooseService(selected.service);
            dialog.current.close();
          }}
        >
          Quiero una solución similar
        </a>
      </dialog>
    </section>
  );
}
