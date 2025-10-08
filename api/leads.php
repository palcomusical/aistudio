<?php
require_once '../config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    case 'PUT':
        handlePut($pdo);
        break;
    case 'DELETE':
        handleDelete($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
        break;
}

function handleGet($pdo) {
    try {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM leads WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $lead = $stmt->fetch();

            if ($lead) {
                echo json_encode($lead);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Lead não encontrado']);
            }
        } elseif (isset($_GET['stats'])) {
            $stats = [
                'total' => $pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn(),
                'pendentes' => $pdo->query("SELECT COUNT(*) FROM leads WHERE status = 'Pendente'")->fetchColumn(),
                'atendidos' => $pdo->query("SELECT COUNT(*) FROM leads WHERE status = 'Atendido'")->fetchColumn(),
            ];

            $topStates = $pdo->query(
                "SELECT state, COUNT(*) as count FROM leads WHERE state IS NOT NULL GROUP BY state ORDER BY count DESC LIMIT 5"
            )->fetchAll();

            $topSources = $pdo->query(
                "SELECT utm_source, COUNT(*) as count FROM leads WHERE utm_source IS NOT NULL GROUP BY utm_source ORDER BY count DESC LIMIT 5"
            )->fetchAll();

            echo json_encode([
                'stats' => $stats,
                'topStates' => $topStates,
                'topSources' => $topSources
            ]);
        } else {
            $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
            $limit = isset($_GET['limit']) ? min(100, max(10, intval($_GET['limit']))) : 50;
            $offset = ($page - 1) * $limit;

            $where = [];
            $params = [];

            if (isset($_GET['status'])) {
                $where[] = "status = ?";
                $params[] = $_GET['status'];
            }

            if (isset($_GET['search'])) {
                $search = '%' . $_GET['search'] . '%';
                $where[] = "(name LIKE ? OR email LIKE ? OR whatsapp LIKE ?)";
                $params[] = $search;
                $params[] = $search;
                $params[] = $search;
            }

            $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

            $countStmt = $pdo->prepare("SELECT COUNT(*) FROM leads $whereClause");
            $countStmt->execute($params);
            $total = $countStmt->fetchColumn();

            $stmt = $pdo->prepare(
                "SELECT * FROM leads $whereClause ORDER BY created_at DESC LIMIT ? OFFSET ?"
            );
            $stmt->execute(array_merge($params, [$limit, $offset]));
            $leads = $stmt->fetchAll();

            echo json_encode([
                'leads' => $leads,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ]);
        }
    } catch (PDOException $e) {
        error_log("Erro ao buscar leads: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar leads']);
    }
}

function handlePost($pdo) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            $data = $_POST;
        }

        $required = ['name', 'email', 'whatsapp'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Campo obrigatório: $field"]);
                return;
            }
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email inválido']);
            return;
        }

        $stmt = $pdo->prepare("
            INSERT INTO leads (
                name, email, whatsapp, dial_code, cep, state, city,
                utm_source, utm_medium, utm_campaign, utm_term, utm_content,
                lgpd_consent, ip_address, user_agent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $result = $stmt->execute([
            sanitize($data['name']),
            sanitize($data['email']),
            sanitize($data['whatsapp']),
            sanitize($data['dialCode'] ?? '55'),
            sanitize($data['cep'] ?? ''),
            sanitize($data['state'] ?? ''),
            sanitize($data['city'] ?? ''),
            sanitize($data['utm_source'] ?? ''),
            sanitize($data['utm_medium'] ?? ''),
            sanitize($data['utm_campaign'] ?? ''),
            sanitize($data['utm_term'] ?? ''),
            sanitize($data['utm_content'] ?? ''),
            !empty($data['lgpdConsent']) ? 1 : 0,
            getUserIP(),
            $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);

        if ($result) {
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'id' => $pdo->lastInsertId(),
                'message' => 'Lead cadastrado com sucesso'
            ]);
        }
    } catch (PDOException $e) {
        error_log("Erro ao criar lead: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao cadastrar lead']);
    }
}

function handlePut($pdo) {
    requireAuth();

    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID do lead é obrigatório']);
            return;
        }

        $updates = [];
        $params = [];

        $allowedFields = ['status', 'representative_name', 'name', 'email', 'whatsapp', 'state', 'city'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updates[] = "$field = ?";
                $params[] = sanitize($data[$field]);
            }
        }

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'Nenhum campo para atualizar']);
            return;
        }

        $params[] = $data['id'];

        $stmt = $pdo->prepare(
            "UPDATE leads SET " . implode(', ', $updates) . " WHERE id = ?"
        );

        $result = $stmt->execute($params);

        if ($result) {
            logAdminAction($pdo, 'update_lead', ['lead_id' => $data['id'], 'updates' => $updates]);
            echo json_encode(['success' => true, 'message' => 'Lead atualizado com sucesso']);
        }
    } catch (PDOException $e) {
        error_log("Erro ao atualizar lead: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao atualizar lead']);
    }
}

function handleDelete($pdo) {
    requireAdmin();

    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID do lead é obrigatório']);
            return;
        }

        $stmt = $pdo->prepare("DELETE FROM leads WHERE id = ?");
        $result = $stmt->execute([$data['id']]);

        if ($result) {
            logAdminAction($pdo, 'delete_lead', ['lead_id' => $data['id']]);
            echo json_encode(['success' => true, 'message' => 'Lead excluído com sucesso']);
        }
    } catch (PDOException $e) {
        error_log("Erro ao excluir lead: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao excluir lead']);
    }
}
?>
