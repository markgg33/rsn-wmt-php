function showLoading(message = "Please wait...") {
  const overlay = document.getElementById("globalOverlay");
  if (overlay) {
    overlay.style.display = "flex";
    overlay.querySelector("div:nth-child(2)").textContent = message;
  }
}

function hideLoading() {
  const overlay = document.getElementById("globalOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}
