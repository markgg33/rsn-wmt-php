<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $first_name = trim($_POST['first_name'] ?? '');
  $middle_name = trim($_POST['middle_name'] ?? '');
  $last_name = trim($_POST['last_name'] ?? '');
  $email = $_POST['email'] ?? '';
  $password = $_POST['password'] ?? '';
  $user_type = $_POST['user_type'] ?? 'user';
  $department = $_POST['department'] ?? '';

  if (!$first_name || !$last_name || !$email || !$password || !$user_type || !$department) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required except middle name.']);
    exit;
  }

  $middle_initial = $middle_name ? strtoupper($middle_name[0]) . '.' : null;
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
  $stmt = $conn->prepare("INSERT INTO users (first_name, middle_name, last_name, email, password, user_type, department) VALUES (?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("sssssss", $first_name, $middle_initial, $last_name, $email, $hashedPassword, $user_type, $department);

  if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'User added successfully.']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
  }
}
