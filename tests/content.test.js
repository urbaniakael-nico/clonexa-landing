// Enlaces de WhatsApp y redes, reglas de contenido y validacion del formulario.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  COMPARISON,
  DEMO_TABS,
  FAQ,
  PLANS,
  SHOTS,
  SOCIAL,
  WA_GENERAL,
  demoRequestMessage,
  planWhatsapp,
  tabWhatsapp,
  waLink
} from "../src/content.js";
import { validateDemoForm } from "../src/form.js";

const WA = /^https:\/\/wa\.me\/13468244098\?text=.+/;
const text = (link) => decodeURIComponent(new URL(link).searchParams.get("text"));

test("todos los enlaces de WhatsApp van a wa.me/13468244098 con un mensaje en español", () => {
  assert.match(WA_GENERAL, WA);
  assert.match(text(WA_GENERAL), /demo/i);
  for (const tab of DEMO_TABS) {
    const link = tabWhatsapp(tab);
    assert.match(link, WA);
    assert.ok(text(link).includes(tab.business), `${tab.id}: el mensaje nombra el negocio`);
  }
  for (const plan of PLANS) {
    const link = planWhatsapp(plan);
    assert.match(link, WA);
    assert.ok(text(link).includes(plan.name), `${plan.id}: el mensaje nombra el plan`);
  }
  const form = waLink(demoRequestMessage({ name: "Ana", business: "La Brasa, asadero", whatsapp: "300 123 4567" }));
  assert.match(form, WA);
  assert.match(text(form), /Nombre: Ana\nNegocio: La Brasa, asadero\nWhatsApp: 300 123 4567/);
});

test("redes: las 5 URL exactas", () => {
  assert.deepEqual(
    Object.fromEntries(SOCIAL.map((s) => [s.id, s.url])),
    {
      instagram: "https://www.instagram.com/clonexaapp",
      facebook: "https://www.facebook.com/1397005896827159",
      tiktok: "https://www.tiktok.com/@clonexxa",
      linkedin: "https://www.linkedin.com/company/146691274",
      youtube: "https://www.youtube.com/@CLONEXASAAS"
    }
  );
});

test("DIAN siempre como Próximamente, sin fechas; planes sin precios; 6 preguntas; 4 pestañas con 5 beneficios", () => {
  const dian = COMPARISON.find(([feature]) => /DIAN/.test(feature));
  assert.equal(dian[2], "soon");
  const dianFaq = FAQ.find(([q]) => /DIAN/.test(q));
  assert.match(dianFaq[1], /próximamente/i);
  assert.doesNotMatch(dianFaq[1], /\b20\d\d\b|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i);
  assert.doesNotMatch(JSON.stringify(PLANS), /\$|\bCOP\b|\d{2,}\.\d{3}/);
  assert.equal(FAQ.length, 6);
  assert.deepEqual(DEMO_TABS.map((t) => t.label), ["Restaurantes y asaderos", "Bares", "Talleres de confección", "Personal en campo"]);
  DEMO_TABS.forEach((t) => assert.equal(t.items.length, 5, t.id));
});

test("sin cifras de clientes o usuarios en la pagina", () => {
  const source = fs.readFileSync(new URL("../src/content.js", import.meta.url), "utf8") + fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\d[\d.,]*\s*\+?\s*(clientes|usuarios|negocios|empresas)\b/i);
});

test("cada captura existe en /public/capturas con su version pequeña y tiene alt", () => {
  for (const [id, shot] of Object.entries(SHOTS)) {
    assert.ok(shot.alt && shot.alt.length > 20, `${id}: alt descriptivo`);
    assert.ok(fs.existsSync(new URL(`../public${shot.src}`, import.meta.url)), `${id}: falta ${shot.src}`);
    assert.ok(fs.existsSync(new URL(`../public${shot.src.replace(".webp", "-sm.webp")}`, import.meta.url)), `${id}: falta la version pequeña`);
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
