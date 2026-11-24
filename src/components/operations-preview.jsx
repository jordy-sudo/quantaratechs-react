import { useEffect, useRef, useState } from "react";
import {
  Check,
  FileSpreadsheet,
  Workflow,
  Database,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
const workflows = {
  sales: {
    label: "Ventas",
    source: "Nuevo pedido",
    action: "Validar datos",
    target: "Actualizar CRM",
    tasks: [
      "Recibir la información del pedido",
      "Verificar los datos del cliente",
      "Sincronizar el registro comercial",
    ],
  },
  operations: {
    label: "Operaciones",
    source: "Solicitud",
    action: "Aprobar flujo",
    target: "Notificar equipo",
    tasks: [
      "Centralizar la solicitud",
      "Aplicar las reglas de aprobación",
      "Notificar al equipo responsable",
    ],
  },
  data: {
    label: "Datos",
    source: "Archivo Excel",
    action: "Ordenar datos",
    target: "Reporte unificado",
    tasks: [
      "Leer la información del archivo",
      "Unificar los formatos de datos",
      "Preparar el reporte de seguimiento",
    ],
  },
};
export default function OperationsPreview() {
  const [active, setActive] = useState("sales");
  const [status, setStatus] = useState("idle");
  const timer = useRef(null);
  const flow = workflows[active];
  useEffect(() => () => clearTimeout(timer.current), []);
  function run() {
    if (status === "running") return;
    setStatus("running");
    timer.current = setTimeout(() => setStatus("done"), 1300);
  }
  function select(key) {
    clearTimeout(timer.current);
    setActive(key);
    setStatus("idle");
  }
  return (
    <div
      className="operations-scene"
      aria-label="Demostración interactiva de automatización"
    >
      <div className="scene-orbit" aria-hidden="true" />
      <div className="operations-window">
        <div className="window-bar">
          <span className="window-brand">
            <span className="q-mark" aria-hidden="true">
              Q
            </span>
            Tu operación, conectada
          </span>
          <span className="demo-tag">Demo interactiva</span>
        </div>
        <div className="operations-content">
          <div className="preview-heading">
            <div>
              <p className="preview-kicker">UN SOLO FLUJO</p>
              <h2>Menos pasos. Más control.</h2>
            </div>
            <ShieldCheck aria-hidden="true" className="preview-shield" />
          </div>
          <div
            className="preview-tabs"
            role="group"
            aria-label="Elegir proceso de ejemplo"
          >
            {Object.entries(workflows).map(([key, item]) => (
              <button
                key={key}
                aria-pressed={active === key}
                onClick={() => select(key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className={`workflow-pipeline ${status}`} aria-hidden="true">
            {[
              { Icon: FileSpreadsheet, title: flow.source },
              { Icon: Workflow, title: flow.action },
              { Icon: Database, title: flow.target },
            ].map(({ Icon, title }, index) => (
              <div className="pipeline-step" key={index}>
                <span className="pipeline-icon">
                  <Icon size={23} />
                </span>
                <span>{title}</span>
              </div>
            ))}
          </div>
          <div className="activity-card">
            <div className="activity-title">
              <span>Actividad del proceso</span>
              <span className={`status-tag ${status}`}>
                {status === "done"
                  ? "Completado"
                  : status === "running"
                    ? "Procesando"
                    : "Listo para probar"}
              </span>
            </div>
            <ul>
              {flow.tasks.map((task, index) => (
                <li key={task}>
                  <span
                    className={`task-check ${status === "done" ? "checked" : ""}`}
                  >
                    {status === "done" ? <Check size={13} /> : index + 1}
                  </span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
          <div className="preview-footer">
            <p role="status">
              {status === "done"
                ? "Simulación completada con datos de ejemplo."
                : "Explora el flujo con datos de ejemplo."}
            </p>
            <button
              onClick={run}
              disabled={status === "running"}
              aria-label={
                status === "done"
                  ? "Repetir simulación"
                  : "Probar flujo de automatización"
              }
            >
              {status === "done" ? (
                <RotateCcw size={16} aria-hidden="true" />
              ) : (
                <Play size={16} aria-hidden="true" />
              )}
              {status === "running"
                ? "Procesando…"
                : status === "done"
                  ? "Repetir"
                  : "Probar flujo"}
            </button>
          </div>
        </div>
      </div>
      <div className="scene-caption">
        <span className="caption-line" />
        Diseñamos conexiones que simplifican tu día a día.
      </div>
    </div>
  );
}
