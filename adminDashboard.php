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
    <script src="javascripts/sidebar.js"></script>
    <!----AOS LIBRARY---->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>

<body>

    <div class="grid-container">
        <aside id="rsn-sidebar">

            <div class="logout-container">
                <img src="images/RESONO_logo.png" width="100px" alt="">
                <a href="logout.php"><button class="btn-logout"><i class="fa-solid fa-power-off"></i></button></a>
                <br>
                <p>Welcome, ADMIN ADMIN</p>
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
                    </ul>
                </li>

                <!----SYSTEM SETTINGS---->
                <li>
                    <a class="sidebar-dropdown d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#systemSettingsmenu" role="button" aria-expanded="false" aria-controls="systemSettingsmenu">
                        <span><i class="fa-solid fa-gear"></i>SYSTEM SETTINGS</span>
                        <i class="fa-solid fa-caret-down"></i>
                    </a>

                    <ul class="collapse sidebar-submenu list-unstyled ps-3" id="systemSettingsmenu">
                        <li class="sidebar-list-item" data-page="ipRestrictions" onclick="changePage('ipRestrictions')">IP Restrictions</li>
                        <li class="sidebar-list-item" data-page="workModeCreation" onclick="changePage('workModeCreation')">Work Mode Creation</li>
                        <li class="sidebar-list-item" data-page="billing" onclick="changePage('billing')">Billing</li>
                        <li class="sidebar-list-item" data-page="changePass" onclick="changePage('changePass')">Change Password</li>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Task rows go here dynamically -->
                                </tbody>
                            </table>
                            <button class="btn btn-danger mb-2" onclick="resetTaskLog()">Reset Table</button>
                        </div>

                        <!-- JavaScript for logic -->
                        <script src="javascripts/tagTesting.js"></script>
                    </div>

                </div>
                <br>
            </div>

            <!-- Work Mode creation Page -->
            <div id="workModeCreation-page" class="page-content">

                <div class="main-title">
                    <h1>WORK MODE CREATION</h1>
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
                <div class="card p-4 mt-4">
                    <h4>Edit Existing Work Modes</h4>
                    <div id="existingWorkModesList" class="list-group"></div>
                </div>

                <script src="javascripts/editWorkMode.js"></script>

            </div>

        </div>

        <!-- LOADING OVERLAY -->
        <div id="loadingOverlay" class="loading-overlay" style="display: none;">
            <div class="loading-spinner">
                <div class="spinner-border text-light" role="status"></div>
                <p class="mt-2 text-white">Tagging task...</p>
            </div>
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

    <script src="javascripts/addWorkMode.js"></script>

    <script>
        function confirmSaveWorkMode() {
            return confirm("Are you sure you want to save this Work Mode and its tasks?");
        }
    </script>


</body>

</html>