// cursor-trail.js
(function () {
  // Disable on touch devices
  if ("ontouchstart" in window) return;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  const MAX_DOTS = 10;
  let dots = [];

  document.addEventListener("mousemove", (e) => {
    const dot = document.createElement("div");
    dot.className = "cursor-trail-dot";

    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;

    document.body.appendChild(dot);
    dots.push(dot);

    if (dots.length > MAX_DOTS) {
      const oldDot = dots.shift();
      oldDot.remove();
    }

    setTimeout(() => {
      dot.remove();
    }, 700);
  });
})();
