<?php
require 'config.php'; // use mysqli

session_start();
$user_id = $_SESSION['user_id']; // assuming login system in place

$data = json_decode(file_get_contents("php://input"), true);

$mode = $data['work_mode'];
$task = $data['task_description'];
$date = $data['date'];
$start = $data['start_time'];

$stmt = $conn->prepare("INSERT INTO task_logs (user_id, work_mode, task_description, date, start_time) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $user_id, $mode, $task, $date, $start);
$stmt->execute();

echo json_encode(['inserted_id' => $stmt->insert_id]);
?>
