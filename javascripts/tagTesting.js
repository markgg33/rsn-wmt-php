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

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

function startTask() {
  const taskDescription = document.getElementById("taskSelector").value;
  if (taskDescription === "") {
    alert("Please select a task.");
    return;
  }

  const now = new Date();
  const timeString = formatTime(now);
  const dateString = formatDate(now); // e.g., 2025-04-16

  // Set work mode: either the first word (for Away/End Shift), or "Web" by default
  let workMode = "Web";
  if (
    taskDescription.includes("Away") ||
    taskDescription.includes("End Shift")
  ) {
    workMode = taskDescription.split(" ")[0];
  }

  const tableBody = document
    .getElementById("wmtLogTable")
    .getElementsByTagName("tbody")[0];

  // If a task is ongoing, complete it with end time and duration
  if (lastTaskRow) {
    const startTime = lastTaskRow.cells[3].textContent;
    const endTime = timeString;

    if (startTime && endTime) {
      lastTaskRow.cells[4].textContent = endTime; // End time
      lastTaskRow.cells[5].textContent = calculateTimeSpent(startTime, endTime); // Duration
    }
  }

  // Create a new row for the current tag
  const newRow = tableBody.insertRow();
  newRow.insertCell(0).textContent = dateString; // Date
  newRow.insertCell(1).textContent = workMode;
  newRow.insertCell(2).textContent = taskDescription;
  newRow.insertCell(3).textContent = timeString; // Start time
  newRow.insertCell(4).textContent = ""; // End time (to be filled when next tag happens)
  newRow.insertCell(5).textContent = ""; // Total time spent

  lastTaskRow = newRow;

  // Clear dropdown
  document.getElementById("taskSelector").value = "";
}
