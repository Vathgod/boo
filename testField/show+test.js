document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "AIzaSyC1nLm_Zt-Hdd_7G_g4e1oBYDe7cp8S7Ek";
  const booksContainer = document.querySelector(".books-container");
  const seeMoreButton = document.querySelector(".seeMore button");
  let startIndex = 0; // Track the starting index for pagination
  const maxResults = 15; // Number of books to load per click

  // Hide old static cards
  const oldCards = document.querySelectorAll(".book-card");
  oldCards.forEach((card) => {
    card.style.display = "none"; // Hide the old cards
  });

  const search = "usa";
  function fetchBooks(startIndex) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${apiKey}&startIndex=${startIndex}&maxResults=${maxResults}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          data.items.forEach((item) => {
            const book = item.volumeInfo;
            const bookElement = document.createElement("div");
            bookElement.className = "book-card";

            // Book Image
            const bookImage = document.createElement("div");
            bookImage.className = "book-image";
            const image = document.createElement("img");
            image.src = book.imageLinks
              ? book.imageLinks.thumbnail
              : "path/to/default/image.jpg";
            image.alt = book.title;
            bookImage.appendChild(image);

            // Book Details
            const bookDetails = document.createElement("div");
            bookDetails.className = "book-details";

            // Trim Title to 10-15 characters
            const title = document.createElement("h3");
            title.className = "book-title";
            title.textContent =
              book.title.length > 15
                ? book.title.substring(0, 15) + "..."
                : book.title;

            // Trim Author to 15-18 characters
            const author = document.createElement("p");
            author.className = "book-author";
            author.textContent = `By ${
              book.authors
                ? book.authors.join(", ").substring(0, 18) + "..."
                : "Unknown Author"
            }`;

            // Rating (static for now)
            const rating = document.createElement("div");
            rating.className = "book-rating";
            rating.innerHTML = `
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <span>(${book.ratingsCount || 0} reviews)</span>
              `;

            // Trim Description to 15-25 characters
            const description = document.createElement("p");
            description.className = "book-description";
            description.textContent = book.description
              ? book.description.substring(0, 25) + "..."
              : "No description available.";

            // Button
            const button = document.createElement("a"); // Use <a> instead of <button>
            button.className = "add-to-cart-btn";
            button.innerHTML = `<i class="fa-solid fa-book"></i> GO to Read`;

            // Set the button's href to the book's preview link (if available)
            if (book.previewLink) {
              button.href = book.previewLink; // Use the preview link from the API
              button.target = "_blank"; // Open in a new tab
            } else {
              button.href = "#"; // Disable the link if no preview is available
              button.onclick = (e) => {
                e.stopPropagation(); // Prevent the card click event from firing
                alert("No preview available for this book.");
                return false; // Prevent default behavior
              };
            }

            // Append Elements
            bookDetails.appendChild(title);
            bookDetails.appendChild(author);
            bookDetails.appendChild(rating);
            bookDetails.appendChild(description);
            bookDetails.appendChild(button);

            bookElement.appendChild(bookImage);
            bookElement.appendChild(bookDetails);

            booksContainer.appendChild(bookElement);
          });

          // Attach "show" event listeners to the newly created cards
          attachShowEventListeners();
        } else {
          seeMoreButton.style.display = "none"; // Hide the "See More" button if no more books are available
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        booksContainer.innerHTML = "<p>Error loading books.</p>";
      });
  }

  // Initial load of books
  fetchBooks(startIndex);

  // "See More" button click event
  seeMoreButton.addEventListener("click", () => {
    startIndex += maxResults; // Increment the start index
    fetchBooks(startIndex); // Fetch and display more books
  });
});

// Function to attach "show" event listeners to book cards
function attachShowEventListeners() {
  const cards = document.querySelectorAll(".book-card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Prevent the card click event if the "GO to Read" button is clicked
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
