// ============================================
// ========== GLOBAL VARIABLES & CONFIG =======
// ============================================

let lastTaskRow = null;
let workModeData = {};
let isSliding = false;
let startX = 0;
let hasMoved = false;
let currentX = 0;

// ============================================
// ========== TIME FORMATTING HELPERS =========
// ============================================

function formatTime(date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDateForDisplay(date) {
  return date.toLocaleDateString("en-GB");
}

function formatDateForDatabase(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateTimeSpent(start, end) {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startHours, startMinutes, 0);

  const endDate = new Date();
  endDate.setHours(endHours, endMinutes, 0);

  let diffMs = endDate - startDate;
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

// ============================================
// ========== LOCAL STORAGE UTILITIES =========
// ============================================

/*function saveLogToLocalStorage() {
  const rows = [...document.querySelectorAll("#wmtLogTable tbody tr")];
  const data = rows.map((row) =>
    [...row.cells].map((cell) => cell.textContent)
  );
  localStorage.setItem("wmtLogData", JSON.stringify(data));
}

function loadLogFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("wmtLogData"));
  if (!data) return;

  const tableBody = document.querySelector("#wmtLogTable tbody");
  tableBody.innerHTML = "";

  data.forEach((rowData) => {
    const row = tableBody.insertRow();
    rowData.forEach((cellText) => (row.insertCell().textContent = cellText));
    lastTaskRow = row;
  });
}*/

// ============================================
// ========== TASK LOGGING FUNCTION ===========
// ============================================

/*function startTask() {
  const taskDescription = document.getElementById("taskSelector").value;
  const workMode = document.getElementById("workModeSelector").value;

  if (!taskDescription) {
    alert("Please select a task.");
    return;
  }

  if (!lastTaskRow && taskDescription.includes("End Shift")) {
    alert("You haven't started any task yet.");
    return;
  }

  if (lastTaskRow && lastTaskRow.cells[2].textContent === taskDescription) {
    alert("You're already on this task.");
    return;
  }

  const now = new Date();
  const timeString = formatTime(now);
  const dateString = formatDate(now);

  const tableBody = document
    .getElementById("wmtLogTable")
    .getElementsByTagName("tbody")[0];

  if (lastTaskRow) {
    const startTime = lastTaskRow.cells[3].textContent;
    const endTime = timeString;

    if (startTime && endTime) {
      lastTaskRow.cells[4].textContent = endTime;
      lastTaskRow.cells[5].textContent = calculateTimeSpent(startTime, endTime);
      lastTaskRow.classList.remove("active-task");
    }
  }

  const newRow = tableBody.insertRow();
  newRow.insertCell(0).textContent = dateString;
  newRow.insertCell(1).textContent = workMode;
  newRow.insertCell(2).textContent = taskDescription;
  newRow.insertCell(3).textContent = timeString;
  newRow.insertCell(4).textContent = "";
  newRow.insertCell(5).textContent = "";

  newRow.classList.add("active-task");
  lastTaskRow = newRow;

  saveLogToLocalStorage();
  document.getElementById("taskSelector").value = "";
}*/

function startTask() {
  const taskDescription = document.getElementById("taskSelector").value;
  const workMode = document.getElementById("workModeSelector").value;

  if (!taskDescription) {
    alert("Please select a task.");
    return;
  }

  // Block if trying to tag End Shift without any prior task
  if (taskDescription.includes("End Shift") && !lastTaskRow) {
    alert("You must start a task before ending your shift.");
    return;
  }

  const now = new Date();
  const timeString = formatTime(now);
  const dateString = formatDateForDisplay(now);
  const dbDate = formatDateForDatabase(now);

  const tableBody = document
    .getElementById("wmtLogTable")
    .querySelector("tbody");

  // ✅ If last task exists and NOT an End Shift
  if (lastTaskRow && !lastTaskRow.cells[2].textContent.includes("End Shift")) {
    const startTime = lastTaskRow.cells[3].textContent;
    const endTime = timeString;

    if (startTime && endTime) {
      lastTaskRow.cells[4].textContent = endTime;
      lastTaskRow.cells[5].textContent = calculateTimeSpent(startTime, endTime);
      lastTaskRow.classList.remove("active-task");

      // Update last task in database
      const prevTaskId = lastTaskRow.dataset.taskId;
      fetch("update_task_log.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: prevTaskId,
          end_time: endTime,
          duration: calculateTimeSpent(startTime, endTime),
        }),
      }).catch((err) => {
        console.error("Error updating previous task:", err);
      });
    }
  }

  // ✅ Now create a fresh new task
  const newRow = tableBody.insertRow();

  newRow.insertCell(0).textContent = dateString;
  newRow.insertCell(1).textContent = workMode;
  newRow.insertCell(2).textContent = taskDescription;
  newRow.insertCell(3).textContent = timeString;
  newRow.insertCell(4).textContent = "";
  newRow.insertCell(5).textContent = "";

  newRow.classList.add("active-task");

  console.log("Tagging task with:", {
    work_mode: workMode,
    task_description: taskDescription,
    date: dateString,
    start_time: timeString,
  });

  // Save new task to DB
  fetch("insert_task_log.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      work_mode: workMode,
      task_description: taskDescription,
      date: dbDate,
      start_time: timeString,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        newRow.dataset.taskId = data.inserted_id;
      } else {
        alert("Error saving task: " + data.message);
      }
    })
    .catch((err) => {
      console.error("Insert error:", err);
    });

  // ✅ MOST IMPORTANT: If the new task is "End Shift", reset `lastTaskRow`
  if (taskDescription.includes("End Shift")) {
    lastTaskRow = null;
  } else {
    lastTaskRow = newRow;
  }

  document.getElementById("taskSelector").value = "";
}

// ============================================
// ======== TASK DROPDOWN UPDATER =============
// ============================================

function updateTaskOptions() {
  const workMode = document.getElementById("workModeSelector").value;
  const taskSelector = document.getElementById("taskSelector");

  taskSelector.innerHTML = '<option value="">-- Select Task --</option>';

  const tasks = workModeData[workMode];
  if (tasks) {
    tasks.forEach((task) => {
      const option = document.createElement("option");
      option.value = task;
      option.textContent = task;
      taskSelector.appendChild(option);
    });
  }
}

// ============================================
// ======= WORK MODE DROPDOWN LOADER ==========
// ============================================

function populateWorkModes() {
  const selector = document.getElementById("workModeSelector");
  Object.keys(workModeData).forEach((mode) => {
    const option = document.createElement("option");
    option.value = mode;
    option.textContent = mode;
    selector.appendChild(option);
  });
}

// ============================================
// ======== SLIDE TO TAG INTERACTION ==========
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const handle = document.getElementById("slideButtonHandle");
  const wrapper = document.getElementById("slideButtonWrapper");

  if (!handle || !wrapper) return;

  // Mouse down - start sliding
  handle.addEventListener("mousedown", (e) => {
    isSliding = true;
    startX = e.clientX;
    currentX = startX;
    document.body.style.userSelect = "none"; // Prevent text highlight
    wrapper.style.cursor = "grabbing";
  });

  // Track movement
  document.addEventListener("mousemove", (e) => {
    if (!isSliding) return;
    currentX = e.clientX;

    let delta = currentX - startX;
    const maxSlide = wrapper.clientWidth - handle.clientWidth;

    if (delta < 0) delta = 0;
    if (delta > maxSlide) delta = maxSlide;

    handle.style.left = `${delta}px`;
  });

  // Mouse up - check if slide was enough
  document.addEventListener("mouseup", () => {
    if (!isSliding) return;

    isSliding = false;
    document.body.style.userSelect = "";
    wrapper.style.cursor = "grab";

    const maxSlide = wrapper.clientWidth - handle.clientWidth;
    const slidDistance = currentX - startX;

    if (slidDistance >= maxSlide * 0.9) {
      handle.textContent = "Tagging...";
      handle.style.pointerEvents = "none";

      // Show full loading overlay
      document.getElementById("loadingOverlay").style.display = "flex";

      setTimeout(() => {
        startTask(); // Perform the task tagging
        document.getElementById("loadingOverlay").style.display = "none"; // Hide overlay

        // Reset slide handle
        handle.style.left = "0";
        handle.textContent = "▶ Slide to Tag";
        handle.style.pointerEvents = "auto";
      }, 1500); // Delay gives time to show the spinner (you can adjust)
    } else {
      handle.style.left = "0"; // Reset slide handle if not fully slid
    }
  });

  // Load logs and modes
  // loadLogFromLocalStorage();

  // ============================================
  // ======== LOAD TAGS FOR USERS ==========
  // ============================================

  loadExistingLogs(); //Dynamic fetching of Logs depending on the user

  function loadExistingLogs() {
    fetch("get_user_task_logs.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const tableBody = document.querySelector("#wmtLogTable tbody");
          tableBody.innerHTML = "";

          data.logs.forEach((log) => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = formatDateForDisplay(
              new Date(log.date)
            );
            row.insertCell(1).textContent = log.work_mode;
            row.insertCell(2).textContent = log.task_description;
            row.insertCell(3).textContent = formatToHHMM(log.start_time);
            row.insertCell(4).textContent = log.end_time
              ? formatToHHMM(log.end_time)
              : "";
            row.insertCell(5).textContent = formatToHHMM(log.total_duration) || "";

            // Attach task ID to each row (so update_task_log knows what to update)
            row.dataset.taskId = log.id;

            // AFTER loading the logs: set lastTaskRow
            const rows = document.querySelectorAll("#wmtLogTable tbody tr");
            rows.forEach((row) => {
              if (!row.cells[4].textContent) {
                lastTaskRow = row;
                row.classList.add("active-task");
              }
            });
          });
        } else {
          console.error("Failed to load logs:", data.message);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  fetch("get_work_modes.php")
    .then((response) => response.json())
    .then((data) => {
      workModeData = data;
      populateWorkModes();
      renderWorkModes(data);
    })
    .catch((error) => {
      console.error("Error loading work modes:", error);
    });
});

//Helper for format
function formatToHHMM(timeStr) {
  if (!timeStr) return "";
  return timeStr.slice(0, 5); // From '13:24:00' ➔ '13:24'
}

// ============================================
// ======== RESET TABLE INTERACTION ==========
// ============================================

function resetTaskLog() {
  if (
    confirm("Are you sure you want to clear all logs? This cannot be undone.")
  ) {
    localStorage.removeItem("wmtLogData"); // Clear localStorage
    const tableBody = document.querySelector("#wmtLogTable tbody");
    tableBody.innerHTML = ""; // Clear the table rows
    lastTaskRow = null; // Reset the last tagged row
  }
}

// ============================================
// ======== LOADING OVERLAY SCRIPT DUPLICATION ==========
// ============================================

/*if (slidDistance >= maxSlide * 0.9) {
  // Show full loading overlay
  document.getElementById("loadingOverlay").style.display = "flex";

  setTimeout(() => {
    startTask(); // Tag only after delay
    document.getElementById("loadingOverlay").style.display = "none";
    handle.style.left = "0";
    handle.textContent = "▶ Slide to Tag";
  }, 1500);
}*/

// ================================
// RENDER WORK MODES
// ================================

function renderWorkModes(data) {
  const container = document.getElementById("existingWorkModesList");
  container.innerHTML = "";

  Object.entries(data).forEach(([mode, tasks]) => {
    const wrapper = document.createElement("div");
    wrapper.className = "list-group-item";

    wrapper.innerHTML = `
        <strong>${mode}</strong>
        <ul class="mt-2">
          ${tasks
            .map(
              (task, idx) => `
            <li class="mb-1 d-flex align-items-center gap-2">
              <input type="text" class="form-control form-control-sm flex-grow-1" value="${task}" data-mode="${mode}" data-index="${idx}">
              <button class="btn btn-danger btn-sm" onclick="deleteTask('${mode}', ${idx})">Delete</button>
            </li>
          `
            )
            .join("")}
        </ul>
        <div class="d-flex justify-content-end mt-2 gap-2">
          <button class="btn btn-primary btn-sm" onclick="updateTasks('${mode}')">Update</button>
          <button class="btn btn-danger btn-sm" onclick="deleteWorkMode('${mode}')">Delete Mode</button>
        </div>
      `;

    container.appendChild(wrapper);
  });
}

// ================================
// UPDATE WORK MODE TASKS
// ================================
function updateTasks(mode) {
  const inputs = document.querySelectorAll(`input[data-mode="${mode}"]`);
  const updatedTasks = Array.from(inputs)
    .map((i) => i.value.trim())
    .filter((t) => t !== "");

  fetch("update_work_mode.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, tasks: updatedTasks }),
  })
    .then((res) => res.text())
    .then((msg) => {
      alert("Updated successfully!");
      location.reload();
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to update.");
    });
}

// ================================
// DELETE TASK FROM A MODE
// ================================
function deleteTask(mode, index) {
  if (!confirm("Delete this task?")) return;

  fetch("delete_task.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, index }),
  })
    .then((res) => res.text())
    .then((msg) => location.reload())
    .catch((err) => console.error(err));
}

// ================================
// DELETE AN ENTIRE WORK MODE
// ================================
function deleteWorkMode(mode) {
  if (!confirm("Delete the entire work mode?")) return;

  fetch("delete_work_mode.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode }),
  })
    .then((res) => res.text())
    .then((msg) => location.reload())
    .catch((err) => console.error(err));
}
