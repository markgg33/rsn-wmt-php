<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$end = $data['end_time'];
$duration = $data['duration'];

$stmt = $conn->prepare("UPDATE task_logs SET end_time = ?, duration = ? WHERE id = ?");
$stmt->bind_param("ssi", $end, $duration, $id);
$stmt->execute();
