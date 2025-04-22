const selectCategory = document.getElementById("searchCategory");

selectCategory.addEventListener("change", function () {
  const selectedValue = this.value;
  const arr = document.getElementById("book");
  const links = {
    all: "index.html",
    fiction: "../bookType/history.html",
    "non-fiction": "../bookType/comic.html",
    science: "../bookType/science.html",
    history: "../bookType/khmer.html",
  };
  if (links[selectedValue]) {
    window.location.href = links[selectedValue];
  }
});
