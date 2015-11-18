<?php
//elastic search librarie
require_once 'vendor/autoload.php';
//new connection 
$es=new Elasticsearch\Client(['hosts'=>['127.0.0.1:9200']]);
?>
