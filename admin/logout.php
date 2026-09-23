<?php
declare(strict_types=1);
require_once __DIR__ . '/../app/Core/AdminAuth.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_valid($_POST['csrf_token'] ?? null)) {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) { $params = session_get_cookie_params(); setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']); }
    session_destroy();
    header('Location: /admin/login.php');
    exit;
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Log out | Print Advertising</title><style>body{font:16px Arial,sans-serif;color:#191632;background:#f7f6fa}.box{max-width:360px;margin:15vh auto;padding:26px;background:#fff;border-radius:10px}button{min-height:44px;padding:0 18px;background:#6515d4;color:#fff;border:0;border-radius:6px}</style></head><body><main class="box"><h1>Log out</h1><p>End your admin session?</p><form method="post"><input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>"><button type="submit">Log out</button></form><p><a href="/admin/index.php">Return to dashboard</a></p></main></body></html>
