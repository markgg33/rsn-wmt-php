<?php
require 'config.php';

session_start();
header('Content-Type: application/json');

// DEBUG
error_reporting(E_ALL);
ini_set('display_errors', 1);


header('Content-Type: application/json');

$query = "SELECT id, name FROM users WHERE user_type IN ('user', 'hr', 'executive', 'admin')";
$result = $conn->query($query);

$users = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

if (empty($users)) {
    echo json_encode(['status' => 'error', 'message' => 'No users found']);
    exit;
}


echo json_encode($users);
