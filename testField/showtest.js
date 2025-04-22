const apiKey = "AIzaSyC1nLm_Zt-Hdd_7G_g4e1oBYDe7cp8S7Ek";
const apiUrl = "https://www.googleapis.com/books/v1/volumes";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchCategory = document.getElementById("searchCategory");
const booksContainer = document.querySelector(".books-container");
const seeMoreButton = document.querySelector(".seeMore button");

let currentQuery = "JavaScript";
let currentCategory = "all";
let startIndex = 0;

async function fetchBooks(query, category = "all", startIndex = 0) {
  try {
    let url = `${apiUrl}?q=${encodeURIComponent(
      query
    )}&maxResults=12&startIndex=${startIndex}`;
    if (category !== "all") {
      url += `+subject:${category}`;
    }
    if (apiKey) {
      url += `&key=${apiKey}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    booksContainer.innerHTML =
      "<p>Failed to fetch books. Please try again later.</p>";
    return [];
  }
}

function displayBooks(books) {
  if (!books || books.length === 0) {
    booksContainer.innerHTML = "<p>No books found.</p>";
    return;
  }

  const oldCards = document.querySelectorAll(".book-card");
  oldCards.forEach((card) => (card.style.display = "none"));

  const booksHTML = books
    .map((book) => {
      const volumeInfo = book.volumeInfo;
      const title = limitWords(volumeInfo.title, 4); // Limit title to 4 words
      const author = limitWords(volumeInfo.authors?.join(", ") || "Unknown", 4); // Limit author to 4 words
      const description = limitWords(
        volumeInfo.description || "No description available.",
        10
      ); // Limit description to 10 words
      return `
          <div class="book-card">
            <div class="book-image">
              <img src="${
                volumeInfo.imageLinks?.thumbnail ||
                "https://via.placeholder.com/150x200"
              }" alt="${volumeInfo.title}" />
            </div>
            <div class="book-details">
              <h3 class="book-title">${title}</h3>
              <p class="book-author">By ${author}</p>
              <div class="book-rating">
                ${generateRatingStars(volumeInfo.averageRating || 0)}
                <span>(${volumeInfo.ratingsCount || 0} reviews)</span>
              </div>
              <p class="book-description">${description}</p>
              <a href="${
                volumeInfo.previewLink
              }" target="_blank" class="add-to-cart-btn">
                <i class="fa-solid fa-book"></i> Go to read
              </a>
            </div>
          </div>
        `;
    })
    .join("");

  booksContainer.innerHTML += booksHTML;
  attachShowEventListeners();
}

function limitWords(text, maxWords) {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
}

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

function generateRatingStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fa-solid ${
      i <= rating ? "fa-star" : "fa-regular fa-star"
    }"></i>`;
  }
  return stars;
}

window.addEventListener("load", async () => {
  const books = await fetchBooks(currentQuery, currentCategory, startIndex);
  displayBooks(books);
  seeMoreButton.style.display = "block";
});

seeMoreButton.addEventListener("click", async () => {
  startIndex += 12;
  const books = await fetchBooks(currentQuery, currentCategory, startIndex);
  displayBooks(books);
});

searchButton.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  const category = searchCategory.value;
  if (query) {
    currentQuery = query;
    currentCategory = category;
    startIndex = 0;
    booksContainer.innerHTML = "";
    const books = await fetchBooks(query, category, startIndex);
    displayBooks(books);
    seeMoreButton.style.display = "block";
  } else {
    alert("Please enter a book title or author.");
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});
