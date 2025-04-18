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
                        <li class="sidebar-list-item" data-page="commend-list" onclick="changePage('commend-list')">Commend List</li>
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
                        <script src="javascripts/tagTesting.js"></script>
                        <h4>Work Mode Tagging</h4>
                        <div class="d-flex align-items-center gap-2">
                            <select id="workModeSelector" class="form-select w-auto" onchange="updateTaskOptions()">
                                <option value="">-- Select Work Mode --</option>
                                <option value="Web">Web</option>
                                <option value="Ancillary">Ancillary</option>
                                <option value="Away">Away</option>
                                <option value="End">End</option>
                            </select>

                            <select id="taskSelector" class="form-select w-auto">
                                <option value="">-- Select Task --</option>
                            </select>
                            <button class="btn btn-primary" onclick="startTask()">Start Time</button>
                        </div>

                        <br>
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
                                    <!-- Task rows go here -->
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
                <br>
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

</body>

</html>