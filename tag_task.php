<?php
session_start();
require_once 'config.php'; // your mysqli connection

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$work_mode_id = $_POST['work_mode_id'] ?? null;
$task_id = $_POST['task_id'] ?? null;
$notes = $_POST['notes'] ?? '';
$timestamp = date('Y-m-d H:i:s');

if (!$work_mode_id || !$task_id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing work mode or task ID"]);
    exit;
}

// Step 1: Update the previous task to set its end_time
$update = $conn->prepare("UPDATE task_logs 
    SET end_time = ? 
    WHERE user_id = ? AND end_time IS NULL 
    ORDER BY timestamp DESC LIMIT 1");
$update->bind_param("si", $timestamp, $user_id);
$update->execute();
$update->close();

// Step 2: Insert the new task (start time only)
$insert = $conn->prepare("INSERT INTO task_logs 
    (user_id, work_mode_id, task_id, timestamp, notes) 
    VALUES (?, ?, ?, ?, ?)");
$insert->bind_param("iiiss", $user_id, $work_mode_id, $task_id, $timestamp, $notes);

if ($insert->execute()) {
    echo json_encode(["status" => "success", "message" => "Task tagged successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
}

$insert->close();
$conn->close();
