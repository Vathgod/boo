document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "AIzaSyC1nLm_Zt-Hdd_7G_g4e1oBYDe7cp8S7Ek";
  const booksContainer = document.querySelector(".books-container");
  const seeMoreButton = document.querySelector(".seeMore button");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchCategory = document.getElementById("searchCategory");

  let startIndex = 0;
  const maxResults = 15;
  let currentQuery = "";

  const oldCards = document.querySelectorAll(".book-card");
  oldCards.forEach((card) => {
    card.style.display = "none";
  });

  fetchBooks("Fairy", "all", startIndex);

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click();
    }
  });

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    const category = searchCategory.value;

    if (query) {
      currentQuery = query;
      startIndex = 0;
      booksContainer.innerHTML = "";
      fetchBooks(currentQuery, category, startIndex);
    } else {
      alert("Please enter a book title or author.");
    }
  });

  function fetchBooks(query, category, startIndex) {
    let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&startIndex=${startIndex}&maxResults=${maxResults}`;

    if (category !== "all") {
      apiUrl += `&subject:${category}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          data.items.forEach((item) => {
            const book = item.volumeInfo;
            const bookElement = document.createElement("div");
            bookElement.className = "book-card";

            const bookImage = document.createElement("div");
            bookImage.className = "book-image";
            const image = document.createElement("img");
            image.src = book.imageLinks
              ? book.imageLinks.thumbnail
              : "path/to/default/image.jpg";
            image.alt = book.title;
            bookImage.appendChild(image);

            const bookDetails = document.createElement("div");
            bookDetails.className = "book-details";

            const title = document.createElement("h3");
            title.className = "book-title";
            title.textContent =
              book.title.length > 15
                ? book.title.substring(0, 15) + "..."
                : book.title;

            const author = document.createElement("p");
            author.className = "book-author";
            author.textContent = `By ${
              book.authors
                ? book.authors.join(", ").substring(0, 18) + "..."
                : "Unknown Author"
            }`;

            const rating = document.createElement("div");
            rating.className = "book-rating";
            const ratingValue = book.averageRating || 0;
            const ratingCount = book.ratingsCount || 0;
            rating.innerHTML = `
                  ${"<i class='fa-solid fa-star'></i>".repeat(
                    Math.floor(ratingValue)
                  )}
                  ${"<i class='fa-regular fa-star'></i>".repeat(
                    5 - Math.floor(ratingValue)
                  )}
                  <span>(${ratingCount} reviews)</span>
                `;

            const description = document.createElement("p");
            description.className = "book-description";
            description.textContent = book.description
              ? book.description.substring(0, 25) + "..."
              : "No description available.";

            const button = document.createElement("a");
            button.className = "add-to-cart-btn";
            button.innerHTML = `<i class="fa-solid fa-book"></i> GO to Read`;

            if (book.previewLink) {
              button.href = book.previewLink;
              button.target = "_blank";
            } else {
              button.href = "#";
              button.onclick = () => {
                alert("No preview available for this book.");
                return false;
              };
            }

            bookDetails.appendChild(title);
            bookDetails.appendChild(author);
            bookDetails.appendChild(rating);
            bookDetails.appendChild(description);
            bookDetails.appendChild(button);

            bookElement.appendChild(bookImage);
            bookElement.appendChild(bookDetails);

            booksContainer.appendChild(bookElement);
          });

          attachShowEventListeners();

          seeMoreButton.style.display = "block";
        } else {
          seeMoreButton.style.display = "none";
          if (startIndex === 0) {
            booksContainer.innerHTML = "<p>No books found.</p>";
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        booksContainer.innerHTML = "<p>Error loading books.</p>";
      });
  }

  seeMoreButton.addEventListener("click", () => {
    startIndex += maxResults;
    fetchBooks(currentQuery, searchCategory.value, startIndex);
  });

  function attachShowEventListeners() {
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
});
