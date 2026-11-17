import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { legalPagesPlugin } from "./legal/pages.js";

// Railway mientras tanto y el dominio propio (con y sin www).
const ALLOWED_HOSTS = [".up.railway.app", "clonexa.com.co", "www.clonexa.com.co"];

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), legalPagesPlugin()],
  // El build SSR (prerender) solo usa src/entry-server.jsx; el del cliente, las paginas HTML.
  build: isSsrBuild
    ? {}
    : {
        // manifest: el prerender lo lee para precargar el diccionario del idioma de cada pagina.
        manifest: true,
        rollupOptions: {
          input: {
            main: "index.html",
            privacidad: "privacidad/index.html",
            terminos: "terminos/index.html",
            "borrar-datos": "borrar-datos/index.html",
            "en-privacidad": "en/privacidad/index.html",
            "en-terminos": "en/terminos/index.html",
            "en-borrar-datos": "en/borrar-datos/index.html",
            "fr-privacidad": "fr/privacidad/index.html",
            "fr-terminos": "fr/terminos/index.html",
            "fr-borrar-datos": "fr/borrar-datos/index.html"
          }
        }
      },
  server: {
    host: "0.0.0.0",
    allowedHosts: ALLOWED_HOSTS
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: ALLOWED_HOSTS
  }
}));
