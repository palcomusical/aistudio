<?php
// ==========================================
// Configura��o de Banco de Dados
// ==========================================

// Configura��es do banco de dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'bomcorte_db');
define('DB_USER', 'seu_usuario');
define('DB_PASS', 'sua_senha');
define('DB_CHARSET', 'utf8mb4');

// Configura��es gerais
define('SITE_URL', 'https://seudominio.com.br');
define('ADMIN_PATH', '/admin');

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Configura��es de sess�o
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 1);
session_start();

// Conex�o com o banco de dados usando PDO
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    error_log("Erro de conex�o com o banco de dados: " . $e->getMessage());
    die(json_encode(['error' => 'Erro ao conectar ao banco de dados']));
}

// Fun��o para obter o IP do usu�rio
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
}

// Fun��o para sanitizar entrada
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Fun��o para verificar autentica��o
function isAuthenticated() {
    return isset($_SESSION['user_id']) && isset($_SESSION['user_email']);
}

// Fun��o para verificar se o usu�rio � admin
function isAdmin() {
    return isAuthenticated() && $_SESSION['user_role'] === 'Administrador';
}

// Fun��o para verificar se o usu�rio tem permiss�o de edi��o
function canEdit() {
    return isAuthenticated() && in_array($_SESSION['user_role'], ['Administrador', 'Editor']);
}

// Fun��o para redirecionar se n�o autenticado
function requireAuth() {
    if (!isAuthenticated()) {
        header('Location: /login.php');
        exit;
    }
}

// Fun��o para redirecionar se n�o for admin
function requireAdmin() {
    requireAuth();
    if (!isAdmin()) {
        header('Location: /admin/dashboard.php');
        exit;
    }
}

// Headers de seguran�a
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Fun��o para registrar log de a��o administrativa
function logAdminAction($pdo, $action, $details = null) {
    if (!isAuthenticated()) return;

    try {
        $stmt = $pdo->prepare(
            "INSERT INTO admin_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([
            $_SESSION['user_id'],
            $action,
            $details ? json_encode($details) : null,
            getUserIP()
        ]);
    } catch (PDOException $e) {
        error_log("Erro ao registrar log: " . $e->getMessage());
    }
}
?>
