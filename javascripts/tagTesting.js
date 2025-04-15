
    let lastTaskRow = null;

    function startTask() {
        const taskDescription = document.getElementById("taskSelector").value;
        if (taskDescription === "") {
            alert("Please select a task.");
            return;
        }

        // Extract Work Mode
        let workMode = "Web";
        if (taskDescription.includes("Away") || taskDescription.includes("End Shift")) {
            workMode = taskDescription.split(" ")[0];
        }

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const tableBody = document.getElementById("wmtLogTable").getElementsByTagName("tbody")[0];

        // If a task is ongoing, mark end time
        if (lastTaskRow) {
            lastTaskRow.cells[3].textContent = timeString;
        }

        // Create new row and mark start time
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = workMode;
        newRow.insertCell(1).textContent = taskDescription;
        newRow.insertCell(2).textContent = timeString;
        newRow.insertCell(3).textContent = ""; // End time placeholder
        lastTaskRow = newRow;

        // Optional: Reset selector after tagging
        document.getElementById("taskSelector").value = "";
    }





