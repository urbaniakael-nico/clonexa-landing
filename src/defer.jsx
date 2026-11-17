// Hidratacion diferida: las secciones de abajo llegan completas en el HTML prerenderizado (SEO y
// primer pintado), pero React no las hidrata ni descarga su JavaScript hasta que se acercan a la
// pantalla. Asi la portada queda interactiva rapido (menos TBT) sin quitar nada.
//
// Como funciona: cada seccion va dentro de <Suspense>. En el navegador, el componente "suspende"
// (lanza una promesa) hasta que la seccion esta a ~600 px de verse; React deja intacto el HTML del
// servidor mientras tanto y la hidrata al resolverse. En el prerender no suspende nunca.
import React from "react";

const IS_SERVER = typeof window === "undefined";
const MARGIN = "600px";
const gates = new Map();

function gate(id) {
  let g = gates.get(id);
  if (g) return g;
  g = { done: false };
  g.promise = new Promise((resolve) => {
    const finish = () => {
      g.done = true;
      resolve();
    };
    const el = document.getElementById(id);
    if (!el || !("IntersectionObserver" in window)) {
      finish();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          finish();
        }
      },
      { rootMargin: MARGIN }
    );
    io.observe(el);
    // Si la persona toca o escribe dentro antes de tiempo, se hidrata ya.
    const now = () => {
      io.disconnect();
      finish();
    };
    el.addEventListener("pointerdown", now, { once: true, capture: true });
    el.addEventListener("focusin", now, { once: true, capture: true });
  });
  gates.set(id, g);
  return g;
}

function Gate({ id, children }) {
  if (!IS_SERVER) {
    const g = gate(id);
    if (!g.done) throw g.promise;
  }
  return children;
}

// Seccion con hidratacion diferida (el codigo ya esta en el paquete principal).
export function Deferred({ id, children }) {
  return (
    <React.Suspense fallback={null}>
      <Gate id={id}>{children}</Gate>
    </React.Suspense>
  );
}

const lazies = [];

// Componente en su propio archivo JS: se descarga y se hidrata cuando la seccion `id` se acerca.
// En el prerender se carga antes de renderizar (preloadAll).
export function lazyNear(id, loader, pick = (m) => m.default) {
  let Comp = null;
  let promise = null;
  const load = () => (promise ||= loader().then((m) => {
    Comp = pick(m);
  }));
  function Inner(props) {
    if (Comp) return <Comp {...props} />;
    if (IS_SERVER) throw new Error(`lazyNear(${id}): falta preloadAll() antes del prerender`);
    const g = gate(id);
    throw g.done ? load() : g.promise.then(load);
  }
  function Near(props) {
    return (
      <React.Suspense fallback={null}>
        <Inner {...props} />
      </React.Suspense>
    );
  }
  lazies.push(load);
  return Near;
}

export function preloadAll() {
  return Promise.all(lazies.map((load) => load()));
}

// Corre fn cuando el navegador esta quieto (o despues de `ms` como maximo).
export function whenIdle(fn, ms = 2500) {
  if (IS_SERVER) return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout: ms });
    return () => window.cancelIdleCallback?.(id);
  }
  const id = setTimeout(fn, 1200);
  return () => clearTimeout(id);
}
