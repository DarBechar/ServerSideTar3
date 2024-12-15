const API = "https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/Movies";

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

    form.classList.add("was-validated");
  });
});

const init = () => {
  let userInfo = JSON.parse(localStorage.getItem("UserData"));

  ajaxCall(
    "GET",
    "https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/User/wishList" + `/${userInfo.userId}`,
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
  console.log(wishList);
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
      isInWishlist ? "In Wishlist" : "Add To WishList"
    }</button>
          </a>
        </div>
      </div>
    </div>`;
  }

  $("#ph").html(str);

  $(".button").click((e) => {
    console.log(e);
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
    `https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/User/wishList/${CurrUser.userId}/${id}`,
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
  console.log("Success:", data);
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

const clearForm=()=>{
  $("#inputTitle").val()="";
  $("#inputRating").val()="";
       $("#inputIncome").val()="";
        $("#inputReleaseYear").val()="";
        $("#inputDuration").val()="";
       $("#inputLanguage").val()="";
         $("#inputDescription").val()="";
    $("#inputGenre").val()="";
       $("#inputPhotoURL").val()="";
}