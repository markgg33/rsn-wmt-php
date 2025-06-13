<?php

require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'], $_SESSION['user_type'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing log ID']);
    exit;
}

$id = intval($data['id']);
$start_time = $data['start_time'] ?? null;
$end_time = $data['end_time'] ?? null;
$duration = $data['duration'] ?? null;
$remarks = $data['remarks'] ?? null;

// Build query dynamically
$fields = [];
$params = [];
$types = "";

if ($start_time !== null) {
    $fields[] = "start_time = ?";
    $params[] = $start_time;
    $types .= "s";
}

if ($end_time !== null) {
    $fields[] = "end_time = ?";
    $params[] = $end_time;
    $types .= "s";
}

if ($duration !== null) {
    $fields[] = "total_duration = ?";
    $params[] = $duration;
    $types .= "s";
}

if ($remarks !== null) {
    $fields[] = "remarks = ?";
    $params[] = $remarks;
    $types .= "s";
}

if (empty($fields)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No fields to update']);
    exit;
}

$types .= "i"; // for ID
$params[] = $id;

$query = "UPDATE task_logs SET " . implode(", ", $fields) . " WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database update failed']);
}
