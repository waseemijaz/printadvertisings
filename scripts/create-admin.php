<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../config/database.php';
$username = trim((string) (getenv('PA_ADMIN_USERNAME') ?: ''));
$password = (string) (getenv('PA_ADMIN_PASSWORD') ?: '');
if ($username === '' || strlen($username) > 80 || strlen($password) < 12) {
    fwrite(STDERR, "Set PA_ADMIN_USERNAME and a 12+ character PA_ADMIN_PASSWORD, then run php scripts/create-admin.php.\n"); exit(2);
}
$stmt = database_connection()->prepare('INSERT INTO admins (username, password_hash) VALUES (:username, :hash)');
$stmt->execute([':username' => $username, ':hash' => password_hash($password, PASSWORD_DEFAULT)]);
fwrite(STDOUT, "Admin created.\n");
