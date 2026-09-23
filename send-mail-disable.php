<?php
declare(strict_types=1);

/* Small same-origin enquiry endpoint for the static HTML site. */
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

$isHttps = (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off')
    || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_SSL'] ?? '')) === 'on';
ini_set('session.use_strict_mode', '1');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'GET' && ($_GET['action'] ?? '') === 'token') {
    if (empty($_SESSION['quote_csrf'])) {
        try {
            $_SESSION['quote_csrf'] = bin2hex(random_bytes(32));
        } catch (Throwable $error) {
            respond(503, ['success' => false, 'code' => 'temporarily_unavailable']);
        }
    }
    respond(200, ['success' => true, 'token' => $_SESSION['quote_csrf']]);
}
if ($method !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['success' => false, 'code' => 'method_not_allowed']);
}

$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $requestHost = preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? ''));
    if (!is_string($originHost) || strtolower($originHost) !== strtolower($requestHost)) {
        respond(403, ['success' => false, 'code' => 'request_rejected']);
    }
}

$submittedToken = (string) ($_POST['csrf_token'] ?? '');
$sessionToken = (string) ($_SESSION['quote_csrf'] ?? '');
if ($submittedToken === '' || $sessionToken === '' || !hash_equals($sessionToken, $submittedToken)) {
    respond(403, ['success' => false, 'code' => 'request_rejected']);
}

/* Keep only a hash of the IP in a short-lived temporary rate-limit file. */
$clientIp = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$ratePath = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR
    . 'pa-quote-limit-' . hash('sha256', $clientIp);
$rateFile = @fopen($ratePath, 'c+');
if ($rateFile === false || !flock($rateFile, LOCK_EX)) {
    if (is_resource($rateFile)) {
        fclose($rateFile);
    }
    respond(503, ['success' => false, 'code' => 'temporarily_unavailable']);
}
$now = time();
$windowStart = $now - 900;
rewind($rateFile);
$oldAttempts = json_decode((string) stream_get_contents($rateFile), true);
$attempts = [];
if (is_array($oldAttempts)) {
    foreach ($oldAttempts as $stamp) {
        if (is_int($stamp) && $stamp > $windowStart) {
            $attempts[] = $stamp;
        }
    }
}
if (count($attempts) >= 5) {
    flock($rateFile, LOCK_UN);
    fclose($rateFile);
    respond(429, ['success' => false, 'code' => 'rate_limited']);
}
$attempts[] = $now;
rewind($rateFile);
ftruncate($rateFile, 0);
$stored = fwrite($rateFile, json_encode($attempts));
if ($stored === false || !fflush($rateFile)) {
    flock($rateFile, LOCK_UN);
    fclose($rateFile);
    respond(503, ['success' => false, 'code' => 'temporarily_unavailable']);
}
flock($rateFile, LOCK_UN);
fclose($rateFile);

/* Quietly accept honeypot submissions without sending or storing them. */
if (is_string($_POST['website_url'] ?? null) && trim($_POST['website_url']) !== '') {
    respond(200, ['success' => true]);
}

$cleanText = static function ($value, int $maxBytes, bool $multiline = false): ?string {
    if (!is_string($value)) {
        return null;
    }
    $value = strip_tags(str_replace(["\r\n", "\r"], "\n", $value));
    $value = preg_replace($multiline ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/', '', $value);
    if (!is_string($value) || strlen($value) > $maxBytes || preg_match('//u', $value) !== 1) {
        return null;
    }
    return trim($value);
};

$name = $cleanText($_POST['name'] ?? null, 480);
$phone = $cleanText($_POST['phone'] ?? null, 30);
$email = $cleanText($_POST['email'] ?? '', 254);
$quantity = $cleanText($_POST['quantity'] ?? '', 10);
$message = $cleanText($_POST['message'] ?? '', 8000, true);
$product = $cleanText($_POST['product'] ?? '', 80);

$validProducts = [
    '/stationery.html' => 'Business Stationery',
    '/marketing.html' => 'Marketing Print',
    '/apparel.html' => 'Apparel & Textiles',
    '/gifts.html' => 'Corporate Gifts',
    '/calendars.html' => 'Calendars & Diaries',
    '/drinkware.html' => 'Drinkware',
    '/express.html' => 'Express Print',
    '/products/business-cards.html' => 'Business Cards',
    '/products/letterheads.html' => 'Letterheads',
    '/products/flyers-leaflets.html' => 'Flyers & Leaflets',
    '/products/express-business-cards.html' => 'Express Business Cards',
    '/products/custom-t-shirt-printing.html' => 'Custom T-Shirt Printing',
    '/products/corporate-uniforms.html' => 'Corporate Uniforms',
    '/products/custom-notebooks.html' => 'Custom Notebooks',
    '/products/custom-mugs.html' => 'Custom Mugs',
    '/products/water-bottles.html' => 'Water Bottles',
    '/products/gift-boxes.html' => 'Gift Boxes',
    '/products/outdoor-banners.html' => 'Outdoor Banners',
    '/products/promotional-displays.html' => 'Promotional Displays',
];

$phoneDigits = is_string($phone) ? preg_replace('/\D/', '', $phone) : '';
$valid = is_string($name) && $name !== ''
    && is_string($phone) && preg_match('/\A[0-9+(). -]{7,30}\z/', $phone) === 1
    && is_string($phoneDigits) && strlen($phoneDigits) >= 7 && strlen($phoneDigits) <= 20
    && ($email === '' || (is_string($email) && filter_var($email, FILTER_VALIDATE_EMAIL) !== false))
    && ($quantity === '' || (is_string($quantity) && preg_match('/\A[0-9]+\z/', $quantity) === 1 && (int) $quantity >= 1 && (int) $quantity <= 1000000000))
    && is_string($message)
    && ($product === '' || (is_string($product) && array_key_exists($product, $validProducts)));
if (!$valid) {
    respond(422, ['success' => false, 'code' => 'invalid_input']);
}

try {
    $leadId = 'PA-' . strtoupper(bin2hex(random_bytes(8)));
} catch (Throwable $error) {
    respond(503, ['success' => false, 'code' => 'temporarily_unavailable']);
}
$submittedAt = gmdate(DATE_ATOM);
$subject = 'New print enquiry ' . $leadId;
$body = "Lead ID: {$leadId}\nDate/time (UTC): {$submittedAt}\nStatus: New\n\n";
$body .= "Name: {$name}\nWhatsApp / Phone: {$phone}\n";
$body .= 'Email: ' . ($email !== '' ? $email : 'Not provided') . "\n";
$body .= 'Product/category: ' . ($product !== '' ? $validProducts[$product] : 'Not provided') . "\n";
$body .= 'Approximate quantity: ' . ($quantity !== '' ? $quantity : 'Not provided') . "\n\n";
$body .= "Additional requirements:\n" . ($message !== '' ? $message : 'Not provided') . "\n";
$headers = "From: Print Advertising <no-reply@printadvertisings.com>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
if ($email !== '') {
    $headers .= 'Reply-To: ' . $email . "\r\n";
}

try {
    $sent = @mail('info@printadvertisings.com', $subject, $body, $headers);
} catch (Throwable $error) {
    $sent = false;
}
if (!$sent) {
    respond(503, ['success' => false, 'code' => 'temporarily_unavailable']);
}

respond(200, ['success' => true, 'lead_id' => $leadId]);
