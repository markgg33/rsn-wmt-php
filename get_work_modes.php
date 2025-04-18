<?php
// Database connection

$host = 'localhost';
$db   = 'work_mode_tracker';
$user = 'root';
$pass = 'P@ssword3309807';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "
        SELECT wm.id AS work_mode_id, wm.name AS work_mode_name, td.id AS task_id, td.description AS task_description
        FROM work_modes wm
        LEFT JOIN task_descriptions td ON wm.id = td.work_mode_id
        ORDER BY wm.name, td.description
    ";

    $stmt = $pdo->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $workModes = [];

    foreach ($results as $row) {
        $wmName = $row['work_mode_name'];
        if (!isset($workModes[$wmName])) {
            $workModes[$wmName] = [];
        }

        if ($row['task_description']) {
            $workModes[$wmName][] = $row['task_description'];
        }
    }

    header('Content-Type: application/json');
    echo json_encode($workModes);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
