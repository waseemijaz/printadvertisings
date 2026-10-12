<?php
declare(strict_types=1);

final class Lead
{
    public function __construct(private PDO $db) {}

    public function create(array $data): int
    {
        $stmt = $this->db->prepare('INSERT INTO leads (name, company_name, phone, email, product, category, quantity, topic, budget, message, lead_type, status) VALUES (:name, :company_name, :phone, :email, :product, :category, :quantity, :topic, :budget, :message, :lead_type, \'New\')');
        $stmt->execute([
            ':name' => $data['name'], ':company_name' => $data['company_name'] ?: null, ':phone' => $data['phone'], ':email' => $data['email'] ?: null,
            ':product' => $data['product'] ?: null, ':category' => $data['category'] ?: null,
            ':quantity' => $data['quantity'] !== '' ? (int) $data['quantity'] : null, ':topic' => $data['topic'] ?: null,
            ':budget' => $data['budget'] ?: null, ':message' => $data['message'] ?: null,
            ':lead_type' => $data['lead_type'],
        ]);
        $id = (int) $this->db->lastInsertId();
        if ($id < 1) throw new RuntimeException('Lead was not saved');
        return $id;
    }
}
