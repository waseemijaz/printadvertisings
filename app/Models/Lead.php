<?php
declare(strict_types=1);

final class Lead
{
    public function __construct(private PDO $db) {}

    public function create(array $data): int
    {
        $stmt = $this->db->prepare('INSERT INTO leads (name, phone, email, product, category, quantity, message, status) VALUES (:name, :phone, :email, :product, :category, :quantity, :message, \'New\')');
        $stmt->execute([
            ':name' => $data['name'], ':phone' => $data['phone'], ':email' => $data['email'] ?: null,
            ':product' => $data['product'] ?: null, ':category' => $data['category'] ?: null,
            ':quantity' => $data['quantity'] !== '' ? (int) $data['quantity'] : null, ':message' => $data['message'] ?: null,
        ]);
        return (int) $this->db->lastInsertId();
    }
}
