<?php
declare(strict_types=1);
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_layout.php';

$db = database_connection();
$search = trim((string) ($_GET['q'] ?? ''));
$requestedType = $_GET['type'] ?? 'all';
$leadTypes = ['quick_enquiry' => 'Quick Enquiry', 'quote_request' => 'Quote Request'];
$leadType = is_string($requestedType) && isset($leadTypes[$requestedType]) ? $requestedType : 'all';
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 25;
$whereParts = [];
$params = [];
if ($search !== '') {
    $whereParts[] = '(name LIKE :search OR phone LIKE :search OR email LIKE :search OR product LIKE :search OR message LIKE :search)';
    $params[':search'] = '%' . $search . '%';
}
if ($leadType !== 'all') {
    $whereParts[] = 'lead_type = :lead_type';
    $params[':lead_type'] = $leadType;
}
$where = $whereParts ? ' WHERE ' . implode(' AND ', $whereParts) : '';
$countStmt = $db->prepare('SELECT COUNT(*) FROM leads' . $where);
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();
$pages = max(1, (int) ceil($total / $perPage));
$page = min($page, $pages);
$stmt = $db->prepare('SELECT id, created_at, name, company_name, phone, email, product, lead_type, status FROM leads' . $where . ' ORDER BY created_at DESC, id DESC LIMIT :limit OFFSET :offset');
foreach ($params as $key => $value) $stmt->bindValue($key, $value, PDO::PARAM_STR);
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', ($page - 1) * $perPage, PDO::PARAM_INT);
$stmt->execute();
$leads = $stmt->fetchAll();
$query = ($search === '' ? '' : '&q=' . rawurlencode($search)) . ($leadType === 'all' ? '' : '&type=' . rawurlencode($leadType));
admin_header('Enquiries', 'enquiries');
?>
<main class="admin-main">
    <h1 class="page-heading">Enquiries</h1>
    <p class="page-intro">Search, review, and update customer enquiries.</p>
    <section class="panel">
        <div class="panel__heading"><div><h2>All enquiries <small>(<?= $total ?> total)</small></h2></div></div>
        <form class="toolbar" method="get">
            <label for="lead-search">Search enquiries
                <input id="lead-search" name="q" value="<?= escape_html($search) ?>" placeholder="Name, phone, email, product or message">
            </label>
            <label for="lead-type">Lead type
                <select id="lead-type" name="type">
                    <option value="all"<?= $leadType === 'all' ? ' selected' : '' ?>>All lead types</option>
                    <?php foreach ($leadTypes as $type => $label): ?><option value="<?= escape_html($type) ?>"<?= $leadType === $type ? ' selected' : '' ?>><?= escape_html($label) ?></option><?php endforeach; ?>
                </select>
            </label>
            <button class="button" type="submit">Search</button>
            <?php if ($search !== '' || $leadType !== 'all'): ?><a class="button button--secondary" href="/admin/leads.php">Clear</a><?php endif; ?>
        </form>
        <div class="table-scroll">
            <table class="admin-table">
                <thead><tr><th>Date</th><th>Lead type</th><th>Name</th><th>Contact</th><th>Product</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                <?php if (!$leads): ?><tr><td class="empty-state" colspan="7">No enquiries found.</td></tr><?php endif; ?>
                <?php foreach ($leads as $lead): ?>
                    <tr>
                        <td><?= escape_html(date('Y-m-d H:i', strtotime((string) $lead['created_at']))) ?><small>#<?= (int) $lead['id'] ?></small></td>
                        <td><span class="lead-type lead-type--<?= escape_html($lead['lead_type']) ?>"><?= escape_html($leadTypes[$lead['lead_type']] ?? 'Quick Enquiry') ?></span></td>
                        <td><?= escape_html($lead['name']) ?><?php if (!empty($lead['company_name'])): ?><small><?= escape_html($lead['company_name']) ?></small><?php endif; ?></td>
                        <td><?= escape_html($lead['phone']) ?><?php if ($lead['email']): ?><small><?= escape_html($lead['email']) ?></small><?php endif; ?><small><a href="https://wa.me/<?= escape_html(preg_replace('/\D+/', '', (string) $lead['phone'])) ?>" target="_blank" rel="noopener">WhatsApp</a></small></td>
                        <td><?= escape_html($lead['product'] ?: '—') ?></td>
                        <td><span class="status-badge status-badge--<?= escape_html(strtolower((string) $lead['status'])) ?>"><?= escape_html($lead['status']) ?></span></td>
                        <td><a href="/admin/lead.php?id=<?= (int) $lead['id'] ?>">View details</a></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php if ($pages > 1): ?><nav class="pagination" aria-label="Pagination"><?php for ($number = 1; $number <= $pages; $number++): ?><a class="<?= $number === $page ? 'is-current' : '' ?>" href="/admin/leads.php?page=<?= $number . $query ?>"<?= $number === $page ? ' aria-current="page"' : '' ?>><?= $number ?></a><?php endfor; ?></nav><?php endif; ?>
    </section>
</main>
<?php admin_footer(); ?>
