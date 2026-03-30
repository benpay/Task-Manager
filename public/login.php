<?php
/**
 * Login API - DIAGNOSTIC V2
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// --- TEST DE CONEXIÓN INICIAL ---
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
    echo json_encode(['success' => false, 'error' => 'ERROR DE CONEXIÓN DB: ' . $e->getMessage()]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = isset($input['username']) ? trim($input['username']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

// 1. Verificar/Crear usuario benpay
$passHash = password_hash('Traducete1!', PASSWORD_DEFAULT);
$stmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(username) = 'benpay'");
$stmt->execute();
if (!$stmt->fetch()) {
    $insert = $pdo->prepare("INSERT INTO users (username, password_hash, role) VALUES ('benpay', ?, 'admin')");
    $insert->execute([$passHash]);
}

// 2. Intentar Login
$stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1");
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    session_start();
    echo json_encode(['success' => true, 'token' => session_id()]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false, 
        'error' => 'DEBUG: ' . (!$user ? 'Usuario inexistente' : 'Password incorrecta'),
        'version' => 'DIAGNOSTIC_V2'
    ]);
}
?>
