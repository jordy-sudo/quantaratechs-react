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
    secure: port === 465 || env.MAIL_ENCRYPTION === "ssl",
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
