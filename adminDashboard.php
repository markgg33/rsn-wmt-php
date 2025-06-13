<?php

require "config.php";

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_type'], ['admin', 'executive', 'hr'])) {
    header("Location: login.php");
    exit;
}

$userType = $_SESSION['user_type'];

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WMT Admin Tracker</title>
    <script src="https://kit.fontawesome.com/92cde7fc6f.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css" />
    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <link rel="icon" type="image/x-icon" href="images/RESONO_logo.ico">
    <link rel="stylesheet" href="css/adminDashboard.css">
    <!---FONT--->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
    <script>
        sessionStorage.setItem('user_type', '<?= $_SESSION['user_type'] ?>');
        sessionStorage.setItem('user_id', '<?= $_SESSION['user_id'] ?>');
    </script>
    <script src="javascripts/sidebar.js"></script>
    <!----AOS LIBRARY---->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>

<body>

    <div class="grid-container">
        <aside id="rsn-sidebar">

            <div class="logout-container">
                <img src="images/RESONO_logo.png" width="100px" alt="">
                <a href="logout.php" onclick="return confirm('Are you sure you want to log out?')"><button class="btn-logout"><i class="fa-solid fa-power-off"></i></button></a>
                <br>
                <p>Welcome, <?= isset($_SESSION['name']) ? htmlspecialchars($_SESSION['name']) : 'Guest'; ?></p>

            </div>

            <ul class="sidebar-list" data-aos="fade-right">
                <li>
                    <a class="sidebar-dropdown d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#generalSubmenu" role="button" aria-expanded="false" aria-controls="generalSubmenu">
                        <span><i class="fa-solid fa-house"></i>GENERAL</span>
                        <i class="fa-solid fa-caret-down"></i>
                    </a>

                    <ul class="collapse sidebar-submenu list-unstyled ps-3" id="generalSubmenu">
                        <li class="sidebar-list-item" data-page="dashboard" onclick="changePage('dashboard')">Dashboard</li>
                        <li class="sidebar-list-item" data-page="monthlySummary" onclick="changePage('monthlySummary')">Monthly Summary</li>
                        <li class="sidebar-list-item" data-page="uploadFiles" onclick="changePage('uploadFiles')">Upload Files</li>
                        <li class="sidebar-list-item" data-page="editWMT" onclick="changePage('editWMT')">Edit WMT</li>
                    </ul>
                </li>

                <!----SYSTEM SETTINGS---->
                <li>
                    <a class="sidebar-dropdown d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#systemSettingsmenu" role="button" aria-expanded="false" aria-controls="systemSettingsmenu">
                        <span><i class="fa-solid fa-gear"></i>SYSTEM SETTINGS</span>
                        <i class="fa-solid fa-caret-down"></i>
                    </a>

                    <ul class="collapse sidebar-submenu list-unstyled ps-3" id="systemSettingsmenu">

                        <li class="sidebar-list-item" data-page="addUsers" onclick="changePage('addUsers')">Add Users</li>
                        <li class="sidebar-list-item" data-page="workModeCreation" onclick="changePage('workModeCreation')">Work Mode Management</li>
                        <li class="sidebar-list-item" data-page="employees" onclick="changePage('employees')">Employees</li>
                        <li class="sidebar-list-item" data-page="billing" onclick="changePage('billing')">Billing</li>
                        <li class="sidebar-list-item" data-page="editProfile" onclick="changePage('editProfile')">Edit Profile</li>
                    </ul>
                </li>
                <!----SYSTEM SETTINGS END---->

            </ul>
        </aside>

        <div class="rsn-main-container">

            <div id="dashboard-page" class="page-content">
                <div class="main-title">
                    <h1>DASHBOARD</h1>
                    <script src="javascripts/realTimeClock.js"></script>
                    <div class="time-container">
                        <h3 id="live-date" class="fw-bold"></h3>
                        <h6 id="live-time" class="text-muted"></h6>
                    </div>
                </div>

                <div class="rsn-main-cards">

                    <!-- WMT Task Tagging -->
                    <div class="card">
                        <h4>Work Mode Tagging</h4>
                        <!-- Work Mode and Task Selection -->
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <select id="workModeSelector" class="form-select w-auto" onchange="updateTaskOptions()">
                                <option value="">-- Select Work Mode --</option>
                                <!-- Options will be populated dynamically -->
                            </select>

                            <select id="taskSelector" class="form-select w-auto">
                                <option value="">-- Select Task --</option>
                                <!-- Task options will be populated based on selected Work Mode -->
                            </select>
                            <br>

                            <div id="slideButtonWrapper" class="slide-button-wrapper">
                                <div class="slide-button-handle" id="slideButtonHandle">▶ Slide to Tag</div>
                            </div>
                        </div>

                        <!-- Task Log Table -->
                        <div class="table-responsive">
                            <table class="table table-bordered text-center" id="wmtLogTable">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Date</th>
                                        <th>Work Mode</th>
                                        <th>Task Description</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Total Time Spent</th>
                                        <th>Remarks</th>
                                        <th>Edit Time</th> <!-- New -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Task rows go here dynamically -->
                                </tbody>
                            </table>
                            <!---button class="btn btn-danger mb-2" onclick="resetTaskLog()">Reset Table</button---CAN BE USE FOR TESTING PURPOSES--->
                        </div>
                    </div>
                </div>
                <br>
            </div>

            <!--Edit user tagging -->
            <div id="editWMT-page" class="page-content">
                <div class="main-title">
                    <h1>EDIT WORK MODE TRACKERS</h1>
                </div>

                <!-- Search bar with input group -->
                <div class="input-group mb-3" style="max-width: 600px;">
                    <input type="text" class="form-control" id="searchUserInput" placeholder="Search by name or email">
                    <button class="btn btn-success" type="button" id="searchUserBtn">
                        <i class="fas fa-search"></i>
                    </button>
                    <button class="btn btn-danger" type="button" id="clearSelectedUserBtn" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div id="userResults" class="mb-3"></div>
                <div id="selectedUserInfo" class="fw-bold mb-2"></div>

                <table class="table table-bordered" id="taskLogsTable">
                    <thead class="table-light">
                        <tr>
                            <th>Date</th>
                            <th>Work Mode</th>
                            <th>Task Description</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Total Duration</th>
                            <th>Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="taskLogsBody"></tbody>
                </table>
            </div>

            <!--Add users Page-->

            <div id="addUsers-page" class="page-content">
                <div class="card p-4 mt-4">
                    <h4>Add New User</h4>
                    <form id="addUserForm">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="first_name" class="form-label">First Name</label>
                                <input type="text" class="form-control" id="first_name" name="first_name" required />
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="middle_name" class="form-label">Middle Name (optional)</label>
                                <input type="text" class="form-control" id="middle_name" name="middle_name" />
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="last_name" class="form-label">Last Name</label>
                                <input type="text" class="form-control" id="last_name" name="last_name" required />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="department" class="form-label">Department</label>
                            <select class="form-select" id="department" name="department" required>
                                <option value="">Select Department</option>
                                <option value="Web Team">Web Team</option>
                                <option value="Ancilliary Team">Ancilliary Team</option>
                                <option value="Fraud Team">Fraud Team</option>
                                <option value="Nectar Team">Nectar Team</option>
                                <option value="Executives">Executives</option>
                            </select>
                        </div>

                        <!-- Email, Password, and User Role remain the same -->
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required />
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <div class="input-group">
                                <input
                                    type="password"
                                    class="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Enter password"
                                    required />
                                <span class="input-group-text toggle-password" onclick="togglePassword('password')">
                                    <i class="fa-solid fa-eye" id="eye-password"></i>
                                </span>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="user_type" class="form-label">User Role</label>
                            <select class="form-select" id="user_type" name="user_type" required>
                                <option value="">Select Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="hr">HR</option>
                                <option value="executive">Executive</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-success">Add User</button>
                        <div id="userAddResult" class="mt-3"></div>
                    </form>
                </div>

                <script src="javascripts/addUsers.js"></script>
            </div>

            <!-- Work Mode creation Page -->
            <div id="workModeCreation-page" class="page-content">

                <div class="main-title">
                    <h1>WORK MODE MANAGEMENT</h1>
                </div>
                <br>

                <form action="save_work_mode.php" method="POST" onsubmit="return confirmSaveWorkMode()">

                    <div class="card p-4">
                        <h4>Create Work Mode & Task Descriptions</h4>

                        <!-- Work Mode Input -->
                        <div class="mb-3">
                            <label for="workModeInput" class="form-label">Work Mode Name</label>
                            <input
                                type="text"
                                class="form-control"
                                id="workModeInput"
                                name="work_mode"
                                placeholder="e.g., Web Content"
                                required>
                        </div>

                        <!-- Task Descriptions -->
                        <div class="mb-3">
                            <label class="form-label">Task Descriptions</label>
                            <div id="taskContainer">
                                <div class="input-group mb-2 task-input-group">
                                    <input
                                        type="text"
                                        class="form-control"
                                        name="tasks[]"
                                        placeholder="e.g., Web - Content Creation"
                                        required>
                                    <button
                                        type="button"
                                        class="btn btn-danger"
                                        onclick="removeTaskField(this)">
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                class="btn btn-secondary mt-2"
                                onclick="addTaskField()">
                                + Add Another Task
                            </button>
                            <button type="submit" class="btn btn-success mt-2 ">Save Work Mode</button>
                        </div>
                    </div>
                </form>

                <!-- Existing Work Modes Management -->
                <div class="p-4 mt-4">
                    <h4>Edit Existing Work Modes</h4>
                    <div id="existingWorkModesList" class="list-group"></div>
                </div>
            </div>

            <!-- Monthly Summary Page APRIL 21, 2025-->

            <div id="monthlySummary-page" class="page-content">
                <div class="main-title d-flex justify-content-between align-items-center">
                    <h1>MONTHLY SUMMARY</h1>

                    <div class="d-flex align-items-center gap-2">
                        <input type="month" id="monthSelector" class="form-control w-auto" />
                        <select id="userSelector" class="form-select w-auto">
                            <option value="">-- Select User --</option>
                        </select>
                    </div>
                </div>

                <br />

                <!-- Summary Table -->

                <div class="table-responsive" id="summaryContainer" style="display: none;">
                    <table class="table table-bordered text-center" id="monthlySummaryTable">
                        <thead class="table-dark">
                            <tr>
                                <th>Date</th>
                                <th>Login @</th>
                                <th>Logout @</th>
                                <th>Total Time</th>
                                <th>Production Time</th>
                                <th>Offphone Time</th>
                                <th>Training Time</th>
                                <th>Resono Function</th>
                                <th>Paid Break</th>
                                <th>Unpaid Break</th>
                                <th>Personal Time</th>
                                <th>System Down</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div id="summaryBtn" style="display: none;">
                    <button id="generatePdfBtn" class="btn btn-success">Download Summary as PDF</button>
                </div>
                <div id="refreshSummaryBtn" style="display:none;" class="mt-2">
                    <button class="btn btn-secondary" onclick="refreshSummary()">🔄 Reload Summary</button>
                </div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
            </div>

            <!-- EMPLOYEES PAGE -->
            <div id="employees-page" class="page-content" style="display:none;">
                <div class="main-title">
                    <h1>EMPLOYEES</h1>
                </div>

                <div id="employeeContainer" class="mt-3">
                    <!-- Employee list will be rendered here -->
                </div>
            </div>


        </div><!-- MAIN CONTAINER ENDS -->

    </div>

    <!-- Global Loading Overlay -->
    <div id="globalOverlay" style="
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    font-family: Arial, sans-serif;
">
        <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div style="margin-top: 10px;">Please wait...</div>
    </div>


    </div>

    <!-- AOS JS -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            offset: 100, // Start animation 100px before the section is in view
            duration: 800, // Animation duration in milliseconds
            easing: 'ease-in-out', // Smooth transition effect
        });
    </script>
    <!-- JavaScript for logic -->
    <script src="javascripts/loadingOverlay.js"></script>
    <script src="javascripts/tagTask.js"></script>
    <script src="javascripts/editWMT.js"></script>
    <script src="javascripts/addWorkMode.js"></script>
    <script src="javascripts/togglePassword.js"></script>
    <script src="javascripts/editWorkMode.js"></script>
    <script src="javascripts/employees.js"></script>


    <!-- SCRIPTS FOR THE TABLE GENERATION -->
    <script src="javascripts/monthlySummary.js"></script>

    <script>
        function confirmSaveWorkMode() {
            return confirm("Are you sure you want to save this Work Mode and its tasks?");
        }
    </script>


</body>

</html>