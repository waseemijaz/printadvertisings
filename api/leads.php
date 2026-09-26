<?php
declare(strict_types=1);
require_once __DIR__ . '/../app/Core/Http.php';
require_once __DIR__ . '/../app/Core/RateLimiter.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../app/Models/Lead.php';
require_once __DIR__ . '/../app/Controllers/LeadController.php';
require_once __DIR__ . '/../app/Core/QuoteMailer.php';

ini_set('display_errors', '0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
start_secure_session();
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'GET' && ($_GET['action'] ?? '') === 'token') json_response(200, ['success' => true, 'token' => csrf_token()]);
if ($method !== 'POST') { header('Allow: GET, POST'); json_response(405, ['success' => false, 'code' => 'method_not_allowed']); }
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $requestHost = preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? ''));
    if (!is_string($originHost) || strtolower($originHost) !== strtolower($requestHost)) json_response(403, ['success' => false, 'code' => 'request_rejected']);
}
if (!csrf_valid($_POST['csrf_token'] ?? null)) json_response(403, ['success' => false, 'code' => 'request_rejected']);
if (!RateLimiter::allow('lead', 5, 900)) json_response(429, ['success' => false, 'code' => 'rate_limited']);
$honeypot = $_POST['website_url'] ?? '';
if (is_string($honeypot) && trim($honeypot) !== '') json_response(200, ['success' => true]);
try {
    $validated = LeadController::validate($_POST);
    $controller = new LeadController(new Lead(database_connection()));
    $id = $controller->create($validated);
    $notificationSent = false;
    try {
        $notificationSent = QuoteMailer::send($validated, $id);
    } catch (Throwable $mailError) {
        error_log('[quote-mail] lead=' . $id . ' notification=failed type=' . get_class($mailError));
    }
    json_response(201, ['success' => true, 'lead_id' => $id, 'notification_sent' => $notificationSent]);
} catch (InvalidArgumentException $error) {
    json_response(422, ['success' => false, 'code' => 'invalid_input']);
} catch (Throwable $error) {
    /* Do not return database, mail, or submitted personal data to the browser. */
    json_response(503, ['success' => false, 'code' => 'temporarily_unavailable']);
}
