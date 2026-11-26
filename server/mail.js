import nodemailer from "nodemailer";

export function mailSettings(env = process.env) {
  const required = ["MAIL_HOST", "MAIL_PORT", "MAIL_USERNAME", "MAIL_PASSWORD"];
  if (required.some((key) => !env[key]))
    throw Object.assign(new Error("Mail configuration is incomplete"), {
      code: "ECONFIG",
    });
  const port = Number(env.MAIL_PORT);
  if (![465, 587, 2525, 25].includes(port))
    throw Object.assign(new Error("Invalid SMTP port"), { code: "ECONFIG" });
  return {
    host: env.MAIL_HOST,
    port,
    // SMTP submission uses implicit TLS on 465 and STARTTLS on the other ports.
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: env.MAIL_USERNAME, pass: env.MAIL_PASSWORD },
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

export function createMailTransport(env = process.env) {
  return nodemailer.createTransport(mailSettings(env));
}

const errorToken = (value) =>
  typeof value === "string" && /^[A-Z][A-Z0-9_]{0,79}$/.test(value)
    ? value
    : undefined;
const smtpCommands = new Set([
  "CONN",
  "EHLO",
  "HELO",
  "LHLO",
  "STARTTLS",
  "AUTH PLAIN",
  "AUTH LOGIN",
  "AUTH CRAM-MD5",
  "AUTH XOAUTH2",
  "MAIL FROM",
  "RCPT TO",
  "DATA",
  "API",
]);

export function mailErrorDetails(error) {
  // Keep system/TLS diagnostics without logging provider replies or credentials.
  return {
    code: errorToken(error.code) || "EMAIL",
    originalCode: errorToken(error.originalCode),
    command: smtpCommands.has(error.command) ? error.command : undefined,
    responseCode:
      Number.isInteger(error.responseCode) &&
      error.responseCode >= 100 &&
      error.responseCode <= 599
        ? error.responseCode
        : undefined,
    timeoutType: errorToken(error.timeoutType),
  };
}
