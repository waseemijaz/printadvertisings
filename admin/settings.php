<?php
declare(strict_types=1);
require_once __DIR__ . '/_init.php';

$error = '';
$success = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current = is_string($_POST['current_password'] ?? null) ? $_POST['current_password'] : '';
    $new = is_string($_POST['new_password'] ?? null) ? $_POST['new_password'] : '';
    $confirmation = is_string($_POST['new_password_confirmation'] ?? null) ? $_POST['new_password_confirmation'] : '';
    $passwordStmt = database_connection()->prepare('SELECT password_hash FROM admins WHERE id = :id LIMIT 1');
    $passwordStmt->execute([':id' => (int) $_SESSION['admin_id']]);
    $passwordHash = (string) ($passwordStmt->fetchColumn() ?: '');
    if (!csrf_valid($_POST['csrf_token'] ?? null)) {
        $error = 'Your session expired. Refresh the page and try again.';
    } elseif ($current === '' || !password_verify($current, $passwordHash)) {
        $error = 'The current password is incorrect.';
    } elseif (strlen($new) < 12 || !preg_match('/[A-Za-z]/', $new) || !preg_match('/\d/', $new)) {
        $error = 'The new password must be at least 12 characters and include a letter and a number.';
    } elseif (!hash_equals($new, $confirmation)) {
        $error = 'The new passwords do not match.';
    } elseif (hash_equals($current, $new)) {
        $error = 'The new password must be different from the current password.';
    } else {
        $stmt = database_connection()->prepare('UPDATE admins SET password_hash = :password_hash WHERE id = :id');
        $stmt->execute([':password_hash' => password_hash($new, PASSWORD_DEFAULT), ':id' => (int) $_SESSION['admin_id']]);
        session_regenerate_id(true);
        unset($_SESSION['csrf_token']);
        $success = 'Your password has been changed.';
    }
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Settings | Print Advertising</title><style>
*{box-sizing:border-box}body{margin:0;background:#f7f6fa;color:#191632;font:14px/1.5 Arial,sans-serif}.top{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px max(18px,calc((100% - 700px)/2));background:#191632;color:#fff}.top img{width:155px;max-height:52px;object-fit:contain}.top a{color:#fff}.nav{display:flex;gap:14px}.wrap{width:min(700px,calc(100% - 32px));margin:26px auto}.panel{border:1px solid #e8e5ee;border-radius:10px;background:#fff;padding:22px}.panel label{display:grid;gap:6px;margin:16px 0;font-weight:700}.panel input{min-height:44px;padding:8px 10px;border:1px solid #ddd8e7;border-radius:6px;font:inherit}.button{min-height:44px;padding:8px 14px;border:0;border-radius:6px;background:#6515d4;color:#fff;cursor:pointer}.error{color:#a32929}.success{color:#247454}@media(max-width:580px){.top{align-items:flex-start}.nav{flex-wrap:wrap;justify-content:flex-end}}
</style></head><body><header class="top"><a href="/admin/index.php"><img src="/images/logo.webp" alt="Print Advertising"></a><nav class="nav"><a href="/admin/index.php">Dashboard</a><a href="/admin/leads.php">Enquiries</a><a href="/admin/logout.php">Log out</a></nav></header><main class="wrap"><section class="panel"><h1>Account settings</h1><p>Signed in as <strong><?= escape_html($_SESSION['admin_name'] ?? 'Admin') ?></strong></p><?php if ($error !== ''): ?><p class="error" role="alert"><?= escape_html($error) ?></p><?php endif; ?><?php if ($success !== ''): ?><p class="success" role="status"><?= escape_html($success) ?></p><?php endif; ?><form method="post" autocomplete="off"><input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>"><label>Current password<input type="password" name="current_password" autocomplete="current-password" required></label><label>New password<input type="password" name="new_password" autocomplete="new-password" minlength="12" required></label><label>Confirm new password<input type="password" name="new_password_confirmation" autocomplete="new-password" minlength="12" required></label><p>Use at least 12 characters with letters and numbers.</p><button class="button" type="submit">Change password</button></form></section></main></body></html>
