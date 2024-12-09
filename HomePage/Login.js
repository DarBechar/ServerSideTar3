const LoginAPI = "https://localhost:7295/api/User/api/User/Login";

$(document).ready(() => {
  if (localStorage.getItem("isLoggedIn") == "true") {
    console.log("logged");
    window.location.href = "../HomePage/index.html";
    return;
  }
  var myModal = new bootstrap.Modal(document.getElementById("loginModal"), {
    backdrop: "static",
    keyboard: false,
  });
  myModal.show();

  $("#loginFormSubmit").submit((event) => {
    event.preventDefault();
    const user = {
      id: 0,
      UserName: $("#usernameInput").val(),
      email: $("#emailInput").val(),
      password: $("#passwordInput").val(),
    };
    console.log(user);
    ajaxCall("POST", LoginAPI, JSON.stringify(user), successCB, errorCB);
  });
});

// Toggle between login and register forms
function toggleForms(formType) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const modalTitle = document.getElementById("modalTitle");

  if (formType === "register") {
    loginForm.classList.add("d-none");
    registerForm.classList.remove("d-none");
    modalTitle.textContent = "Register New Account";
  } else {
    registerForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
    modalTitle.textContent = "Login Required";
  }
}

const successCB = (data) => {
  console.log("Raw data:", data);
  console.log("Username:", data.username);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("UserData", JSON.stringify(data));

  localStorage.setItem("UserName", toString(data.UserName));

  // Show success message
  $("#loginAlert")
    .removeClass("alert-danger")
    .addClass("alert-success")
    .text("Succesfully Logged In")
    .removeClass("d-none");

  // Close modal using Bootstrap's native JavaScript
  const modalElement = document.getElementById("loginModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);

  // Wait 1 second then close and redirect
  setTimeout(() => {
    modalInstance.hide();
    window.location.href = "../HomePage/Login.html";
  }, 1000);
};

const errorCB = (err) => {
  console.log("Error:", err.responseJSON || err.statusText);
};
