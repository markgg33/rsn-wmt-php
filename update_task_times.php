<?php
require_once 'config.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$task_id = $data['task_id'] ?? null;
$start_time = $data['start_time'] ?? null;
$end_time = $data['end_time'] ?? null;

if (!$task_id || !$start_time) {
    echo json_encode(['status' => 'error', 'message' => 'Missing task_id or start_time']);
    exit;
}

$userType = $_SESSION['user_type'] ?? '';
if (!in_array($userType, ['admin', 'hr', 'executive', 'user'])) {
    echo json_encode(['status' => 'error', 'message' => "Unauthorized: user_type = $userType"]);
    exit;
}

// Fetch the task description to check if it's "END SHIFT"
$sql_check = "SELECT task_description_id FROM task_logs WHERE id = ?";
$stmt_check = $conn->prepare($sql_check);
if (!$stmt_check) {
    error_log("DB prepare failed (check): " . $conn->error);
    echo json_encode(['status' => 'error', 'message' => 'DB prepare failed']);
    exit;
}
$stmt_check->bind_param("i", $task_id);
$stmt_check->execute();
$result = $stmt_check->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Task not found']);
    exit;
}
$row = $result->fetch_assoc();
$task_description = $row['task_description_id'];

$duration = null;

// If end_time is provided, validate it
if ($end_time) {
    $start = strtotime($start_time);
    $end = strtotime($end_time);

    if ($end <= $start) {
        echo json_encode(['status' => 'error', 'message' => 'End time must be after start time']);
        exit;
    }

    $duration = gmdate("H:i:s", $end - $start);
}

// Prepare the SQL update based on whether it's END SHIFT
if ($task_description === "End Shift") {
    $sql = "UPDATE task_logs SET start_time = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $start_time, $task_id);
} else {
    $sql = "UPDATE task_logs SET start_time = ?, end_time = ?, total_duration = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $start_time, $end_time, $duration, $task_id);
}

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    error_log("DB update failed: " . $stmt->error);
    echo json_encode(['status' => 'error', 'message' => 'DB update failed']);
}
