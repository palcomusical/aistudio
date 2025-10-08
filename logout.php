<?php
require_once 'config.php';

if (isAuthenticated()) {
    logAdminAction($pdo, 'logout', ['email' => $_SESSION['user_email']]);
}

session_unset();
session_destroy();

header('Location: /login.php');
exit;
?>
