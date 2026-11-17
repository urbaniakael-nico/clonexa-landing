// Secciones que se descargan aparte y se hidratan al acercarse a la pantalla (ver defer.jsx).
// El id es el de la <section> que cada una pinta (el HTML prerenderizado ya lo trae).
import { lazyNear } from "./defer.jsx";

export const LiveSim = lazyNear("en-vivo", () => import("./sim.jsx"));
export const Design3D = lazyNear("disena", () => import("./extras.jsx"), (m) => m.Design3D);
export const Toys = lazyNear("funciones", () => import("./extras.jsx"), (m) => m.Toys);
export const Reels = lazyNear("reels", () => import("./extras.jsx"), (m) => m.Reels);
