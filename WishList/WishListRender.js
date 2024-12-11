// const API = "https://proj.ruppin.ac.il/bgroup4/test2/tar1/api/Movies";
const API = "https://localhost:7295/api/User/wishList";
const userinfo = JSON.parse(localStorage.getItem("UserData"));

let wishList;
$(document).ready(() => {
  console.log(userinfo.userId);

  ajaxCall(
    "GET",
    API + `/${userinfo.userId}`,
    null,
    successCallBack,
    errorCallBack
  );
});

const render = (mPackage) => {
  wishList = mPackage;
  let str = ``;
  for (let i = 0; i < mPackage.length; i++) {
    str += `<div class="card-container">
    <div class="card position-relative">
     <div class="position-absolute top-0 end-0 m-2">
      <span class="badge bg-warning text-dark p-2">
       <i class="bi bi-star-fill me-1"></i>${mPackage[i].rating}
     </span>
   </div>
      <img
        src="${mPackage[i].photoURL}" alt="my-pic" class="card_img"/>
      <div class="card_info">
        <span class="card_category">${mPackage[i].language}</span>
        <h3 class="card_tittle">${mPackage[i].title}</h3>
        </a>
      </div>
    </div>
  </div>`;
  }
  $("#phWish").html(str);
};

const successCallBack = (mPackage) => {
  render(mPackage);
};

const errorCallBack = (err) => {
  console.log("Error:", err.responseJSON || err.statusText);
};
