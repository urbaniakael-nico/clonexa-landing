import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { legalPagesPlugin } from "./legal/pages.js";

export default defineConfig({
  plugins: [react(), legalPagesPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        privacidad: "privacidad/index.html",
        terminos: "terminos/index.html",
        "borrar-datos": "borrar-datos/index.html"
      }
    }
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "clonexa-landing-production.up.railway.app",
      ".up.railway.app"
    ]
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: [
      "clonexa-landing-production.up.railway.app",
      ".up.railway.app"
    ]
  }
});