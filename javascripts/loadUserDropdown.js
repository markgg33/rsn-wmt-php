function loadUsersDropdown() {
  fetch("get_all_users.php")
    .then((res) => res.json())
    .then((data) => {
      const dropdown = document.getElementById("userFilterDropdown");
      data.users.forEach((user) => {
        const opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent = user.name + " (" + user.email + ")";
        dropdown.appendChild(opt);
      });
    });
}
