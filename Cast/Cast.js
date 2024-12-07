const API = "https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/Cast";

$(document).ready(() => {
  console.log("logged");

  ajaxCall("GET", API, null, GetSuccessCallBack, errorCallBack);

  $("#submitBtn").click(() => {
    console.log("logged");

    post(
      (castMember = {
        ID: $("#inputID").val(),
        Name: $("#inputName").val(),
        Role: $("#inputRole").val(),
        DateOfBirth: $("#inputBirthDate").val(),
        Country: $("#inputCountry").val(),
      })
    );
    return false;
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
        <div class="card_info">
          <span class="card_category">Role: ${CastJson[index].role}</span>
          <h3 class="card_tittle">Name:<br> ${CastJson[index].name}</h3>
          <span class="card_category">Country: ${CastJson[index].country}</span>
        </div>
      </div>
    </div>`;
  }
  $("#phCast").html(str);
};
