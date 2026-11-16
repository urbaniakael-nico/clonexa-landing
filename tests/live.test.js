// Landing "Tu negocio, en vivo": textos sin region, carta en video real, simulacion, reels y peso inicial.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CARTA_MINI,
  CARTA_MOMENTS,
  DESIGN_3D,
  HERO_VIDEO,
  INSIDE_TABS,
  REELS,
  SCENE_SRC,
  SIM_TABS,
  driftKpi,
  kpiText,
  simAction
} from "../src/live.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const HAS_DIST = fs.existsSync(path.join(DIST, "index.html"));
const pub = (p) => path.join(ROOT, "public", p);

function visibleText(html) {
  const body = html.slice(html.indexOf("<body"));
  return body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ");
}

function distPages() {
  const pages = ["index.html", "404.html"];
  for (const d of fs.readdirSync(DIST, { withFileTypes: true })) {
    if (d.isDirectory() && fs.existsSync(path.join(DIST, d.name, "index.html"))) pages.push(path.join(d.name, "index.html"));
  }
  return pages;
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
  const src = ["src/live.js", "src/live.jsx", "src/App.jsx", "src/content.js"].map((f) => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
  assert.doesNotMatch(src, /empanada/i);
});

test("así funciona por dentro: 6 nichos con 3 pasos y una captura real cada uno", () => {
  assert.deepEqual(INSIDE_TABS.map((t) => t.label), ["Restaurante", "Bar", "Taller", "Campo", "Call center", "Tienda"]);
  for (const tab of INSIDE_TABS) {
    assert.equal(tab.steps.length, 3, tab.id);
    assert.ok(fs.existsSync(pub(`capturas/${tab.shot}.webp`)), tab.shot);
    assert.ok(tab.toasts.length >= 2, tab.id);
  }
  assert.deepEqual(INSIDE_TABS[0].steps.map(([t]) => t), ["El cliente pide con el QR", "Llega directo a cocina", "La caja cuadra sola"]);
});

test("simulación: cada botón de acción cambia las cifras y deja un aviso", () => {
  assert.deepEqual(SIM_TABS.map((t) => t.label), ["Restaurante", "Bar", "Taller", "Campo", "Call center"]);
  for (const tab of SIM_TABS) {
    const kpis = Object.fromEntries(tab.kpis.map((k) => [k.id, k.value]));
    const { kpis: next, toast } = simAction(tab.id, kpis, () => 0.5);
    assert.ok(toast && toast.length > 10, `${tab.id}: aviso`);
    assert.notDeepEqual(next, kpis, `${tab.id}: las cifras cambian`);
    for (const k of tab.kpis) {
      assert.equal(typeof kpiText(k, next[k.id]), "string");
      const drifted = driftKpi(k, kpis[k.id], () => 0.9);
      if (k.min !== undefined) assert.ok(drifted >= k.min, `${tab.id}.${k.id} min`);
      if (k.max !== undefined) assert.ok(drifted <= k.max, `${tab.id}.${k.id} max`);
    }
    for (const label of tab.labels) assert.ok(label[0] >= 0 && label[0] <= 100 && label[1] >= 0 && label[1] <= 100);
    assert.ok(tab.action.length > 5 && tab.points.length === 4);
  }
  assert.equal(kpiText({ money: true }, 2468000), "$ 2.468.000");
  assert.equal(kpiText({ seconds: true }, 38), "0:38");
});

test("reels: los 6 en el orden pedido", () => {
  assert.deepEqual(REELS.map((r) => r.label), ["Restaurante", "Bar", "Taller", "Call center", "Campo", "Domicilios"]);
});

const REGION = /bogot[aá]|colombia|latinoam[eé]rica|kennedy|chapinero|medell[ií]n/i;
const NAME = /nicol[aá]s|g[oó]mez/i;

test("ningún texto visible con región ni con el nombre del dueño (salvo privacidad y términos)", { skip: !HAS_DIST && "sin dist/" }, () => {
  for (const page of distPages()) {
    const html = fs.readFileSync(path.join(DIST, page), "utf8");
    const legal = /^(privacidad|terminos)[\\/]/.test(page);
    const text = visibleText(html);
    if (!legal) {
      assert.doesNotMatch(text, REGION, `${page}: región visible`);
      assert.doesNotMatch(text, NAME, `${page}: nombre visible`);
    }
    // title y description tampoco nombran region (la direccion vive solo en el JSON-LD)
    const head = html.slice(0, html.indexOf("</head>")).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
    if (!legal) assert.doesNotMatch(head, REGION, `${page}: región en el head`);
  }
});

test("inicio: secciones en orden, CTA único, celulares con video y sin cifras de casos", { skip: !HAS_DIST && "sin dist/" }, () => {
  const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  const ids = ["inicio", "soluciones", "en-vivo", "disena", "funciones", "reels", "arma", "planes", "preguntas", "agenda"];
  const pos = ids.map((id) => html.indexOf(`id="${id}"`));
  pos.forEach((p, i) => assert.ok(p > 0, `falta #${ids[i]}`));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, "orden de las secciones");
  assert.match(html, /<title>Clonexa · Tu negocio, en vivo<\/title>/);
  assert.match(html, />Pide tu demo gratis</);
  assert.doesNotMatch(html, /Agenda tu demo|Quiero mi demo/);
  // celulares de carta: video (con poster del plato), nunca la captura vieja de iconos
  const phones = html.match(/<div class="cphone[^"]*"><video[^>]*>/g) || [];
  assert.ok(phones.length >= 4, `celulares con video: ${phones.length}`);
  for (const p of phones) assert.match(p, /data-moment="(ceviche|nachos|lomo|hamburguesa)"/);
  const live = fs.readFileSync(path.join(ROOT, "src/live.jsx"), "utf8");
  assert.match(live, /v\.src = CARTA_MINI/, "los celulares cargan la carta en video real");
  assert.doesNotMatch(html, /rest-qr|bar-qr/);
  assert.doesNotMatch(visibleText(html), /RESULTADOS DE CLIENTES|100 ?%|< ?5 min/);
  // Siguenos con los enlaces de siempre
  for (const net of ["instagram.com/clonexaapp", "tiktok.com/@clonexxa", "facebook.com/1397005896827159", "linkedin.com/company/146691274", "youtube.com/@CLONEXASAAS"]) {
    assert.ok(html.includes(net), net);
  }
});

test("páginas de nicho: abren con su pestaña de Así funciona por dentro y su simulación", { skip: !HAS_DIST && "sin dist/" }, () => {
  const expected = { restaurantes: ["restaurante", "restaurante"], bares: ["bar", "bar"], "talleres-y-fabricas": ["taller", "taller"], "call-centers": ["callcenter", "callcenter"], "personal-en-campo": ["campo", "campo"] };
  for (const [slug, [inside, sim]] of Object.entries(expected)) {
    const html = fs.readFileSync(path.join(DIST, slug, "index.html"), "utf8");
    assert.match(html, new RegExp(`id="dentro-tab-${inside}"[^>]*aria-selected="true"|aria-selected="true"[^>]*id="dentro-tab-${inside}"`), `${slug}: pestaña`);
    assert.match(html, new RegExp(`id="sim-tab-${sim}"[^>]*aria-selected="true"|aria-selected="true"[^>]*id="sim-tab-${sim}"`), `${slug}: simulación`);
  }
});

test("peso inicial de la portada < 1,5 MB (HTML, CSS, JS, fuentes e imagenes sin carga diferida)", { skip: !HAS_DIST && "sin dist/" }, () => {
  const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  let total = Buffer.byteLength(html);
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
  for (const a of new Set(assets)) total += fs.statSync(path.join(DIST, a)).size;
  // imagenes que no son lazy (la portada pide la grande en computador: el peor caso)
  for (const img of html.match(/<img [^>]*>/g)) {
    if (/loading="lazy"/.test(img)) continue;
    const src = img.match(/ src="([^"]+)"/)[1];
    total += fs.statSync(path.join(DIST, src)).size;
  }
  assert.ok(total < 1_500_000, `peso inicial ${total}`);
});
