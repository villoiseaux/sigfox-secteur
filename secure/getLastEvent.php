<?php
	
	header("Content-type:application/json");
	$json = json_decode(file_get_contents('php://input'), true);
	$_id = $json["id"];

	$error_code=0;
	$error_cause="ok";
	
	if(!ctype_alnum($_id)){
                $error_code = 2 ;
                $error_cause = " Bad type for id";
        }
	if(!$_id){
		$error_code=1;
		$error_cause = " Missing id input";
	}

	if($error_code==0){
	 //Database parameters
                $dbname = "test";
                $dbuser = "pgtest";
                $dbpassword = "test";

         // Connection to database
                $conn = pg_connect("dbname= $dbname user=$dbuser password=$dbpassword");
                $conn_stat = pg_connection_status($conn);
                if($conn_stat!= 'PGSQL_CONNECTION_OK'){
                        $error_code = 3;
                        $error_cause =  "Connection to database failed";
                }
	}
	if($error_code == 0){
	 // Test if id exist in database
                $res=pg_query($conn, 'SELECT * FROM DATA WHERE id =\''. $_id.'\';');
                if(!pg_num_rows($res)){
                        $error_code = 4;
                        $error_cause = "id does not exist in database";
                }
	}
	// Request to database
	if($error_code == 0){
		$res=pg_query($conn,'SELECT * FROM DATA WHERE id = \''.$_id.'\' AND time = (SELECT MAX(time) FROM DATA WHERE id = \''.$_id.'\') ;');
		if($res==false){
			$error_code = 5;
			$error_cause = "Request failed";
		}
		pg_close($conn);
	}

	// Display Json
	echo "{\n \"event\" :\n";
	if($error_code == 0){
         $row = pg_fetch_row($res);
         $event = hexdec(substr($row[2],4,2));
         if($event == 16){
                    $event_type = "ON";
          }elseif($event == 17){
                    $event_type = "OFF";
          }else{
                    $event_type = "OTHER";
          }


        echo "{ \"time\" : \"$row[1]\" , \"data\" : \"$row[2]\" , \"lat\" : \"$row[3]\", \"lng\" : \"$row[4]\" , \"snr\" : \"$row[5]\" , \"rssi\" : \"$row[6]\" , \"event type\" : \"$event_type\" },\n";
         }

	echo "\"error code\" : \"$error_code\" ,\n\"error label\" : \"$error_cause\"";
	echo "\n }";
?>
