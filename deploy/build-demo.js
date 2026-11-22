/*
 * Builds the static Alenia demo served at https://test-rvss.alwaysdata.net/alenia/
 *
 * - Angular production build, client-side rendering only (no Node process on
 *   the alwaysdata free plan).
 * - The /alenia/ base href lets the app live next to the certif site.
 * - deploy/demo-session.html is injected so the dashboards can be opened
 *   without the .NET API.
 * - deploy/htaccess becomes .htaccess for the SPA fallback.
 *
 * Usage (from AleniaUI/):
 *   node deploy/build-demo.js
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectDir = path.resolve(__dirname, "..");
const outputDir = path.join(projectDir, "dist", "alenia-ui", "browser");

execSync(
  "npx ng build --configuration production --base-href /alenia/ --ssr=false --prerender=false",
  { cwd: projectDir, stdio: "inherit", shell: true }
);

const indexPath = path.join(outputDir, "index.html");
const demoSession = fs.readFileSync(path.join(__dirname, "demo-session.html"), "utf8");
let indexHtml = fs.readFileSync(indexPath, "utf8");

if (!indexHtml.includes("</head>")) {
  throw new Error("index.html has no </head>, cannot inject the demo session");
}
if (!indexHtml.includes("alenia-demo-session")) {
  indexHtml = indexHtml.replace("</head>", demoSession + "\n</head>");
  fs.writeFileSync(indexPath, indexHtml);
}

fs.copyFileSync(path.join(__dirname, "htaccess"), path.join(outputDir, ".htaccess"));
console.log(`Demo build ready: ${outputDir}`);
