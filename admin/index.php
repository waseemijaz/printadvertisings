<?php
declare(strict_types=1);
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_layout.php';

$db = database_connection();
$statuses = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
$leadTypes = ['quick_enquiry' => 'Quick Enquiry', 'quote_request' => 'Quote Request'];
$requestedType = $_GET['type'] ?? $_POST['type'] ?? 'all';
$leadType = is_string($requestedType) && isset($leadTypes[$requestedType]) ? $requestedType : 'all';
$error = '';
$updated = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
    $status = (string) ($_POST['status'] ?? '');
    if (!csrf_valid($_POST['csrf_token'] ?? null) || !$id || !in_array($status, $statuses, true)) {
        $error = 'The status update could not be applied.';
    } else {
        $update = $db->prepare('UPDATE leads SET status = :status WHERE id = :id');
        $update->execute([':status' => $status, ':id' => $id]);
        $updated = true;
    }
}

$where = $leadType === 'all' ? '' : ' WHERE lead_type = :lead_type';
$params = $leadType === 'all' ? [] : [':lead_type' => $leadType];
$countStmt = $db->prepare("SELECT status, COUNT(*) AS total FROM leads{$where} GROUP BY status");
$countStmt->execute($params);
$counts = array_fill_keys($statuses, 0);
foreach ($countStmt->fetchAll() as $row) {
    if (isset($counts[$row['status']])) $counts[$row['status']] = (int) $row['total'];
}
$recentStmt = $db->prepare("SELECT id, created_at, name, company_name, phone, product, lead_type, status FROM leads{$where} ORDER BY created_at DESC, id DESC LIMIT 8");
$recentStmt->execute($params);
$recent = $recentStmt->fetchAll();
$token = csrf_token();
admin_header('Dashboard', 'dashboard');
?>
<main class="admin-main">
    <h1 class="page-heading">Dashboard</h1>
    <p class="page-intro">Welcome back, <?= escape_html($_SESSION['admin_name'] ?? 'Admin') ?>. Here is your enquiry overview.</p>

    <section class="stats-grid" aria-label="Enquiry summary">
        <div class="card stat-card"><span class="stat-card__label">Total Leads</span><strong class="stat-card__value"><?= array_sum($counts) ?></strong></div>
        <?php foreach ($statuses as $status): ?>
            <div class="card stat-card"><span class="stat-card__label"><?= escape_html($status) ?></span><strong class="stat-card__value"><?= $counts[$status] ?></strong></div>
        <?php endforeach; ?>
    </section>

    <section class="panel">
        <div class="panel__heading">
            <div><h2>Recent Enquiries</h2><p>Review and update the latest submissions.</p></div>
            <a class="button" href="/admin/leads.php">View all enquiries</a>
        </div>
        <form class="toolbar" method="get">
            <label for="dashboard-lead-type">Lead type
                <select id="dashboard-lead-type" name="type">
                    <option value="all"<?= $leadType === 'all' ? ' selected' : '' ?>>All lead types</option>
                    <?php foreach ($leadTypes as $type => $label): ?>
                        <option value="<?= escape_html($type) ?>"<?= $leadType === $type ? ' selected' : '' ?>><?= escape_html($label) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <button class="button" type="submit">Apply filter</button>
        </form>
        <?php if ($updated): ?><p class="notice" role="status">Enquiry status updated.</p><?php endif; ?>
        <?php if ($error !== ''): ?><p class="notice error" role="alert"><?= escape_html($error) ?></p><?php endif; ?>
        <div class="table-scroll">
            <table class="admin-table">
                <thead><tr><th>Date</th><th>Lead type</th><th>Name</th><th>Contact</th><th>Product</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                <?php if (!$recent): ?><tr><td class="empty-state" colspan="7">No enquiries found.</td></tr><?php endif; ?>
                <?php foreach ($recent as $lead): ?>
                    <?php $statusClass = strtolower((string) $lead['status']); ?>
                    <tr>
                        <td><?= escape_html(date('Y-m-d H:i', strtotime((string) $lead['created_at']))) ?><small>#<?= (int) $lead['id'] ?></small></td>
                        <td><span class="lead-type lead-type--<?= escape_html($lead['lead_type']) ?>"><?= escape_html($leadTypes[$lead['lead_type']] ?? 'Quick Enquiry') ?></span></td>
                        <td><?= escape_html($lead['name']) ?><?php if (!empty($lead['company_name'])): ?><small><?= escape_html($lead['company_name']) ?></small><?php endif; ?></td>
                        <td><?= escape_html($lead['phone']) ?></td>
                        <td><?= escape_html($lead['product'] ?: '—') ?></td>
                        <td><span class="status-badge status-badge--<?= escape_html($statusClass) ?>"><?= escape_html($lead['status']) ?></span></td>
                        <td>
                            <form class="status-form" method="post">
                                <input type="hidden" name="csrf_token" value="<?= escape_html($token) ?>">
                                <input type="hidden" name="id" value="<?= (int) $lead['id'] ?>">
                                <input type="hidden" name="type" value="<?= escape_html($leadType) ?>">
                                <label class="visually-hidden" for="status-<?= (int) $lead['id'] ?>">Status for enquiry <?= (int) $lead['id'] ?></label>
                                <select id="status-<?= (int) $lead['id'] ?>" name="status">
                                    <?php foreach ($statuses as $status): ?><option<?= $lead['status'] === $status ? ' selected' : '' ?>><?= escape_html($status) ?></option><?php endforeach; ?>
                                </select>
                                <button type="submit">Save</button>
                            </form>
                            <a href="/admin/lead.php?id=<?= (int) $lead['id'] ?>">Details</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </section>
</main>
<?php admin_footer(); ?>
