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
        $name = $clean($input['name'] ?? null, 120);
        $phone = $clean($input['phone'] ?? null, 30);
        $email = $clean($input['email'] ?? '', 254);
        $product = $clean($input['product'] ?? '', 120);
        $category = $clean($input['category'] ?? '', 120);
        $quantity = $clean($input['quantity'] ?? '', 10);
        $message = $clean($input['message'] ?? '', 2000, true);
        $digits = is_string($phone) ? preg_replace('/\D/', '', $phone) : '';
        $valid = is_string($name) && $name !== '' && is_string($phone)
            && preg_match('/\A[0-9+(). -]{7,30}\z/', $phone) === 1 && strlen((string) $digits) >= 7 && strlen((string) $digits) <= 20
            && is_string($email) && ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) !== false)
            && is_string($product) && is_string($category) && is_string($message)
            && is_string($quantity) && ($quantity === '' || (preg_match('/\A[0-9]{1,10}\z/', $quantity) === 1 && (int) $quantity > 0 && (int) $quantity <= 1000000000));
        if (!$valid) throw new InvalidArgumentException('invalid_input');
        return compact('name', 'phone', 'email', 'product', 'category', 'quantity', 'message');
    }

    public function create(array $validated): int
    {
        return $this->leads->create($validated);
    }
}
