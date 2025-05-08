<?php
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$end = $data['end_time'];
$duration = $data['duration'];

$stmt = $conn->prepare("UPDATE task_logs SET end_time = ?, total_duration = ? WHERE id = ?");
$stmt->bind_param("ssi", $end, $duration, $id);
$stmt->execute();

echo json_encode(['status' => 'success']);
