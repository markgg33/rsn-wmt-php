<?php
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['work_mode_name'] ?? null;

    if (!$name) {
        echo json_encode(['status' => 'error', 'message' => 'Missing work mode name.']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM work_modes WHERE name = ?");
    $stmt->bind_param("s", $name);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Work mode deleted successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Deletion failed.']);
    }
}
?>
