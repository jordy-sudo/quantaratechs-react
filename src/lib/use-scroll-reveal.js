import { useEffect } from "react";

const selectors = [
  ".section-heading",
  ".service-card",
  ".solution-card",
  ".process-grid > li",
  ".principles",
  ".faq-list details",
  ".contact-copy",
  ".contact-form",
  ".footer-grid > div",
];

export function useScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = selectors.flatMap((selector) => [
      ...document.querySelectorAll(selector),
    ]);
    let observer;

    function reveal(node) {
      node.classList.remove("reveal-pending");
      node.classList.add("reveal-visible");
      observer?.unobserve(node);
    }

    function observe() {
      observer?.disconnect();
      if (preference.matches) {
        nodes.forEach((node) => node.classList.remove("reveal-pending"));
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );
      nodes.forEach((node, index) => {
        if (node.classList.contains("reveal-visible")) return;
        node.classList.add(
          "scroll-reveal",
          "reveal-pending",
          `reveal-delay-${index % 4}`,
        );
        observer.observe(node);
      });
    }

    function focus(event) {
      const node = event.target.closest(".scroll-reveal");
      if (node) {
        node.classList.add("reveal-instant");
        reveal(node);
      }
    }

    observe();
    preference.addEventListener("change", observe);
    document.addEventListener("focusin", focus);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", observe);
      document.removeEventListener("focusin", focus);
      nodes.forEach((node) =>
        node.classList.remove(
          "scroll-reveal",
          "reveal-pending",
          "reveal-visible",
          "reveal-instant",
          "reveal-delay-0",
          "reveal-delay-1",
          "reveal-delay-2",
          "reveal-delay-3",
        ),
      );
    };
  }, []);
}
