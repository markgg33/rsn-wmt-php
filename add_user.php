<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'] ?? '';
  $email = $_POST['email'] ?? '';
  $password = $_POST['password'] ?? '';
  $user_type = $_POST['user_type'] ?? 'user';

  if (!$name || !$email || !$password || !$user_type) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
  }

  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Check for duplicate email
  $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
  $check->bind_param("s", $email);
  $check->execute();
  $check->store_result();

  if ($check->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
    exit;
  }

  // Insert user
  $stmt = $conn->prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)");
  $stmt->bind_param("ssss", $name, $email, $hashedPassword, $user_type);

  if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'User added successfully.']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
  }
}
?>
