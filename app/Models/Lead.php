<?php
declare(strict_types=1);

final class Lead
{
    public function __construct(private PDO $db) {}

    public function create(array $data): int
    {
        $stmt = $this->db->prepare('INSERT INTO leads (name, phone, email, product, category, quantity, message, lead_type, status) VALUES (:name, :phone, :email, :product, :category, :quantity, :message, :lead_type, \'New\')');
        $stmt->execute([
            ':name' => $data['name'], ':phone' => $data['phone'], ':email' => $data['email'] ?: null,
            ':product' => $data['product'] ?: null, ':category' => $data['category'] ?: null,
            ':quantity' => $data['quantity'] !== '' ? (int) $data['quantity'] : null, ':message' => $data['message'] ?: null,
            ':lead_type' => $data['lead_type'],
        ]);
        return (int) $this->db->lastInsertId();
    }
}
