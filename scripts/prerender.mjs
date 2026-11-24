import fs from "node:fs/promises";
import { render } from "../node_modules/.cache/quantara-ssr/entry-server.js";
import { organization } from "../shared/seo.js";
const file = new URL("../dist/index.html", import.meta.url);
let html = await fs.readFile(file, "utf8");
html = html.replace(
  '<div id="root"></div>',
  `<div id="root">${render()}</div>`,
);
html = html.replace(
  "</head>",
  `<script type="application/ld+json">${JSON.stringify(organization)}</script>\n</head>`,
);
await fs.writeFile(file, html);
console.log(
  "Landing prerendered: content is available without waiting for JavaScript.",
);
