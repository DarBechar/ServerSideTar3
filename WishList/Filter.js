$(document).ready(() => {
  $("#RatingBtn").click(() => {
    let rating = $("#RatingInput").val();
    let apiRating = `https://localhost:7295/api/Movies/Rating/${rating}`;
    $.ajax({
      type: "GET",
      url: apiRating,
      data: null,
      cache: false,
      contentType: "application/json",
      dataType: "json",
      success: filterSuccCB,
      error: filterErrCB,
    });
  });

  $("#DurationBtn").click(() => {
    let duration = $("#DurationInput").val();
    let apiDuration = `https://localhost:7295/api/Movies/duration?duration=${duration}`;
    $.ajax({
      type: "GET",
      url: apiDuration,
      data: null,
      cache: false,
      contentType: "application/json",
      dataType: "json",
      success: filterSuccCB,
      error: filterErrCB,
    });
  });
});

const filterSuccCB = (data) => {
  let str = "";
  for (let index = 0; index < data.length; index++) {
    str += `<div class="card-container">
  <div class="card position-relative">
   <div class="position-absolute top-0 end-0 m-2">
    <span class="badge bg-warning text-dark p-2">
     <i class="bi bi-star-fill me-1"></i>${data[index].rating}
   </span>
 </div>
    <img
      src="${data[index].photoURL}" alt="my-pic" class="card_img"/>
    <div class="card_info">
      <span class="card_category">${data[index].language}</span>
      <h3 class="card_tittle">${data[index].title}</h3>
      </a>
    </div>
  </div>
</div>`;
  }
  $("#RatingInput").val("");
  $("#DurationInput").val("");
  $("#phWish").html(str);
};

const filterErrCB = (err) => {
  console.log(err);
};
