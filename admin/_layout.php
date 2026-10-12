<?php
declare(strict_types=1);

function admin_header(string $title, string $active): void
{
    $items = [
        'dashboard' => ['Dashboard', '/admin/index.php'],
        'enquiries' => ['Enquiries', '/admin/leads.php'],
        'settings' => ['Settings', '/admin/settings.php'],
    ];
    ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= escape_html($title) ?> | Print Advertising</title>
    <link rel="icon" href="/images/favicons/favicon.png">
    <link rel="stylesheet" href="/admin/admin.css">
</head>
<body>
<header class="admin-header">
    <div class="admin-header__inner">
        <a class="admin-brand" href="/admin/index.php">
            <img src="/images/logo.webp" alt="Print Advertising">
        </a>
        <div class="admin-header__right">
            <nav class="admin-nav" aria-label="Admin navigation">
                <?php foreach ($items as $key => [$label, $href]): ?>
                    <a class="admin-nav__link<?= $active === $key ? ' is-active' : '' ?>" href="<?= $href ?>"<?= $active === $key ? ' aria-current="page"' : '' ?>><?= $label ?></a>
                <?php endforeach; ?>
                <form class="admin-logout" method="post" action="/admin/logout.php">
                    <input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>">
                    <button type="submit" class="admin-nav__link admin-nav__button">Log out</button>
                </form>
            </nav>
            <span class="admin-account"><?= escape_html($_SESSION['admin_name'] ?? 'Admin') ?></span>
        </div>
    </div>
</header>
<?php
}

function admin_footer(): void
{
    ?>
</body>
</html>
<?php
}
