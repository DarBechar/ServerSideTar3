const API = "https://localhost:7295/api/Cast";

$(document).ready(() => {
  console.log("logged");

  ajaxCall("GET", API, null, GetSuccessCallBack, errorCallBack);

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
        DateOfBirth: $("#inputBirthDate").val(),
        Country: $("#inputCountry").val(),
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
  ajaxCall("GET", API, null, GetSuccessCallBack, errorCallBack);
};

const errorCallBack = (err) => {
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
          <span class="card_category">Role: ${CastJson[index].role}</span>
          <h3 class="card_tittle">${CastJson[index].name}</h3>
          <span class="card_category">${CastJson[index].country}</span>
        </div>
      </div>
    </div>`;
  }
  $("#phCast").html(str);
};
