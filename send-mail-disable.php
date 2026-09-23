<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "Method not allowed.";
    exit;
}

$to = "info@printadvertisings.com";
$subject = "New Contact Form Submission - Print Advertising";

$name = trim((string) ($_POST["name"] ?? ""));
$email = trim((string) ($_POST["email"] ?? ""));
$website = trim((string) ($_POST["text"] ?? ""));
$message = trim((string) ($_POST["message"] ?? ""));

if ($name === "" || $email === "" || $message === "") {
    http_response_code(400);
    echo "Please fill in all required fields.";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Please enter a valid email address.";
    exit;
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safeWebsite = htmlspecialchars($website, ENT_QUOTES, 'UTF-8');
$safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$body = "Name: {$safeName}\n";
$body .= "Email: {$safeEmail}\n";
$body .= "Website: " . ($safeWebsite !== "" ? $safeWebsite : "Not provided") . "\n\n";
$body .= "Message:\n{$safeMessage}";

$headers = "From: no-reply@printadvertisings.com\r\n";
$headers .= "Reply-To: {$safeEmail}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo "Thank you. Your message has been sent successfully.";
} else {
    http_response_code(500);
    echo "Message sending failed. Please try again.";
}
