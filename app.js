function setupReveal() {
  const nodes = document.querySelectorAll(
    ".section-head, .day, .villa-hero, .villa-specs, .villa-gallery figure, .activity-list li, .guide-grid article, .food-list li, .sheet-embed, .tips"
  );
  nodes.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((el) => io.observe(el));
}

setupReveal();
