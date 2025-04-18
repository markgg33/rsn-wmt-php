let lastTaskRow = null;

function formatTime(date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(date) {
  return date.toLocaleDateString("en-GB"); // e.g., 01/04/2025
}

function calculateTimeSpent(start, end) {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startHours, startMinutes, 0);

  const endDate = new Date();
  endDate.setHours(endHours, endMinutes, 0);

  let diffMs = endDate - startDate;
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // handle overnight

  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function saveLogToLocalStorage() {
  const rows = [...document.querySelectorAll("#wmtLogTable tbody tr")];
  const data = rows.map(row => [...row.cells].map(cell => cell.textContent));
  localStorage.setItem("wmtLogData", JSON.stringify(data));
}

function loadLogFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("wmtLogData"));
  if (!data) return;

  const tableBody = document.querySelector("#wmtLogTable tbody");
  tableBody.innerHTML = ""; // Clear any existing rows

  data.forEach(rowData => {
    const row = tableBody.insertRow();
    rowData.forEach(cellText => row.insertCell().textContent = cellText);
    lastTaskRow = row;
  });
}

function startTask() {
  const taskDescription = document.getElementById("taskSelector").value;
  if (taskDescription === "") {
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

  // Set work mode separately (do not overwrite task description)
  let workMode = "Web";
  if (taskDescription.startsWith("Away")) workMode = "Away";
  else if (taskDescription.startsWith("End Shift")) workMode = "End";

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
}
