<?php
/**
 * LE BORSE DI ANITA — Server Backend API (PHP)
 * Gestisce il salvataggio remoto di borse e immagini per hosting web standard.
 *
 * Istruzioni: Carica questo file nella stessa cartella di index.html ed admin.html.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/data_borse.json';
$uploadsDir = __DIR__ . '/uploads';

// Crea la cartella uploads se non esiste
if (!file_exists($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}

$action = isset($_GET['action']) ? $_GET['action'] : 'list';

if ($action === 'list') {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo json_encode([]);
    }
    exit();
}

if ($action === 'save') {
    $rawInput = file_get_contents('php://input');
    $items = json_decode($rawInput, true);

    if (!is_array($items)) {
        http_response_code(400);
        echo json_encode(['error' => 'Dati non validi']);
        exit();
    }

    // Processa eventuali immagini in base64 salvandole come file fisici nella cartella uploads
    foreach ($items as &$item) {
        if (isset($item['foto']) && strpos($item['foto'], 'data:image/') === 0) {
            $parts = explode(',', $item['foto']);
            if (count($parts) === 2) {
                $meta = $parts[0];
                $base64 = $parts[1];

                $ext = 'jpg';
                if (strpos($meta, 'image/webp') !== false) $ext = 'webp';
                elseif (strpos($meta, 'image/png') !== false) $ext = 'png';

                $filename = 'borsa_' . ($item['id'] ?? uniqid()) . '_' . time() . '.' . $ext;
                $filePath = $uploadsDir . '/' . $filename;

                if (file_put_contents($filePath, base64_decode($base64))) {
                    $item['foto'] = 'uploads/' . $filename;
                }
            }
        }
    }
    unset($item);

    // Salva il file JSON
    if (file_put_contents($dataFile, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true, 'count' => count($items)]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Impossibile salvare il file JSON']);
    }
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Azione non riconosciuta']);
