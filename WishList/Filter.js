$(document).ready(() => {
  $("#RatingBtn").click(() => {
    renderRatingFilter();
  });

  $("#DurationBtn").click(() => {
    renderDurationFilter();
  });
});

const renderRatingFilter = () => {
  let rating = $("#RatingInput").val();
  console.log(rating);
  let str = "";
  for (let index = 0; index < wishList.length; index++) {
    if (wishList[index].rating >= rating) {
      str += `<div class="card-container">
    <div class="card position-relative">
     <div class="position-absolute top-0 end-0 m-2">
      <span class="badge bg-warning text-dark p-2">
       <i class="bi bi-star-fill me-1"></i>${wishList[index].rating}
     </span>
   </div>
      <img
        src="${wishList[index].photoURL}" alt="my-pic" class="card_img"/>
      <div class="card_info">
        <span class="card_category">${wishList[index].language}</span>
        <h3 class="card_tittle">${wishList[index].title}</h3>
        </a>
      </div>
    </div>
  </div>`;
    }
  }
  $("#RatingInput").val("");
  $("#phWish").html(str);
};

const renderDurationFilter = () => {
  let duration = $("#DurationInput").val();
  console.log(duration);
  let str = "";
  for (let index = 0; index < wishList.length; index++) {
    if (wishList[index].duration >= duration) {
      str += `<div class="card-container">
    <div class="card position-relative">
     <div class="position-absolute top-0 end-0 m-2">
      <span class="badge bg-warning text-dark p-2">
       <i class="bi bi-star-fill me-1"></i>${wishList[index].rating}
     </span>
   </div>
      <img
        src="${wishList[index].photoURL}" alt="my-pic" class="card_img"/>
      <div class="card_info">
        <span class="card_category">${wishList[index].language}</span>
        <h3 class="card_tittle">${wishList[index].title}</h3>
          <button id="${wishList[index].id}" class="button" >Add To Favorites</button>
        </a>
      </div>
    </div>
  </div>`;
    }
  }
  $("#DurationInput").val("");
  $("#phWish").html(str);
};
