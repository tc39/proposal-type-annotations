import { watch, readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { createServer } from "http"
import { tmpdir } from "os";
import { join } from "path";
import { stdout } from "process";
import { WebSocketServer } from 'ws';
import { buildSync } from "esbuild";
import { createRequire } from 'module';
import sass from "sass";

// Convert and run the 'app' code
const build = async () => {
  const tmpFile = join(tmpdir(), "tc39-template.js")
  try {

  // JSX -> JS, then evaluate that in node
  const result = buildSync({ logLevel: "warning", platform: "node", bundle: true, outfile: tmpFile, entryPoints: ['src/site.jsx'], external: ["remark-shiki-twoslash"] })
  if (!result.errors.length) {
      // This require is used inside the eval below.
      const require = createRequire(import.meta.url);
      await eval(readFileSync(tmpFile, "utf8"))
      
      // SCSS -> CSS on the html injecting it into `<style id="style" />`
      const style = sass.renderSync({ file: "./src/style.scss" })
      const withStyle = readFileSync("./out/index.html", "utf8").replace('<style id="style"></style>', `<style id="style">${style.css.toString()}</style>`)
      writeFileSync(join("out", "index.html"), withStyle)
    }
  } catch (error) {
    console.log(error) 
  }
}

// Starts up a HTTP server which builds the site each time it is requested 
const server = createServer(function (req, res) {
  const filepath =  req.url === "/" ? "index.html" : req.url
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(readFileSync(join("out", filepath), "utf8"));
  res.end();
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

// Ensure there's an output folder to put generated files
if (!existsSync("out")) {
  mkdirSync("out")
}


// Trigger a build anyway
build()