<?php
declare(strict_types=1);
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_layout.php';

$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id) { http_response_code(404); exit('Enquiry not found.'); }
$db = database_connection();
$stmt = $db->prepare('SELECT * FROM leads WHERE id = :id LIMIT 1');
$stmt->execute([':id' => $id]);
$lead = $stmt->fetch();
if (!$lead) { http_response_code(404); exit('Enquiry not found.'); }
$statuses = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
$leadTypes = ['quick_enquiry' => 'Quick Enquiry', 'quote_request' => 'Quote Request'];
$error = '';
$success = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $status = (string) ($_POST['status'] ?? '');
    if (!csrf_valid($_POST['csrf_token'] ?? null) || !in_array($status, $statuses, true)) {
        $error = 'The status update could not be applied.';
    } else {
        $update = $db->prepare('UPDATE leads SET status = :status WHERE id = :id');
        $update->execute([':status' => $status, ':id' => $id]);
        $lead['status'] = $status;
        $success = 'Enquiry status updated.';
    }
}
admin_header('Enquiry details', 'enquiries');
?>
<main class="admin-main">
    <a class="back-link" href="/admin/leads.php">← Back to enquiries</a>
    <section class="panel">
        <div class="panel__heading"><div><h1 class="page-heading">Enquiry #<?= (int) $lead['id'] ?></h1><p>Submitted <?= escape_html((string) $lead['created_at']) ?></p></div></div>
        <?php if ($error !== ''): ?><p class="notice error" role="alert"><?= escape_html($error) ?></p><?php endif; ?>
        <?php if ($success !== ''): ?><p class="notice" role="status"><?= escape_html($success) ?></p><?php endif; ?>
        <div class="detail-grid">
            <div class="detail-field"><strong>Lead type</strong><span class="lead-type lead-type--<?= escape_html($lead['lead_type']) ?>"><?= escape_html($leadTypes[$lead['lead_type']] ?? 'Quick Enquiry') ?></span></div>
            <div class="detail-field"><strong>Status</strong><span class="status-badge status-badge--<?= escape_html(strtolower((string) $lead['status'])) ?>"><?= escape_html($lead['status']) ?></span></div>
            <div class="detail-field"><strong>Name</strong><?= escape_html($lead['name']) ?></div>
            <div class="detail-field"><strong>Company</strong><?= escape_html($lead['company_name'] ?: '—') ?></div>
            <div class="detail-field"><strong>Phone</strong><a href="tel:<?= escape_html($lead['phone']) ?>"><?= escape_html($lead['phone']) ?></a></div>
            <div class="detail-field"><strong>Email</strong><?= $lead['email'] ? '<a href="mailto:' . escape_html($lead['email']) . '">' . escape_html($lead['email']) . '</a>' : '—' ?></div>
            <div class="detail-field"><strong>Product</strong><?= escape_html($lead['product'] ?: '—') ?></div>
            <div class="detail-field"><strong>Category</strong><?= escape_html($lead['category'] ?: '—') ?></div>
            <div class="detail-field"><strong>Quantity</strong><?= escape_html($lead['quantity'] ?: '—') ?></div>
            <div class="detail-field"><strong>Discussion topic</strong><?= escape_html($lead['topic'] ?: '—') ?></div>
            <div class="detail-field"><strong>Estimated budget</strong><?= escape_html($lead['budget'] ?: '—') ?></div>
            <div class="detail-field detail-field--wide"><strong>Message</strong><?= escape_html($lead['message'] ?: '—') ?></div>
        </div>
        <div class="detail-actions">
            <form class="status-form" method="post">
                <input type="hidden" name="csrf_token" value="<?= escape_html(csrf_token()) ?>">
                <label for="detail-status">Update status</label>
                <select id="detail-status" name="status"><?php foreach ($statuses as $status): ?><option<?= $lead['status'] === $status ? ' selected' : '' ?>><?= escape_html($status) ?></option><?php endforeach; ?></select>
                <button type="submit">Save status</button>
            </form>
            <?php $digits = preg_replace('/\D+/', '', (string) $lead['phone']); ?>
            <a class="button button--secondary" href="https://wa.me/<?= escape_html($digits) ?>" target="_blank" rel="noopener">WhatsApp</a>
        </div>
    </section>
</main>
<?php admin_footer(); ?>
