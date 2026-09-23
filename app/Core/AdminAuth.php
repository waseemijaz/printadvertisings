<?php
declare(strict_types=1);
require_once __DIR__ . '/Http.php';
require_once __DIR__ . '/RateLimiter.php';
require_once __DIR__ . '/../../config/database.php';
start_secure_session();

function require_admin(): void
{
    if (empty($_SESSION['admin_id'])) { header('Location: /admin/login.php'); exit; }
}

function verify_admin_login(string $username, string $password): bool
{
    $stmt = database_connection()->prepare('SELECT id, password_hash FROM admins WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $username]);
    $admin = $stmt->fetch();
    if (!$admin || !password_verify($password, (string) $admin['password_hash'])) return false;
    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int) $admin['id'];
    $_SESSION['admin_name'] = $username;
    unset($_SESSION['csrf_token']);
    return true;
}
