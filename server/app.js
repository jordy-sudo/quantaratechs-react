import express from "express";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { randomUUID, createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SERVICES, LIMITS } from "../shared/contact.js";
import { createMailTransport } from "./mail.js";
import { organization } from "../shared/seo.js";

const root = fileURLToPath(new URL("../", import.meta.url));
export const successMessage =
  "Tu mensaje se envió correctamente. Te responderemos al correo que indicaste.";
const errorMessage =
  "No pudimos enviar tu mensaje. Tus datos siguen en el formulario. Inténtalo más tarde o escríbenos directamente por correo.";
const emailPattern = /^[^\s@<>,;\r\n]+@[^\s@<>,;\r\n]+\.[^\s@<>,;\r\n]+$/;
const validEmail = (value) =>
  typeof value === "string" &&
  value.length <= LIMITS.email &&
  emailPattern.test(value);
const hasControls = (value) =>
  Array.from(value).some(
    (char) => char.codePointAt(0) < 32 || char.codePointAt(0) === 127,
  );
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

function validate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    return { error: "Revisa los datos de tu consulta." };
  for (const key of [
    "name",
    "email",
    "message",
    "company",
    "service",
    "website",
  ]) {
    if (body[key] !== undefined && typeof body[key] !== "string")
      return { error: "Revisa los datos de tu consulta." };
  }
  const data = Object.fromEntries(
    ["name", "email", "message", "company", "service", "website"].map((key) => [
      key,
      (body[key] || "").trim(),
    ]),
  );
  if (data.website)
    return {
      error:
        "No pudimos validar la consulta. Recarga la página e inténtalo nuevamente.",
    };
  if (
    data.name.length < 2 ||
    data.name.length > LIMITS.name ||
    hasControls(data.name)
  )
    return { error: "Ingresa un nombre válido de entre 2 y 120 caracteres." };
  if (!validEmail(data.email))
    return { error: "Ingresa un correo electrónico válido." };
  if (
    data.message.length < LIMITS.messageMin ||
    data.message.length > LIMITS.message ||
    data.message.includes("\0")
  )
    return { error: "El mensaje debe tener entre 20 y 5000 caracteres." };
  if (data.company.length > LIMITS.company || hasControls(data.company))
    return { error: "Revisa el nombre de tu empresa (máximo 120 caracteres)." };
  data.service ||= "not-sure";
  if (!SERVICES.some((item) => item.id === data.service))
    return { error: "Selecciona uno de los servicios disponibles." };
  return { data };
}

export function createApp({
  env = process.env,
  sendMail,
  logger = console,
  rateLimitMax = 5,
  rateLimitWindowMs = 15 * 60 * 1000,
} = {}) {
  const app = express();
  let transport;
  const deliver =
    sendMail ||
    (async (options) => {
      transport ||= createMailTransport(env);
      return transport.sendMail(options);
    });
  app.disable("x-powered-by");
  if (/^[1-9]\d*$/.test(env.TRUST_PROXY_HOPS || ""))
    app.set("trust proxy", Number(env.TRUST_PROXY_HOPS));
  const seoHash = createHash("sha256")
    .update(JSON.stringify(organization))
    .digest("base64");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", `'sha256-${seoHash}'`],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: env.NODE_ENV === "production" ? [] : null,
        },
      },
      strictTransportSecurity: env.NODE_ENV === "production",
    }),
  );
  app.use(compression());
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use(express.json({ limit: "16kb", strict: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/public-config", (_req, res) => {
    const email = env.CONTACT_EMAIL || env.MAIL_USERNAME || "";
    res.json({ contactEmail: validEmail(email) ? email : "" });
  });
  const limiter = rateLimit({
    windowMs: rateLimitWindowMs,
    limit: rateLimitMax,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, res) =>
      res
        .status(429)
        .json({
          message:
            "Has enviado varias consultas. Espera 15 minutos o escríbenos directamente por correo.",
        }),
  });
  app.post("/api/contact", limiter, async (req, res) => {
    if (!req.is("application/json"))
      return res
        .status(415)
        .json({ message: "El formulario debe enviarse en formato JSON." });
    const origin = req.get("origin");
    if (origin) {
      let sameOrigin = false;
      try {
        sameOrigin =
          new URL(origin).host === req.get("host") ||
          origin ===
            new URL(env.SITE_URL || "https://www.quantaratechs.com").origin;
      } catch {
        /* malformed origins are rejected */
      }
      if (!sameOrigin)
        return res
          .status(403)
          .json({
            message: "Envía tu consulta desde la página de QuantaraTechs.",
          });
    }
    const { data, error } = validate(req.body);
    if (error) return res.status(400).json({ message: error });
    const requestId = randomUUID();
    const service = SERVICES.find((item) => item.id === data.service).label;
    try {
      const to = (env.MAIL_TO || env.MAIL_USERNAME || "")
        .split(",")
        .map((email) => email.trim());
      if (!validEmail(env.MAIL_USERNAME) || !to.every(validEmail) || !to.length)
        throw Object.assign(new Error("Invalid mail configuration"), {
          code: "ECONFIG",
        });
      const lines = [
        "Nueva consulta desde QuantaraTechs",
        `Referencia: ${requestId}`,
        "",
        `Nombre: ${data.name}`,
        `Correo: ${data.email}`,
        `Empresa: ${data.company || "No indicada"}`,
        `Servicio: ${service}`,
        "",
        "Mensaje:",
        data.message,
      ];
      const info = await deliver({
        from: {
          name: env.MAIL_FROM_NAME || "QuantaraTechs",
          address: env.MAIL_USERNAME,
        },
        to,
        replyTo: { name: data.name, address: data.email },
        subject: `Consulta QuantaraTechs: ${data.name}`,
        text: lines.join("\n"),
        html: `<h2>Nueva consulta desde QuantaraTechs</h2><p><strong>Referencia:</strong> ${requestId}</p><p><strong>Nombre:</strong> ${escape(data.name)}<br><strong>Correo:</strong> ${escape(data.email)}<br><strong>Empresa:</strong> ${escape(data.company || "No indicada")}<br><strong>Servicio:</strong> ${escape(service)}</p><h3>Mensaje</h3><p>${escape(data.message).replace(/\r?\n/g, "<br>")}</p>`,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
      if (!info.accepted?.length || info.rejected?.length)
        throw Object.assign(new Error("SMTP did not accept every recipient"), {
          code: "ERECIPIENT",
        });
      logger.info(
        JSON.stringify({
          event: "contact_sent",
          requestId,
          messageId: info.messageId,
        }),
      );
      return res.json({ message: successMessage, requestId });
    } catch (error) {
      logger.error(
        JSON.stringify({
          event: "contact_failed",
          requestId,
          code: error.code || "EMAIL",
          responseCode: error.responseCode,
        }),
      );
      return res.status(503).json({ message: errorMessage, requestId });
    }
  });
  app.use("/api", (_req, res) =>
    res.status(404).json({ message: "La ruta solicitada no existe." }),
  );
  app.use(
    express.static(path.join(root, "dist"), {
      index: false,
      dotfiles: "deny",
      setHeaders: (res, file) =>
        res.set(
          "Cache-Control",
          /[.-][\w-]{8,}\.(js|css|woff2)$/.test(file) && !file.endsWith(".html")
            ? "public, max-age=31536000, immutable"
            : "public, max-age=3600",
        ),
    }),
  );
  app.get("/", (_req, res) => {
    res.set("Cache-Control", "no-cache");
    res.sendFile(path.join(root, "dist/index.html"));
  });
  app.use((_req, res) =>
    res.status(404).type("text").send("No se encontró la página solicitada."),
  );
  app.use((error, _req, res, _next) => {
    if (error.type === "entity.too.large")
      return res
        .status(413)
        .json({ message: "El mensaje es demasiado largo." });
    if (error.type === "entity.parse.failed")
      return res
        .status(400)
        .json({ message: "Los datos del formulario no son válidos." });
    logger.error(
      JSON.stringify({ event: "server_error", code: error.code || "INTERNAL" }),
    );
    return res
      .status(500)
      .json({ message: "No pudimos procesar la solicitud." });
  });
  return app;
}
