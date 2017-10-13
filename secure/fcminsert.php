<?php 

require "init.php";
$json_token = json_decode(file_get_contents('php://input'), true);
$token=$json_token["token"];

ini_set ("log_error", 1);
ini_set ("error_log", "/tmp/php-error.log");
error_log("token=".$token."\n");

if (!preg_match('/^[a-zA-Z0-9 .\-.\_.\:]+$/i', $token)) {
        header('HTTP/1.0 400  Server error');
        exit;
}

$res_test_exist = pg_query($conn, 'select * from devices where token = \''.$token.'\';');
if($res_test_exist==false){
       header('HTTP/1.0 400 Server error');
       exit;
}

$row_test_exist = pg_fetch_row($res_test_exist);
$existance = $row_test_exist[0];

if(!$existance){
	$res = pg_query($conn, ' insert into devices (token) values (\''.$token.'\');');
	if($res==false){
        	header('HTTP/1.0 400 Server error');
        	exit;
        }
}

pg_close($conn);
header('HTTP/1.0 204 OK');

?>

