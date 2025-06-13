function showLoading() {
  document.getElementById("globalOverlay").style.display = "flex";
}

function hideLoading() {
  document.getElementById("globalOverlay").style.display = "none";
}

// Helper to hide loading overlay with delay
function hideLoadingWithDelay(delay = 500) {
  setTimeout(() => {
    hideLoading();
  }, delay);
}

function updateDuration(id) {
  const startInput = document.getElementById(`start-${id}`);
  const endInput = document.getElementById(`end-${id}`);
  const durationInput = document.getElementById(`duration-${id}`);

  const start = startInput.value;
  const end = endInput.value;

  if (start && end) {
    const duration = calculateTimeSpent(start, end);
    durationInput.value = duration;
    markRowChanged(id);
  }
}

document.getElementById("searchUserBtn").addEventListener("click", () => {
  const keyword = document.getElementById("searchUserInput").value.trim();
  if (!keyword) return;

  showLoading();
  fetch(`search_users.php?keyword=${encodeURIComponent(keyword)}`)
    .then((res) => res.json())
    .then((data) => {
      const results = document.getElementById("userResults");
      results.innerHTML = "";

      if (data.status === "success") {
        data.users.forEach((user) => {
          const div = document.createElement("div");
          div.className = "p-2 border rounded bg-light mb-1";
          div.style.cursor = "pointer";
          div.textContent = `${user.name} (${user.email})`;
          div.onclick = () => {
            document.getElementById(
              "selectedUserInfo"
            ).textContent = `Showing logs for: ${user.name} (${user.email})`;
            document.getElementById("userResults").innerHTML = "";
            document.getElementById("clearSelectedUserBtn").style.display =
              "inline-block";
            loadTaskLogs(user.id);
          };
          results.appendChild(div);
        });
      } else {
        results.innerHTML = '<div class="text-danger">No users found.</div>';
      }
    })
    .catch(console.error)
    .finally(() => hideLoadingWithDelay());
});

document
  .getElementById("clearSelectedUserBtn")
  .addEventListener("click", () => {
    document.getElementById("searchUserInput").value = "";
    document.getElementById("selectedUserInfo").textContent = "";
    document.getElementById("taskLogsBody").innerHTML = "";
    document.getElementById("userResults").innerHTML = "";
    document.getElementById("clearSelectedUserBtn").style.display = "none";
  });

function loadTaskLogs(userId) {
  showLoading();
  fetch(`get_user_task_logs.php?user_id=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("taskLogsBody");
      tbody.innerHTML = "";

      if (data.status === "success") {
        data.logs.forEach((log) => {
          const row = document.createElement("tr");
          row.setAttribute("data-id", log.id);

          // Create input IDs to easily access them
          const startID = `start-${log.id}`;
          const endID = `end-${log.id}`;
          const durationID = `duration-${log.id}`;

          row.innerHTML = `
    <td>${log.date}</td>
    <td>${log.work_mode}</td>
    <td>${log.task_description}</td>
    <td><input type="time" id="${startID}" class="form-control" value="${
            log.start_time
          }" onchange="updateDuration(${log.id})"></td>
    <td><input type="time" id="${endID}" class="form-control" value="${
            log.end_time || ""
          }" onchange="updateDuration(${log.id})"></td>
    <td><input type="text" id="${durationID}" class="form-control" value="${
            log.total_duration || ""
          }" onchange="markRowChanged(${log.id})" readonly></td>
    <td><input type="text" class="form-control" value="${
      log.remarks || ""
    }" onchange="markRowChanged(${log.id})"></td>
    <td><button class="btn btn-sm btn-primary" onclick="saveLog(${
      log.id
    }, this)">Save</button></td>
  `;

          tbody.appendChild(row);
        });
      }
    })
    .catch(console.error)
    .finally(() => hideLoadingWithDelay());
}

function markRowChanged(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  row.classList.add("table-warning");
}

function saveLog(id, btn) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const start_time = document.getElementById(`start-${id}`).value;
  const end_time = document.getElementById(`end-${id}`).value;
  const duration = document.getElementById(`duration-${id}`).value;
  const remarks = row.querySelectorAll("input")[3].value; // 4th input is remarks

  showLoading();
  fetch("update_task_log.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, start_time, end_time, duration, remarks }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Response from update_task_log:", data);
      if (data.status === "success") {
        row.classList.remove("table-warning");
        alert("Updated successfully!");
      } else {
        alert("Update failed.");
      }
    })
    .catch((error) => {
      console.error("Update error:", error);
      alert("Something went wrong.");
    })
    .finally(() => hideLoadingWithDelay());
}

//======================================
//======= CALCULATION HELPER ===========
//======================================

function calculateTimeSpent(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startDate = new Date(0, 0, 0, sh, sm);
  const endDate = new Date(0, 0, 0, eh, em);

  let diff = (endDate - startDate) / 1000 / 60; // minutes

  if (diff < 0) diff += 24 * 60; // cross midnight

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}
