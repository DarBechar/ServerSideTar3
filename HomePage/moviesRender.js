// const API = "https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/Movies";

const API = "https://localhost:7295/api/Movies";

$(document).ready(() => {
  if (localStorage.getItem("isLoggedIn") != "true") {
    window.location.href = "../HomePage/Login.html";
    return;
  } else {
    console.log("logged");
    ajaxCall("GET", API, null, successCallBack, errorCallBack);

    const userSection = $("#userSection");
    const UserData = JSON.parse(localStorage.getItem("UserData"));

    const username = UserData.username || "User"; // Get username if stored

    userSection.html(`
      <div class="d-flex align-items-center">
        <span class="nav-link">Welcome, ${username}</span>
        <a class="nav-link text-danger" href="#" onclick="logout()">Logout</a>
      </div>
    `);
  }
});

const render = (movies) => {
  console.log(movies);
  let str = "";
  for (let i = 0; i < movies.length; i++) {
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
            <button id="${movies[i].id}" class="button" >Add To WishList</button>
          </a>
        </div>
      </div>
    </div>`;
  }

  $("#ph").html(str);

  $(".button").click((e) => {
    console.log(e);
    Post(e.target.id);
    e.target.disabled = true;
    $(e.target)
      .removeClass("btn-primary")
      .addClass("btn-secondary")
      .text("Added to Wish List");
  });
};

function Post(id) {
  let CurrUserid = UserData.userId;

  const movieData = {
    MovieId: parseInt(id),
    UserId: CurrUserid,
  };

  ajaxCall(
    "POST",
    API,
    JSON.stringify(movieData),
    (data) => {
      console.log("Full server response:", data);
      console.log("Response type:", typeof data);
      console.log("Response status:", "Success");
    },
    (err) => {
      console.log("Error object:", err);
      console.log("Error status:", err.status);
      console.log("Error message:", err.responseText);
    }
  );
}

const successCallBack = (data) => {
  console.log("Success:", data);
  render(data);
};

const errorCallBack = (err) => {
  console.log("Error:", err.responseJSON || err.statusText);
};

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username"); // If you stored username
  window.location.href = "../HomePage/Login.html";
}
