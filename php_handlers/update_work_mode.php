<?php
$host = 'localhost';
$db   = 'work_mode_tracker';
$user = 'root';
$pass = 'P@ssword3309807';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents("php://input"), true);
    $originalName = $input['originalName'];
    $newName = $input['newName'];
    $tasks = $input['tasks'];

    $pdo->beginTransaction();

    // Update work mode name
    $stmt = $pdo->prepare("SELECT id FROM work_modes WHERE name = ?");
    $stmt->execute([$originalName]);
    $workModeId = $stmt->fetchColumn();

    if (!$workModeId) {
        throw new Exception("Work mode not found.");
    }

    $stmt = $pdo->prepare("UPDATE work_modes SET name = ? WHERE id = ?");
    $stmt->execute([$newName, $workModeId]);

    // Delete old tasks
    $pdo->prepare("DELETE FROM task_descriptions WHERE work_mode_id = ?")->execute([$workModeId]);

    // Insert new tasks
    $stmt = $pdo->prepare("INSERT INTO task_descriptions (work_mode_id, description) VALUES (?, ?)");
    foreach ($tasks as $task) {
        $stmt->execute([$workModeId, $task]);
    }

    $pdo->commit();
    echo json_encode(["message" => "Work mode and tasks updated successfully."]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
