class BookManager {
  static async loadBooks(page = 1, filters = {}) {
    try {
      const response = await BooksAPI.getBooks(page, 12, filters);
      const booksContainer = document.getElementById("books-grid");
      this.renderBooks(response.data, booksContainer);
      return response;
    } catch (error) {
      console.error("Error loading books:", error);
      throw error;
    }
  }

  static renderBooks(books, container) {
    if (!books || books.length === 0) {
      container.innerHTML = "<p>No books found.</p>";
      return;
    }

    container.innerHTML = books
      .map(
        (book) => `
            <div class="book-card">
                <div class="book-cover">
                    <img src="${
                      book.Image || "assets/images/book-placeholder.jpg"
                    }" alt="${book.Title}">
                </div>
                <div class="book-info">
                    <h3>${book.Title}</h3>
                    <p class="author">By ${book.Author}</p>
                    <p class="price">$${book.Price}</p>
                    <div class="book-actions">
                        <a href="book-details.html?id=${
                          book._id
                        }" class="btn btn-secondary">Details</a>
                        <button class="btn btn-primary add-to-cart" 
                                onclick="BookManager.handleAddToCart('${
                                  book._id
                                }')" 
                                data-id="${book._id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  static async handleAddToCart(bookId) {
    try {
      if (!isLoggedIn()) {
        showMessage("Please log in to add items to your cart.", "error");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
        return;
      }

      const button = event.target;
      button.disabled = true;
      button.textContent = "Adding...";

      await CartAPI.addToCart(bookId);
      showMessage("Book added to cart!", "success");
      updateCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
      showMessage("Error adding to cart. Please try again.", "error");
    } finally {
      const button = event.target;
      button.disabled = false;
      button.textContent = "Add to Cart";
    }
  }
}

function updateCartCount() {
  if (!isLoggedIn()) {
    document.getElementById("cart-count").textContent = "(0)";
    return;
  }

  CartAPI.getCart()
    .then((response) => {
      const count = response.data.reduce(
        (total, item) => total + item.Quantity,
        0
      );
      document.getElementById("cart-count").textContent = `(${count})`;
    })
    .catch((error) => {
      console.error("Error updating cart count:", error);
      document.getElementById("cart-count").textContent = "(0)";
    });
}

function showMessage(message, type = "info") {
  const messageContainer = document.createElement("div");
  messageContainer.className = `message ${type}`;
  messageContainer.textContent = message;

  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.classList.add("hide");
    setTimeout(() => {
      document.body.removeChild(messageContainer);
    }, 500);
  }, 3000);
}
