import { createNetlifyHandler } from "../../server/netlify.js";

export default createNetlifyHandler();

export const config = { path: "/api/*" };
