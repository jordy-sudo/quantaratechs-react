import "dotenv/config";
import { createMailTransport } from "../server/mail.js";
let transport;
try {
  transport = createMailTransport();
  await transport.verify();
  console.log("SMTP: conexión segura y autenticación correctas.");
  console.log(
    "Esta comprobación no envía correos. El envío se verifica desde el formulario.",
  );
} catch (error) {
  console.error(
    `SMTP: comprobación fallida (${error.code || "EMAIL"}${error.responseCode ? `, respuesta ${error.responseCode}` : ""}).`,
  );
  if (error.code === "EAUTH")
    console.error(
      "Revisa MAIL_USERNAME y MAIL_PASSWORD en .env. Si Zoho usa doble factor, utiliza una contraseña de aplicación.",
    );
  if (error.code === "ECONFIG")
    console.error(
      "Completa MAIL_HOST, MAIL_PORT, MAIL_USERNAME y MAIL_PASSWORD en .env.",
    );
  process.exitCode = 1;
} finally {
  transport?.close();
}
