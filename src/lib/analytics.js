// Ready for an analytics integration; never include personal data in this queue.
export function track(event, properties = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...properties });
  window.dispatchEvent(
    new CustomEvent("quantara:analytics", { detail: { event, ...properties } }),
  );
}
