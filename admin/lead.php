<?php
declare(strict_types=1);
require_once __DIR__ . '/_init.php';

$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id) { http_response_code(404); exit('Enquiry not found.'); }
$db = database_connection();
$stmt = $db->prepare('SELECT * FROM leads WHERE id = :id LIMIT 1');
$stmt->execute([':id' => $id]);
$lead = $stmt->fetch();
if (!$lead) { http_response_code(404); exit('Enquiry not found.'); }
$statuses = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $status = (string) ($_POST['status'] ?? '');
    if (!csrf_valid($_POST['csrf_token'] ?? null) || !in_array($status, $statuses, true)) {
        $error = 'The status update could not be applied.';
    } else {
        $update = $db->prepare('UPDATE leads SET status = :status WHERE id = :id');
        $update->execute([':status' => $status, ':id' => $id]);
        $lead['status'] = $status;
    }
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Enquiry #<?= (int) $lead['id'] ?> | Print Advertising</title><style>
*{box-sizing:border-box}body{margin:0;background:#f7f6fa;color:#191632;font:14px/1.5 Arial,sans-serif}.top{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px max(18px,calc((100% - 850px)/2));background:#191632;color:#fff}.top img{width:155px;max-height:52px;object-fit:contain}.top a{color:#fff}.nav{display:flex;gap:14px}.wrap{width:min(850px,calc(100% - 32px));margin:26px auto}.panel{border:1px solid #e8e5ee;border-radius:10px;background:#fff;padding:22px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.field{border-bottom:1px solid #eeeaf3;padding-bottom:10px}.field strong{display:block;color:#716d7e;font-size:12px;text-transform:uppercase}.message{white-space:pre-wrap;overflow-wrap:anywhere}.select{display:flex;gap:8px;align-items:center;margin-top:25px}.select select,.select button{min-height:40px;padding:7px 10px;border:1px solid #ddd8e7;border-radius:6px;background:#fff}.select button{background:#6515d4;color:#fff;border-color:#6515d4}.error{color:#a32929}@media(max-width:580px){.grid{grid-template-columns:1fr}.top{align-items:flex-start}.nav{flex-wrap:wrap;justify-content:flex-end}}
</style></head><body><header class="top"><a href="/admin/index.php"><img src="/images/logo.webp" alt="Print Advertising"></a><nav class="nav"><a href="/admin/leads.php">Enquiries</a><a href="/admin/settings.php">Settings</a><a href="/admin/logout.php">Log out</a></nav></header><main class="wrap"><p><a href="/admin/leads.php">← Back to enquiries</a></p><section class="panel"><h1>Enquiry #<?= (int) $lead['id'] ?></h1><?php if ($error !== ''): ?><p class="error" role="alert"><?= escape_html($error) ?></p><?php endif; ?><div class="grid"><div class="field"><strong>Date</strong><?= escape_html((string) $lead['created_at']) ?></div><div class="field"><strong>Lead type</strong><?= escape_html((string) $lead['lead_type']) ?></div><div class="field"><strong>Name</strong><?= escape_html($lead['name']) ?></div><div class="field"><strong>Phone</strong><a href="tel:<?= escape_html($lead['phone']) ?>"><?= escape_html($lead['phone']) ?></a></div><div class="field"><strong>Email</strong><?= $lead['email'] ? '<a href="mailto:' . escape_html($lead['email']) . '">' . escape_html($lead['email']) . '</a>' : '—' ?></div><div class="field"><strong>Product</strong><?= escape_html($lead['product'] ?: '—') ?></div><div class="field"><strong>Category</strong><?= escape_html($lead['category'] ?: '—') ?></div><div class="field"><strong>Quantity</strong><?= escape_html($lead['quantity'] ?: '—') ?></div><div class="field message" style="grid-column:1/-1"><strong>Message</strong><?= escape_html($lead['message'] ?: '—') ?></div></div><form class="select" method="post"><input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>"><label for="status">Status</label><select id="status" name="status"><?php foreach ($statuses as $status): ?><option<?= $lead['status'] === $status ? ' selected' : '' ?>><?= escape_html($status) ?></option><?php endforeach; ?></select><button type="submit">Save status</button></form></section></main></body></html>
