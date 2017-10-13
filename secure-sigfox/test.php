<?php

$db_user = "pgtest";
$db_passwd = "test";
$db_name = "test";

$_id = $_GET["id"];
$_data = $_GET["data"];


$conn = pg_connect("dbname = $db_name user = $db_user password = $db_passwd");
$conn_stat = pg_connection_status($conn);
if($conn_stat !='PGSQL_CONNECTION_OK'){
        echo "Connection failed";
        exit;
}

$event = hexdec(substr($_data,4,2));
$notif=0;
$old_status = pg_query($conn,'SELECT status FROM sondes WHERE mac = \''.$_id.'\';');
$row_old_status = pg_fetch_row($old_status);
$status = $row_old_status[0];

if($status != 'OFF' & $event == 17){
              echo "1";
        }
if($status != 'ON' & $event == 16){
		echo "2";
}      
echo $status;
pg_close($conn);

?>
