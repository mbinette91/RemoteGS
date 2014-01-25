<?PHP 
	if(isset($_GET['q'])){
	require("gsAPI.php");
	$gs = new gsAPI("remote8", "58a95b1d5b78e62e022803692714e457"); //note: you can also change the default key/secret in gsAPI.php
	$sessionID = $gs->startSession();
	$gs->getCountry($_SERVER['REMOTE_ADDR']);
	echo json_encode($gs->getSongSearchResults(urlencode($_GET['q'])));
		}
		
