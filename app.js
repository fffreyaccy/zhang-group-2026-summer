function setupReveal() {
  const nodes = document.querySelectorAll(
    ".section-head, .day, .moments-grid figure, .villa-hero, .villa-specs, .villa-gallery figure, .play-list li, .guide-grid article, .sheet-embed, .tips"
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
