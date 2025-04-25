document.addEventListener("DOMContentLoaded", () => {
  console.log("💡 DOM Ready");
  const userType = sessionStorage.getItem("user_type");
  const userId = sessionStorage.getItem("user_id");

  console.log("🔍 User Type:", userType);
  console.log("🔍 User ID:", userId);

  const monthSelector = document.getElementById("monthSelector");
  const userDropdown = document.getElementById("userFilterDropdown");

  if (monthSelector) {
    const now = new Date();
    monthSelector.value = now.toISOString().slice(0, 7); // format YYYY-MM
  }

  if (["admin", "executive", "hr", "user"].includes(userType)) {
    fetch("get_all_users.php")
      .then((res) => res.json())
      .then((users) => {
        users.forEach((user) => {
          const opt = document.createElement("option");
          opt.value = user.id;
          opt.textContent = user.name;
          userDropdown.appendChild(opt);
        });

        userDropdown.addEventListener("change", () => {
          loadMonthlySummary(userDropdown.value);
        });

        // Load first user or current user summary
        loadMonthlySummary(userDropdown.value || userId);
      });
  } else {
    loadMonthlySummary(userId);
  }

  if (monthSelector) {
    monthSelector.addEventListener("change", () => {
      const targetUserId =
        userDropdown && userDropdown.value ? userDropdown.value : userId;
      loadMonthlySummary(targetUserId);
    });
  }
});

function loadMonthlySummary(userId) {
  const month = document.getElementById("monthSelector").value;

  fetch(`get_monthly_summary.php?user_id=${userId}&month=${month}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "success") {
        renderSummaryTable(res.data);
      } else {
        alert("Failed to load summary.");
        console.error(res.message);
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert("Error loading summary.");
    });
}

function renderSummaryTable(data) {
  const tbody = document.querySelector("#monthlySummaryTable tbody");
  tbody.innerHTML = "";

  data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.login}</td>
      <td>${row.logout}</td>
      <td>${row.total_time}</td>
      <td>${row.production}</td>
      <td>${row.offphone}</td>
      <td>${row.training}</td>
      <td>${row.resono_function}</td>
      <td>${row.paid_break}</td>
      <td>${row.unpaid_break}</td>
      <td>${row.personal_time}</td>
      <td>${row.system_down}</td>
    `;

    if (row.date === "MTD TOTAL") {
      tr.style.fontWeight = "bold";
      tr.style.backgroundColor = "#e9ecef"; // light gray
    }
    tbody.appendChild(tr);
  });
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToHHMM(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}
