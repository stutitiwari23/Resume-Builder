document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme") || "light";
  body.classList.add(savedTheme + "-theme");

  toggle.addEventListener("click", () => {
    const isLight = body.classList.contains("light-theme");

    body.classList.toggle("light-theme", !isLight);
    body.classList.toggle("dark-theme", isLight);

    localStorage.setItem("theme", isLight ? "dark" : "light");
  });
});
