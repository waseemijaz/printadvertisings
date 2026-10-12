<?php
declare(strict_types=1);
require_once __DIR__ . '/../app/Core/AdminAuth.php';
if (empty($_SESSION['admin_id'])) {
    header('Location: /admin/login.php');
    exit;
}
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_valid($_POST['csrf_token'] ?? null)) {
        $error = 'Your session expired. Refresh the page and try again.';
    } else {
        logout_admin();
        header('Location: /admin/login.php');
        exit;
    }
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Log out | Print Advertising</title><style>body{font:16px Arial,sans-serif;color:#191632;background:#f7f6fa}.box{max-width:360px;margin:15vh auto;padding:26px;background:#fff;border-radius:10px}button{min-height:44px;padding:0 18px;background:#6515d4;color:#fff;border:0;border-radius:6px;cursor:pointer}.error{color:#a32929}</style></head><body><main class="box"><h1>Log out</h1><p>End your admin session?</p><?php if ($error !== ''): ?><p class="error" role="alert"><?= escape_html($error) ?></p><?php endif; ?><form method="post"><input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>"><button type="submit">Log out</button></form><p><a href="/admin/index.php">Return to dashboard</a></p></main></body></html>
