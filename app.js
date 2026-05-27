const revealItems = document.querySelectorAll(
  ".mini-grid article, .steps article, .systems article, .assembly, .video-box, .cta, .hero-visual"
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => {
  item.classList.add("reveal");
  observer.observe(item);
});
