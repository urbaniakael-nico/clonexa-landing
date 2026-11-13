// Enlace corto de la prospeccion: /r /b /t /c /s /l + codigo -> pagina del nicho con sus utm (302).
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { matchShortLink, resolveShortLink, NICHE_PAGE } from "../shortlinks.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HAS_DIST = fs.existsSync(path.join(ROOT, "dist", "index.html"));
const DEST = "https://www.clonexa.com.co/bares?utm_source=instagram&utm_medium=prospeccion&utm_campaign=techo-bar&utm_content=SXFB3W";

const fakeFetch = (status, body, calls = []) => async (url, opts) => {
  calls.push({ url, opts });
  return { status, ok: status >= 200 && status < 300, json: async () => body };
};

test("reconoce las 6 letras y codigos validos; lo demas no", () => {
  assert.deepEqual(matchShortLink("/b/sxfb3w"), { letter: "b", code: "SXFB3W" });
  assert.deepEqual(matchShortLink("/r/AB12CD/?x=1"), { letter: "r", code: "AB12CD" });
  for (const bad of ["/x/AB12CD", "/b/", "/b/a.b", "/bares", "/b/AB12CD/otro", "/b/123"]) assert.equal(matchShortLink(bad), null, bad);
  assert.deepEqual(Object.keys(NICHE_PAGE).sort(), ["b", "c", "l", "r", "s", "t"]);
});

test("redirige al destino del backend con los utm y manda el token propio", async () => {
  const calls = [];
  const to = await resolveShortLink("/b/SXFB3W", { fetchImpl: fakeFetch(200, { ok: true, destino: DEST }, calls), backend: "https://be.test", token: "tok" });
  assert.equal(to, DEST);
  assert.equal(calls[0].url, "https://be.test/api/v1/prospecting/link/b/SXFB3W");
  assert.equal(calls[0].opts.headers["X-Landing-Token"], "tok");
  const q = new URL(to).searchParams;
  assert.deepEqual(Object.fromEntries(q), { utm_source: "instagram", utm_medium: "prospeccion", utm_campaign: "techo-bar", utm_content: "SXFB3W" });
});

test("codigo inexistente: pagina principal, sin error", async () => {
  assert.equal(await resolveShortLink("/r/NOEXIST", { fetchImpl: fakeFetch(404, { detail: "no_existe" }), token: "tok" }), "/");
});

test("backend caido o sin token: pagina del nicho con utm_medium y utm_content (la apertura igual cuenta)", async () => {
  const down = async () => { throw new Error("ECONNREFUSED"); };
  assert.equal(await resolveShortLink("/t/K2M8QA", { fetchImpl: down, token: "tok" }), "/talleres-y-fabricas?utm_medium=prospeccion&utm_content=K2M8QA");
  assert.equal(await resolveShortLink("/s/K2M8QA", { token: "" }), "/?utm_medium=prospeccion&utm_content=K2M8QA#soluciones");
  assert.equal(await resolveShortLink("/r/K2M8QA", { fetchImpl: fakeFetch(500, {}), token: "tok" }), "/restaurantes?utm_medium=prospeccion&utm_content=K2M8QA#carta-video");
  // nunca a un dominio ajeno
  assert.equal(await resolveShortLink("/c/K2M8QA", { fetchImpl: fakeFetch(200, { destino: "https://evil.test/x" }), token: "tok" }), "/personal-en-campo?utm_medium=prospeccion&utm_content=K2M8QA");
});

test("servidor: /b/<codigo> responde 302 al destino del backend; codigo inexistente al inicio", { skip: !HAS_DIST && "falta npm run build" }, async () => {
  const backend = http.createServer((req, res) => {
    const ok = req.headers["x-landing-token"] === "tok-prueba";
    if (!ok) { res.writeHead(401); return res.end(); }
    if (req.url === "/api/v1/prospecting/link/b/SXFB3W") { res.writeHead(200, { "content-type": "application/json" }); return res.end(JSON.stringify({ ok: true, destino: DEST })); }
    res.writeHead(404); res.end("{}");
  });
  await new Promise((r) => backend.listen(0, "127.0.0.1", r));
  const port = 18000 + Math.floor(Math.random() * 1000);
  const child = spawn(process.execPath, ["server.js"], { cwd: ROOT, env: { ...process.env, PORT: String(port), CANONICAL_HOST: "",
    BACKEND_URL: `http://127.0.0.1:${backend.address().port}`, LANDING_LINK_TOKEN: "tok-prueba" }, stdio: "pipe" });
  try {
    await new Promise((resolve, reject) => { child.stdout.on("data", (c) => String(c).includes("puerto") && resolve()); setTimeout(() => reject(new Error("timeout")), 8000); });
    const get = (p) => new Promise((resolve) => http.get({ host: "127.0.0.1", port, path: p }, (res) => { res.resume(); resolve(res); }));
    const ok = await get("/b/SXFB3W");
    assert.equal(ok.statusCode, 302);
    assert.equal(ok.headers.location, DEST);
    assert.equal(ok.headers["cache-control"], "no-store");
    const miss = await get("/r/NOEXIST");
    assert.equal(miss.statusCode, 302);
    assert.equal(miss.headers.location, "/");
    assert.equal((await get("/bares")).statusCode, 200, "las paginas de siempre no cambian");
  } finally {
    child.kill();
    backend.close();
  }
});

test("paginas de nicho: botones grandes 'Síguenos para tips' a Instagram, TikTok y Facebook", { skip: !HAS_DIST && "falta npm run build" }, () => {
  for (const page of ["restaurantes", "bares", "talleres-y-fabricas", "personal-en-campo"]) {
    const html = fs.readFileSync(path.join(ROOT, "dist", page, "index.html"), "utf8");
    assert.match(html, /Síguenos para tips/, page);
    for (const [cls, url] of [["tips-instagram", "instagram.com/clonexaapp"], ["tips-tiktok", "tiktok.com/@clonexxa"], ["tips-facebook", "facebook.com/1397005896827159"]]) {
      const esc = (v) => v.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
      const href = esc(`https://www.${url}`);
      const re = new RegExp(`href="${href}[^"]*"[^>]*class="btn tipsBtn ${cls}"|class="btn tipsBtn ${cls}"[^>]*href="${href}`);
      assert.match(html, re, `${page}: ${cls}`);
    }
  }
});

test("GIF livianos de los 4 bumeranes (correo de prospeccion), publicos en /clonexa-media", () => {
  for (const n of ["restaurante", "bar", "taller", "campo"]) {
    const f = path.join(ROOT, "public", "clonexa-media", `bumeran-${n}.gif`);
    const buf = fs.readFileSync(f);
    assert.equal(buf.subarray(0, 6).toString("latin1"), "GIF89a", n);
    assert.ok(buf.length <= 1_000_000, `${n}: ${buf.length} bytes`);
  }
});
