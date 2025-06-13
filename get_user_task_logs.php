<?php
require 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'], $_SESSION['user_type'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'Session expired']);
    exit;
}

$logged_in_user_type = $_SESSION['user_type'];
$logged_in_user_id = $_SESSION['user_id'];

// Allow admins, HR, and executives to fetch another user's logs
if (in_array($logged_in_user_type, ['admin', 'hr', 'executive']) && isset($_GET['user_id'])) {
    $user_id = intval($_GET['user_id']);
} else {
    $user_id = $logged_in_user_id;
}

$query = "SELECT 
            tl.id, 
            tl.date, 
            wm.name AS work_mode, 
            td.description AS task_description,
            tl.start_time, 
            tl.end_time, 
            tl.total_duration,
            tl.remarks
          FROM task_logs tl
          JOIN work_modes wm ON wm.id = tl.work_mode_id
          JOIN task_descriptions td ON td.id = tl.task_description_id
          WHERE tl.user_id = ?
          ORDER BY tl.date ASC, tl.start_time ASC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = [
        'id' => $row['id'],
        'date' => $row['date'],
        'work_mode' => $row['work_mode'],
        'task_description' => $row['task_description'],
        'start_time' => $row['start_time'],
        'end_time' => $row['end_time'],
        'total_duration' => $row['total_duration'],
        'remarks' => $row['remarks'] ?? ''
    ];
}

echo json_encode(['status' => 'success', 'logs' => $logs]);
