// profile.js
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;
  const navbar = document.getElementById("navbar");
  const cards = document.querySelectorAll(".card");

  // Restore saved mode (optional, keeps user preference)
  const saved = localStorage.getItem("dark-mode");
  if (saved === "true") {
    body.classList.add("dark-mode");
    navbar.classList.add("navbar-dark-mode");
    cards.forEach((card) => card.classList.add("dark-mode"));
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = body.classList.toggle("dark-mode");
      navbar.classList.toggle("navbar-dark-mode");
      cards.forEach((card) => card.classList.toggle("dark-mode"));

      // Change icon
      toggleBtn.innerHTML = isDark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';

      // Save preference
      localStorage.setItem("dark-mode", isDark ? "true" : "false");
    });
  }
});
