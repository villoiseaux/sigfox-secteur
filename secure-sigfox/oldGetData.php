
<?php 
	//Data base param
	$dbname = "test";
	$dbuser = "pgtest";
	$dbpassword = "test";
	
	//Data base inputs
	$_id = $_GET["id"];
        $_time = $_GET["time"];
        $_data = $_GET["data"];
	$_lat = $_GET["lat"];
	$_lng = $_GET["lng"];
        $_snr = $_GET["snr"];
	$_rssi = $_GET["rssi"];
	
	$_time = $_time*1000; 
	
	if (!ctype_alnum($_id)|!ctype_alnum($_data)|!is_numeric($_time)|!is_numeric($_lat)|!is_numeric($_lng)|!is_numeric($_snr)|!is_numeric($_rssi)){
		header('HTTP/1.0 400 Erreur');
		exit;
	}
	$conn = pg_connect("dbname=$dbname user=$dbuser password=$dbpassword") or die('echec connexion');	
	
	//get last data inserted for the same device
	$last=pg_query($conn,'SELECT * FROM DATA WHERE id = \''.$_id.'\' AND time = (SELECT MAX(time) FROM DATA WHERE id = \''.$_id.'\') ;');
	if($last==false){
        	header('HTTP/1.0 400 Erreur');
        	exit;
        }
	$row = pg_fetch_row($last); 	
	
	//Insert sonde if does not exist
	$res_test_exist = pg_query($conn,'Select mac from sondes where mac = \''.$_id.'\';'); 
	if($res_test_exist==false){
        	header('HTTP/1.0 400 Erreur');
        	exit;
        }
	$row_test_exist = pg_fetch_row($res_test_exist);
	$existance = $row_test_exist[0];
	if(!$existance){
		$res_add_sonde = pg_query($conn,'Insert into sondes (mac) values (\''.$_id.'\');');
		if($res_add_sonde==false){
        		header('HTTP/1.0 400 Erreur');
        		exit;
        	}
	}
	
	//Insert data
	$res_add_data = pg_query($conn,"INSERT INTO DATA (id, time, data, lat, lng, snr, rssi) VALUES ('$_id','$_time','$_data','$_lat','$_lng','$_snr','$_rssi');");
	if($res_add_data==false){
	        header('HTTP/1.0 400 Erreur');
        	exit;
        }
	//Change sondes status
	$status = hexdec(substr($_data,4,2));
	if ($status == 16){
		$status = 'ON';
	}
	elseif($status == 17){
		$status ='OFF';
	}else{
		$status ='OTHER';
	}
	$res_change_status = pg_query($conn,"UPDATE sondes set status = '$status', last_seen = '$_time' where mac = '$_id';");
	if($res_change_status==false){
                header('HTTP/1.0 400 Erreur');
                exit;
        }

	//Application param
	$path_to_fcm = 'https://fcm.googleapis.com/fcm/send';
	$server_key = 'AAAAAwWc7GQ:APA91bFaJ2ubJu9r0qLmu0qlxi8qo-_952HBDdXgsmAo7Zy8mCJvsW8KucPCCXvvM_459n7V7eHVCospVHGU1WtTlHdz8vEpFRswe7BwQ5h-A-9IOrf4I7j4xfMN8dBrQzx1quxxgVAR';
	$res1 = pg_query($conn,'SELECT id from sondes where mac = \''.$_id.'\';');
	if($res1==false){
        	header('HTTP/1.0 400 Erreur');
        	exit;
        }

	$row1 = pg_fetch_row($res1);
	$id_sonde = $row1[0];
	$res2 = pg_query($conn,'SELECT id_dev from liens where id_sonde ='.$id_sonde.';');
	if($res2==false){
        	header('HTTP/1.0 400 Erreur');
        	exit;
        }
	while ($row2 =pg_fetch_row($res2)){
		$id_dev = $row2[0];
		$res3=pg_query($conn,'Select token from devices where id ='.$id_dev.';');  
		if($res3==false){
        		header('HTTP/1.0 400 Erreur');
        		exit;
        	}
		$row3=pg_fetch_row($res3);
		$key = $row3[0];

	// Test if device is off and send a notif if it was not off before
         $last_event = hexdec(substr($row[2],4,2));
	 $event = hexdec(substr($_data,4,2));
	 $notif=0;		
	if($last_event == 16 & $event == 17){
                $fields = array ( 'to' =>$key,
                		  'notification'=>array('title'=>'Notification Sigfox',
                        	                		'body'=>'Coupure Secteur '));
		$notif=1;
	}

	if($last_event == 17 & $event == 16){
                $fields = array ( 'to' =>$key,
                                  'notification'=>array('title'=>'Notification Sigfox',
                                                                'body'=>'Sonde branchée au secteur '));
                $notif=1;
        }

	if($notif){
		$headers = array('Authorization:key=' .$server_key,
        	                 'Content-Type:application/json');
		$json_field = json_encode($fields);
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $path_to_fcm);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,false);
		curl_setopt($curl,CURLOPT_IPRESOLVE,CURL_IPRESOLVE_V4);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $json_field);

		$result = curl_exec($curl);

	}
	}
	
	pg_close($conn);	

        header('HTTP/1.0 200 OK');

?>
