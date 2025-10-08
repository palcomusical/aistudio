<?php
require_once '../config.php';
requireAdmin();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuários - BomCorte Admin</title>
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
    <script type="module" crossorigin src="/assets/index.js"></script>
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <div id="root"></div>
    <script>
        window.API_BASE_URL = '/api';
        window.IS_ADMIN_PANEL = true;
        window.ADMIN_PAGE = 'users';
        window.USER_SESSION = <?= json_encode([
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email'],
            'role' => $_SESSION['user_role']
        ]) ?>;
    </script>
</body>
</html>
