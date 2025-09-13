const hamburger = document.getElementById("hamburger");
const menuList = document.getElementById("menuList");

hamburger.addEventListener("click", () => {
  menuList.classList.toggle("show");
});

// Gestione dropdown su mobile
document.querySelectorAll(".dropdown > a").forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    const parent = item.parentElement;
    parent.classList.toggle("active");
  });
});
