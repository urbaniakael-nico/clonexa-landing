// Landing "Tu negocio, en vivo": textos sin region, carta en video real, simulacion, reels, idiomas y peso inicial.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CARTA_MINI, CARTA_MOMENTS, DESIGN_3D, HERO_VIDEO, INSIDE_TABS, REELS, SCENE_SRC, SIM_TABS, driftKpi, kpiText, labelState, simAction } from "../src/live.js";
import es from "../src/i18n/es.json" with { type: "json" };
import en from "../src/i18n/en.json" with { type: "json" };
import fr from "../src/i18n/fr.json" with { type: "json" };

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const HAS_DIST = fs.existsSync(path.join(DIST, "index.html"));
const pub = (p) => path.join(ROOT, "public", p);
const DICTS = { es, en, fr };
const PREFIX = { es: "", en: "en/", fr: "fr/" };

function visibleText(html) {
  const body = html.slice(html.indexOf("<body"));
  return body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ");
}

function distPages(dir = DIST, prefix = "") {
  const pages = [];
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name === "assets" || d.name.startsWith(".")) continue;
    const file = path.join(dir, d.name, "index.html");
    if (fs.existsSync(file)) pages.push(path.join(prefix, d.name, "index.html"));
    pages.push(...distPages(path.join(dir, d.name), path.join(prefix, d.name)));
  }
  return prefix ? pages : ["index.html", "404.html", ...pages];
}

test("todos los archivos de la landing en vivo existen", () => {
  const files = [HERO_VIDEO.small, HERO_VIDEO.large, HERO_VIDEO.poster, HERO_VIDEO.posterSm, CARTA_MINI,
    ...Object.values(CARTA_MOMENTS).map((m) => m.poster),
    ...SIM_TABS.flatMap((t) => Object.values(SCENE_SRC(t.scene))),
    DESIGN_3D.main.src, DESIGN_3D.main.srcSm, DESIGN_3D.templates.src, DESIGN_3D.templates.srcSm, ...DESIGN_3D.characters.map((c) => c.src),
    ...REELS.flatMap((r) => [r.src, r.poster])];
  for (const f of files) assert.ok(fs.existsSync(pub(f)), f);
});

test("videos livianos: portada < 700 KB, carta mini < 400 KB, reels < 1,5 MB", () => {
  assert.ok(fs.statSync(pub(HERO_VIDEO.large)).size < 700_000);
  assert.ok(fs.statSync(pub(HERO_VIDEO.small)).size < 350_000);
  assert.ok(fs.statSync(pub(CARTA_MINI)).size < 400_000);
  for (const r of REELS) assert.ok(fs.statSync(pub(r.src)).size < 1_500_000, r.src);
});

test("carta en video: momentos de cada plato y nunca la foto de empanadas", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(CARTA_MOMENTS).map(([k, v]) => [k, v.start])),
    { ceviche: 0, nachos: 3.5, lomo: 7.8, hamburguesa: 9.5 }
  );
  assert.equal(INSIDE_TABS.find((t) => t.id === "restaurante").carta, "hamburguesa");
  assert.equal(INSIDE_TABS.find((t) => t.id === "bar").carta, "nachos");
  const src = ["src/live.js", "src/live.jsx", "src/extras.jsx", "src/App.jsx", "src/content.js"].map((f) => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
  assert.doesNotMatch(src, /empanada/i);
});

test("así funciona por dentro: 6 nichos con 3 pasos y una captura real cada uno", () => {
  assert.deepEqual(INSIDE_TABS.map((t) => es.inside.tabs[t.id].label), ["Restaurante", "Bar", "Taller", "Campo", "Call center", "Tienda"]);
  for (const tab of INSIDE_TABS) {
    assert.ok(fs.existsSync(pub(`capturas/${tab.shot}.webp`)), tab.shot);
    assert.ok(es.inside.tabs[tab.id].toasts.length >= 2, tab.id);
  }
  assert.deepEqual(es.inside.tabs.restaurante.steps.map(([t]) => t), ["El cliente pide con el QR", "Llega directo a cocina", "La caja cuadra sola"]);
});

test("simulación: cada botón de acción cambia las cifras y deja un aviso (en cada idioma)", () => {
  assert.deepEqual(SIM_TABS.map((t) => es.sim.tabs[t.id].label), ["Restaurante", "Bar", "Taller", "Campo", "Call center"]);
  for (const tab of SIM_TABS) {
    const kpis = Object.fromEntries(tab.kpis.map((k) => [k.id, k.value]));
    for (const t of [es, en, fr]) {
      const text = t.sim.tabs[tab.id];
      const { kpis: next, toast } = simAction(tab.id, kpis, () => 0.5, text.toast);
      assert.ok(toast && toast.length > 10 && !toast.includes("{"), `${tab.id}: aviso`);
      assert.notDeepEqual(next, kpis, `${tab.id}: las cifras cambian`);
      assert.ok(text.action.length > 5 && text.points.length === 4);
    }
    for (const k of tab.kpis) {
      const drifted = driftKpi(k, k.value, () => 0.9);
      if (k.min !== undefined) assert.ok(drifted >= k.min, `${tab.id}.${k.id} min`);
      if (k.max !== undefined) assert.ok(drifted <= k.max, `${tab.id}.${k.id} max`);
    }
    for (const [x, y] of tab.pos) assert.ok(x >= 0 && x <= 100 && y >= 0 && y <= 100);
  }
  assert.equal(kpiText({ money: true }, 2468000, "es"), "$ 2.468.000");
  assert.equal(kpiText({ money: true }, 2468000, "en"), "$2,468");
  assert.equal(kpiText({ seconds: true }, 38), "0:38");
  assert.deepEqual(labelState("+Agente 1 · En llamada · {t}", 151), { kind: "on", text: "Agente 1 · En llamada · 02:31" });
  assert.deepEqual(labelState("!Agente 7 · Pausa", 0), { kind: "warn", text: "Agente 7 · Pausa" });
});

test("reels: los 6 en el orden pedido", () => {
  assert.deepEqual(REELS.map((r) => es.reels.items[r.id]), ["Restaurante", "Bar", "Taller", "Call center", "Campo", "Domicilios"]);
});

const REGION = /bogot[aá]|colombia|latinoam[eé]rica|latin america|kennedy|chapinero|medell[ií]n/i;
const NAME = /nicol[aá]s|g[oó]mez/i;

test("ningún texto visible con región ni con el nombre del dueño (salvo privacidad y términos), en los 3 idiomas", { skip: !HAS_DIST && "sin dist/" }, () => {
  const pages = distPages();
  assert.ok(pages.length >= 30, `paginas: ${pages.length}`);
  for (const page of pages) {
    const html = fs.readFileSync(path.join(DIST, page), "utf8");
    const legal = /(^|[\\/])(privacidad|terminos)[\\/]/.test(page);
    const text = visibleText(html);
    if (!legal) {
      assert.doesNotMatch(text, REGION, `${page}: región visible`);
      assert.doesNotMatch(text, NAME, `${page}: nombre visible`);
    }
    // title y description tampoco nombran region (la direccion vive solo en el JSON-LD)
    const head = html.slice(0, html.indexOf("</head>")).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
    if (!legal) assert.doesNotMatch(head, REGION, `${page}: región en el head`);
    assert.doesNotMatch(text, /para más tips|s[ií]gueme/i, `${page}: eslogan`);
  }
});

test("inicio en cada idioma: secciones en orden, CTA del idioma, celulares con video y sin cifras de casos", { skip: !HAS_DIST && "sin dist/" }, () => {
  for (const [lang, t] of Object.entries(DICTS)) {
    const html = fs.readFileSync(path.join(DIST, PREFIX[lang], "index.html"), "utf8");
    const ids = ["inicio", "soluciones", "en-vivo", "disena", "funciones", "reels", "arma", "planes", "preguntas", "agenda"];
    const pos = ids.map((id) => html.indexOf(`id="${id}"`));
    pos.forEach((p, i) => assert.ok(p > 0, `${lang}: falta #${ids[i]}`));
    assert.deepEqual([...pos].sort((a, b) => a - b), pos, `${lang}: orden de las secciones`);
    assert.ok(html.includes(`<title>${t.meta.home.title}</title>`), `${lang}: title`);
    assert.ok(html.includes(`>${t.common.cta}<`), `${lang}: CTA`);
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    const phones = html.match(/<div class="cphone[^"]*"><video[^>]*>/g) || [];
    assert.ok(phones.length >= 4, `${lang}: celulares con video: ${phones.length}`);
    for (const p of phones) assert.match(p, /data-moment="(ceviche|nachos|lomo|hamburguesa)"/);
    assert.doesNotMatch(html, /rest-qr|bar-qr/);
    assert.doesNotMatch(visibleText(html), /RESULTADOS DE CLIENTES|100 ?%|< ?5 min/);
    for (const net of ["instagram.com/clonexaapp", "tiktok.com/@clonexxa", "facebook.com/1397005896827159", "linkedin.com/company/146691274", "youtube.com/@CLONEXASAAS"]) {
      assert.ok(html.includes(net), `${lang}: ${net}`);
    }
  }
  const live = fs.readFileSync(path.join(ROOT, "src/live.jsx"), "utf8");
  assert.match(live, /v\.src = CARTA_MINI/, "los celulares cargan la carta en video real");
});

test("páginas de nicho (3 idiomas): abren con su pestaña de Así funciona por dentro y su simulación", { skip: !HAS_DIST && "sin dist/" }, () => {
  const expected = { restaurantes: ["restaurante", "restaurante"], bares: ["bar", "bar"], "talleres-y-fabricas": ["taller", "taller"], "call-centers": ["callcenter", "callcenter"], "personal-en-campo": ["campo", "campo"] };
  for (const lang of Object.keys(DICTS)) {
    for (const [slug, [inside, sim]] of Object.entries(expected)) {
      const html = fs.readFileSync(path.join(DIST, PREFIX[lang], slug, "index.html"), "utf8");
      assert.match(html, new RegExp(`id="dentro-tab-${inside}"[^>]*aria-selected="true"|aria-selected="true"[^>]*id="dentro-tab-${inside}"`), `${lang}/${slug}: pestaña`);
      assert.match(html, new RegExp(`id="sim-tab-${sim}"[^>]*aria-selected="true"|aria-selected="true"[^>]*id="sim-tab-${sim}"`), `${lang}/${slug}: simulación`);
    }
  }
});

test("peso inicial de la portada < 1,5 MB (HTML, CSS, JS, diccionario e imagenes sin carga diferida)", { skip: !HAS_DIST && "sin dist/" }, () => {
  for (const lang of Object.keys(DICTS)) {
    const html = fs.readFileSync(path.join(DIST, PREFIX[lang], "index.html"), "utf8");
    let total = Buffer.byteLength(html);
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
    for (const a of new Set(assets)) total += fs.statSync(path.join(DIST, a)).size;
    for (const img of html.match(/<img [^>]*>/g)) {
      if (/loading="lazy"/.test(img)) continue;
      const src = img.match(/ src="([^"]+)"/)[1];
      total += fs.statSync(path.join(DIST, src)).size;
    }
    assert.ok(total < 1_500_000, `${lang}: peso inicial ${total}`);
  }
});

test("TBT: la simulacion, Diseña en 3D, juguetes, reels y los otros idiomas van en archivos JS aparte", { skip: !HAS_DIST && "sin dist/" }, () => {
  const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  const main = html.match(/src="(\/assets\/main-[^"]+\.js)"/)[1];
  const code = fs.readFileSync(path.join(DIST, main), "utf8");
  assert.doesNotMatch(code, /Simular llamada entrante|Simulate an incoming call/, "simulacion fuera del paquete principal");
  assert.doesNotMatch(code, /Mira cómo se vería|Arma tu local como en/, "diccionario fuera del paquete principal");
  assert.ok(fs.readdirSync(path.join(DIST, "assets")).some((f) => /^sim-.*\.js$/.test(f)), "archivo de la simulacion");
  assert.ok(fs.readdirSync(path.join(DIST, "assets")).some((f) => /^extras-.*\.js$/.test(f)), "archivo de extras");
  // la pagina en espanol solo precarga su diccionario
  assert.match(html, /<link rel="modulepreload" href="\/assets\/es-[^"]+\.js" \/>/);
  assert.doesNotMatch(html, /assets\/(en|fr)-[^"]+\.js/);
});
