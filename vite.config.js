import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { legalPagesPlugin } from "./legal/pages.js";

// Railway mientras tanto y el dominio propio (con y sin www).
const ALLOWED_HOSTS = [".up.railway.app", "clonexa.com.co", "www.clonexa.com.co"];

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
    allowedHosts: ALLOWED_HOSTS
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: ALLOWED_HOSTS
  }
});
