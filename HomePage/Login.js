const LoginAPI = "https://localhost:7295/api/User/Login";

$(document).ready(() => {
  //checking if the user is logged in. if he is refering to homepage, if not showing the login modal
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

  //handling the login form submition

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

  //validation that password match
  $("#confirmPassword").on("input", function () {
    const password = $("#registerPassword").val();
    const confirmPassword = $(this).val();

    if (password !== confirmPassword) {
      $(this).addClass("is-invalid");
      $(this).removeClass("is-valid");
    } else {
      $(this).addClass("is-valid");
      $(this).removeClass("is-invalid");
    }
  });

  //validating email input

  $("#registerEmail").on("input", function () {
    const email = $(this).val();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailPattern.test(email)) {
      $(this).addClass("is-valid");
      $(this).removeClass("is-invalid");
    } else {
      $(this).addClass("is-invalid");
      $(this).removeClass("is-valid");
    }
  });

  //handling the register form submition

  $("#registerFormSubmit").submit((event) => {
    event.preventDefault();
    const user = {
      id: 0,
      UserName: $("#registerUsername").val(),
      Email: $("#registerEmail").val(),
      password: $("#registerPassword").val(),
    };
    console.log(user);

    $.ajax({
      type: "POST",
      url: "https://localhost:7295/api/User/Register",
      data: JSON.stringify(user),
      cache: false,
      contentType: "application/json",
      dataType: "json",
      success: (response) => {
        console.log("Raw success response:", response);
        successCB(response);
      },
      error: (error) => {
        errorCB(error);
      },
    });
  });

  //wiring the toggle between login and register
  $("#showRegister").click(() => toggleForms("register"));
  $("#showLogin").click(() => toggleForms("login"));
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
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("UserData", JSON.stringify(data));
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
  $("#loginAlert")
    .removeClass("alert-success")
    .addClass("alert-danger")
    .text("Login failed. Please check your username and password.")
    .removeClass("d-none");
  console.log("Full error:", err);
  console.log("Status:", err.status);
  console.log("Response Text:", err.responseText);
};
