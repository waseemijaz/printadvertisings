<?php
declare(strict_types=1);

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function start_secure_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $https = (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off')
        || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_SSL'] ?? '')) === 'on'
        || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Lax']);
    session_start();
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return (string) $_SESSION['csrf_token'];
}

function csrf_valid(mixed $token): bool
{
    return is_string($token) && isset($_SESSION['csrf_token']) && hash_equals((string) $_SESSION['csrf_token'], $token);
}

function escape_html(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
