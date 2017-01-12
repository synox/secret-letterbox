<?php
date_default_timezone_set('Europe/Paris');

// Force content type
header('Content-type: application/json;charset=utf-8');
header('X-Content-Type-Options: nosniff');

$inputJSON = file_get_contents('php://input');
if (!$inputJSON) {
    echo '{error: "no data"}';
    http_response_code(400);
    die();
}

$messages = json_decode($inputJSON, TRUE);
$message_timestamps = array();

foreach ($messages as $message) {
    $date = date('Y-m-d_His', $message['timestamp'] / 1000); // for production better use a GUID.
    file_put_contents("./data/$date.txt.gpg", $message['encrypted']);
    $message_timestamps[] = $message['timestamp'];
}

echo json_encode($message_timestamps);
