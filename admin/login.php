<?php
declare(strict_types=1);
require_once __DIR__ . '/../app/Core/AdminAuth.php';
if (!empty($_SESSION['admin_id'])) { header('Location: /admin/index.php'); exit; }
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_valid($_POST['csrf_token'] ?? null)) $error = 'Please refresh the page and try again.';
    elseif (!RateLimiter::allow('admin-login', 8, 900)) $error = 'Too many attempts. Please wait and try again.';
    else {
        $usernameInput = $_POST['username'] ?? '';
        $passwordInput = $_POST['password'] ?? '';
        $username = is_string($usernameInput) ? trim($usernameInput) : '';
        $password = is_string($passwordInput) ? $passwordInput : '';
        try { $valid = verify_admin_login($username, $password); }
        catch (Throwable $exception) { $valid = false; }
        if ($valid) { header('Location: /admin/index.php'); exit; }
        $error = 'The username or password was not recognized.';
    }
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Admin login | Print Advertising</title><link rel="icon" href="/images/favicons/favicon.png"><style>
*{box-sizing:border-box}body{margin:0;background:#f6f4fa;color:#191632;font:15px/1.5 Arial,sans-serif}.login{width:min(420px,calc(100% - 32px));margin:10vh auto;padding:30px;border:1px solid #e7e3ed;border-radius:14px;background:#fff;box-shadow:0 15px 40px #211d3812}.login img{display:block;width:185px;max-width:70%;height:auto;margin:0 auto 22px}.login h1{font-size:23px;margin:0 0 18px}.login label{display:grid;gap:6px;margin:14px 0;font-weight:700}.login input{width:100%;min-height:48px;padding:10px 12px;border:1px solid #dcd9e5;border-radius:7px;font:inherit}.login button{width:100%;min-height:48px;border:0;border-radius:7px;background:#6515d4;color:#fff;font:700 15px Arial;cursor:pointer}.error{color:#a32929}
</style></head><body><main class="login"><img src="/images/logo.webp" alt="Print Advertising"><h1>Lead dashboard</h1><?php if ($error !== ''): ?><p class="error" role="alert"><?= escape_html($error) ?></p><?php endif; ?><form method="post" autocomplete="on"><input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>"><label>Username<input name="username" autocomplete="username" required maxlength="80"></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button type="submit">Sign in</button></form></main></body></html>
