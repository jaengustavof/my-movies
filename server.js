import fs from "fs/promises";
import path from "path";
import express from "express";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/assets", express.static(path.join(__dirname, "dist/client/assets"), { maxAge: "1y" }));
app.use(express.static(path.join(__dirname, "dist/client"), { index: false }));

app.get("/", handleSSR);
app.get("/movie/:id", handleSSR);

async function handleSSR(req, res) {
    try {
        const templatePath = path.join(__dirname, "dist/client/index.html");
        const ssrEntryPath = path.join(__dirname, "dist/server/entry-server.js");

        const template = await fs.readFile(templatePath, "utf-8");

        const mod = await import(pathToFileURL(ssrEntryPath).href);
        const render = mod.default ?? mod.render; // <- soporta default o named

        if (typeof render !== "function") {
            console.error("[SSR] El módulo SSR no exporta una función render. Exports:", Object.keys(mod));
            return res.status(500).send("SSR: módulo inválido");
        }

        const appHtml = await render(req.url);
        const html = template.replace("<!--app-html-->", appHtml);

        res.status(200).set("Content-Type", "text/html").send(html);
    } catch (error) {
        console.error("SSR Error:", error?.stack || error);
        res.status(500).send("Error del servidor");
    }
}

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
