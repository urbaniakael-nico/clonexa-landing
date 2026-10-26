import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import Root from "./Root.jsx";
import "./landing.css";

// En produccion el HTML ya viene prerenderizado (se hidrata); en desarrollo se renderiza aqui.
const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <Root path={window.location.pathname} />
  </React.StrictMode>
);
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
