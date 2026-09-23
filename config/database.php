<?php
declare(strict_types=1);

/* Configure these values in the PHP hosting environment; never place credentials in the site. */
function database_connection(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = getenv('PA_DB_HOST') ?: '127.0.0.1';
    $port = getenv('PA_DB_PORT') ?: '3306';
    $name = getenv('PA_DB_NAME') ?: '';
    $user = getenv('PA_DB_USER') ?: '';
    $password = getenv('PA_DB_PASSWORD') ?: '';
    if ($name === '' || $user === '') {
        throw new RuntimeException('Database configuration unavailable');
    }

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $pdo->exec("SET time_zone = '+00:00'");
    return $pdo;
}
