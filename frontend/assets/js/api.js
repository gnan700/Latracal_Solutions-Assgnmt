const API_BASE_URL = "https://online-bookstore-gdhy.onrender.com";

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
// Auth API
const AuthAPI = {
  login: (credentials) => {
    return fetchAPI("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: (userData) => {
    return fetchAPI("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: () => {
    return fetchAPI("/users/logout", {
      method: "POST",
    });
  },

  updateProfile: (userId, userData) => {
    return fetchAPI(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },
};

// Books API
const BooksAPI = {
  getBooks: (page = 1, limit = 8) => {
    return fetchAPI(`/books?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  },

  getBookById: (bookId) => {
    return fetchAPI(`/books/${bookId}`, {
      method: "GET",
    });
  },

  getBookReviews: (bookId) => {
    return fetchAPI(`/books/${bookId}/reviews`, {
      method: "GET",
    });
  },

  // Admin functions
  createBook: (bookData) => {
    const formData = new FormData();

    for (const key in bookData) {
      formData.append(key, bookData[key]);
    }

    return fetchAPI("/books", {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  updateBook: (bookId, bookData) => {
    return fetchAPI(`/books/${bookId}`, {
      method: "PATCH",
      body: JSON.stringify(bookData),
    });
  },

  deleteBook: (bookId) => {
    return fetchAPI(`/books/${bookId}`, {
      method: "DELETE",
    });
  },
};

// Cart API
const CartAPI = {
  getCart: () => {
    return fetchAPI("/cart", {
      method: "GET",
    });
  },

  addToCart: (bookId) => {
    return fetchAPI("/cart", {
      method: "POST",
      body: JSON.stringify({ bookId: bookId }),
    });
  },

  removeFromCart: (bookId) => {
    return fetchAPI(`/cart/${bookId}`, {
      method: "DELETE",
    });
  },

};

// Orders API
const OrdersAPI = {
  createOrder: (orderData) => {
    return fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  // Admin functions
  getOrders: (page = 1, limit = 5) => {
    return fetchAPI(`/orders?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  },

  getOrderById: (orderId) => {
    return fetchAPI(`/orders/${orderId}`, {
      method: "GET",
    });
  },

  deleteOrder: (orderId) => {
    return fetchAPI(`/orders/${orderId}`, {
      method: "DELETE",
    });
  },

  getUserOrders: (userId) => {
    return fetchAPI(`/users/${userId}/orders`, {
      method: "GET",
    });
  },
};

// Reviews API
const ReviewsAPI = {
  createReview: (reviewData) => {
    return fetchAPI("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  getReviewById: (reviewId) => {
    return fetchAPI(`/reviews/${reviewId}`, {
      method: "GET",
    });
  },

  updateReview: (reviewId, reviewData) => {
    return fetchAPI(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  deleteReview: (reviewId) => {
    return fetchAPI(`/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  getUserReviews: (userId) => {
    return fetchAPI(`/users/${userId}/reviews`, {
      method: "GET",
    });
  },
};

// Author API
const AuthorsAPI = {
  getAuthors: () => {
    return fetchAPI("/authors", {
      method: "GET",
    });
  },

  getAuthorById: (authorId) => {
    return fetchAPI(`/authors/${authorId}`, {
      method: "GET",
    });
  },

  // Admin functions
  createAuthor: (authorData) => {
    return fetchAPI("/authors/create", {
      method: "POST",
      body: JSON.stringify(authorData),
    });
  },

  updateAuthor: (authorId, authorData) => {
    return fetchAPI(`/authors/${authorId}`, {
      method: "PUT",
      body: JSON.stringify(authorData),
    });
  },

  deleteAuthor: (authorId) => {
    return fetchAPI(`/authors/${authorId}`, {
      method: "DELETE",
    });
  },
};

const AdminAPI = {
  getDashboardStats: async () => {
    try {
      const [books, orders, users] = await Promise.all([
        BooksAPI.getBooks(1, 1),
        OrdersAPI.getOrders(1, 1),
        AdminAPI.getUsers(1, 1),
      ]);

      const allOrders = await OrdersAPI.getOrders(1, 1000);
      const totalRevenue = allOrders.data.reduce(
        (sum, order) => sum + (order.TotalAmount || 0),
        0
      );

      return {
        totalBooks: books.total || 0,
        totalOrders: orders.total || 0,
        totalUsers: users.total || 0,
        totalRevenue: totalRevenue || 0,
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      throw error;
    }
  },

  getUsers: (page = 1, limit = 10) => {
    return fetchAPI(`/users?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  },

  getUserById: (userId) => {
    return fetchAPI(`/users/${userId}`, {
      method: "GET",
    });
  },

  updateUser: (userId, userData) => {
    return fetchAPI(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  deleteUser: (userId) => {
    return fetchAPI(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};
