// @ts-check
import { watch, readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { readFile, writeFile } from "fs/promises";
import { createServer } from "http"
import { tmpdir } from "os";
import { join } from "path";
import { stdout } from "process";
import { createRequire } from 'module';

import { buildSync as esbuildSync } from "esbuild";
import { build as buildEcmarkup } from "ecmarkup"
import { WebSocketServer } from 'ws';
import sass from "sass";
import { fail } from "assert";

// Convert and run the 'app' code
const build = async () => {
  // The file the site's JS is bundled into and then evaluated
  const tmpFile = join(tmpdir(), "tc39-template.js")
  try {

  const ecmarkupOutput = await buildEcmarkup("./src/grammar-input.html", path => readFile(path, { encoding: "utf-8" }), {
    outfile: "./out/grammar.html"
  });
  for (const [filePath, content] of ecmarkupOutput.generatedFiles) {
    await writeFile(filePath ?? fail("File path must be non-null."), content, "utf8")
  }
  // Use esbuild to convert JSX -> JS and to bundle the necessary JS into a single file.
  const result = esbuildSync({ logLevel: "warning", platform: "node", bundle: true, outfile: tmpFile, entryPoints: ['src/site.jsx'], external: ["remark-shiki-twoslash"] })
  if (!result.errors.length) {
      // This require is used inside the eval below.
      const require = createRequire(import.meta.url);
      // The 'site.jsx' file has a function at the end which renders the JSX into static HTML
      // which is what we're running when this `eval` is called. This generates the .html file.
      await eval(readFileSync(tmpFile, "utf8"))
      
      // Convert the SCSS to minified CSS, and injecting it into the rendered HTML
      const style = sass.renderSync({ file: "./src/style.scss", outputStyle: process.env.SITE_DEV ? "expanded": "compressed" })
      const withStyle = readFileSync("./out/index.html", "utf8").replace('<style id="style"></style>', `<style id="style">${style.css.toString()}</style>`)
      writeFileSync(join("out", "index.html"), withStyle)
    }
  } catch (error) {
    console.log(error) 
  }
}

// Starts up a HTTP server which vendors files in dev mode
if (process.env.SITE_DEV) {
  const server = createServer(function (req, res) {
    const filepath =  !req.url || req.url === "/" ? "index.html" : req.url
    if (existsSync(join("out", filepath))) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(readFileSync(join("out", filepath), "utf8"));
      res.end();
    } else {
      res.writeHead(404)
      res.end()
    }
  }).listen(8080);
  
  // Create a websocket, and file watcher so that pressing save in the index
  // triggers a browser reload, letting you edit without jumping over and
  // refreshing.
  const wss = new WebSocketServer({ server });
  console.log("Started up dev server: http://localhost:8080")
  
  // FS watcher on the src dir which triggers a re-build, and then tells
  // any connected webpages to reload.
  watch("./src", async () => {
    stdout.write(".");
    await build()
    wss.clients.forEach(client => client.send("reload"))
  });  
} else {
  console.log("Building site into ./out")
}

// Ensure there's an output folder to put generated files
if (!existsSync("out")) {
  mkdirSync("out")
}

// Trigger a build while the server loads ups
build()