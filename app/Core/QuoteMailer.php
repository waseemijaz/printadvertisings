<?php
declare(strict_types=1);

final class QuoteMailer
{
    private const NOTIFICATION_RECIPIENT = 'info@printadvertisings.com';
    private const GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
    private const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0';

    public static function send(array $lead, int $leadId): bool
    {
        $tenantId = trim((string) getenv('PA_GRAPH_TENANT_ID'));
        $clientId = trim((string) getenv('PA_GRAPH_CLIENT_ID'));
        $clientSecret = (string) getenv('PA_GRAPH_CLIENT_SECRET');
        $sender = trim((string) getenv('PA_GRAPH_SENDER'));

        if ($tenantId === '' || $clientId === '' || $clientSecret === '' || $sender === '') {
            self::logFailure($leadId, 'configuration_missing');
            return false;
        }

        if (!function_exists('curl_init')) {
            self::logFailure($leadId, 'curl_unavailable');
            return false;
        }

        try {
            $accessToken = self::accessToken($tenantId, $clientId, $clientSecret, $leadId);
            if ($accessToken === null) {
                return false;
            }

            $url = self::GRAPH_BASE_URL . '/users/' . rawurlencode($sender) . '/sendMail';
            $payload = [
                'message' => [
                    'subject' => 'New print enquiry #' . $leadId,
                    'body' => [
                        'contentType' => 'Text',
                        'content' => self::body($lead, $leadId),
                    ],
                    'toRecipients' => [[
                        'emailAddress' => ['address' => self::NOTIFICATION_RECIPIENT],
                    ]],
                    'replyTo' => self::replyTo($lead),
                ],
                'saveToSentItems' => true,
            ];

            $result = self::request(
                $url,
                [
                    'Authorization: Bearer ' . $accessToken,
                    'Content-Type: application/json',
                    'Accept: application/json',
                ],
                json_encode($payload, JSON_THROW_ON_ERROR)
            );

            if ($result['status'] !== 202) {
                self::logFailure($leadId, 'send_failed', $result['status'], $result['body']);
                return false;
            }

            error_log('[quote-mail] lead=' . $leadId . ' provider=MicrosoftGraph notification=accepted status=202');
            return true;
        } catch (Throwable $error) {
            self::logFailure($leadId, 'request_error', null, $error->getMessage());
            return false;
        }
    }

    private static function accessToken(string $tenantId, string $clientId, string $clientSecret, int $leadId): ?string
    {
        $result = self::request(
            'https://login.microsoftonline.com/' . rawurlencode($tenantId) . '/oauth2/v2.0/token',
            ['Content-Type: application/x-www-form-urlencoded', 'Accept: application/json'],
            http_build_query([
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'scope' => self::GRAPH_SCOPE,
                'grant_type' => 'client_credentials',
            ], '', '&', PHP_QUERY_RFC3986)
        );

        if ($result['status'] < 200 || $result['status'] >= 300) {
            self::logFailure($leadId, 'token_request_failed', $result['status'], $result['body']);
            return null;
        }

        $data = json_decode($result['body'], true);
        $token = is_array($data) ? ($data['access_token'] ?? null) : null;
        if (!is_string($token) || $token === '') {
            self::logFailure($leadId, 'token_response_missing_access_token', $result['status'], $result['body']);
            return null;
        }

        return $token;
    }

    /** @return array{status:int, body:string} */
    private static function request(string $url, array $headers, string $body): array
    {
        $handle = curl_init($url);
        if ($handle === false) {
            throw new RuntimeException('Unable to initialize cURL');
        }

        curl_setopt_array($handle, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 25,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);

        $response = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        $curlError = curl_error($handle);
        curl_close($handle);

        if (!is_string($response)) {
            throw new RuntimeException($curlError !== '' ? $curlError : 'Empty response from Microsoft Graph');
        }

        return ['status' => $status, 'body' => $response];
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

    private static function replyTo(array $lead): array
    {
        $email = $lead['email'] ?? '';
        if (!is_string($email) || $email === '' || preg_match('/[\r\n]/', $email) === 1
            || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return [];
        }

        return [['emailAddress' => ['address' => $email]]];
    }

    private static function logFailure(int $leadId, string $reason, ?int $status = null, ?string $response = null): void
    {
        $fields = [
            '[quote-mail] lead=' . $leadId,
            'provider=MicrosoftGraph',
            'notification=failed',
            'reason=' . self::safeLogValue($reason),
        ];
        if ($status !== null) {
            $fields[] = 'http_status=' . $status;
        }
        if ($response !== null && $response !== '') {
            $fields[] = 'response_body=' . self::safeLogValue(self::safeResponseBody($response), null);
        }
        error_log(implode(' ', $fields));
    }

    private static function safeResponseBody(string $response): string
    {
        $data = json_decode($response, true);
        if (is_array($data)) {
            $data = self::redactSensitiveFields($data);
            $encoded = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            if (is_string($encoded)) {
                return $encoded;
            }
        }

        return $response;
    }

    private static function redactSensitiveFields(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_string($key) && preg_match('/^(access_token|client_secret|refresh_token|id_token|authorization)$/i', $key) === 1) {
                $data[$key] = '[REDACTED]';
            } elseif (is_array($value)) {
                $data[$key] = self::redactSensitiveFields($value);
            } elseif (is_string($value)) {
                $data[$key] = self::safeLogValue($value);
            }
        }
        return $data;
    }

    private static function safeLogValue(string $value, ?int $maxLength = 1000): string
    {
        $secret = (string) getenv('PA_GRAPH_CLIENT_SECRET');
        if ($secret !== '') {
            $value = str_replace($secret, '[REDACTED]', $value);
        }
        $value = preg_replace('/\bBearer\s+[^\s"\\]+/i', 'Bearer [REDACTED]', $value) ?? $value;
        $value = preg_replace('/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/', '[REDACTED_TOKEN]', $value) ?? $value;
        $value = preg_replace('/[\r\n\t]+/', ' ', $value) ?? '';
        return $maxLength === null ? $value : substr($value, 0, $maxLength);
    }
}
