# Lead system setup

The public website remains static HTML/CSS/JavaScript. The quote endpoint and admin area require PHP 8+, PDO MySQL, and a MySQL/MariaDB database.

1. Create an empty database using `utf8mb4`, then apply `database/schema.sql`. For an existing installation, apply `database/migrations/20261007_add_lead_type.sql` once; prior rows default to `quick_enquiry`.
2. Set these environment variables in the PHP hosting configuration (do not add credentials to frontend files or Git): `PA_DB_HOST`, `PA_DB_PORT` (optional; defaults to 3306), `PA_DB_NAME`, `PA_DB_USER`, and `PA_DB_PASSWORD`.
3. Create the first admin from a trusted CLI with `PA_ADMIN_USERNAME` and `PA_ADMIN_PASSWORD` set in that process environment, then run `php scripts/create-admin.php`. Use a long unique password of at least 12 characters. The password is stored as a `password_hash()` hash.
4. Serve the site over HTTPS with PHP enabled for `/api/` and `/admin/`. No credentials, admin bootstrap endpoint, or database details are exposed in the browser.
5. Configure Microsoft Graph app-only mail access in the PHP hosting environment with `PA_GRAPH_TENANT_ID`, `PA_GRAPH_CLIENT_ID`, `PA_GRAPH_CLIENT_SECRET`, and `PA_GRAPH_SENDER` (set the sender to `info@printadvertisings.com`). Grant the application the required Graph `Mail.Send` permission and enable PHP cURL. Keep the client secret out of source control and the browser.

The forms submit to `/api/leads.php`; `/send-mail-disable.php` remains as a compatibility endpoint and uses the same handler. Legacy submissions without a `lead_type` are stored as `quick_enquiry`; quote popup submissions use `quote_request`. Leads are saved before Graph notification is attempted, so a mail failure does not discard the lead; failures are logged and the API reports `notification_sent: false`. Database setup errors remain generic and do not expose database details to the browser.
