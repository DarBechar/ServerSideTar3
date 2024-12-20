const API = "https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/Movies";
const WishListAPI =
  "https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/User/wishList";

// const API = "https://localhost:7295/api/Movies";

// const WishListAPI = "https://localhost:7295/api/User/wishList";

$(document).ready(() => {
  //checking if the user is loggeed in or not.
  if (localStorage.getItem("isLoggedIn") != "true") {
    window.location.href = "../HomePage/Login.html";
    return;
  } else {
    init();

    //handling the user section in the menu
    const userSection = $("#userSection");
    const UserData = JSON.parse(localStorage.getItem("UserData"));

    const username = UserData.username || "User"; // Get username if stored

    userSection.html(`
      <div class="d-flex align-items-center">
        <span class="nav-link">Welcome ${username}</span>
        <a class="nav-link " href="#" onclick="logout()">Logout</a>
      </div>
    `);
  }

  //Handling the Add Movie Form
  const form = document.querySelector(".needs-validation");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
    } else {
      const movie = {
        title: $("#inputTitle").val(),
        rating: parseFloat($("#inputRating").val()),
        income: parseInt($("#inputIncome").val()),
        releaseYear: parseInt($("#inputReleaseYear").val()),
        duration: parseInt($("#inputDuration").val()),
        language: $("#inputLanguage").val(),
        description: $("#inputDescription").val(),
        genre: $("#inputGenre").val(),
        photoURL: $("#inputPhotoURL").val(),
      };
      console.log("Log movie" + movie);
      AddMovie(movie);
      clearForm();
    }
  });
});

const init = () => {
  let userInfo = JSON.parse(localStorage.getItem("UserData"));

  ajaxCall(
    "GET",
    WishListAPI + `/${userInfo.userId}`,
    null,
    (WishListData) => {
      localStorage.setItem("WishListData", JSON.stringify(WishListData));
    },
    (err) => {
      console.log(err);
    }
  );
  ajaxCall("GET", API, null, successCallBack, errorCallBack);
};

const render = (movies) => {
  let wishList = JSON.parse(localStorage.getItem("WishListData")) || [];
  // Create a Set of wishlist movie IDs for efficient lookup
  const wishlistIds = new Set(wishList.map((movie) => movie.id));
  let str = "";
  for (let i = 0; i < movies.length; i++) {
    const isInWishlist = wishlistIds.has(movies[i].id);

    str += `<div class="card-container">
      <div class="card position-relative">
       <div class="position-absolute top-0 end-0 m-2">
        <span class="badge bg-warning text-dark p-2">
         <i class="bi bi-star-fill me-1"></i>${movies[i].rating}
       </span>
     </div>
        <img
          src="${movies[i].photoURL}" alt="my-pic" class="card_img"/>
        <div class="card_info">
          <span class="card_category">${movies[i].language}</span>
          <h3 class="card_tittle">${movies[i].title}</h3>
            <button ${isInWishlist ? "disabled" : ""} id="${
      movies[i].id
    }" class="button ${isInWishlist ? "disabled" : ""}" >${
      isInWishlist ? "In Wishlist" : "WishList"
    }</button>
    <button class="add-cast-btn" data-movie-id="${movies[i].id}">Cast</button>
        </div>
      </div>
    </div>`;
  }

  $("#ph").html(str);

  $(".button").click((e) => {
    add2WishList(e.target.id);
    e.target.disabled = true;
    $(e.target)
      .removeClass("btn-primary")
      .addClass("disabled")
      .text("In Wishlist");
  });
};

function add2WishList(id) {
  let CurrUser = JSON.parse(localStorage.getItem("UserData"));

  ajaxCall(
    "POST",
    WishListAPI + `${CurrUser.userId}/${id}`,
    null,
    Add2WishListSuccessCB,
    Add2WishListErrorCB
  );
}

const Add2WishListSuccessCB = (data) => {
  console.log(data);
  console.log("success");
};

const Add2WishListErrorCB = (err) => {
  console.log(err);
};

const successCallBack = (data) => {
  render(data);
};

const errorCallBack = (err) => {
  console.log("Error:", err.responseJSON || err.statusText);
};

function logout() {
  localStorage.clear();
  window.location.href = "../HomePage/Login.html";
}
const addMovieSuccess = (data) => {
  init();
};

const AddMovie = (movie) => {
  ajaxCall("POST", API, JSON.stringify(movie), addMovieSuccess, errorCallBack);
};

const clearForm = () => {
  $("#movieAlert")
    .removeClass("d-none alert-danger")
    .addClass("alert-success")
    .text("Movie added successfully!")
    .show();

  // Reset form and validation state
  const form = document.querySelector(".needs-validation");
  setTimeout(() => {
    form.reset();
    form.classList.remove("was-validated");
    $("#movieAlert").addClass("d-none");
  }, 100);
};

// Handle "Add Cast" button click
$(document).on("click", ".add-cast-btn", function () {
  const castModal = new bootstrap.Modal(document.getElementById("castModal"));

  const movieId = $(this).data("movie-id");

  ajaxCall(
    "GET",
    `https://localhost:7295/api/Cast/${movieId}`,
    null,
    (response) => {
      console.log(response);
      const currentCast = response.filter(
        (actor) => actor.listType === "current"
      );
      const availableActors = response.filter(
        (actor) => actor.listType === "available"
      );

      renderCurrentCast(currentCast);
      renderAvailableActors(availableActors);
    },
    errorCallBack
  );

  $("#saveCastChanges").click(function () {
    console.log("Save button clicked"); // Debug if click is registered

    const movieId = $("#castModal").data("movie-id");
    console.log("Movie ID:", movieId); // Debug movie ID

    const currentCastIds = $("#currentCast .remove-actor")
      .map(function () {
        return $(this).data("actor-id");
      })
      .get();
    console.log("Current cast IDs:", currentCastIds); // Debug collected IDs

    // Close the modal after saving
    castModal.hide();
  });

  // Fetch current cast
  // $.ajax({
  //   url: `YOUR_API_ENDPOINT/movies/${movieId}/cast`,
  //   method: "GET",
  //   success: function (currentCast) {
  //     renderCurrentCast(currentCast);
  //   },
  //   error: errorCallBack,
  // });

  // Fetch available actors
  // $.ajax({
  //   url: "YOUR_API_ENDPOINT/actors/available",
  //   method: "GET",
  //   success: function (availableActors) {
  //     renderAvailableActors(availableActors);
  //   },
  //   error: errorCallBack,
  // });

  // Store movie ID in modal for later use
  $("#castModal").data("movie-id", movieId);
  castModal.show();
});

// Render current cast list
function renderCurrentCast(cast) {
  const castList = cast
    .map(
      (actor) => `
     <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <img src="${actor.photoURL}" alt="${actor.name}" 
                     class="rounded-circle me-2" 
                     style="width: 40px; height: 40px; object-fit: cover;">
                <span>${actor.name}</span>
            </div>
            <button class="btn btn-sm btn-danger remove-actor" data-actor-id="${actor.id}">
                Remove
            </button>
        </li>
    `
    )
    .join("");

  $("#currentCast").html(castList);
}

// Render available actors list
function renderAvailableActors(actors) {
  const availableList = actors
    .map(
      (actor) => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <img src="${actor.photoURL}" alt="${actor.name}" 
                     class="rounded-circle me-2" 
                     style="width: 40px; height: 40px; object-fit: cover;">
                <span>${actor.name}</span>
            </div>
            <button class="btn btn-sm btn-success add-actor" data-actor-id="${actor.id}">
                Add
            </button>
        </li>
    `
    )
    .join("");

  $("#availableActors").html(availableList);
}

// Handle adding actor to cast
$(document).on("click", ".add-actor", function () {
  const actorId = $(this).data("actor-id");
  const actorItem = $(this).closest("li");

  // Move actor to current cast list
  $("#currentCast").append(actorItem);
  $(this)
    .removeClass("btn-success add-actor")
    .addClass("btn-danger remove-actor")
    .text("Remove");
});

// Handle removing actor from cast
$(document).on("click", ".remove-actor", function () {
  const actorId = $(this).data("actor-id");
  const actorItem = $(this).closest("li");

  // Move actor back to available actors list
  $("#availableActors").append(actorItem);
  $(this)
    .removeClass("btn-danger remove-actor")
    .addClass("btn-success add-actor")
    .text("Add");
});

// Handle saving changes
$(document).on("click", "#saveCastChanges", function (e) {
  e.preventDefault(); // Prevent any default form submission
  console.log("Save button clicked - handler started");

  const movieId = $("#castModal").data("movie-id");

  const currentCastIds = $("#currentCast .remove-actor")
    .map(function () {
      return $(this).data("actor-id");
    })
    .get();

  $.ajax({
    url: `https://localhost:7295/api/Movies/DeleteCast/${movieId}`,
    method: "DELETE",
    contentType: "application/json",
    success: function (deleteResponse) {
      console.log("Delete successful:", deleteResponse);

      //  handle inserts
      currentCastIds.forEach((actorId) => {
        $.ajax({
          url: `https://localhost:7295/api/Movies/InsertCast2Movie/${movieId}/${actorId}`,
          method: "POST",
          contentType: "application/json",
          success: function (insertResponse) {
            console.log(
              `Insert successful for actor ${actorId}:`,
              insertResponse
            );
          },
          error: function (error) {
            console.error(`Insert failed for actor ${actorId}:`, error);
          },
        });
      });

      $("#castModal").modal("hide");
      init();
    },
    error: function (error) {
      console.error("Delete failed:", error);
    },
  });
});
