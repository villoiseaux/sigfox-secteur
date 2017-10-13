<?php

require "init.php";
$json = json_decode(file_get_contents('php://input'), true);
$mac=$json["mac"];
$token = $json["token"];


if(!ctype_alnum($mac)){
	header('HTTP/1.0 400 Erreur A');
        exit;
        }
if (!preg_match('/^[a-zA-Z0-9 .\-.\_.\:]+$/i', $token)) {
    header('HTTP/1.0 400 Erreur');    
	exit;
}

// add fcminsert (insert device if not exists)
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



// Add sonde if not exists
// search the sonde (probe)
$res_test_exist = pg_query($conn, 'select * from sondes where mac = \''.$mac.'\';');
if($res_test_exist==false){
       header('HTTP/1.0 400 Server error');
       exit;
}
// if not found insert it
$row_test_exist = pg_fetch_row($res_test_exist);
$existance = $row_test_exist[0];
if(!$existance){
	$res = pg_query($conn, ' insert into sondes (mac) values (\''.$mac.'\');');
	if($res==false){
        	header('HTTP/1.0 400 Server error');
        	exit;
        }
}

// Add link device <->sonde
$res = pg_query($conn, ' Select id from sondes where mac = \''.$mac.'\';');
if($res==false){ 
        header('HTTP/1.0 400 Erreur B');
	exit;
        }
$row = pg_fetch_row($res);
$id_sonde = $row[0];

$res = pg_query($conn, ' Select id from devices where token = \''.$token.'\';');
if($res==false){
        header('HTTP/1.0 400 Erreur C');
        exit;    
        }
$row = pg_fetch_row($res);
$id_dev = $row[0];


$res_test_exist = pg_query($conn, 'select * from liens  where id_dev = \''.$id_dev.'\' and id_sonde = \''.$id_sonde.'\';');
if($res_test_exist==false){
       header('HTTP/1.0 400 Server error D');
       exit;
}


$row_test_exist = pg_fetch_row($res_test_exist);
$existance = $row_test_exist[0];

if(!$existance){
$res = pg_query($conn, ' Insert into liens (id_dev,id_sonde) values ( \''.$id_dev.'\',\' '.$id_sonde.'\');');
if($res==false){
        header('HTTP/1.0 400 Erreur E');
        exit;
        }
}

pg_close($conn);
header('HTTP/1.0 204 OK');

?>

