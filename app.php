<?php
require 'vendor/autoload.php';

$app = new \Slim\Slim(array(   'templates.path' => './templates'));
 
$app->get('/', function () use ($app) {
  $app->render("write.html");
});

$app->get('/saved', function () use ($app) {
  $app->render("saved.html");
});

$app->post('/save', function () use ($app) {
  $data = $app->request->params('encMessage');
  if(!$data) {
    echo "error: no data";
    return;
  }
  $date = date('Y-m-d_His'); // for production better use a GUID. 
  file_put_contents("./data/$date.txt.gpg", $data);
  $app->redirect('./saved');
});

$app->run();
