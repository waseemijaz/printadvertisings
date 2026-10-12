<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../config/database.php';
$db = database_connection();
$db->beginTransaction();
$lockStmt = $db->query('SELECT id FROM admins FOR UPDATE');
if ($lockStmt->fetch() !== false) {
    $db->rollBack();
    fwrite(STDERR, "An admin already exists. First-admin setup is disabled.\n");
    exit(1);
}
$username = trim((string) (getenv('PA_ADMIN_USERNAME') ?: ''));
if ($username === '') {
    fwrite(STDOUT, 'Admin username: ');
    $username = trim((string) fgets(STDIN));
}
if ($username === '' || strlen($username) > 80 || !preg_match('/^[A-Za-z0-9._-]+$/', $username)) {
    fwrite(STDERR, "Username must be 1-80 characters and contain only letters, numbers, dot, underscore, or hyphen.\n");
    exit(2);
}
$password = (string) (getenv('PA_ADMIN_PASSWORD') ?: '');
if ($password === '') {
    fwrite(STDOUT, 'Admin password (input is hidden): ');
    shell_exec('stty -echo');
    $password = rtrim((string) fgets(STDIN), "\r\n");
    shell_exec('stty echo');
    fwrite(STDOUT, PHP_EOL);
}
if (strlen($password) < 12 || !preg_match('/[A-Za-z]/', $password) || !preg_match('/\d/', $password)) {
    fwrite(STDERR, "Password must be at least 12 characters and include a letter and a number.\n");
    exit(2);
}
$stmt = $db->prepare('INSERT INTO admins (username, password_hash) VALUES (:username, :hash)');
$stmt->execute([':username' => $username, ':hash' => password_hash($password, PASSWORD_DEFAULT)]);
$db->commit();
fwrite(STDOUT, "Admin created.\n");
