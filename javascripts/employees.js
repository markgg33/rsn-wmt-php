function loadEmployees() {
  $.get("get_all_employees.php", function (data) {
    const container = $("#employeeContainer");
    container.empty();

    const departments = JSON.parse(data);
    for (let dept in departments) {
      const group = departments[dept];
      const groupBox = $(`
                <div class="card mb-3 shadow-sm">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">${dept}</h5>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-striped mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>User Type</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `);

      group.forEach((emp) => {
        groupBox.find("tbody").append(`
                    <tr>
                        <td>${emp.first_name} ${emp.middle_name || ""} ${
          emp.last_name
        }</td>
                        <td>${emp.email}</td>
                        <td>${emp.user_type}</td>
                    </tr>
                `);
      });

      container.append(groupBox);
    }
  }).fail(() => {
    $("#employeeContainer").html(
      `<div class="alert alert-danger">Failed to load employee data.</div>`
    );
  });
}

// Auto-load when page is shown
function changePage(page) {
  $(".page-content").hide();
  $(`#${page}-page`).show();

  if (page === "employees") {
    loadEmployees();
  }
}
