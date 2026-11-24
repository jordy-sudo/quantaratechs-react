import { Check, Code2, Workflow, Database } from "lucide-react";
import OperationsPreview from "../components/operations-preview";
export default function Hero() {
  return (
    <>
      <section
        className="hero section container"
        id="hero"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy">
          <p className="eyebrow">
            Software con propósito. Tecnología con impacto.
          </p>
          <h1 id="hero-title">
            Automatiza tu operación.
            <br />
            <span>Conecta tu negocio.</span>
          </h1>
          <p className="hero-description">
            Desarrollamos software a medida, bots e integraciones para reducir
            tareas manuales y centralizar la información de tu empresa.
          </p>
          <div className="hero-actions">
            <a
              href="#contact"
              className="button button-primary"
              data-placement="hero"
            >
              Cuéntanos tu proyecto
            </a>
            <a href="#projects" className="button button-secondary">
              Explorar soluciones
            </a>
          </div>
          <p className="hero-note">
            <Check size={17} aria-hidden="true" />
            Diseñamos la solución a partir de tus procesos.
          </p>
        </div>
        <OperationsPreview />
      </section>
      <div className="capabilities-strip">
        <div className="container capabilities-inner">
          <p>De la idea a una operación conectada.</p>
          <span>
            <Code2 aria-hidden="true" size={19} />
            Software a medida
          </span>
          <span>
            <Workflow aria-hidden="true" size={19} />
            Procesos automáticos
          </span>
          <span>
            <Database aria-hidden="true" size={19} />
            Datos centralizados
          </span>
        </div>
      </div>
    </>
  );
}
