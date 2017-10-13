<?php


$db_user = "pgtest";
$db_passwd = "test";
$db_name = "test";

$conn = pg_connect("dbname = $db_name user = $db_user password = $db_passwd");
$conn_stat = pg_connection_status($conn);
if($conn_stat !='PGSQL_CONNECTION_OK'){
	echo "Connection failed";
	exit;
}

 
?>
