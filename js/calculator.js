const priceBtn = document.getElementById("byPriceBtn");
const litersBtn = document.getElementById("byLitersBtn");

priceBtn.addEventListener("click", () => {
  priceBtn.classList.add("active");
  litersBtn.classList.remove("active");
});

litersBtn.addEventListener("click", () => {
  litersBtn.classList.add("active");
  priceBtn.classList.remove("active");
});
