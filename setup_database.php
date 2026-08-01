<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("<h2 style='color:red'>Connection failed: " . htmlspecialchars($conn->connect_error) . "</h2>
         <p>Please make sure MySQL is running in the XAMPP Control Panel.</p>");
}

echo "<!DOCTYPE html><html><head><title>VegiKart - Database Setup</title>";
echo "<style>body{font-family:'Segoe UI',Arial,sans-serif;background:#f0fdf4;padding:40px;}
.container{max-width:760px;margin:auto;background:#fff;padding:30px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.08);border-top:6px solid #2e7d32;}
h1{color:#2e7d32;} li{margin:6px 0;font-size:15px;} code{background:#f1f8e9;padding:2px 8px;border-radius:4px;color:#33691e;}
.ok{color:#2e7d32;}.err{color:#c62828;} table{border-collapse:collapse;width:100%;} td,th{border:1px solid #ddd;padding:8px;font-size:14px;text-align:left;}
th{background:#e8f5e9;}</style></head><body><div class='container'>";
echo "<h1>🥬 VegiKart Database Setup</h1>";

if ($conn->query("CREATE DATABASE IF NOT EXISTS vegikart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci")) {
    echo "<p class='ok'>✔ Database <code>vegikart_db</code> created/selected.</p>";
} else {
    echo "<p class='err'>✘ Failed to create database: " . htmlspecialchars($conn->error) . "</p>";
}
$conn->select_db('vegikart_db');

$sqlFile = __DIR__ . '/database.sql';
if (file_exists($sqlFile)) {
    $sql = file_get_contents($sqlFile);
    if ($conn->multi_query($sql)) {
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->more_results() && $conn->next_result());

        if ($conn->errno) {
            echo "<p class='err'>✘ SQL error: " . htmlspecialchars($conn->error) . "</p>";
        } else {
            echo "<p class='ok'>✔ Schema executed successfully (tables + seed data).</p>";
        }
    } else {
        echo "<p class='err'>✘ Failed to execute SQL script: " . htmlspecialchars($conn->error) . "</p>";
    }
} else {
    echo "<p class='err'>✘ database.sql not found in the same folder.</p>";
}

$tables = ['users', 'categories', 'products', 'orders', 'order_items'];
echo "<h2>Table Summary</h2><table><tr><th>Table</th><th>Status</th><th>Rows</th></tr>";
foreach ($tables as $t) {
    $exists = $conn->query("SHOW TABLES LIKE '$t'");
    if ($exists && $exists->num_rows > 0) {
        $cnt = $conn->query("SELECT COUNT(*) AS c FROM `$t`");
        $row = $cnt ? $cnt->fetch_assoc()['c'] : 0;
        echo "<tr><td><code>$t</code></td><td class='ok'>✔ Exists</td><td>$row</td></tr>";
    } else {
        echo "<tr><td><code>$t</code></td><td class='err'>✘ Missing</td><td>—</td></tr>";
    }
}
echo "</table>";

echo "<h2>Next Steps</h2><ul>";
echo "<li>Open <code>http://localhost/vegikart/login2.html</code> to test login.</li>";
echo "<li>Open <code>http://localhost/vegikart/signup2.html</code> to register a new user.</li>";
echo "<li>View users in phpMyAdmin: <code>http://localhost/phpmyadmin</code> → vegikart_db → users</li>";
echo "</ul></div></body></html>";

$conn->close();
?>

