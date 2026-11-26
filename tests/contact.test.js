import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../server/app.js";
import { mailSettings, mailErrorDetails } from "../server/mail.js";

const env = {
  MAIL_USERNAME: "sender@example.com",
  MAIL_TO: "owner@example.com",
  MAIL_FROM_NAME: "Quantara Techs",
};
const valid = {
  name: "Ana Pérez",
  email: "ana@example.com",
  company: "Empresa de prueba",
  service: "automation",
  message: "Queremos automatizar el seguimiento de nuestras solicitudes.",
  website: "",
};
const logger = { info() {}, error() {} };
async function setup(t, options = {}) {
  const sent = [];
  const app = createApp({
    env,
    logger,
    rateLimitMax: 100,
    sendMail: async (mail) => {
      sent.push(mail);
      return {
        accepted: ["owner@example.com"],
        rejected: [],
        messageId: "test-message",
      };
    },
    ...options,
  });
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, route = "/api/contact", headers = {}) =>
    fetch(base + route, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  return { sent, base, post };
}
test("sends the correct contact data, uses authenticated sender, and returns a receipt only after acceptance", async (t) => {
  const { post, sent } = await setup(t);
  const res = await post(valid);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.match(body.requestId, /^[\da-f-]{36}$/);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].from.address, env.MAIL_USERNAME);
  assert.equal(sent[0].replyTo.address, valid.email);
  assert.deepEqual(sent[0].to, [env.MAIL_TO]);
  assert.ok(sent[0].text.includes(valid.company));
  assert.ok(sent[0].text.includes("Automatización y bots"));
  assert.ok(sent[0].text.includes(body.requestId));
});
test("escapes user HTML and preserves multiline messages", async (t) => {
  const { post, sent } = await setup(t);
  const res = await post({
    ...valid,
    name: "<script>alert(1)</script>",
    message: "<img src=x onerror=alert(1)>\nSegunda línea del mensaje",
  });
  assert.equal(res.status, 200);
  assert.ok(!sent[0].html.includes("<script>"));
  assert.ok(!sent[0].html.includes("<img"));
  assert.ok(sent[0].html.includes("&lt;img"));
  assert.ok(sent[0].html.includes("<br>"));
});
test("rejects invalid, oversized, injected and bot input without sending email", async (t) => {
  const { post, sent } = await setup(t);
  for (const body of [
    {},
    { ...valid, email: "bad" },
    { ...valid, email: "a@example.com,b@example.com" },
    { ...valid, name: "Name\r\nBcc: x@example.com" },
    { ...valid, name: {} },
    { ...valid, service: "invented" },
    { ...valid, message: "short" },
    { ...valid, message: "x".repeat(5001) },
    { ...valid, company: "x".repeat(121) },
    { ...valid, website: "spam.example.com" },
    [],
  ]) {
    const res = await post(body);
    assert.equal(res.status, 400);
    assert.ok((await res.json()).message);
  }
  assert.equal(sent.length, 0);
});
test("SMTP authentication failure is a 503 with a generic message and a reference", async (t) => {
  const { post } = await setup(t, {
    sendMail: async () => {
      throw Object.assign(new Error("smtp secret-user secret-password"), {
        code: "EAUTH",
        responseCode: 535,
      });
    },
  });
  const res = await post(valid);
  const body = await res.json();
  assert.equal(res.status, 503);
  assert.ok(body.requestId);
  assert.ok(!JSON.stringify(body).includes("secret"));
  assert.ok(!JSON.stringify(body).includes("535"));
});

test("SMTP socket failures log the original system cause without exposing it to visitors", async (t) => {
  const logs = [];
  const { post } = await setup(t, {
    logger: {
      info() {},
      error(line) {
        logs.push(JSON.parse(line));
      },
    },
    sendMail: async () => {
      throw Object.assign(new Error("secret-user secret-password"), {
        code: "ESOCKET",
        originalCode: "ERR_SSL_WRONG_VERSION_NUMBER",
        command: "CONN",
        response: "private provider response",
      });
    },
  });
  const response = await post(valid);
  const body = await response.json();
  assert.equal(response.status, 503);
  assert.deepEqual(logs, [
    {
      event: "contact_failed",
      requestId: body.requestId,
      code: "ESOCKET",
      originalCode: "ERR_SSL_WRONG_VERSION_NUMBER",
      command: "CONN",
    },
  ]);
  assert.ok(!JSON.stringify(logs).includes("secret"));
  assert.ok(!JSON.stringify(logs).includes("private"));
  assert.ok(!JSON.stringify(body).includes("ESOCKET"));
  assert.ok(!JSON.stringify(body).includes("ERR_SSL"));
});
test("no accepted recipient or partial rejection never reports success", async (t) => {
  for (const info of [
    { accepted: [], rejected: ["owner@example.com"] },
    { accepted: ["owner@example.com"], rejected: ["other@example.com"] },
  ]) {
    const { post } = await setup(t, { sendMail: async () => info });
    assert.equal((await post(valid)).status, 503);
  }
});
test("limits repeated requests and returns Retry-After", async (t) => {
  const { post, sent } = await setup(t, { rateLimitMax: 2 });
  assert.equal((await post(valid)).status, 200);
  assert.equal((await post(valid)).status, 200);
  const res = await post(valid);
  assert.equal(res.status, 429);
  assert.ok(res.headers.get("retry-after"));
  assert.equal(sent.length, 2);
});
test("rejects cross-site submissions, incorrect media, malformed JSON and excessive bodies", async (t) => {
  const { post, base, sent } = await setup(t);
  assert.equal(
    (
      await post(valid, "/api/contact", {
        Origin: "https://unknown.example.com",
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await fetch(base + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "hello",
      })
    ).status,
    415,
  );
  assert.equal(
    (
      await fetch(base + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      })
    ).status,
    400,
  );
  assert.equal(
    (await post({ ...valid, message: "x".repeat(20000) })).status,
    413,
  );
  assert.equal(sent.length, 0);
});
test("public config only exposes the public email and missing routes are real 404s", async (t) => {
  const { base } = await setup(t, {
    env: {
      ...env,
      MAIL_PASSWORD: "secret",
      CONTACT_EMAIL: "contact@example.com",
    },
  });
  const response = await fetch(base + "/api/public-config");
  assert.deepEqual(await response.json(), {
    contactEmail: "contact@example.com",
  });
  assert.equal(response.headers.get("cache-control"), "no-store");
  for (const route of ["/api/missing", "/assets/missing.png", "/missing-page"])
    assert.equal((await fetch(base + route)).status, 404);
});
test("SMTP transport requires configuration and enforces TLS and finite timeouts", () => {
  assert.throws(() => mailSettings({}), { code: "ECONFIG" });
  const options = mailSettings({
    MAIL_HOST: "smtp.example.com",
    MAIL_PORT: "587",
    MAIL_USERNAME: "user",
    MAIL_PASSWORD: "secret",
  });
  assert.equal(options.secure, false);
  assert.equal(options.requireTLS, true);
  assert.equal(options.tls.minVersion, "TLSv1.2");
  assert.ok(options.socketTimeout < 30000);
});

test("SMTP port determines TLS mode even when the legacy encryption variable conflicts", () => {
  for (const [port, encryption, secure] of [
    [465, "ssl", true],
    [465, "tls", true],
    [587, "tls", false],
    [587, "ssl", false],
    [2525, "ssl", false],
    [25, "ssl", false],
  ]) {
    const options = mailSettings({
      MAIL_HOST: "smtp.example.com",
      MAIL_PORT: String(port),
      MAIL_USERNAME: "sender@example.com",
      MAIL_PASSWORD: "secret",
      MAIL_ENCRYPTION: encryption,
    });
    assert.equal(options.secure, secure, `port ${port}, encryption ${encryption}`);
    assert.equal(options.requireTLS, !secure);
    assert.equal(options.tls.rejectUnauthorized, undefined);
  }
});

test("SMTP diagnostics omit raw errors, provider replies and unexpected command data", () => {
  const details = mailErrorDetails({
    code: "ESOCKET",
    originalCode: "secret-password\nECONNRESET",
    command: "AUTH PLAIN secret-password",
    message: "secret-password",
    response: "private provider response",
    responseCode: "private provider response",
    timeoutType: "CONNECT_TIMEOUT",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(details)), {
    code: "ESOCKET",
    timeoutType: "CONNECT_TIMEOUT",
  });
});
