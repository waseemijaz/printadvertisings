# Lead system setup

The public website remains static HTML/CSS/JavaScript. The quote endpoint and admin area require PHP 8+, PDO MySQL, and a MySQL/MariaDB database.

1. Create an empty database using `utf8mb4`, then apply `database/schema.sql`.
2. Set these environment variables in the PHP hosting configuration (do not add credentials to frontend files or Git): `PA_DB_HOST`, `PA_DB_PORT` (optional; defaults to 3306), `PA_DB_NAME`, `PA_DB_USER`, and `PA_DB_PASSWORD`.
3. Create the first admin from a trusted CLI with `PA_ADMIN_USERNAME` and `PA_ADMIN_PASSWORD` set in that process environment, then run `php scripts/create-admin.php`. Use a long unique password of at least 12 characters. The password is stored as a `password_hash()` hash.
4. Serve the site over HTTPS with PHP enabled for `/api/` and `/admin/`. No credentials, admin bootstrap endpoint, or database details are exposed in the browser.

The forms submit to `/api/leads.php`; `/send-mail-disable.php` remains as a compatibility endpoint and uses the same handler. Before MySQL configuration exists, the form shows a generic retry/WhatsApp message and does not expose setup or database errors.
