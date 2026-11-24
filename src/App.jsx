import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Hero from "./sections/hero-section";
import Services from "./sections/about-our-apps";
import Solutions from "./sections/our-latest-creation";
import Process from "./sections/process";
import Faq from "./sections/faq";
import Contact from "./sections/get-in-touch";
import { track } from "./lib/analytics";

export default function App() {
  const [service, setService] = useState("not-sure");
  const [contactEmail, setContactEmail] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/public-config", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.contactEmail) setContactEmail(data.contactEmail);
      })
      .catch(() => {});
    function click(event) {
      const link = event.target.closest('a[href="#contact"]');
      if (link)
        track("contact_cta_click", {
          placement: link.dataset.placement || "navigation",
        });
    }
    document.addEventListener("click", click);
    return () => {
      controller.abort();
      document.removeEventListener("click", click);
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Services onChooseService={setService} />
        <Solutions onChooseService={setService} />
        <Process />
        <Faq />
        <Contact
          service={service}
          onServiceChange={setService}
          contactEmail={contactEmail}
        />
      </main>
      <Footer contactEmail={contactEmail} />
    </>
  );
}
