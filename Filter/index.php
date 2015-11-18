<?php
require_once 'init.php';
//request from elastic search database 
if (isset($_POST['message']){
$message=$_POST['message'];

$query=$es=>search([
	'body'=>[
		'query'=>[
			'bool'=>[
				'should'=>[
					'match'=>['word'=>$message
								]
						]
					]
				]
			]

	]);
//verify the existance of the user 
if ($query['hits']['total']=>1){
	$_POST['verify'] = "no";
}
else {
$_POST['verify'] = "ok";
}

}
?>



</body>
</html>
