<?php
declare(strict_types=1);

final class RateLimiter
{
    public static function allow(string $scope, int $limit, int $period): bool
    {
        $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
        $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'pa-' . $scope . '-' . hash('sha256', $ip);
        $file = @fopen($path, 'c+');
        if ($file === false || !flock($file, LOCK_EX)) {
            if (is_resource($file)) fclose($file);
            return false;
        }
        $cutoff = time() - $period;
        rewind($file);
        $old = json_decode((string) stream_get_contents($file), true);
        $attempts = is_array($old) ? array_values(array_filter($old, static fn($stamp) => is_int($stamp) && $stamp > $cutoff)) : [];
        if (count($attempts) >= $limit) {
            flock($file, LOCK_UN); fclose($file); return false;
        }
        $attempts[] = time();
        rewind($file); ftruncate($file, 0);
        $ok = fwrite($file, json_encode($attempts)) !== false && fflush($file);
        flock($file, LOCK_UN); fclose($file);
        return $ok;
    }
}
