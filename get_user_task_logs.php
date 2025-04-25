<?php
session_start();
require 'config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$query = "SELECT tl.id, tl.date, wm.name AS work_mode, td.description AS task_description,
                 tl.start_time, tl.end_time, tl.total_duration
          FROM task_logs tl
          JOIN work_modes wm ON wm.id = tl.work_mode_id
          JOIN task_descriptions td ON td.id = tl.task_description_id
          WHERE tl.user_id = ?
          ORDER BY tl.date DESC, tl.start_time ASC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = $row;
}

echo json_encode(['status' => 'success', 'logs' => $logs]);
