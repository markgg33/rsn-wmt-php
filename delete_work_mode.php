<?php
require 'config.php';

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
