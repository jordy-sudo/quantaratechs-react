import { createRoot, hydrateRoot } from "react-dom/client";
import "./global.css";
import App from "./App.jsx";

const root = document.getElementById("root");
// Development is rendered normally; production includes prerendered HTML for SEO.
if (root.hasChildNodes()) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
