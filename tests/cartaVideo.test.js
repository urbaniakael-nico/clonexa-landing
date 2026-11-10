// Carta en video con QR para visitas de la prospeccion de Nexa a restaurantes.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CARTA_VIDEO, cartaVideoTarget, cartaWhatsapp } from "../src/cartaVideo.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HAS_DIST = fs.existsSync(path.join(ROOT, "dist", "index.html"));
const q = (o) => "?" + new URLSearchParams(o).toString();

test("se muestra para prospeccion de restaurantes, comidas rapidas, cafes y panaderias (con el codigo)", () => {
  for (const tipo of ["restaurante", "comidas-rapidas", "cafe", "panaderia"]) {
    const t = cartaVideoTarget({ search: q({ utm_source: "email", utm_medium: "prospeccion", utm_campaign: `kennedy-central-${tipo}`, utm_content: "K7M2QD" }) });
    assert.deepEqual(t, { show: true, code: "K7M2QD" }, tipo);
  }
});

test("no se muestra para bares, talleres, redes ni visitas normales; #carta-video siempre", () => {
  assert.equal(cartaVideoTarget({ search: q({ utm_medium: "prospeccion", utm_campaign: "techo-bar", utm_content: "K7M2QD" }) }).show, false);
  assert.equal(cartaVideoTarget({ search: q({ utm_medium: "prospeccion", utm_campaign: "timiza-taller" }) }).show, false);
  assert.equal(cartaVideoTarget({ search: q({ utm_source: "instagram", utm_medium: "social", utm_campaign: "nexa-restaurante" }) }).show, false);
  assert.deepEqual(cartaVideoTarget({ search: "" }), { show: false, code: "" });
  assert.deepEqual(cartaVideoTarget({ search: "", hash: "#carta-video" }), { show: true, code: "" });
});

test("los utm guardados de la sesion cuentan (navega a otra pagina sin utm)", () => {
  const saved = { utm_medium: "prospeccion", utm_campaign: "castilla-restaurante", utm_content: "ab12cd" };
  assert.deepEqual(cartaVideoTarget({ search: "", saved }), { show: true, code: "AB12CD" });
});

test("codigo raro no se usa (solo 6 letras o numeros)", () => {
  const t = cartaVideoTarget({ search: q({ utm_medium: "prospeccion", utm_campaign: "x-restaurante", utm_content: "<script>" }) });
  assert.deepEqual(t, { show: true, code: "" });
});

test("WhatsApp: wa.me/573144798220 con 'Hola, vi la carta video (código XXXX)'", () => {
  const link = new URL(cartaWhatsapp("K7M2QD"));
  assert.equal(link.origin + link.pathname, "https://wa.me/573144798220");
  assert.equal(link.searchParams.get("text"), "Hola, vi la carta video (código K7M2QD)");
  assert.match(new URL(cartaWhatsapp("")).searchParams.get("text"), /carta video/);
});

test("los archivos de la demo existen y el GIF del correo pesa menos de 1 MB", () => {
  for (const f of [CARTA_VIDEO.src, CARTA_VIDEO.poster, CARTA_VIDEO.qr, "/clonexa-media/carta-video.gif"]) {
    assert.ok(fs.existsSync(path.join(ROOT, "public", f)), f);
  }
  const gif = fs.statSync(path.join(ROOT, "public/clonexa-media/carta-video.gif")).size;
  assert.ok(gif < 1_000_000, `GIF ${gif} bytes`);
  const head = fs.readFileSync(path.join(ROOT, "public/clonexa-media/carta-video.gif")).subarray(0, 6).toString("ascii");
  assert.equal(head, "GIF89a");
});

test("la seccion no cambia el HTML prerenderizado (se decide en el navegador)", { skip: !HAS_DIST && "sin dist/" }, () => {
  const html = fs.readFileSync(path.join(ROOT, "dist", "index.html"), "utf8");
  assert.doesNotMatch(html, /id="carta-video"/);
});

test("el servidor entrega el GIF como image/gif", { skip: !HAS_DIST && "sin dist/" }, async () => {
  const port = 41799;
  const child = spawn(process.execPath, ["server.js"], { cwd: ROOT, env: { ...process.env, PORT: String(port) }, stdio: "pipe" });
  await new Promise((resolve, reject) => {
    child.stdout.on("data", (c) => String(c).includes("puerto") && resolve());
    setTimeout(() => reject(new Error("timeout")), 8000);
  });
  try {
    const res = await new Promise((resolve, reject) => {
      http.get({ host: "127.0.0.1", port, path: "/clonexa-media/carta-video.gif" }, (r) => { r.resume(); resolve(r); }).on("error", reject);
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers["content-type"], "image/gif");
  } finally {
    child.kill();
  }
});
