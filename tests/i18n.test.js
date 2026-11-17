// Idiomas: los diccionarios EN y FR tienen exactamente las mismas claves que ES (falla si falta una),
// los mismos marcadores {x}, las mismas listas y nada de regiones en el texto.
import test from "node:test";
import assert from "node:assert/strict";
import es from "../src/i18n/es.json" with { type: "json" };
import en from "../src/i18n/en.json" with { type: "json" };
import fr from "../src/i18n/fr.json" with { type: "json" };
import { localize, money, splitLang } from "../src/i18n/core.js";
import { INDUSTRY_PAGES } from "../src/industries.js";
import { INSIDE_TABS, SIM_TABS } from "../src/live.js";

// Recorre dos estructuras en paralelo y devuelve las diferencias (clave que falta o sobra, tipo o largo).
function diff(a, b, path = "") {
  const out = [];
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return [`${path}: deberia ser lista`];
    if (a.length !== b.length) out.push(`${path}: ${a.length} elementos en ES, ${b.length} en la traduccion`);
    a.forEach((v, i) => i < b.length && out.push(...diff(v, b[i], `${path}[${i}]`)));
    return out;
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object" || Array.isArray(b)) return [`${path}: deberia ser objeto`];
    for (const k of Object.keys(a)) {
      if (!(k in b)) out.push(`${path}.${k}: falta`);
      else out.push(...diff(a[k], b[k], `${path}.${k}`));
    }
    for (const k of Object.keys(b)) if (!(k in a)) out.push(`${path}.${k}: sobra (no existe en ES)`);
    return out;
  }
  if (typeof a !== typeof b) return [`${path}: tipo ${typeof a} en ES, ${typeof b} en la traduccion`];
  if (typeof a === "string") {
    if (!b.trim()) out.push(`${path}: vacio`);
    const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
    if (vars(a) !== vars(b)) out.push(`${path}: marcadores {${vars(a)}} en ES, {${vars(b)}} en la traduccion`);
    // marcador de estado de las etiquetas de la simulacion (+ activo, ! alerta)
    if (/^\.sim\.tabs\.\w+\.labels/.test(path) && (a[0] === "+" || a[0] === "!" ? a[0] : "") !== (b[0] === "+" || b[0] === "!" ? b[0] : "")) {
      out.push(`${path}: marcador de estado distinto`);
    }
  }
  if (typeof a === "boolean" && a !== b) out.push(`${path}: ${a} en ES, ${b} en la traduccion`);
  return out;
}

test("EN y FR tienen todas las claves de ES (y ninguna de mas)", () => {
  for (const [name, dict] of [["en", en], ["fr", fr]]) {
    const problems = diff(es, dict);
    assert.deepEqual(problems, [], `${name}:\n${problems.join("\n")}`);
  }
});

test("los diccionarios cubren cada pestana, cada etiqueta de la simulacion y cada industria", () => {
  for (const dict of [es, en, fr]) {
    for (const tab of INSIDE_TABS) assert.equal(dict.inside.tabs[tab.id].steps.length, 3, tab.id);
    for (const tab of SIM_TABS) {
      const text = dict.sim.tabs[tab.id];
      assert.equal(text.labels.length, tab.pos.length, `${tab.id}: una etiqueta por posicion`);
      assert.equal(text.zones.length, tab.zones.length, `${tab.id}: zonas`);
      for (const k of tab.kpis) assert.ok(text.kpis[k.id], `${tab.id}.${k.id}`);
    }
    for (const page of INDUSTRY_PAGES) assert.equal(dict.industries[page.slug].steps.length, page.shots.length, page.slug);
  }
});

test("textos en ingles y frances: traducidos (no copiados del espanol) y sin regiones", () => {
  const flat = (o) => (typeof o === "string" ? [o] : Array.isArray(o) ? o.flatMap(flat) : o && typeof o === "object" ? Object.values(o).flatMap(flat) : []);
  for (const [name, dict] of [["en", en], ["fr", fr]]) {
    const all = flat(dict).join("\n");
    assert.doesNotMatch(all, /colombia|bogot[aá]|latin ?america|am[eé]rique latine|\bUSA\b|[ÉE]tats-Unis|United States|\bDIAN\b/i, `${name}: region en el texto`);
    assert.doesNotMatch(all, /para más tips|follow (us )?for (more )?tips/i, `${name}: eslogan de tips`);
    assert.notEqual(dict.hero.title1, es.hero.title1, `${name}: portada sin traducir`);
    assert.notEqual(dict.industries.restaurantes.h1, es.industries.restaurantes.h1, `${name}: industria sin traducir`);
  }
  assert.doesNotMatch(flat(es).join("\n"), /colombia|bogot[aá]|latinoam[eé]rica/i, "es: region en el texto");
});

test("rutas por idioma: espanol en las rutas actuales, /en y /fr para los demas", () => {
  assert.deepEqual(splitLang("/"), { lang: "es", base: "/" });
  assert.deepEqual(splitLang("/bares"), { lang: "es", base: "/bares" });
  assert.deepEqual(splitLang("/en"), { lang: "en", base: "/" });
  assert.deepEqual(splitLang("/fr/call-centers/"), { lang: "fr", base: "/call-centers" });
  assert.equal(localize("en", "/"), "/en");
  assert.equal(localize("fr", "/restaurantes"), "/fr/restaurantes");
  assert.equal(localize("es", "/restaurantes"), "/restaurantes");
});

test("montos demo: pesos en espanol, dolares con el formato de cada idioma en ingles y frances", () => {
  assert.equal(money("es", 2468000), "$ 2.468.000");
  assert.equal(money("en", 2468000), "$2,468");
  assert.match(money("fr", 2468000), /^2[\s  ]468 \$ US$/);
});
