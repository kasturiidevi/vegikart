<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST;
}

$name     = isset($data['name'])     ? trim($data['name'])     : '';
$email    = isset($data['email'])    ? trim($data['email'])    : '';
$phone    = isset($data['phone'])    ? trim($data['phone'])    : '';
$password = isset($data['password']) ? $data['password']       : '';

if ($name === '') {
    send_json(false, 'Full name is required.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(false, 'Please enter a valid email address.');
}
$phoneDigits = preg_replace('/\D/', '', $phone);
if (strlen($phoneDigits) !== 10) {
    send_json(false, 'Phone number must be exactly 10 digits.');
}
if (strlen($password) < 6) {
    send_json(false, 'Password must be at least 6 characters.');
}
if (strlen($password) > 15 || !preg_match('/[@!\/]/', $password) || !preg_match('/[A-Z]/', $password)) {
    send_json(false, 'Password must be ≤15 chars and contain 1 symbol (@, !, /) and 1 capital letter (A-Z).');
}

global $conn;
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    $stmt->close();
    send_json(false, 'An account with this email already exists. Please login.');
}
$stmt->close();

$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $phone, $hashed);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    $stmt->close();

    $_SESSION['user_id']  = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;

    send_json(true, 'Account created successfully! 🎉 Please login.', array(
        'user_id' => $userId,
        'name'    => $name,
        'email'   => $email
    ));
} else {
    $stmt->close();
    send_json(false, 'Registration failed: ' . $conn->error);
}
?>

