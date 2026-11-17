// Enlaces de WhatsApp y redes, reglas de contenido, capturas y validacion del formulario.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  BUILDER_MODULES,
  PLAN_IDS,
  PLAN_RECOMMENDED,
  SHOTS,
  SOCIAL,
  builderSummary,
  builderWhatsapp,
  demoRequestMessage,
  planWhatsapp,
  solutionWhatsapp,
  waGeneral,
  waLink
} from "../src/content.js";
import { validateDemoForm } from "../src/form.js";
import { INSIDE_TABS } from "../src/live.js";
import es from "../src/i18n/es.json" with { type: "json" };
import en from "../src/i18n/en.json" with { type: "json" };
import fr from "../src/i18n/fr.json" with { type: "json" };

const WA = /^https:[/][/]wa[.]me[/]573144798220[?]text=.+/;
const text = (link) => decodeURIComponent(new URL(link).searchParams.get("text"));

test("todos los enlaces de WhatsApp van a wa.me/573144798220 con el mensaje en el idioma de la pagina", () => {
  for (const t of [es, en, fr]) {
    assert.match(waGeneral(t), WA);
    assert.match(text(waGeneral(t)), /d[eé]mo/i);
    for (const tab of INSIDE_TABS) {
      const business = t.inside.tabs[tab.id].business;
      const link = solutionWhatsapp(t, business);
      assert.match(link, WA);
      assert.ok(text(link).includes(business), `${tab.id}: el mensaje nombra el negocio`);
    }
    for (const id of PLAN_IDS) {
      const link = planWhatsapp(t, id);
      assert.match(link, WA);
      assert.ok(text(link).includes(t.plans.items[id].name), `${id}: el mensaje nombra el plan`);
    }
  }
  const form = waLink(demoRequestMessage(es, { name: "Ana", business: "La Brasa, restaurante", whatsapp: "300 123 4567" }));
  assert.match(form, WA);
  assert.equal(text(form), "Hola Clonexa, quiero agendar mi demo gratis.\nNombre: Ana\nNegocio: La Brasa, restaurante\nWhatsApp: 300 123 4567");
  assert.match(text(waLink(demoRequestMessage(en, { name: "Ann", business: "Grill", whatsapp: "300" }))), /^Hi Clonexa.*\nName: Ann\nBusiness: Grill/s);
  assert.match(text(waLink(demoRequestMessage(fr, { name: "Anne", business: "Grill", whatsapp: "300" }))), /^Bonjour Clonexa.*\nNom: Anne\nEntreprise: Grill/s);
});

test("arma tu sistema: el mensaje de WhatsApp lleva los modulos elegidos", () => {
  const link = builderWhatsapp(es, ["callcenter", "pedidos", "gerencia"]);
  assert.match(link, WA);
  assert.equal(text(link), "Hola Clonexa, quiero cotizar un sistema Clonexa con: Pedidos, Call center, Gerencia.");
  assert.equal(text(builderWhatsapp(en, ["pedidos", "envivo"])), "Hi Clonexa, I'd like a quote for a Clonexa system with: Orders, Live 3D.");
  assert.equal(builderSummary([]).level, "");
  assert.equal(es.builder.levels[builderSummary(["pedidos"]).level], "Solución lista");
  const all = BUILDER_MODULES.map(([, id]) => id);
  assert.equal(es.builder.levels[builderSummary(all).level], "Empresa a la medida");
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

test("factura electronica 'proximamente' sin fechas; planes sin precios; modulos 3D en Arma tu sistema y en los planes", () => {
  const dianFaq = es.faq.items.find(([q]) => /DIAN/.test(q));
  assert.match(dianFaq[1], /próximamente/i);
  for (const t of [es, en, fr]) {
    const invoice = t.faq.items[t.faq.items.length - 1][1];
    assert.doesNotMatch(invoice, /20[0-9][0-9]|enero|january|janvier|diciembre|december|décembre/i);
    assert.doesNotMatch(JSON.stringify(t.plans), /[$]|COP|[0-9]{2,}[.,][0-9]{3}/);
  }
  const ids = BUILDER_MODULES.map(([, id]) => id);
  assert.ok(ids.includes("envivo") && ids.includes("diseno3d"));
  assert.deepEqual(PLAN_IDS.map((id) => es.plans.items[id].name), ["Esencial", "Operación completa", "A la medida"]);
  const completa = es.plans.items[PLAN_RECOMMENDED].items.map(([t]) => t);
  assert.ok(completa.includes("Negocio en vivo 3D") && completa.includes("Diseño 3D del local y personajes"));
});

const SOURCE = ["../src/content.js", "../src/live.js", "../src/live.jsx", "../src/sim.jsx", "../src/extras.jsx", "../src/App.jsx", "../src/layout.jsx", "../src/pages.jsx", "../src/industries.js", "../src/site.js", "../src/i18n/es.json", "../src/i18n/en.json", "../src/i18n/fr.json", "../index.html"]
  .map((f) => fs.readFileSync(new URL(f, import.meta.url), "utf8"))
  .join("\n");

test("sin cifras de clientes o usuarios en la pagina", () => {
  assert.doesNotMatch(SOURCE, /\d[\d.,]*\s*\+?\s*(clientes|usuarios|negocios|empresas|customers|users|businesses|companies|utilisateurs|entreprises)\b/i);
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
  const used = [...INSIDE_TABS.map((t) => t.shot), "campo-inicio", "taller-produccion", "hero-caja"];
  for (const id of used) assert.ok(SHOTS[id], `${id}: captura sin definir`);
  for (const [id, shot] of Object.entries(SHOTS)) {
    for (const t of [es, en, fr]) assert.ok(t.shots[id] && t.shots[id].length > 20, `${id}: alt descriptivo en cada idioma`);
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
  assert.doesNotMatch(es.shots["bar-barra"], /Alistando|columnas/);
});

test("la portada pide el poster chico en celular y el grande en computador", () => {
  const live = fs.readFileSync("src/live.jsx", "utf8");
  assert.match(live, /srcSet=\{`\$\{HERO_VIDEO\.posterSm\} 800w, \$\{HERO_VIDEO\.poster\} 1280w`\}/);
  assert.match(live, /fetchPriority="high"/);
});
