// Menu movil de las paginas legales (mismo comportamiento que la landing).
const menu = document.querySelector("[data-menu]");

document.querySelector("[data-menu-open]")?.addEventListener("click", () => {
  menu.hidden = false;
});

document.querySelector("[data-menu-close]")?.addEventListener("click", () => {
  menu.hidden = true;
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.hidden = true;
  });
});
