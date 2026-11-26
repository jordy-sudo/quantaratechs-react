import "dotenv/config";
import { createMailTransport, mailErrorDetails } from "../server/mail.js";
let transport;
try {
  transport = createMailTransport();
  await transport.verify();
  console.log("SMTP: conexión segura y autenticación correctas.");
  console.log(
    "Esta comprobación no envía correos. El envío se verifica desde el formulario.",
  );
} catch (error) {
  const details = mailErrorDetails(error);
  console.error(
    `SMTP: comprobación fallida (${details.code}${details.responseCode ? `, respuesta ${details.responseCode}` : ""}).`,
  );
  console.error(JSON.stringify({ event: "smtp_verify_failed", ...details }));
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
