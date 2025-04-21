<?php
session_start();
require 'config.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Update DB to reflect user is offline
    $stmt = $conn->prepare("UPDATE users SET is_online = 0, is_logged_in = 0 WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    session_destroy();
}

// Always redirect to login page (or homepage)
header("Location: index.php");
exit;
?>
