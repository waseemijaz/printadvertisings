<?php
declare(strict_types=1);

final class LeadController
{
    public function __construct(private Lead $leads) {}

    public static function validate(array $input): array
    {
        $clean = static function (mixed $value, int $max, bool $multiline = false): ?string {
            if (!is_string($value)) return null;
            $value = strip_tags(str_replace(["\r\n", "\r"], "\n", $value));
            $pattern = $multiline ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/';
            $value = preg_replace($pattern, '', $value);
            if (!is_string($value) || !mb_check_encoding($value, 'UTF-8') || mb_strlen($value) > $max) return null;
            return trim($value);
        };
        $leadType = $input['lead_type'] ?? 'quick_enquiry';
        if (!is_string($leadType) || !in_array($leadType, ['quick_enquiry', 'quote_request'], true)) {
            throw new InvalidArgumentException('invalid_input');
        }
        $name = $clean($input['name'] ?? null, 120);
        $phone = $clean($input['phone'] ?? null, 30);
        $email = $clean($input['email'] ?? '', 254);
        $product = $clean($input['product'] ?? '', 120);
        $category = $clean($input['category'] ?? '', 120);
        $quantity = $clean($input['quantity'] ?? '', 10);
        $message = $clean($input['message'] ?? '', 2000, true);
        $topic = $clean($input['topic'] ?? '', 120);
        $budget = $clean($input['budget'] ?? '', 120);
        $website = $clean($input['website'] ?? '', 254);
        $messageParts = [];
        if (is_string($topic) && $topic !== '') $messageParts[] = 'Discussion topic: ' . $topic;
        if (is_string($budget) && $budget !== '') $messageParts[] = 'Budget: ' . $budget;
        if (is_string($website) && $website !== '') $messageParts[] = 'Website: ' . $website;
        if ($messageParts !== []) $message = implode("\n", $messageParts) . ($message !== '' ? "\n\n" . $message : '');
        $digits = is_string($phone) ? preg_replace('/\D/', '', $phone) : '';
        $phoneValid = is_string($phone) && ($phone === ''
            ? $leadType === 'quick_enquiry'
            : preg_match('/\A[0-9+(). -]{7,30}\z/', $phone) === 1 && strlen((string) $digits) >= 7 && strlen((string) $digits) <= 20);
        $emailValid = is_string($email) && ($email !== '' || $leadType !== 'quick_enquiry')
            && ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) !== false);
        $valid = is_string($name) && $name !== '' && $phoneValid
            && $emailValid
            && is_string($product) && is_string($category) && is_string($message)
            && ($leadType !== 'quick_enquiry' || $message !== '') && mb_strlen($message) <= 2000
            && is_string($topic) && is_string($budget) && is_string($website)
            && is_string($quantity) && ($quantity === '' || (preg_match('/\A[0-9]{1,10}\z/', $quantity) === 1 && (int) $quantity > 0 && (int) $quantity <= 1000000000));
        if (!$valid) throw new InvalidArgumentException('invalid_input');
        return compact('name', 'phone', 'email', 'product', 'category', 'quantity', 'message') + ['lead_type' => $leadType];
    }

    public function create(array $validated): int
    {
        return $this->leads->create($validated);
    }
}
