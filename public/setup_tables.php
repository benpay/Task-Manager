<?php
$host_name = 'db5020001954.hosting-data.io';
$database = 'dbs15430582';
$user_name = 'dbu2531119';
$db_password = 'Traducete1!'; 

try {
    $pdo = new PDO("mysql:host=$host_name;dbname=$database;charset=utf8mb4", $user_name, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Create tasks table
    $pdo->exec("CREATE TABLE IF NOT EXISTS store_tasks (
        id BIGINT PRIMARY KEY,
        data LONGTEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Create materials table
    $pdo->exec("CREATE TABLE IF NOT EXISTS store_materials (
        id BIGINT PRIMARY KEY,
        data LONGTEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    echo "✅ Tablas 'store_tasks' y 'store_materials' creadas correctamente.";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
