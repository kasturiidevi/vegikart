<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST;
}

$email    = isset($data['email'])    ? trim($data['email'])    : '';
$password = isset($data['password']) ? $data['password']       : '';

if ($email === '' || $password === '') {
    send_json(false, 'Email and password are required.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(false, 'Please enter a valid email address.');
}

global $conn;
$stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    send_json(false, 'No account found with this email. Please sign up first.');
}

$user = $result->fetch_assoc();
$stmt->close();

if (!password_verify($password, $user['password'])) {
    send_json(false, 'Invalid email or password. Please try again.');
}

$_SESSION['user_id']    = $user['id'];
$_SESSION['user_name']  = $user['name'];
$_SESSION['user_email'] = $user['email'];

send_json(true, 'Welcome back, ' . $user['name'] . '! Login successful.', array(
    'user_id' => $user['id'],
    'name'    => $user['name'],
    'email'   => $user['email']
));
?>

