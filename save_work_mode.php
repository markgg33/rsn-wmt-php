<?php
// Database connection
$host = 'localhost';
$db   = 'work_mode_tracker';
$user = 'root';
$pass = 'P@ssword3309807';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Sanitize and validate input
$workMode = trim($_POST['work_mode'] ?? '');
$tasks = $_POST['tasks'] ?? [];

if ($workMode === '' || empty($tasks)) {
    die('Please provide a work mode name and at least one task.');
}

try {
    $pdo->beginTransaction();

    // Insert work mode
    $stmt = $pdo->prepare("INSERT INTO work_modes (name) VALUES (:name)");
    $stmt->execute(['name' => $workMode]);
    $workModeId = $pdo->lastInsertId();

    // Insert task descriptions
    $taskStmt = $pdo->prepare("INSERT INTO task_descriptions (work_mode_id, description) VALUES (:work_mode_id, :description)");

    foreach ($tasks as $task) {
        $cleanTask = trim($task);
        if ($cleanTask !== '') {
            $taskStmt->execute([
                'work_mode_id' => $workModeId,
                'description' => $cleanTask
            ]);
        }
    }

    $pdo->commit();

    echo "<script>
    alert('Work mode and tasks saved successfully!');
    window.location.href = 'adminDashboard.php'; // Change this to your main page
</script>";
    exit();
} catch (Exception $e) {
    $pdo->rollBack();
    die("Failed to save: " . $e->getMessage());
}
