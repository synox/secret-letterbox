<?php
date_default_timezone_set('Europe/Paris');
require 'vendor/autoload.php';

$app = new \Slim\Slim();
 
$app->get('/', function () use ($app) {
});

$app->post('/save', function () use ($app) {
  $body = $app->request->getBody();
  if(!$body) {
    echo "error: no data";
    $app->response->setStatus(400);
    return;
  }
  $message_timestamps = array();
  $messages = json_decode($body, true);
  foreach($messages as $message) {    
    $date = date('Y-m-d_His', $message['timestamp'] / 1000); // for production better use a GUID. 
    file_put_contents("../../data/$date.txt.gpg", $message['encrypted']);
    $message_timestamps[] = $message['timestamp'];
  }
  print json_encode($message_timestamps);
});

$app->run();
