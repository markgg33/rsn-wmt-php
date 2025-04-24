document.addEventListener("DOMContentLoaded", () => {
    const userType = sessionStorage.getItem("user_type"); // Or inject via PHP
    const userId = sessionStorage.getItem("user_id");     // Or inject via PHP
  
    // Pre-fill current month
    document.getElementById("monthSelector").value = new Date().toISOString().slice(0, 7);
  
    if (["admin", "executive", "hr"].includes(userType)) {
      fetch("php_handlers/get_all_users.php")
        .then(res => res.json())
        .then(data => {
          const selector = document.getElementById("userSelector");
          selector.classList.remove("d-none");
          data.forEach(user => {
            const opt = document.createElement("option");
            opt.value = user.id;
            opt.textContent = user.name;
            selector.appendChild(opt);
          });
        });
    }
  
    loadMonthlySummary();
  });
  
  function loadMonthlySummary() {
    const monthYear = document.getElementById("monthSelector").value;
    const [year, month] = monthYear.split("-");
    let userId = sessionStorage.getItem("user_id"); // Default
  
    const userDropdown = document.getElementById("userSelector");
    if (!userDropdown.classList.contains("d-none")) {
      userId = userDropdown.value;
    }
  
    fetch(`php_handlers/get_monthly_summary.php?user_id=${userId}&month=${month}&year=${year}`)
      .then(res => res.json())
      .then(res => {
        if (res.status === "success") {
          renderSummaryTable(res.data);
        } else {
          alert("Failed to load summary");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error loading summary.");
      });
  }
  
  function renderSummaryTable(data) {
    const tbody = document.querySelector("#monthlySummaryTable tbody");
    tbody.innerHTML = "";
  
    Object.entries(data).forEach(([date, details]) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${date}</td>
        <td>${details.login}</td>
        <td>${details.logout}</td>
        <td>${details.total_time}</td>
        <td>${details.production}</td>
        <td>${details.offphone}</td>
        <td>${details.training}</td>
        <td>${details.resono_function}</td>
        <td>${details.paid_break}</td>
        <td>${details.unpaid_break}</td>
        <td>${details.personal_time}</td>
        <td>${details.system_down}</td>
      `;
      tbody.appendChild(row);
    });
  }
  