<?php 
	header("Content-type:application/json");
	
	// Error_code indicates if there is an error and the type of error	
	$error_code = 0;
	$error_cause = "OK";
	
	//Inputs : name of the device and the time lapse
	$json = json_decode(file_get_contents('php://input'), true);

	$_id = $json["id"];
	$_start = $json["start"];
	$_end = $json["end"];
	
	//Test if the inputs are valid

	if ($_start > $_end){
                $error_code = 1;
                $error_cause = "Start higher then end";
                }
	
	
	if (!ctype_digit($_start)){
		$error_code = 2;
		$error_cause = "Bad type for start" ;
		}
	
	if (!ctype_digit($_end)){
		$error_code = 3;
                $error_cause = "Bad type for end" ;
                }
	
	if(!ctype_alnum($_id)){
		$error_code = 4;
		$error_cause = " Bad type for id";
		}

	if (!$_id  | !$_start | !$_end){
                $error_code = 5;
                $error_cause = "Missing input";
                }

	if($error_code == 0) {

		//Database parameters
		$dbname = "test";
        	$dbuser = "pgtest";
        	$dbpassword = "test";
			
		// Connection to database
		$conn = pg_connect("dbname= $dbname user=$dbuser password=$dbpassword");
		$conn_stat = pg_connection_status($conn);
		if($conn_stat!= 'PGSQL_CONNECTION_OK'){
			$error_code = 6;
			$error_cause = 	"Connection to database failed";
		}
	}
	if($error_code==0){		
		// Test if id exist in database
		$res=pg_query($conn, 'SELECT * FROM DATA WHERE id =\''. $_id.'\';');
		if(!pg_num_rows($res)){
			$error_code = 7;
			$error_cause = "id does not exist in database";
		}
	
		// Request to the database
		$res = pg_query($conn, 'SELECT * FROM DATA WHERE id =\''. $_id. '\' AND time <'.$_end. ' AND time >'.$_start.';');	
		if($res==False){
			$error_code = 8;
	                $error_cause = "Request failed";
	        }

		//Closing connection to database
        	pg_close($conn);

	}
	// Display data in json
	echo "{\n \"event\" :";
	$cnt = 0;
	$cnt_event = 0;
	echo "[ ";
	if($error_code == 0){
		echo "\n";
		while($row = pg_fetch_row($res)) {
			$cnt_event++;	
			$event = hexdec(substr($row[2],4,2));
			if($event == 16){
				$event_type = "ON";
			}elseif($event == 17){
				$event_type = "OFF";
			}else{
				$event_type = "OTHER";
			}
	
			if ($cnt == 1){
				echo ", \n";
			}else{
				$cnt = 1;
			}

			echo "{ \"time\" : \"$row[1]\" , \"data\" : \"$row[2]\" , \"lat\" : \"$row[3]\", \"lng\" : \"$row[4]\" , \"snr\" : \"$row[5]\" , \"rssi\" : \"$row[6]\" , \"event type\" : \"$event_type\" }";
		}
	echo "\n";
	}
	echo " ],\n";
	echo "\"event count\" : \"$cnt_event\",\n";
        echo "\"error code\" : \"$error_code\",\n";
	echo "\"error label\" : \"$error_cause\"\n";
	echo "}";
				 

		
?>
