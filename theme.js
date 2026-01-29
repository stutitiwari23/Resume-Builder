// theme.js — FINAL, STABLE VERSION
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const icon = btn.querySelector("i");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (theme === "dark") {
      icon.className = "fa-solid fa-sun";
      btn.title = "Switch to Light Mode";
      btn.setAttribute("aria-label", "Switch to Light Mode");
    } else {
      icon.className = "fa-solid fa-moon";
      btn.title = "Switch to Dark Mode";
      btn.setAttribute("aria-label", "Switch to Dark Mode");
    }
  }

  // Load saved theme
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  applyTheme(savedTheme);

  btn.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";

    applyTheme(next);
    localStorage.setItem("theme", next);
  });
});
