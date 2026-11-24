import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
const links = [
  ["#services", "Servicios"],
  ["#projects", "Soluciones"],
  ["#process", "Cómo trabajamos"],
  ["#faq", "Preguntas frecuentes"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const panel = useRef(null);
  useEffect(() => {
    if (!open) return;
    panel.current.querySelector("a")?.focus();
    function onKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    const media = matchMedia("(min-width: 1100px)");
    function onResize(event) {
      if (event.matches) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    media.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onResize);
    };
  }, [open]);
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Navegación principal">
        <a href="#hero" className="brand" aria-label="QuantaraTechs, inicio">
          <img
            src="/assets/logo.png"
            width="139"
            height="40"
            alt="QuantaraTechs"
            fetchPriority="high"
          />
        </a>
        <div className="desktop-links">
          {links.map(([href, text]) => (
            <a key={href} href={href}>
              {text}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="button button-primary nav-cta"
          data-placement="header"
        >
          Hablemos de tu proyecto
        </a>
        <button
          className="menu-toggle"
          ref={trigger}
          aria-expanded={open}
          aria-controls={open ? "mobile-navigation" : undefined}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>
      {open && (
        <nav
          className="mobile-navigation"
          id="mobile-navigation"
          aria-label="Navegación móvil"
          ref={panel}
        >
          {links.map(([href, text]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {text}
            </a>
          ))}
          <a
            href="#contact"
            className="button button-primary"
            onClick={() => setOpen(false)}
            data-placement="mobile-menu"
          >
            Hablemos de tu proyecto
          </a>
        </nav>
      )}
    </header>
  );
}
