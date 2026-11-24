import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "./site-contact.js";

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Quantara Techs",
  email: CONTACT_EMAIL,
  telephone: `+${WHATSAPP_NUMBER}`,
  url: "https://www.quantaratechs.com/",
  logo: "https://www.quantaratechs.com/assets/logo-wordmark.svg",
  description:
    "Software a medida, automatización de procesos, bots e integraciones con Power Platform y Azure.",
};
