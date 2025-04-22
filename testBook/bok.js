const cards = document.querySelectorAll(".book-card");

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", () => {
    const isCurrentlyShown = cards[i].classList.contains("show");
    cards.forEach((card) => card.classList.remove("show"));
    document
      .querySelectorAll(".book-image")
      .forEach((img) => img.classList.remove("show"));

    if (!isCurrentlyShown) {
      cards[i].classList.add("show");
      document.body.style.overflow = "hidden";
      const image = cards[i].querySelector(".book-image");
      if (image) image.classList.add("show");
    } else {
      document.body.style.overflow = "";
    }
  });
}

const readBook = document.querySelectorAll(".cc");
for (let i = 0; i < readBook.length; i++) {
  readBook[i].addEventListener("click", (event) => {
    event.stopPropagation();
    readBook[i].classList.toggle("show2");
  });
}

const buttons = document.querySelectorAll(".goToReadBtn");
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "https://www.youtube.com/watch?v=T5xcnjAG8pE";
  });
});
