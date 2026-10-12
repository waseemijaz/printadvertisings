<?php
declare(strict_types=1);
require_once __DIR__ . '/_init.php';

$db = database_connection();
$statuses = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
$search = trim((string) ($_GET['q'] ?? ''));
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 25;
$where = '';
$params = [];
if ($search !== '') {
    $where = ' WHERE name LIKE :search OR phone LIKE :search OR email LIKE :search OR product LIKE :search OR message LIKE :search';
    $params[':search'] = '%' . $search . '%';
}
$countStmt = $db->prepare('SELECT COUNT(*) FROM leads' . $where);
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();
$pages = max(1, (int) ceil($total / $perPage));
$page = min($page, $pages);
$stmt = $db->prepare('SELECT id, created_at, name, phone, email, product, status FROM leads' . $where . ' ORDER BY created_at DESC, id DESC LIMIT :limit OFFSET :offset');
foreach ($params as $key => $value) $stmt->bindValue($key, $value, PDO::PARAM_STR);
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', ($page - 1) * $perPage, PDO::PARAM_INT);
$stmt->execute();
$leads = $stmt->fetchAll();
$token = csrf_token();
$query = $search === '' ? '' : '&q=' . rawurlencode($search);
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Enquiries | Print Advertising</title><link rel="icon" href="/images/favicons/favicon.png"><style>
*{box-sizing:border-box}body{margin:0;background:#f7f6fa;color:#191632;font:14px/1.5 Arial,sans-serif}.top{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px max(18px,calc((100% - 1200px)/2));background:#191632;color:#fff}.top img{width:155px;max-height:52px;object-fit:contain}.top a{color:#fff}.nav{display:flex;gap:14px;align-items:center}.wrap{width:min(1200px,calc(100% - 32px));margin:26px auto}.panel{border:1px solid #e8e5ee;border-radius:10px;background:#fff;overflow:auto}.panel h1{margin:0;padding:20px;font-size:21px}.search{display:flex;gap:8px;padding:0 20px 18px}.search input{flex:1;min-height:40px;padding:8px 10px;border:1px solid #ddd8e7;border-radius:6px;font:inherit}.button{display:inline-block;padding:9px 13px;border:0;border-radius:6px;background:#6515d4;color:#fff;text-decoration:none;cursor:pointer}.table{width:100%;border-collapse:collapse;min-width:760px}.table th,.table td{padding:12px 15px;border-top:1px solid #eeeaf3;text-align:left;vertical-align:top}.table th{font-size:11px;color:#716d7e;text-transform:uppercase}.table td small{display:block;color:#716d7e}.pages{display:flex;gap:8px;padding:18px}.pages a{padding:7px 10px;border:1px solid #ddd8e7;border-radius:5px;text-decoration:none;color:#191632}.pages .current{background:#6515d4;color:#fff}@media(max-width:600px){.top{align-items:flex-start}.nav{flex-wrap:wrap;justify-content:flex-end}}
</style></head><body><header class="top"><a href="/admin/index.php"><img src="/images/logo.webp" alt="Print Advertising"></a><nav class="nav"><a href="/admin/index.php">Dashboard</a><a href="/admin/settings.php">Settings</a><a href="/admin/logout.php">Log out</a></nav></header><main class="wrap"><section class="panel"><h1>Enquiries <small>(<?= $total ?> total)</small></h1><form class="search" method="get"><label for="q" class="visually-hidden">Search enquiries</label><input id="q" name="q" value="<?= escape_html($search) ?>" placeholder="Search name, phone, email, product or message"><button class="button" type="submit">Search</button><?php if ($search !== ''): ?><a class="button" href="/admin/leads.php">Clear</a><?php endif; ?></form><table class="table"><thead><tr><th>Date</th><th>Name</th><th>Contact</th><th>Product</th><th>Status</th><th></th></tr></thead><tbody><?php if (!$leads): ?><tr><td colspan="6">No enquiries found.</td></tr><?php endif; ?><?php foreach ($leads as $lead): ?><tr><td><?= escape_html(date('Y-m-d H:i', strtotime((string) $lead['created_at']))) ?><small>#<?= (int) $lead['id'] ?></small></td><td><?= escape_html($lead['name']) ?></td><td><?= escape_html($lead['phone']) ?><?php if ($lead['email']): ?><small><?= escape_html($lead['email']) ?></small><?php endif; ?></td><td><?= escape_html($lead['product'] ?: '—') ?></td><td><?= escape_html($lead['status']) ?></td><td><a href="/admin/lead.php?id=<?= (int) $lead['id'] ?>">View details</a></td></tr><?php endforeach; ?></tbody></table><?php if ($pages > 1): ?><nav class="pages" aria-label="Pagination"><?php for ($number = 1; $number <= $pages; $number++): ?><a class="<?= $number === $page ? 'current' : '' ?>" href="/admin/leads.php?page=<?= $number . $query ?>"><?= $number ?></a><?php endfor; ?></nav><?php endif; ?></section></main></body></html>
