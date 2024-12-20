const API_BASE = "https://localhost:7295/api";

$(document).ready(() => {
  // Check if admin is logged in
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../HomePage/Login.html";
    return;
  }

  loadUsers();
});

function loadUsers() {
  ajaxCall(
    "GET",
    `https://localhost:7295/api/User`,
    null,
    renderUsers,
    errorCallback
  );
}

function renderUsers(users) {
  console.log(users);
  const usersList = users
    .map(
      (user) => `
          <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                  data-user-id="${user.id}" 
                  onclick="loadUserWishlist(${user.id}, '${user.userName}')">
              <div>
                  <h6 class="mb-0">${user.userName}</h6>
                  <small class="text-muted">${user.email}</small>
              </div>
              <span class="badge bg-primary rounded-pill" id="wishlist-count-${user.id}">0</span>
          </button>
      `
    )
    .join("");

  $("#usersList").html(usersList);
}

function loadUserWishlist(userId, username) {
  // Update selected user display
  $("#selectedUserName").text(username);

  // Highlight selected user
  $(".list-group-item").removeClass("active");
  $(`[data-user-id="${userId}"]`).addClass("active");

  ajaxCall(
    "GET",
    `${API_BASE}/User/wishList/${userId}`,
    null,
    renderWishlist,
    errorCallback
  );
}

function renderWishlist(wishlist) {
  if (!wishlist || wishlist.length === 0) {
    $("#wishlistContainer").html(
      '<div class="col-12"><p class="text-center">No items in wishlist</p></div>'
    );
    return;
  }

  const wishlistItems = wishlist
    .map(
      (movie) => `
          <div class="col-md-4 mb-3">
              <div class="card h-100">
                  <img src="${movie.photoURL}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                      <h6 class="card-title">${movie.title}</h6>
                      <p class="card-text">
                          <small class="text-muted">
                              <i class="bi bi-star-fill text-warning"></i> ${movie.rating}
                          </small>
                      </p>
                  </div>
              </div>
          </div>
      `
    )
    .join("");

  $("#wishlistContainer").html(wishlistItems);

  // Update wishlist count badge
  $(`#wishlist-count-${userId}`).text(wishlist.length);
}

function errorCallback(error) {
  console.error("Error:", error);
  alert("An error occurred. Please try again.");
}

// Your existing ajaxCall function here
