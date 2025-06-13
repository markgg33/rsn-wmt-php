// ============================================
// ========== GLOBAL VARIABLES & CONFIG =======
// ============================================

let lastTaskRow = null;
let workModeData = {};
let isSliding = false;
let startX = 0;
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
  const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);
  const s = new Date(),
    e = new Date();
  s.setHours(sH, sM);
  e.setHours(eH, eM);
  let diff = e - s;
  if (diff < 0) diff += 24 * 60 * 60 * 1000;
  const mins = Math.floor(diff / 60000);
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(
    mins % 60
  ).padStart(2, "0")}`;
}

// ============================================
// ========== MAIN TASK TAGGING LOGIC =========
// ============================================

function startTask() {
  const task = document.getElementById("taskSelector").value;
  const mode = document.getElementById("workModeSelector").value;
  if (!task) return alert("Please select a task.");
  if (task.includes("End Shift") && !lastTaskRow)
    return alert("You must start a task before ending your shift.");

  const now = new Date();
  const startT = formatTime(now);
  const dateStr = formatDateForDisplay(now);
  const dbDate = formatDateForDatabase(now);
  const user =
    document.getElementById("userSelector")?.value ||
    sessionStorage.getItem("user_id");
  const tableBody = document.querySelector("#wmtLogTable tbody");

  if (lastTaskRow && !lastTaskRow.cells[2].textContent.includes("End Shift")) {
    const s = lastTaskRow.cells[3].textContent;
    const e = startT;
    if (s && e) {
      const dur = calculateTimeSpent(s, e);
      lastTaskRow.cells[4].textContent = e;
      lastTaskRow.cells[5].textContent = dur;
      lastTaskRow.classList.remove("active-task");
      fetch("update_task_log.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lastTaskRow.dataset.taskId,
          end_time: e,
          duration: dur,
        }),
      }).catch((err) => console.error("Error updating prev task:", err));
    }
  }

  const remarks = document.getElementById("remarksInput")?.value || "";
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
  <td>${dateStr}</td>
  <td>${mode}</td>
  <td>${task}</td>
  <td>${startT}</td>
  <td>--</td>
  <td>--</td>
`;

  tableBody.appendChild(newRow);
  newRow.classList.add("active-task");

  fetch("insert_task_logs.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user,
      work_mode: mode,
      task_description: task,
      date: dbDate,
      start_time: startT,
      remarks,
    }),
  })
    .then((res) => {
      if (res.status === 401) {
        alert("Session expired. Redirecting...");
        window.location.href = "index.php";
        return;
      }
      return res.json();
    })
    .then((data) => {
      if (!data) return;
      if (data.status === "success") {
        if (data.updated_previous) {
          const prevEndTime = data.updated_previous.end_time;
          const prevID = data.updated_previous.id;
          const prevEndInput = document.getElementById(`end_${prevID}`);
          if (prevEndInput) {
            prevEndInput.value = prevEndTime;
          }
        }
        newRow.dataset.taskId = data.inserted_id;
        addRemarksCell(newRow, data.inserted_id, remarks);

        // Fill in end time of the previous task (if exists)
        if (lastTaskRow) {
          const lastEndInput = lastTaskRow.querySelector('input[id^="end_"]');
          if (lastEndInput) {
            const now = new Date();
            const formatted = now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            lastEndInput.value = formatted;
          }
        }

        const userType = sessionStorage.getItem("user_type");
        if (["admin", "hr", "executive"].includes(userType)) {
          const cell = newRow.insertCell(7);
          const sID = `start_${data.inserted_id}`;
          const eID = `end_${data.inserted_id}`;
          const btnID = `saveTime_${data.inserted_id}`;
          cell.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <input type="time" class="form-control form-control-sm" style="width: 110px;" id="${sID}" value="${startT}" />
      <input type="time" class="form-control form-control-sm" style="width: 110px;" id="${eID}" value="" />
      <button class="btn btn-sm btn-success" id="${btnID}">Save</button>
    </div>
  `;

          document.getElementById(btnID).addEventListener("click", () => {
            const startInput = document.getElementById(sID);
            const endInput = document.getElementById(eID);
            fetch("update_task_log.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: data.inserted_id,
                start_time: startInput.value,
                end_time: endInput.value,
                duration: calculateTimeSpent(startInput.value, endInput.value),
              }),
            })
              .then((r) => r.json())
              .then((resp) =>
                alert(
                  resp.status === "success" ? "Time updated!" : "Update failed."
                )
              )
              .catch((err) => console.error("Error saving times:", err));
          });
        }

        const month = document.getElementById("monthSelector")?.value;
        if (user && month) loadMonthlySummary(user, month);
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((err) => {
      console.error("Insert error:", err);
      alert("Error tagging task.");
    });

  lastTaskRow = task.includes("End Shift") ? null : newRow;
  document.getElementById("taskSelector").value = "";
}

function addRemarksCell(row, id, value) {
  const cell = row.insertCell(6);
  cell.className = "remarks-cell";
  const inputId = `remarks_${id}`,
    btnId = `saveRemarksBtn_${id}`;
  cell.innerHTML = `
    <div class="d-flex gap-1 align-items-center">
      <input type="text" id="${inputId}" value="${value}" class="form-control form-control-sm" data-task-id="${id}" />
      <button class="btn btn-sm btn-success" id="${btnId}">Save</button>
    </div>
  `;
  document.getElementById(btnId).addEventListener("click", () => {
    const input = document.getElementById(inputId);
    fetch("update_task_remarks.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: input.dataset.taskId,
        remarks: input.value,
      }),
    })
      .then((r) => r.json())
      .then((resp) =>
        alert(resp.status === "success" ? "Remarks saved!" : "Save failed.")
      )
      .catch((err) => console.error("Error saving remarks:", err));
  });
}

// ============================================
// ========== LOAD & RENDER TASK LOGS =========
// ============================================

function loadExistingLogs() {
  fetch("get_user_task_logs.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.status !== "success") {
        return console.error("Error loading logs:", data.message);
      }

      const tbody = document.querySelector("#wmtLogTable tbody");
      tbody.innerHTML = "";

      const userType = sessionStorage.getItem("user_type");

      data.logs.forEach((log, index) => {
        const row = tbody.insertRow();
        row.dataset.taskId = log.id;

        // Set class for the last (active) task
        if (index === data.logs.length - 1 && !log.end_time) {
          row.classList.add("active-task");
          lastTaskRow = row;
        }

        row.insertCell(0).textContent = formatDateForDisplay(
          new Date(log.date)
        );
        row.insertCell(1).textContent = log.work_mode;
        row.insertCell(2).textContent = log.task_description;
        row.insertCell(3).textContent = formatToHHMM(log.start_time);
        row.insertCell(4).textContent = log.end_time
          ? formatToHHMM(log.end_time)
          : "--";
        row.insertCell(5).textContent = log.total_duration
          ? formatToHHMM(log.total_duration)
          : "--";

        // Add remarks input like startTask
        addRemarksCell(row, log.id, log.remarks || "");

        // Add admin controls if user is privileged
        if (["admin", "hr", "executive"].includes(userType)) {
          const cell = row.insertCell(7);
          const sID = `start_${log.id}`;
          const eID = `end_${log.id}`;
          const btnID = `saveTime_${log.id}`;

          if (log.task_description === "End Shift") {
            cell.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <input type="time" class="form-control form-control-sm" style="width: 110px;" id="${sID}" value="${formatToHHMM(
              log.start_time
            )}" />
        <span>(End time fixed)</span>
        <button class="btn btn-sm btn-success" id="${btnID}">Save</button>
      </div>
    `;
          } else {
            cell.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <input type="time" class="form-control form-control-sm" style="width: 110px;" id="${sID}" value="${formatToHHMM(
              log.start_time
            )}" />
        <input type="time" class="form-control form-control-sm" style="width: 110px;" id="${eID}" value="${
              log.end_time ? formatToHHMM(log.end_time) : ""
            }" />
        <button class="btn btn-sm btn-success" id="${btnID}">Save</button>
      </div>
    `;
          }

          // Attach save event
          document.getElementById(btnID)?.addEventListener("click", () => {
            const newStart = document.getElementById(sID).value;
            const newEnd =
              log.task_description === "End Shift"
                ? log.end_time
                : document.getElementById(eID).value;

            if (
              !newStart ||
              (!newEnd && log.task_description !== "End Shift")
            ) {
              return alert("Please fill in the time fields.");
            }

            const duration = newEnd
              ? calculateTimeSpent(newStart, newEnd)
              : null;

            fetch("update_task_times.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                task_id: log.id,
                start_time: newStart,
                end_time: newEnd,
                duration: duration,
              }),
            })
              .then((r) => r.json())
              .then((resp) => {
                alert(
                  resp.status === "success" ? "Time updated!" : "Update failed."
                );
                if (resp.status === "success") loadExistingLogs();
              })
              .catch((err) => console.error("Error saving time:", err));
          });
        }
      });
    });
}

// ============================================
// ========== WORK MODE & SELECTORS ==========
// ============================================

function updateTaskOptions() {
  const tasks =
    workModeData[document.getElementById("workModeSelector").value] || [];
  const select = document.getElementById("taskSelector");
  select.innerHTML = '<option value="">-- Select Task --</option>';
  tasks.forEach((t) => select.add(new Option(t, t)));
}

function populateWorkModes() {
  const sel = document.getElementById("workModeSelector");
  Object.keys(workModeData).forEach((m) => sel.add(new Option(m, m)));
}

// ============================================
// ===== SLIDE-TO-TAG BUTTON INTERACTION ======
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const handle = document.getElementById("slideButtonHandle");
  const wrapper = document.getElementById("slideButtonWrapper");
  if (!handle || !wrapper) return;

  handle.addEventListener("mousedown", (e) => {
    isSliding = true;
    startX = e.clientX;
    currentX = startX;
    document.body.style.userSelect = "none";
    wrapper.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isSliding) return;
    currentX = e.clientX;
    const maxSlide = wrapper.clientWidth - handle.clientWidth;
    const delta = Math.min(maxSlide, Math.max(0, currentX - startX));
    handle.style.left = `${delta}px`;
  });

  document.addEventListener("mouseup", () => {
    if (!isSliding) return;
    isSliding = false;
    document.body.style.userSelect = "";
    wrapper.style.cursor = "grab";
    const maxSlide = wrapper.clientWidth - handle.clientWidth;
    if (currentX - startX >= maxSlide * 0.9) {
      handle.textContent = "Tagging...";
      document.getElementById("globalOverlay").style.display = "flex";
      setTimeout(() => {
        startTask();
        document.getElementById("globalOverlay").style.display = "none";
        handle.style.left = "0";
        handle.textContent = "▶ Slide to Tag";
      }, 1500);
    } else {
      handle.style.left = "0";
    }
  });

  loadExistingLogs();
  fetch("get_work_modes.php")
    .then((r) => r.json())
    .then((data) => {
      workModeData = data;
      populateWorkModes();
      renderWorkModes(data);
    })
    .catch((err) => console.error("Error loading modes:", err));
});

// ============================================
// ========= SUPPORT UTILITIES ================
// ============================================

function formatToHHMM(t) {
  return t ? t.slice(0, 5) : "";
}

function renderWorkModes(data) {
  const container = document.getElementById("existingWorkModesList");
  container.innerHTML = "";
  Object.entries(data).forEach(([mode, tasks]) => {
    const div = document.createElement("div");
    div.className = "list-group-item";
    div.innerHTML = `
      <strong>${mode}</strong>
      <ul>${tasks
        .map(
          (t, i) => `
        <li class="d-flex gap-2">
          <input class="form-control form-control-sm flex-grow-1" value="${t}" data-mode="${mode}" data-index="${i}" />
          <button class="btn btn-danger btn-sm" onclick="deleteTask('${mode}',${i})">Delete</button>
        </li>`
        )
        .join("")}
      </ul>
      <div class="d-flex gap-2 justify-content-end">
        <button class="btn btn-primary btn-sm" onclick="updateTasks('${mode}')">Update</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWorkMode('${mode}')">Delete Mode</button>
      </div>`;
    container.appendChild(div);
  });
}

function updateTasks(mode) {
  const tasks = Array.from(
    document.querySelectorAll(`input[data-mode="${mode}"]`)
  )
    .map((i) => i.value.trim())
    .filter((v) => v);
  fetch("update_work_mode.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, tasks }),
  })
    .then(() => location.reload())
    .catch((err) => console.error(err));
}

function deleteTask(mode, idx) {
  if (!confirm("Delete this task?")) return;
  fetch("delete_task.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, index: idx }),
  }).then(() => location.reload());
}

function deleteWorkMode(mode) {
  if (!confirm("Delete entire mode?")) return;
  fetch("delete_work_mode.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode }),
  }).then(() => location.reload());
}
