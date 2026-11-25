import { withLambda } from "@netlify/aws-lambda-compat";
import serverless from "serverless-http";
import { createApp } from "./app.js";

export function createNetlifyHandler(options) {
  // Keep the SMTP transport and rate limiter across warm invocations.
  const invoke = serverless(createApp(options));

  return (request, context) =>
    withLambda((event, lambdaContext) => {
      event.headers.host = new URL(request.url).host;
      // Netlify supplies the client IP in context; visitor headers cannot override it.
      event.requestContext = { identity: { sourceIp: context.ip } };
      for (const header of ["x-forwarded-for", "forwarded"]) {
        delete event.headers[header];
        delete event.multiValueHeaders[header];
      }
      return invoke(event, lambdaContext);
    })(request, context);
}
