import { test } from "node:test";
import assert from "node:assert/strict";
import api, { config } from "../netlify/functions/api.js";
import { createNetlifyHandler } from "../server/netlify.js";

const origin = "https://www.quantaratechs.com";
const valid = {
  name: "Ana Pérez",
  email: "ana@example.com",
  company: "Empresa de prueba",
  service: "automation",
  message: "Queremos automatizar el seguimiento de nuestras solicitudes.",
  website: "",
};

function setup(options = {}) {
  const sent = [];
  const handler = createNetlifyHandler({
    env: {
      MAIL_USERNAME: "sender@example.com",
      MAIL_TO: "owner@example.com",
      SITE_URL: origin,
    },
    logger: { info() {}, error() {} },
    sendMail: async (mail) => {
      sent.push(mail);
      return { accepted: mail.to, rejected: [], messageId: "test-message" };
    },
    ...options,
  });
  const post = (body = valid, ip = "203.0.113.1", headers = {}) =>
    handler(
      new Request(`${origin}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
          ...headers,
        },
        body: JSON.stringify(body),
      }),
      { ip, requestId: "netlify-test" },
    );
  return { handler, post, sent };
}

test("Netlify entry routes /api/* and serves health without SMTP configuration", async () => {
  assert.equal(config.path, "/api/*");
  const response = await api(new Request(`${origin}/api/health`), {
    ip: "203.0.113.1",
    requestId: "netlify-test",
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("Netlify contact accepts a browser POST and preserves its data and receipt", async () => {
  const { post, sent } = setup();
  const response = await post();
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.match(body.requestId, /^[\da-f-]{36}$/);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(sent.length, 1);
  assert.equal(sent[0].replyTo.address, valid.email);
  assert.ok(sent[0].text.includes(valid.name));
  assert.ok(sent[0].text.includes(valid.message));
});

test("Netlify exposes public config and keeps API misses as JSON 404s", async () => {
  const { handler } = setup();
  const context = { ip: "203.0.113.1", requestId: "netlify-test" };
  const response = await handler(
    new Request(`${origin}/api/public-config`),
    context,
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { contactEmail: "sender@example.com" });
  const missing = await handler(new Request(`${origin}/api/missing`), context);
  assert.equal(missing.status, 404);
  assert.ok((await missing.json()).message);
});

test("Netlify rate limiting uses the platform IP and persists across invocations", async () => {
  const { post, sent } = setup({ rateLimitMax: 1 });
  assert.equal((await post()).status, 200);
  const blocked = await post(valid, "203.0.113.1", {
    "X-Forwarded-For": "198.51.100.99",
    Forwarded: "for=198.51.100.99",
  });
  assert.equal(blocked.status, 429);
  assert.ok(blocked.headers.get("retry-after"));
  assert.equal((await post(valid, "203.0.113.2")).status, 200);
  assert.equal(sent.length, 2);
});

test("Netlify rejects invalid or cross-site submissions without sending mail", async () => {
  const { post, sent } = setup();
  assert.equal((await post({ ...valid, message: "short" })).status, 400);
  assert.equal(
    (
      await post(valid, "203.0.113.1", {
        Origin: "https://other.example.com",
      })
    ).status,
    403,
  );
  assert.equal(sent.length, 0);
});

test("Netlify preserves SMTP failure responses without reporting success", async () => {
  const { post } = setup({
    sendMail: async () => {
      throw Object.assign(new Error("SMTP authentication failed"), {
        code: "EAUTH",
      });
    },
  });
  const response = await post();
  assert.equal(response.status, 503);
  assert.ok((await response.json()).requestId);
});
