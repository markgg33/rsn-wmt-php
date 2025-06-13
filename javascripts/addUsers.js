document.getElementById("addUserForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  // Show loading overlay immediately
  showLoading();

  fetch("add_user.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const resultDiv = document.getElementById("userAddResult");

      if (data.status === "success") {
        alert("User added successfully!");
        document.getElementById("addUserForm").reset();
        resultDiv.textContent = ""; // clear message since alert shows success
        resultDiv.className = "";
      } else {
        resultDiv.textContent = data.message;
        resultDiv.className = "text-danger";
      }
    })
    .catch((err) => {
      console.error(err);
      const resultDiv = document.getElementById("userAddResult");
      resultDiv.textContent = "Something went wrong.";
      resultDiv.className = "text-danger";
    })
    .finally(() => {
      // Hide loading overlay after 1.5 seconds delay
      setTimeout(() => {
        hideLoading();
      }, 1500);
    });
});
