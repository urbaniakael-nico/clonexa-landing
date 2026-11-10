// Enlaces de WhatsApp y redes, reglas de contenido, capturas y validacion del formulario.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  BUILDER_MODULES,
  COMPARISON,
  EXAMPLE_STEPS,
  FAQ,
  INDUSTRIES,
  PLANS,
  SHOTS,
  SOCIAL,
  SOLUTIONS,
  WA_GENERAL,
  builderSummary,
  builderWhatsapp,
  demoRequestMessage,
  planWhatsapp,
  solutionWhatsapp,
  waLink
} from "../src/content.js";
import { validateDemoForm } from "../src/form.js";

const WA = /^https:\/\/wa\.me\/573144798220\?text=.+/;
const text = (link) => decodeURIComponent(new URL(link).searchParams.get("text"));

test("todos los enlaces de WhatsApp van a wa.me/573144798220 con un mensaje en español", () => {
  assert.match(WA_GENERAL, WA);
  assert.match(text(WA_GENERAL), /demo/i);
  for (const tab of SOLUTIONS) {
    const link = solutionWhatsapp(tab);
    assert.match(link, WA);
    assert.ok(text(link).includes(tab.business), `${tab.id}: el mensaje nombra el negocio`);
  }
  for (const plan of PLANS) {
    const link = planWhatsapp(plan);
    assert.match(link, WA);
    assert.ok(text(link).includes(plan.name), `${plan.id}: el mensaje nombra el plan`);
  }
  const form = waLink(demoRequestMessage({ name: "Ana", business: "La Brasa, restaurante", whatsapp: "300 123 4567" }));
  assert.match(form, WA);
  assert.match(text(form), /Nombre: Ana\nNegocio: La Brasa, restaurante\nWhatsApp: 300 123 4567/);
});

test("arma tu sistema: el mensaje de WhatsApp lleva los modulos elegidos", () => {
  const link = builderWhatsapp(["Call center", "Pedidos", "Gerencia"]);
  assert.match(link, WA);
  assert.equal(text(link), "Hola Clonexa, quiero cotizar un sistema Clonexa con: Pedidos, Call center, Gerencia.");
  assert.equal(builderSummary([]).level, "");
  assert.equal(builderSummary(["Pedidos"]).level, "Solución lista");
  const all = BUILDER_MODULES.map(([, name]) => name);
  assert.equal(builderSummary(all).level, "Empresa a la medida");
  assert.equal(builderSummary(all).percent, 100);
});

test("redes: las 5 URL exactas con utm_source=web", () => {
  assert.deepEqual(Object.fromEntries(SOCIAL.map((s) => [s.id, s.url])), {
    instagram: "https://www.instagram.com/clonexaapp?utm_source=web",
    facebook: "https://www.facebook.com/1397005896827159?utm_source=web",
    tiktok: "https://www.tiktok.com/@clonexxa?utm_source=web",
    linkedin: "https://www.linkedin.com/company/146691274?utm_source=web",
    youtube: "https://www.youtube.com/@CLONEXASAAS?utm_source=web"
  });
});

test("DIAN Próximamente sin fechas; planes sin precios; industrias, pestañas y ejemplo de 6 pasos", () => {
  const dian = COMPARISON.find(([feature]) => /DIAN/.test(feature));
  assert.equal(dian[2], "soon");
  const dianFaq = FAQ.find(([q]) => /DIAN/.test(q));
  assert.match(dianFaq[1], /próximamente/i);
  assert.doesNotMatch(dianFaq[1], /\b20\d\d\b|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i);
  assert.doesNotMatch(JSON.stringify(PLANS), /\$|\bCOP\b|\d{2,}\.\d{3}/);
  assert.deepEqual(
    INDUSTRIES.map(([, label]) => label),
    ["Restaurantes", "Bares", "Talleres y fábricas", "Distribuidoras", "Tiendas y cadenas", "Call centers", "Personal en campo", "Tiendas en línea"]
  );
  assert.deepEqual(SOLUTIONS.map((t) => t.label), ["Restaurantes", "Bares", "Talleres y fábricas", "Personal en campo"]);
  assert.deepEqual(SOLUTIONS.map((t) => t.steps.length), [5, 4, 4, 2]);
  SOLUTIONS.forEach((t) => assert.equal(t.items.length, 5, t.id));
  assert.equal(EXAMPLE_STEPS.length, 6);
});

const SOURCE = ["../src/content.js", "../src/App.jsx", "../src/layout.jsx", "../src/pages.jsx", "../src/industries.js", "../src/site.js", "../index.html"]
  .map((f) => fs.readFileSync(new URL(f, import.meta.url), "utf8"))
  .join("\n");

test("sin cifras de clientes o usuarios en la pagina", () => {
  assert.doesNotMatch(SOURCE, /\d[\d.,]*\s*\+?\s*(clientes|usuarios|negocios|empresas)\b/i);
});

test("sin nombres de clientes reales ni funciones que no existen", () => {
  assert.doesNotMatch(SOURCE, /velvet|time machine|el socio|mundo case|asadero/i);
  assert.doesNotMatch(SOURCE, /grabaci[oó]n de llamadas|llamadas entrantes|mapas? de ruta/i);
});

// Ancho real de un WebP (VP8X, VP8L o VP8).
function webpWidth(buffer) {
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") return 1 + buffer.readUIntLE(24, 3);
  if (chunk === "VP8L") return 1 + (buffer.readUInt16LE(21) & 0x3fff);
  return buffer.readUInt16LE(26) & 0x3fff;
}

test("cada captura usada existe con su version pequeña, alt y el ancho declarado", () => {
  const used = [...SOLUTIONS.flatMap((t) => t.steps.map((s) => s.shot)), ...EXAMPLE_STEPS.map((s) => s.shot), "hero-caja"];
  for (const id of used) assert.ok(SHOTS[id], `${id}: captura sin definir`);
  for (const [id, shot] of Object.entries(SHOTS)) {
    assert.ok(shot.alt && shot.alt.length > 20, `${id}: alt descriptivo`);
    assert.ok(shot.width <= 1600, `${id}: max 1600 px`);
    for (const [src, width] of [
      [shot.src, shot.width],
      [shot.srcSm, shot.smWidth]
    ]) {
      const file = new URL(`../public${src}`, import.meta.url);
      assert.ok(fs.existsSync(file), `${id}: falta ${src}`);
      assert.equal(webpWidth(fs.readFileSync(file)), width, `${src}: ancho distinto al declarado`);
    }
  }
});

test("validacion simple del formulario", () => {
  assert.deepEqual(validateDemoForm({ name: "Ana", business: "La Brasa", whatsapp: "+57 300 123 4567" }), {});
  const bad = validateDemoForm({ name: " ", business: "x", whatsapp: "12" });
  assert.deepEqual(Object.keys(bad).sort(), ["business", "name", "whatsapp"]);
  assert.ok(validateDemoForm({ name: "Ana", business: "La Brasa", whatsapp: "1234567890123456" }).whatsapp, "mas de 15 digitos");
});

test("package.json con versiones exactas y package-lock presente", () => {
  const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  for (const [name, version] of Object.entries({ ...pkg.dependencies, ...(pkg.devDependencies || {}) })) {
    assert.match(version, /^\d+\.\d+\.\d+$/, `${name}@${version} no es exacta`);
  }
  const lock = JSON.parse(fs.readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"));
  for (const name of Object.keys(pkg.dependencies)) {
    assert.equal(lock.packages[`node_modules/${name}`].version, pkg.dependencies[name], `lock de ${name}`);
  }
});

// Medidas reales de un .webp (VP8X, VP8 o VP8L) sin dependencias.
function webpSize(file) {
  const b = fs.readFileSync(file);
  const kind = b.toString("ascii", 12, 16);
  if (kind === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (kind === "VP8L") { const v = b.readUInt32LE(21); return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
}

test("cada captura declara las medidas reales de su archivo (no se estira ni se recorta) y su version -sm existe", () => {
  for (const [id, shot] of Object.entries(SHOTS)) {
    const file = `public${shot.src}`;
    assert.ok(fs.existsSync(file), `${id}: falta ${file}`);
    if (shot.video) { assert.ok(fs.existsSync(`public${shot.video}`), `${id}: falta el video`); continue; }
    const [w, h] = webpSize(file);
    assert.equal(w, shot.width, `${id}: ancho del archivo ${w} != ${shot.width}`);
    assert.equal(h, shot.height, `${id}: alto del archivo ${h} != ${shot.height}`);
    const [sw, sh] = webpSize(`public${shot.srcSm}`);
    assert.equal(sw, shot.smWidth, `${id}: -sm mide ${sw}`);
    assert.ok(Math.abs(sw / sh - w / h) < 0.02, `${id}: -sm con otra proporcion`);
  }
});

test("bares paso 2: el panel de barra nuevo (no las columnas viejas rotas)", () => {
  assert.equal(SHOTS["bar-barra"].width, 1600);
  assert.doesNotMatch(SHOTS["bar-barra"].alt, /Alistando|columnas/);
});

test("la captura grande del inicio pide la version grande en tableta (sizes = ancho real en una columna)", () => {
  const app = fs.readFileSync("src/App.jsx", "utf8");
  assert.match(app, /ShotImage id=\{HERO_SHOT\} eager sizes="\(max-width: 1040px\) min\(92vw, 680px\), 640px"/);
});
