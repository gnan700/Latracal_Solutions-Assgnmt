function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

function dashboardLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

function updateAuthUI() {
  const authSection = document.querySelector(".auth-section");
  if (!authSection) return;

  if (isLoggedIn()) {
    const user = JSON.parse(localStorage.getItem("user"));
    authSection.innerHTML = `
            <div class="user-menu">
                <span>Welcome, ${user.Name}</span>
                <a href="profile.html">Profile</a>
                ${
                  user.Role === "admin"
                    ? '<a href="admin/dashboard.html">Admin</a>'
                    : ""
                }
                <a href="#" onclick="logout()">Logout</a>
            </div>
        `;
  } else {
    authSection.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
  }
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function requireAdmin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!isLoggedIn() || user.Role !== "admin") {
    window.location.href = "index.html";
    return false;
  }
  return true;
}
