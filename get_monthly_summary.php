<?php

/*require 'config.php';
session_start();

header('Content-Type: application/json');

$user_id = $_SESSION['user_id'];
$user_type = $_SESSION['user_type'];
$selected_user_id = (isset($_GET['user_id']) && in_array($user_type, ['admin', 'executive', 'hr']))
    ? $_GET['user_id']
    : $user_id;

$month = $_GET['month']; // Format: YYYY-MM

// Validate
if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
    echo json_encode(["status" => "error", "message" => "Invalid month format."]);
    exit;
}

$startDate = $month . '-01';
$endDate = date("Y-m-t", strtotime($startDate));

$query = "
    SELECT 
        DATE(date) AS log_date,
        MIN(start_time) AS login_time,
        MAX(end_time) AS logout_time,
        SEC_TO_TIME(SUM(TIME_TO_SEC(total_duration))) AS total_time,
        SUM(CASE WHEN td.description LIKE 'Production%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS production,
        SUM(CASE WHEN td.description LIKE 'Offphone%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS offphone,
        SUM(CASE WHEN td.description LIKE 'Training%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS training,
        SUM(CASE WHEN td.description LIKE 'Resono%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS resono,
        COUNT(CASE WHEN td.description LIKE '%Paid Break%' THEN 1 ELSE NULL END) * 1800 AS paid_break,
        COUNT(CASE WHEN td.description LIKE '%Unpaid Break%' THEN 1 ELSE NULL END) * 3600 AS unpaid_break,
        SUM(CASE WHEN td.description LIKE '%Personal Time%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS personal_time,
        SUM(CASE WHEN td.description LIKE '%System Down%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS system_down
    FROM task_logs tl
    JOIN task_descriptions td ON tl.task_description_id = td.id
    WHERE tl.user_id = ? AND date BETWEEN ? AND ?
    GROUP BY log_date
    ORDER BY log_date ASC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $selected_user_id, $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

$total_production = 0;
$total_offphone = 0;
$total_training = 0;
$total_resono = 0;
$total_paid = 0;
$total_unpaid = 0;
$total_personal = 0;
$total_down = 0;

while ($row = $result->fetch_assoc()) {
    // Split custom break
    $paid_break = $row["paid_break"];
    $unpaid_break = $row["unpaid_break"];
    
    if (strpos(strtolower($row["task_description"] ?? ''), 'away - break') !== false) {
        $paid_break = 1800;  // 30 minutes in seconds
        $unpaid_break = 3600; // 1 hour in seconds
    }

    $summary[] = [
        "date" => date("d/m/Y", strtotime($row["log_date"])),
        "login" => $row["login_time"],
        "logout" => $row["logout_time"],
        "total_time" => $row["total_time"],
        "production" => gmdate("H:i", $row["production"]),
        "offphone" => gmdate("H:i", $row["offphone"]),
        "training" => gmdate("H:i", $row["training"]),
        "resono_function" => gmdate("H:i", $row["resono"]),
        "paid_break" => gmdate("H:i", $paid_break),
        "unpaid_break" => gmdate("H:i", $unpaid_break),
        "personal_time" => gmdate("H:i", $row["personal_time"]),
        "system_down" => gmdate("H:i", $row["system_down"]),
    ];

    $total_production += $row["production"];
    $total_offphone += $row["offphone"];
    $total_training += $row["training"];
    $total_resono += $row["resono"];
    $total_paid += $paid_break;
    $total_unpaid += $unpaid_break;
    $total_personal += $row["personal_time"];
    $total_down += $row["system_down"];
}

$summary[] = [
    "date" => "MTD TOTAL",
    "login" => "",
    "logout" => "",
    "total_time" => "", // optional
    "production" => gmdate("H:i", $total_production),
    "offphone" => gmdate("H:i", $total_offphone),
    "training" => gmdate("H:i", $total_training),
    "resono_function" => gmdate("H:i", $total_resono),
    "paid_break" => gmdate("H:i", $total_paid),
    "unpaid_break" => gmdate("H:i", $total_unpaid),
    "personal_time" => gmdate("H:i", $total_personal),
    "system_down" => gmdate("H:i", $total_down),
];


echo json_encode(["status" => "success", "data" => $summary]);

function secondsToTime($seconds) {
    $hours = floor($seconds / 3600);
    $minutes = ($seconds % 3600) / 60;
    return str_pad($hours, 2, '0', STR_PAD_LEFT) . ':' . str_pad($minutes, 2, '0', STR_PAD_LEFT);
}

$summary = [];
while ($row = $result->fetch_assoc()) {
    $summary[] = [
        "date" => date("d/m/Y", strtotime($row["log_date"])),
        "login" => $row["login_time"],
        "logout" => $row["logout_time"],
        "total_time" => $row["total_time"],
        "production" => gmdate("H:i", $row["production"]),
        "offphone" => gmdate("H:i", $row["offphone"]),
        "training" => gmdate("H:i", $row["training"]),
        "resono_function" => gmdate("H:i", $row["resono"]),
        "paid_break" => secondsToTime($row["paid_break"]),
        "unpaid_break" => secondsToTime($row["unpaid_break"]),
        "personal_time" => gmdate("H:i", $row["personal_time"]),
        "system_down" => gmdate("H:i", $row["system_down"]),
    ];
}WORKING CODE FOR FETCHING*/

require 'config.php';
session_start();
header('Content-Type: application/json');

$user_id = $_SESSION['user_id'];
$user_type = $_SESSION['user_type'];

$selected_user_id = (isset($_GET['user_id']) && in_array($user_type, ['admin', 'executive', 'hr']))
    ? $_GET['user_id']
    : $user_id;

$month = $_GET['month']; // Format: YYYY-MM

if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
    echo json_encode(["status" => "error", "message" => "Invalid month format."]);
    exit;
}

$startDate = $month . '-01';
$endDate = date("Y-m-t", strtotime($startDate));

$query = "
    SELECT 
    DATE(date) AS log_date,
    MIN(start_time) AS login_time,
    MAX(end_time) AS logout_time,
    SUM(TIME_TO_SEC(total_duration)) AS total_time_in_seconds,
    SUM(CASE 
        WHEN td.description NOT LIKE '%Break%'
         AND td.description NOT LIKE '%Offphone%'
         AND td.description NOT LIKE '%Training%'
         AND td.description NOT LIKE '%Resono%'
         AND td.description NOT LIKE '%Personal%'
         AND td.description NOT LIKE '%System Down%'
         AND td.description NOT LIKE '%End Shift%'
            THEN TIME_TO_SEC(tl.total_duration)
        ELSE 0
    END) AS production,
    SUM(CASE WHEN td.description LIKE 'Offphone%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS offphone,
    SUM(CASE WHEN td.description LIKE 'Training%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS training,
    SUM(CASE WHEN td.description LIKE 'Resono%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS resono,
    SUM(CASE WHEN td.description LIKE '%Personal Time%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS personal_time,
    SUM(CASE WHEN td.description LIKE '%System Down%' THEN TIME_TO_SEC(tl.total_duration) ELSE 0 END) AS system_down,
    MAX(CASE WHEN td.description = 'Away - Break' THEN 1 ELSE 0 END) AS has_away_break
    FROM task_logs tl
    JOIN task_descriptions td ON tl.task_description_id = td.id
    WHERE tl.user_id = ?
    AND date BETWEEN ? AND ?
    GROUP BY log_date
    ORDER BY log_date ASC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $selected_user_id, $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

$summary = [];

$total_production = 0;
$total_offphone = 0;
$total_training = 0;
$total_resono = 0;
$total_paid = 0;
$total_unpaid = 0;
$total_personal = 0;
$total_down = 0;
$total_total_time = 0;

while ($row = $result->fetch_assoc()) {
    $paid_break = 0;
    $unpaid_break = 0;
    $production_seconds = $row["production"];

    // Smart: detect if "Away - Break" was tagged
    if ($row["has_away_break"]) {
        $paid_break = 1800;   // 30 mins paid
        $unpaid_break = 3600; // 1 hr unpaid

        // Subtract 1 hour from production if away-break was used
        $prod_final = max(0, $production_seconds - 3600);
    } else {
        $paid_break = 0;
        $unpaid_break = 0;
        $prod_final = $production_seconds;
    }

    $summary[] = [
        "date" => date("d/m/Y", strtotime($row["log_date"])),
        "login" => $row["login_time"],
        "logout" => $row["logout_time"],
        "total_time" => gmdate("H:i", $row["total_time_in_seconds"]),
        "production" => gmdate("H:i", $prod_final),
        "offphone" => gmdate("H:i", $row["offphone"]),
        "training" => gmdate("H:i", $row["training"]),
        "resono_function" => gmdate("H:i", $row["resono"]),
        "paid_break" => gmdate("H:i", $paid_break),
        "unpaid_break" => gmdate("H:i", $unpaid_break),
        "personal_time" => gmdate("H:i", $row["personal_time"]),
        "system_down" => gmdate("H:i", $row["system_down"]),
    ];

    // MTD SUM
    $total_total_time += $row["total_time_in_seconds"];
    $total_production += $prod_final;
    $total_offphone += $row["offphone"];
    $total_training += $row["training"];
    $total_resono += $row["resono"];
    $total_paid += $paid_break;
    $total_unpaid += $unpaid_break;
    $total_personal += $row["personal_time"];
    $total_down += $row["system_down"];
}



$summary[] = [
    "date" => "MTD TOTAL",
    "login" => "",
    "logout" => "",
    "total_time" => gmdate("H:i", $total_total_time),
    "production" => gmdate("H:i", $total_production),
    "offphone" => gmdate("H:i", $total_offphone),
    "training" => gmdate("H:i", $total_training),
    "resono_function" => gmdate("H:i", $total_resono),
    "paid_break" => gmdate("H:i", $total_paid),
    "unpaid_break" => gmdate("H:i", $total_unpaid),
    "personal_time" => gmdate("H:i", $total_personal),
    "system_down" => gmdate("H:i", $total_down),
];


echo json_encode(["status" => "success", "data" => $summary]);

function secondsToTime($seconds)
{
    $hours = floor($seconds / 3600);
    $minutes = ($seconds % 3600) / 60;
    return str_pad($hours, 2, '0', STR_PAD_LEFT) . ':' . str_pad($minutes, 2, '0', STR_PAD_LEFT);
}
