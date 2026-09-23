CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(254) NULL,
  product VARCHAR(120) NULL,
  category VARCHAR(120) NULL,
  quantity BIGINT UNSIGNED NULL,
  message TEXT NULL,
  status ENUM('New','Contacted','Quoted','Won','Lost') NOT NULL DEFAULT 'New',
  PRIMARY KEY (id),
  KEY idx_leads_created_at (created_at),
  KEY idx_leads_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
