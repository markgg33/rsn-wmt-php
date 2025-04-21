document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch("login.php", {
    method: "POST",
    body: formData
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        window.location.href = data.redirect;
      } else {
        document.getElementById("loginError").textContent = data.message;
        document.getElementById("loginError").style.display = "block";
      }
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("loginError").textContent = "Something went wrong.";
      document.getElementById("loginError").style.display = "block";
    });
});

