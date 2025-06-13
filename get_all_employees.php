<?php
require "config.php";

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_type'], ['admin', 'executive', 'hr'])) {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$sql = "SELECT id, first_name, middle_name, last_name, email, user_type, department 
        FROM users 
        ORDER BY department, last_name, first_name";
$result = $conn->query($sql);

$departments = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dept = $row['department'] ?: 'Unassigned';
        $departments[$dept][] = $row;
    }
}

echo json_encode($departments);
