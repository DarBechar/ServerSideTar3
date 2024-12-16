const API = "https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/Cast";

// const API = "https://localhost:7295/api/Cast";

$(document).ready(() => {
  console.log("logged");

  ajaxCall("GET", API, null, GetSuccessCallBack, errorCallBack);

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

  // Form validation
  const form = document.querySelector(".needs-validation");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      event.stopPropagation();
    } else {
      // If form is valid, create cast member object and post
      const castMember = {
        name: $("#inputName").val(),
        role: $("#inputRole").val(),
        dateOfBirth: $("#inputBirthDate").val(),
        country: $("#inputCountry").val(),
        photoURL: $("#inputPhotoURL").val(),
      };

      post(castMember);
    }

    form.classList.add("was-validated");
  });
});
const post = (castMember) => {
  console.log(castMember);
  ajaxCall(
    "POST",
    API,
    JSON.stringify(castMember),
    PostSuccessCallBack,
    errorCallBack
  );
};

const PostSuccessCallBack = (CastPack) => {
  // Reset form
  document.querySelector(".needs-validation").reset();
  // Remove validation classes
  $(".needs-validation").removeClass("was-validated");

  // Refresh the cast list
  ajaxCall("GET", API, null, GetSuccessCallBack, errorCallBack);

  // Hide alert after 3 seconds
  setTimeout(() => {
    $("#ActorALert").addClass("d-none");
  }, 3000);
};

const errorCallBack = (err) => {
  $("#ActorALert")
    .removeClass("alert-success")
    .addClass("alert-danger")
    .text(err.responseText)
    .removeClass("d-none");
  console.log("Error:", err.responseJSON || err.statusText);
};

const GetSuccessCallBack = (CastJson) => {
  console.log(CastJson);
  let str = "";
  for (let index = 0; index < CastJson.length; index++) {
    str += `<div class="card-container">
      <div class="card position-relative">
       <div class="position-absolute top-0 end-0 m-2">
     </div>
     <img src="${CastJson[index].photoURL}" alt="my-pic" class="card_img"/>
        <div class="card_info">
          <span class="card_category">${CastJson[index].role}</span>
          <h3 class="card_tittle">${CastJson[index].name}</h3>
          <span class="card_category">${CastJson[index].country}</span>
        </div>
      </div>
    </div>`;
  }
  $("#phCast").html(str);
};

function logout() {
  localStorage.clear();
  window.location.href = "../HomePage/Login.html";
}
