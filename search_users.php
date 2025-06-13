<?php
require 'config.php';

header('Content-Type: application/json');

if (!in_array($_SESSION['user_type'], ['admin', 'hr', 'executive'])) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$keyword = $_GET['keyword'] ?? '';
$keyword = '%' . $keyword . '%';

// Combine first_name, middle_name, and last_name into a full name for searching and display
$stmt = $conn->prepare("
    SELECT id, 
           CONCAT_WS(' ', first_name, middle_name, last_name) AS name, 
           email 
    FROM users 
    WHERE CONCAT_WS(' ', first_name, middle_name, last_name) LIKE ? 
       OR email LIKE ?
    LIMIT 10
");

$stmt->bind_param("ss", $keyword, $keyword);
$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode(['status' => 'success', 'users' => $users]);
