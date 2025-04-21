<?php
session_start();
require 'config.php'; // mysqli connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Prepare the SELECT statement
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch user
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            // Store user session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['name'] = $user['name'];

            // Update login status
            $update = $conn->prepare("UPDATE users SET is_online = 1, is_logged_in = 1 WHERE id = ?");
            $update->bind_param("i", $user['id']);
            $update->execute();

            // Redirect based on user type
            if ($user['user_type'] === 'user') {
                echo json_encode(['status' => 'success', 'redirect' => 'userDashboard.php']);
            } else {
                echo json_encode(['status' => 'success', 'redirect' => 'adminDashboard.php']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }
}
