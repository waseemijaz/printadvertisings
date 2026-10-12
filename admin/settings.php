<?php
declare(strict_types=1);
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_layout.php';

$error = '';
$success = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current = is_string($_POST['current_password'] ?? null) ? $_POST['current_password'] : '';
    $new = is_string($_POST['new_password'] ?? null) ? $_POST['new_password'] : '';
    $confirmation = is_string($_POST['new_password_confirmation'] ?? null) ? $_POST['new_password_confirmation'] : '';
    if (!csrf_valid($_POST['csrf_token'] ?? null)) {
        $error = 'Your session expired. Refresh the page and try again.';
    } else {
        $passwordStmt = database_connection()->prepare('SELECT password_hash FROM admins WHERE id = :id LIMIT 1');
        $passwordStmt->execute([':id' => (int) $_SESSION['admin_id']]);
        $passwordHash = (string) ($passwordStmt->fetchColumn() ?: '');
        if ($current === '' || !password_verify($current, $passwordHash)) {
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
}
admin_header('Account Settings', 'settings');
?>
<main class="admin-main">
    <h1 class="page-heading">Account Settings</h1>
    <p class="page-intro">Manage the password for <?= escape_html($_SESSION['admin_name'] ?? 'your account') ?>.</p>
    <section class="panel" style="max-width: 680px;">
        <div class="panel__heading"><div><h2>Change password</h2><p>Your current password is required to make this change.</p></div></div>
        <?php if ($error !== ''): ?><p class="notice error" role="alert"><?= escape_html($error) ?></p><?php endif; ?>
        <?php if ($success !== ''): ?><p class="notice" role="status"><?= escape_html($success) ?></p><?php endif; ?>
        <form class="admin-form" method="post" autocomplete="off" style="padding: 0 20px 24px;">
            <input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>">
            <label>Current password
                <span class="password-field"><input type="password" name="current_password" autocomplete="current-password" required><button class="password-toggle" type="button" data-password-toggle aria-label="Show password">Show</button></span>
            </label>
            <label>New password
                <span class="password-field"><input type="password" name="new_password" autocomplete="new-password" minlength="12" required><button class="password-toggle" type="button" data-password-toggle aria-label="Show password">Show</button></span>
            </label>
            <label>Confirm new password
                <span class="password-field"><input type="password" name="new_password_confirmation" autocomplete="new-password" minlength="12" required><button class="password-toggle" type="button" data-password-toggle aria-label="Show password">Show</button></span>
            </label>
            <p class="requirements">Password requirements: at least 12 characters, including letters and numbers.</p>
            <button class="button" type="submit">Change Password</button>
        </form>
    </section>
</main>
<script>
document.querySelectorAll('[data-password-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
        var input = button.parentElement.querySelector('input');
        var visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        button.textContent = visible ? 'Show' : 'Hide';
        button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    });
});
</script>
<?php admin_footer(); ?>
