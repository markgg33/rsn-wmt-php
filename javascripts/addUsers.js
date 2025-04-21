document.getElementById("addUserForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch("add_user.php", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const resultDiv = document.getElementById("userAddResult");
      resultDiv.textContent = data.message;
      resultDiv.className = data.status === "success" ? "text-success" : "text-danger";
      if (data.status === "success") {
        document.getElementById("addUserForm").reset();
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("userAddResult").textContent = "Something went wrong.";
      document.getElementById("userAddResult").className = "text-danger";
    });
});

