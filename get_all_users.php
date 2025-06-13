<?php
require 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

// DEBUG
error_reporting(E_ALL);
ini_set('display_errors', 1);

$query = "SELECT id, first_name, middle_name, last_name FROM users WHERE user_type IN ('user', 'hr', 'executive', 'admin')";
$result = $conn->query($query);

$users = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['name'] = trim($row['first_name'] . ' ' . $row['middle_name'] . ' ' . $row['last_name']);
        $users[] = $row;
    }
}

if (empty($users)) {
    echo json_encode(['status' => 'error', 'message' => 'No users found']);
    exit;
}


echo json_encode($users);
