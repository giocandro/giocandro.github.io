document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  menu.innerHTML = `
    <button class="menu-toggle">Menù ☰</button>
    <nav>
      <a href="https://giocandro.github.io/index.html">Home</a>
      <a href="https://giocandro.github.io/games/snake/index.html">Snake</a>
    </nav>
  `;

  const toggle = menu.querySelector(".menu-toggle");
  const nav = menu.querySelector("nav");

  toggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
});
