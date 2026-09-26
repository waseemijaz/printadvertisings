<?php
declare(strict_types=1);

final class QuoteMailer
{
    private const NOTIFICATION_RECIPIENT = 'info@printadvertisings.com';
    private const DEFAULT_FROM = 'no-reply@printadvertisings.com';

    public static function send(array $lead, int $leadId): bool
    {
        $headers = [
            'From: Print Advertising <' . self::fromAddress() . '>',
            'Content-Type: text/plain; charset=UTF-8',
        ];
        $email = $lead['email'] ?? '';
        if (is_string($email) && $email !== '' && preg_match('/[\r\n]/', $email) !== 1) {
            $headers[] = 'Reply-To: ' . $email;
        }

        try {
            if (!function_exists('mail')) throw new RuntimeException('PHP mail() is unavailable');
            $accepted = @mail(
                self::NOTIFICATION_RECIPIENT,
                'New print enquiry #' . $leadId,
                self::body($lead, $leadId),
                implode("\r\n", $headers)
            );
        } catch (Throwable $error) {
            self::logFailure($leadId, $error);
            return false;
        }

        if (!$accepted) {
            self::logFailure($leadId);
            return false;
        }

        error_log('[quote-mail] lead=' . $leadId . ' notification=accepted recipient=' . self::NOTIFICATION_RECIPIENT);
        return true;
    }

    private static function body(array $lead, int $leadId): string
    {
        $lines = [
            'Lead ID: ' . $leadId,
            'Date/time (UTC): ' . gmdate(DATE_ATOM),
            'Status: New',
            '',
            'Name: ' . self::value($lead, 'name'),
            'WhatsApp / Phone: ' . self::value($lead, 'phone'),
            'Email: ' . self::value($lead, 'email'),
            'Product: ' . self::value($lead, 'product'),
            'Category: ' . self::value($lead, 'category'),
            'Approximate quantity: ' . self::value($lead, 'quantity'),
            '',
            'Additional requirements:',
            self::value($lead, 'message'),
        ];
        return implode("\r\n", $lines) . "\r\n";
    }

    private static function value(array $lead, string $key): string
    {
        $value = $lead[$key] ?? '';
        return is_string($value) && $value !== '' ? $value : 'Not provided';
    }

    private static function fromAddress(): string
    {
        $configured = trim((string) getenv('PA_MAIL_FROM'));
        if ($configured !== ''
            && preg_match('/[\r\n]/', $configured) !== 1
            && filter_var($configured, FILTER_VALIDATE_EMAIL) !== false) {
            return $configured;
        }
        return self::DEFAULT_FROM;
    }

    private static function logFailure(int $leadId, ?Throwable $error = null): void
    {
        $type = $error === null ? '' : ' type=' . get_class($error);
        error_log('[quote-mail] lead=' . $leadId . ' notification=failed' . $type);
    }
}
