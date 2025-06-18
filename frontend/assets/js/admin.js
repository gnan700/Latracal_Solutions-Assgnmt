BooksAPI.getLowStockBooks = () => {
  return fetchAPI("/books?stock_lt=10", {
    method: "GET",
  });
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

function requireAdmin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.Role !== "admin") {
    window.location.href = "../index.html";
    return false;
  }
  return true;
}

function updateAdminUI() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById("admin-name").textContent = user.Name;
  }
}

function showAdminMessage(message, type = "info") {
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
