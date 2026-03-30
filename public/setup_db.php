<?php
// Script de emergencia para crear el usuario
$host_name = 'db5020001954.hosting-data.io';
$database = 'dbs15430582';
$user_name = 'dbu2531119';
$db_password = 'Traducete1!'; 

try {
    $pdo = new PDO("mysql:host=$host_name;dbname=$database;charset=utf8mb4", $user_name, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $pass = password_hash('Traducete1!', PASSWORD_DEFAULT);
    
    // Borramos si existe para asegurar que la clave sea la correcta
    $pdo->exec("DELETE FROM users WHERE username = 'benpay'");
    
    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role) VALUES ('benpay', ?, 'admin')");
    $stmt->execute([$pass]);

    echo "✅ Usuario 'benpay' creado/actualizado correctamente con contraseña 'Traducete1!'";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
