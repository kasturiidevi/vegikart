<?php
session_start();

define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'vegikart_db');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->select_db(DB_NAME);

$conn->set_charset("utf8mb4");

function run_query($sql) {
    global $conn;
    $result = $conn->query($sql);
    if (!$result) {
        die("Query failed: " . $conn->error . "<br>SQL: " . $sql);
    }
    return $result;
}

function send_json($success, $message, $extra = array()) {
    header('Content-Type: application/json');
    $response = array_merge(array('success' => $success, 'message' => $message), $extra);
    echo json_encode($response);
    exit;
}
?>

