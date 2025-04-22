class Book {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.booksContainer = document.querySelector(".books-container");
    this.seeMoreButton = document.querySelector(".seeMore button");
    this.searchInput = document.getElementById("searchInput");
    this.searchButton = document.getElementById("searchButton");
    this.searchCategory = document.getElementById("searchCategory");
    this.startIndex = 0;
    this.maxResults = 15;
    this.currentQuery = "";

    this._initialize();
  }

  _initialize() {
    this._hideOldCards();
    this._setupEventListeners();
    this.fetchBooks("Fairy", "all", this.startIndex);
  }

  _hideOldCards() {
    const oldCards = document.querySelectorAll(".book-card");
    oldCards.forEach((card) => (card.style.display = "none"));
  }

  _setupEventListeners() {
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchButton.click();
      }
    });

    this.searchButton.addEventListener("click", () => this._searchBooks());
    this.seeMoreButton.addEventListener("click", () => this._loadMoreBooks());
  }

  _searchBooks() {
    const query = this.searchInput.value.trim();
    const category = this.searchCategory.value;

    if (query) {
      this.currentQuery = query;
      this.startIndex = 0;
      this.booksContainer.innerHTML = "";
      this.fetchBooks(this.currentQuery, category, this.startIndex);
    } else {
      alert("Please enter a book title or author.");
    }
  }

  _loadMoreBooks() {
    this.startIndex += this.maxResults;
    this.fetchBooks(
      this.currentQuery,
      this.searchCategory.value,
      this.startIndex
    );
  }

  fetchBooks(query, category, startIndex) {
    let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${this.apiKey}&startIndex=${startIndex}&maxResults=${this.maxResults}`;

    if (category !== "all") {
      apiUrl += `&subject:${category}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => this._displayBooks(data))
      .catch((error) => {
        console.error("Error fetching books:", error);
        this.booksContainer.innerHTML = "<p>Error loading books.</p>";
      });
  }

  _displayBooks(data) {
    if (data.items) {
      data.items.forEach((item) => {
        const book = item.volumeInfo;
        const bookElement = this._createBookCard(book);
        this.booksContainer.appendChild(bookElement);
      });

      this._attachShowEventListeners();
      this.seeMoreButton.style.display = "block";
    } else {
      this.seeMoreButton.style.display = "none";
      if (this.startIndex === 0) {
        this.booksContainer.innerHTML = "<p>No books found.</p>";
      }
    }
  }

  _createBookCard(book) {
    const bookElement = document.createElement("div");
    bookElement.className = "book-card";

    const bookImage = this._createBookImage(book);
    const bookDetails = this._createBookDetails(book);

    bookElement.appendChild(bookImage);
    bookElement.appendChild(bookDetails);

    return bookElement;
  }

  _createBookImage(book) {
    const bookImage = document.createElement("div");
    bookImage.className = "book-image";
    const image = document.createElement("img");
    image.src = book.imageLinks
      ? book.imageLinks.thumbnail
      : "path/to/default/image.jpg";
    image.alt = book.title;
    bookImage.appendChild(image);

    return bookImage;
  }

  _createBookDetails(book) {
    const bookDetails = document.createElement("div");
    bookDetails.className = "book-details";

    const title = document.createElement("h3");
    title.className = "book-title";
    title.textContent =
      book.title.length > 15 ? book.title.substring(0, 15) + "..." : book.title;

    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = `By ${
      book.authors
        ? book.authors.join(", ").substring(0, 18) + "..."
        : "Unknown Author"
    }`;

    const rating = this._createRating(book);
    const description = document.createElement("p");
    description.className = "book-description";
    description.textContent = book.description
      ? book.description.substring(0, 25) + "..."
      : "No description available.";

    const button = document.createElement("a");
    button.className = "add-to-cart-btn";
    button.innerHTML = `<i class="fa-solid fa-book"></i> GO to Read`;
    button.href = book.previewLink || "#";
    button.target = "_blank";

    bookDetails.appendChild(title);
    bookDetails.appendChild(author);
    bookDetails.appendChild(rating);
    bookDetails.appendChild(description);
    bookDetails.appendChild(button);

    return bookDetails;
  }

  _createRating(book) {
    const rating = document.createElement("div");
    rating.className = "book-rating";
    const ratingValue = book.averageRating || 0;
    const ratingCount = book.ratingsCount || 0;
    rating.innerHTML = `
          ${"<i class='fa-solid fa-star'></i>".repeat(Math.floor(ratingValue))}
          ${"<i class='fa-regular fa-star'></i>".repeat(
            5 - Math.floor(ratingValue)
          )}
          <span>(${ratingCount} reviews)</span>
        `;
    return rating;
  }

  _attachShowEventListeners() {
    const cards = document.querySelectorAll(".book-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
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
}

document.addEventListener("DOMContentLoaded", () => {
  new Book("AIzaSyC1nLm_Zt-Hdd_7G_g4e1oBYDe7cp8S7Ek");
});
