<?php
require 'config.php'; // <- update if your db connection is named differently

$data = json_decode(file_get_contents("php://input"), true);

$task_id = $data['task_id'] ?? null;
$remarks = $data['remarks'] ?? '';

if (!$task_id) {
    echo json_encode(["status" => "error", "message" => "Missing task ID"]);
    exit;
}

$stmt = $conn->prepare("UPDATE task_logs SET remarks = ? WHERE id = ?");
$stmt->bind_param("si", $remarks, $task_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
