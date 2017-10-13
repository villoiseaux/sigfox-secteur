<?php

require "init.php";
$json_token = json_decode(file_get_contents('php://input'), true);
$old_token=$json_token["old_token"];
$new_token=$json_token["new_token"];


if (!preg_match('/^[a-zA-Z0-9 .\-.\_.\:]+$/i', $old_token)) {
        header('HTTP/1.0 400  Server error');
        exit;
}

if (!preg_match('/^[a-zA-Z0-9 .\-.\_.\:]+$/i', $new_token)) {
        header('HTTP/1.0 400  Server error');
        exit;
}

$res = pg_query($conn, 'Update devices set token = \''.$new_token.'\' where token = \''.$old_token.'\'');
if($res==false){
        header('HTTP/1.0 400 Server error');
        exit;
}


pg_close($conn);
header('HTTP/1.0 204 OK');

?>
