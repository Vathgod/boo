class Book {
  constructor(
    title,
    authors,
    imageLink,
    description,
    previewLink,
    ratingsCount
  ) {
    this.title = title;
    this.authors = authors;
    this.imageLink = imageLink;
    this.description = description;
    this.previewLink = previewLink;
    this.ratingsCount = ratingsCount;
  }

  createCard() {
    const bookElement = document.createElement("div");
    bookElement.className = "book-card";

    const bookImage = document.createElement("div");
    bookImage.className = "book-image";
    const image = document.createElement("img");
    image.src = this.imageLink || "path/to/default/image.jpg";
    image.alt = this.title;
    bookImage.appendChild(image);

    const bookDetails = document.createElement("div");
    bookDetails.className = "book-details";

    const title = document.createElement("h3");
    title.className = "book-title";
    title.textContent =
      this.title.length > 15 ? this.title.substring(0, 15) + "..." : this.title;

    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = `By ${
      this.authors
        ? this.authors.join(", ").substring(0, 18) + "..."
        : "Unknown Author"
    }`;

    const rating = document.createElement("div");
    rating.className = "book-rating";
    rating.innerHTML = `
      <i class="fa-solid fa-star"></i>
      <i class="fa-solid fa-star"></i>
      <i class="fa-solid fa-star"></i>
      <i class="fa-solid fa-star"></i>
      <i class="fa-regular fa-star"></i>
      <span>(${this.ratingsCount || 0} reviews)</span>
    `;

    const description = document.createElement("p");
    description.className = "book-description";
    description.textContent = this.description
      ? this.description.substring(0, 25) + "..."
      : "No description available.";

    const button = document.createElement("a");
    button.className = "add-to-cart-btn";
    button.innerHTML = `<i class="fa-solid fa-book"></i> GO to Read`;

    button.href = this.previewLink || "#";
    button.target = "_blank";

    bookDetails.appendChild(title);
    bookDetails.appendChild(author);
    bookDetails.appendChild(rating);
    bookDetails.appendChild(description);
    bookDetails.appendChild(button);

    bookElement.appendChild(bookImage);
    bookElement.appendChild(bookDetails);

    return bookElement;
  }
}

class BookManager {
  constructor(apiKey, searchQuery, containerSelector, buttonSelector) {
    this.apiKey = apiKey;
    this.searchQuery = searchQuery;
    this.booksContainer = document.querySelector(containerSelector);
    this.seeMoreButton = document.querySelector(buttonSelector);
    this.startIndex = 0;
    this.maxResults = 15;
  }

  fetchBooks() {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${this.searchQuery}&key=${this.apiKey}&startIndex=${this.startIndex}&maxResults=${this.maxResults}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          data.items.forEach((item) => {
            const bookInfo = item.volumeInfo;
            const book = new Book(
              bookInfo.title,
              bookInfo.authors,
              bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : null,
              bookInfo.description,
              bookInfo.previewLink,
              bookInfo.ratingsCount
            );
            this.booksContainer.appendChild(book.createCard());
          });

          this.attachShowEventListeners();
        } else {
          this.seeMoreButton.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        this.booksContainer.innerHTML = "<p>Error loading books.</p>";
      });
  }

  attachShowEventListeners() {
    const cards = document.querySelectorAll(".book-card");
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".add-to-cart-btn")) {
          return;
        }

        const isCurrentlyShown = card.classList.contains("show");

        cards.forEach((c) => c.classList.remove("show"));
        document
          .querySelectorAll(".book-image")
          .forEach((img) => img.classList.remove("show"));

        if (!isCurrentlyShown) {
          card.classList.add("show");
          document.body.style.overflow = "hidden";
          const image = card.querySelector(".book-image");
          if (image) image.classList.add("show");
        } else {
          document.body.style.overflow = "";
        }
      });
    });
  }

  loadMoreBooks() {
    this.startIndex += this.maxResults;
    this.fetchBooks();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "AIzaSyC1nLm_Zt-Hdd_7G_g4e1oBYDe7cp8S7Ek";
  const bookManager = new BookManager(
    apiKey,
    "car",
    ".books-container",
    ".seeMore button"
  );

  const oldCards = document.querySelectorAll(".book-card");
  oldCards.forEach((card) => {
    card.style.display = "none";
  });

  bookManager.fetchBooks();

  bookManager.seeMoreButton.addEventListener("click", () => {
    bookManager.loadMoreBooks();
  });
});
