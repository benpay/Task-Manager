<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host_name = 'db5020001954.hosting-data.io';
$database = 'dbs15430582';
$user_name = 'dbu2531119';
$db_password = 'Traducete1!'; 

try {
    $pdo = new PDO("mysql:host=$host_name;dbname=$database;charset=utf8mb4", $user_name, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'DB_CONNECTION_ERROR: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

try {
    if ($action === 'get_tasks') {
        // En caso de que no exista la tabla, devolvemos array vacío en lugar de romper
        $stmt = $pdo->query("SHOW TABLES LIKE 'store_tasks'");
        if ($stmt->rowCount() == 0) {
            echo json_encode(['success' => true, 'data' => []]);
            exit;
        }

        $stmt = $pdo->query("SELECT data FROM store_tasks");
        $results = [];
        while ($row = $stmt->fetch()) {
            $results[] = json_decode($row['data'], true);
        }
        echo json_encode(['success' => true, 'data' => $results]);
    } 
    elseif ($action === 'save_task') {
        if (!$input || !isset($input['id'])) throw new Exception('Invalid task data');
        $id = $input['id'];
        $data = json_encode($input);
        $stmt = $pdo->prepare("INSERT INTO store_tasks (id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)");
        $stmt->execute([$id, $data]);
        echo json_encode(['success' => true]);
    }
    elseif ($action === 'delete_task') {
        if (!$input || !isset($input['id'])) throw new Exception('Invalid task id');
        $id = $input['id'];
        $stmt = $pdo->prepare("DELETE FROM store_tasks WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }
    elseif ($action === 'get_materials') {
        $stmt = $pdo->query("SHOW TABLES LIKE 'store_materials'");
        if ($stmt->rowCount() == 0) {
            echo json_encode(['success' => true, 'data' => []]);
            exit;
        }

        $stmt = $pdo->query("SELECT data FROM store_materials");
        $results = [];
        while ($row = $stmt->fetch()) {
            $results[] = json_decode($row['data'], true);
        }
        echo json_encode(['success' => true, 'data' => $results]);
    }
    elseif ($action === 'save_material') {
        if (!$input || !isset($input['id'])) throw new Exception('Invalid material data');
        $id = $input['id'];
        $data = json_encode($input);
        $stmt = $pdo->prepare("INSERT INTO store_materials (id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)");
        $stmt->execute([$id, $data]);
        echo json_encode(['success' => true]);
    }
    elseif ($action === 'delete_material') {
        if (!$input || !isset($input['id'])) throw new Exception('Invalid material id');
        $id = $input['id'];
        $stmt = $pdo->prepare("DELETE FROM store_materials WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }
    else {
        echo json_encode(['success' => false, 'error' => 'Unknown action: ' . $action]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
