<?php
declare(strict_types=1);
require_once __DIR__ . '/../app/Core/AdminAuth.php';
require_once __DIR__ . '/_layout.php';
if (!empty($_SESSION['admin_id'])) { header('Location: /admin/index.php'); exit; }
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_valid($_POST['csrf_token'] ?? null)) {
        $error = 'Please refresh the page and try again.';
    } elseif (!RateLimiter::allow('admin-login', 8, 900)) {
        $error = 'Too many attempts. Please wait and try again.';
    } else {
        $username = is_string($_POST['username'] ?? null) ? trim($_POST['username']) : '';
        $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
        try {
            $valid = verify_admin_login($username, $password);
        } catch (PDOException|RuntimeException $exception) {
            $valid = false;
        }
        if ($valid) { header('Location: /admin/index.php'); exit; }
        $error = 'The username or password was not recognized.';
    }
}
?><!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin login | Print Advertising</title>
    <link rel="icon" href="/images/favicons/favicon.png">
    <link rel="stylesheet" href="/admin/admin.css">
</head>
<body>
<main class="login-page">
    <section class="card login-card">
        <a class="admin-brand" href="/"><img src="/images/logo.webp" alt="Print Advertising"></a>
        <h1>Admin login</h1>
        <?php if ($error !== ''): ?><p class="error" role="alert"><?= escape_html($error) ?></p><?php endif; ?>
        <form class="admin-form" method="post" autocomplete="on">
            <input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>">
            <label>Username<input name="username" autocomplete="username" required maxlength="80"></label>
            <label>Password<input name="password" type="password" autocomplete="current-password" required></label>
            <button class="button" type="submit">Sign in</button>
        </form>
    </section>
</main>
</body>
</html>
