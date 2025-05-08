<?php
require 'config.php';

/*if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}*/

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}


$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"), true);

$modeName = $data['work_mode'];
$taskDescription = $data['task_description'];
$date = $data['date'];
$start = $data['start_time'];

// Get work_mode_id
$modeQuery = $conn->prepare("SELECT id FROM work_modes WHERE name = ?");
$modeQuery->bind_param("s", $modeName);
$modeQuery->execute();
$modeResult = $modeQuery->get_result();
$modeRow = $modeResult->fetch_assoc();

if (!$modeRow) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid work mode']);
    exit;
}
$work_mode_id = $modeRow['id'];

// Get task_description_id
$taskQuery = $conn->prepare("SELECT id FROM task_descriptions WHERE description = ?");
$taskQuery->bind_param("s", $taskDescription);
$taskQuery->execute();
$taskResult = $taskQuery->get_result();
$taskRow = $taskResult->fetch_assoc();

if (!$taskRow) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid task description']);
    exit;
}
$task_description_id = $taskRow['id'];

// Insert into task_logs
$stmt = $conn->prepare("INSERT INTO task_logs (user_id, work_mode_id, task_description_id, date, start_time) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("iiiss", $user_id, $work_mode_id, $task_description_id, $date, $start);
$stmt->execute();

echo json_encode(['status' => 'success', 'inserted_id' => $stmt->insert_id]);
