<?php
declare(strict_types=1);
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_layout.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !csrf_valid($_POST['csrf_token'] ?? null)) {
    http_response_code(405);
    header('Allow: POST');
    exit('Method not allowed.');
}
logout_admin();
header('Location: /admin/login.php');
exit;
