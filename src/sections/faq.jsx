import { ChevronDown } from "lucide-react";
import SectionTitle from "../components/section-title";
const questions = [
  [
    "¿Cómo sé qué solución necesita mi empresa?",
    "No necesitas llegar con una especificación técnica. Cuéntanos qué proceso te quita tiempo, qué información necesitas conectar o qué dificultad quieres resolver. A partir de eso podemos plantear alternativas y definir el siguiente paso.",
  ],
  [
    "¿Pueden trabajar con las herramientas que ya utilizamos?",
    "Revisamos las APIs, los archivos y las posibilidades de integración de tus sistemas actuales. Con esa información definimos qué se puede conectar y qué cambios serían necesarios antes de proponer el alcance.",
  ],
  [
    "¿Cuánto cuesta y cuánto tiempo toma un proyecto?",
    "Depende del alcance, las integraciones y la complejidad del proceso. Después de revisar tu necesidad, preparamos una propuesta con entregables, tiempos y condiciones. Los cambios de alcance se acuerdan contigo.",
  ],
  [
    "¿Qué pasa después de poner la solución en producción?",
    "En la propuesta definimos la documentación, la capacitación y las condiciones de soporte o mantenimiento necesarias. Así tu equipo sabe cómo usar la solución y a quién recurrir cuando necesite ayuda.",
  ],
  [
    "¿Pueden ayudarme con Power Apps, Power Automate o Azure?",
    "Sí. Trabajamos con Power Platform y Azure para crear aplicaciones, automatizar flujos y desplegar soluciones. Revisamos los requisitos y las licencias disponibles para elegir una alternativa adecuada a tu empresa.",
  ],
];
export default function Faq() {
  return (
    <section
      className="section faq-section"
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="container faq-layout">
        <SectionTitle
          eyebrow="Antes de empezar"
          title="Hablemos con las cosas claras."
          description="Algunas respuestas para que puedas dar el siguiente paso con más información."
          id="faq-title"
        />
        <div className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <ChevronDown size={20} aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
