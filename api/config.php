<?php
require_once '../config.php';

header('Content-Type: application/json');

requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
        break;
}

function handleGet($pdo) {
    try {
        $stmt = $pdo->query("SELECT config_key, config_value FROM landing_page_config");
        $configs = $stmt->fetchAll();

        $result = [];
        foreach ($configs as $config) {
            $value = $config['config_value'];

            if ($config['config_key'] === 'features' || $config['config_key'] === 'products') {
                $value = json_decode($value, true);
            } elseif ($config['config_key'] === 'show_product_section') {
                $value = $value === '1' || $value === 1 || $value === true;
            }

            $result[$config['config_key']] = $value;
        }

        $landingPageContent = [
            'logoUrl' => $result['logo_url'] ?? '',
            'mainTitle' => $result['main_title'] ?? '',
            'highlightedTitle' => $result['highlighted_title'] ?? '',
            'description' => $result['description'] ?? '',
            'features' => $result['features'] ?? [],
            'backgroundImageUrl' => $result['background_image_url'] ?? '',
            'colorPalette' => [
                'primary' => $result['color_primary'] ?? '#4c0519',
                'accent' => $result['color_accent'] ?? '#facc15',
                'textPrimary' => $result['color_text_primary'] ?? '#ffffff',
                'textSecondary' => $result['color_text_secondary'] ?? '#d1d5db',
            ],
            'showProductSection' => $result['show_product_section'] ?? true,
            'productSectionTitle' => $result['product_section_title'] ?? '',
            'productSectionDescription' => $result['product_section_description'] ?? '',
            'products' => $result['products'] ?? [],
        ];

        echo json_encode($landingPageContent);
    } catch (PDOException $e) {
        error_log("Erro ao buscar configurações: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar configurações']);
    }
}

function handlePost($pdo) {
    if (!canEdit()) {
        http_response_code(403);
        echo json_encode(['error' => 'Sem permissão para editar']);
        return;
    }

    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Dados inválidos']);
            return;
        }

        $configs = [
            'logo_url' => $data['logoUrl'] ?? '',
            'main_title' => $data['mainTitle'] ?? '',
            'highlighted_title' => $data['highlightedTitle'] ?? '',
            'description' => $data['description'] ?? '',
            'features' => json_encode($data['features'] ?? []),
            'background_image_url' => $data['backgroundImageUrl'] ?? '',
            'color_primary' => $data['colorPalette']['primary'] ?? '#4c0519',
            'color_accent' => $data['colorPalette']['accent'] ?? '#facc15',
            'color_text_primary' => $data['colorPalette']['textPrimary'] ?? '#ffffff',
            'color_text_secondary' => $data['colorPalette']['textSecondary'] ?? '#d1d5db',
            'show_product_section' => $data['showProductSection'] ? '1' : '0',
            'product_section_title' => $data['productSectionTitle'] ?? '',
            'product_section_description' => $data['productSectionDescription'] ?? '',
            'products' => json_encode($data['products'] ?? []),
        ];

        $pdo->beginTransaction();

        foreach ($configs as $key => $value) {
            $stmt = $pdo->prepare(
                "INSERT INTO landing_page_config (config_key, config_value) VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE config_value = ?"
            );
            $stmt->execute([$key, $value, $value]);
        }

        $pdo->commit();

        logAdminAction($pdo, 'update_landing_page_config', ['keys' => array_keys($configs)]);

        echo json_encode([
            'success' => true,
            'message' => 'Configurações atualizadas com sucesso'
        ]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log("Erro ao atualizar configurações: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao atualizar configurações']);
    }
}
?>
