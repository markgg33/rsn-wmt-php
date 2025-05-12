document.addEventListener("DOMContentLoaded", () => {
  console.log("💡 DOM Ready");
  const userType = sessionStorage.getItem("user_type");
  const userId = sessionStorage.getItem("user_id");

  console.log("🔍 User Type:", userType);
  console.log("🔍 User ID:", userId);

  const monthSelector = document.getElementById("monthSelector");
  const userDropdown = document.getElementById("userSelector");

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


//FUNCTION TO LOAD SUMMARY TABLE

function loadMonthlySummary(userId, month = null) {
  //const month = document.getElementById("monthSelector").value;

  if (!month) {
    month = document.getElementById("monthSelector")?.value;
  }

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

//REFRESH BUTTON TO REFRESH THE SUMMARY TABLE

function refreshSummary() {
  const userId =
    document.getElementById("userSelector")?.value ||
    sessionStorage.getItem("user_id");
  const month = document.getElementById("monthSelector")?.value;

  if (!userId || !month) {
    alert("Please select a user and a month to refresh.");
    return;
  }

  loadMonthlySummary(userId, month);
}

// REFRESH BUTTON FOR REGULAR USERS (no userSelector needed)
function refreshUserSummary() {
  const userId = sessionStorage.getItem("user_id");
  const month = document.getElementById("monthSelector")?.value;

  if (!userId || !month) {
    alert("Please select a month to refresh.");
    return;
  }

  loadMonthlySummary(userId, month);
}

//CODE FOR PDF GENERATION OF DTRs

document.getElementById("generatePdfBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "pt", "a4"); // Landscape, points, A4

  const logoBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASsAAAFqCAMAAAB1foxPAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAsSwAALEsBpT2WqQAAAMlQTFRFAAAASE1JTptCT5xCUJ1CUp5DVaBDVqJDV6JFWqRHXKZJXqdKX6lMYqpNZKtPZaxQaK5Raq9Sa69UbbFVb7JWcrNXc7VZdbZaeLhcerhee7lffbthf7tigbxkg71mhb5nh8BpicFri8JtjcNuj8RwkMVxk8Zzlch0l8l2mcl3mst5nMt6ns18oM19os5/pNCBptCDqNKEqtKFrNOHrtSIr9WKsdaLs9eMtdeOt9iPudmQu9qSvdyUv9yVwd2Ww96Yxd6ZxuCa0OWrFOuSJgAAAEN0Uk5TAP//////////////////////////////////////////////////////////////////////////////////////6Br7q6cAAA37SURBVHic7dxluyu3EQBgu8xpmzKl3JSZMf3hKSVlZmZIysx9Th8furaHcUnzKZGlGem11t5d7z373Zxif95wMcUsqACzm+0Upmeb0spVe0KyiayCZacB67fKqtjv1WyVXK7Xq9GqqFSfV5dVaZ0mrharhiIdXPXLaDvKy7mqV9L63VGsVbqWCU7eKrkKlzPRaW6dVtWCprx2qtKqWdPUV+Q1WhWrmlrqEBVa+euag9Qh8rWyVzYXqUNka+WuLSHb0QLj2XK1Uq3cycQ11WU2RKKVJ5VtKRPfSE2zMifyrqGtULxySp7w9JvLeYpmZMl6m00zTymaYWXIkfw1rq+cUTjBSp2i5MqjsXrYSptg+sv/5g9J9/h53IULziJopRre8tNBw0xCVvOROoRmNqHJRKzKJ2eN4gkFrOShs/wZ3T8pt9UcpQ5ROC+vlThuumd/yrScVjOm2pXNzmcljZr8GbySCXqsZi91CGGSnjk6rApmURH507RbLYRqJ83UPlGzVfYEKiP5bbVaLYlqlzxdoxXbfXZSu1wsm9XiqHaZczZZcZ1nKrVLxLJYLZNqlzZxg9ViqbKmrrdies5capeEpbZaNFUOltZq4VS7jBUorZZPlbAGndUaqLhVJFpFi8wlguuIWS2LKoqlsVoNVRBLYbUiql1oNbLVuqgi6xGt1kZFryhstT4qP5bXasFU7kUJVquk8i6Lt1op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"; // Insert your base64 string here

  const table = document.getElementById("monthlySummaryTable");
  if (!table || table.rows.length <= 1) {
    alert("No data available in the summary table.");
    return;
  }

  // Load logo and generate PDF after it's loaded
  const img = new Image();
  img.onload = () => {
    // Add logo and header
    doc.addImage(img, "PNG", 40, 30, 40, 40); // Adjust position and size (IMAGE, FORMAT, X AXIS, Y AXIS, WIDTH, HEIGHT)
    doc.setFontSize(14);
    doc.text("Monthly Work Summary", 150, 50);

    // Format month & user (optional enhancements)
    const monthText = document.getElementById("monthSelector")?.value || "";
    const userText =
      document.getElementById("userSelector")?.selectedOptions[0]?.text || "";

    if (monthText || userText) {
      doc.setFontSize(11);
      doc.text(`Month: ${monthText}`, 150, 70);
      doc.text(`User: ${userText}`, 150, 85);
    }

    // Extract table data
    doc.autoTable({
      html: "#monthlySummaryTable",
      startY: 100,
      styles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        halign: "center",
      },
      margin: { top: 80 },
    });

    const autoGeneratedMessage =
      "This is a generated report from the CDP Systems";
    const finalY = doc.lastAutoTable.finalY || 0;
    doc.setFontSize(8);
    doc.setFont("Roboto", "italic");
    doc.text(autoGeneratedMessage, 40, finalY + 30);

    // Save the PDF
    const filename = `Monthly_Summary_${monthText}_${userText}`.replace(
      /\s+/g,
      "_"
    );
    doc.save(`${filename}.pdf`); //SAVE FUNCTION FOR HTML TO PDF JS
    /*const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");*/
  };

  img.src = logoBase64;
});

//HIDING USER MAKING SELECT USER THE DEFAULT CHOICE and HIDING RELOAD BUTTON

document.getElementById("userSelector").addEventListener("change", function () {
  const selectedUserId = this.value;
  const summaryContainer = document.getElementById("summaryContainer");
  const summaryTableBody = document.querySelector("#monthlySummaryTable tbody");
  const pdfButton = document.getElementById("summaryBtn");
  const reloadButton = document.getElementById("refreshSummaryBtn");

  // Hide table and clear data if no user is selected
  if (!selectedUserId) {
    summaryContainer.style.display = "none";
    pdfButton.style.display = "none";
    reloadButton.style.display = "none";
    summaryTableBody.innerHTML = ""; // Clear previous data


    return;
  }

  // Show container and load summary if user selected
  summaryContainer.style.display = "block";
  pdfButton.style.display = "block";
  reloadButton.style.display = "block";
  loadMonthlySummary(); // Make sure this function exists and fetches the data
});


