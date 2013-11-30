<?PHP
	date_default_timezone_set('America/Montreal'); // http://www.php.net/manual/en/timezones.php
	
	//Constants
	define('DEBUG', false);
	define('APPLICATION_PATH', getcwd()); //Without trailing '/'
	if( ! DEBUG ){
		error_reporting(0);
		ini_set ('error_log', APPLICATION_PATH.'/error_log');
		ini_set ('log_errors', true);
		define('BASE_URL_DESKTOP', "http://www.remote.gs"); //Without trailing '/'
		define('BASE_URL_MOBILE', "http://m.remote.gs"); //Without trailing '/'
		define('GSR_SOCKETIO_HOST', "http://m.remote.gs:8080"); //Without trailing '/'
		define('APPLICATION_LOG', false); //For JS Application (mobile)
	}
	else{
		error_reporting(E_ALL);
		define('BASE_URL_DESKTOP', "http://ffos.local"); //Without trailing '/'
		define('BASE_URL_MOBILE', "http://ffos.local"); //Without trailing '/'
		define('GSR_SOCKETIO_HOST', "http://ffos.local:8080"); //Without trailing '/'
		define('APPLICATION_LOG', true); //For JS Application (mobile)
	}
	define('GOOGLE_ANALYTICS_ID', 'UA-43375422-1');
	define('GOOGLE_ANALYTICS_NAME', 'remote.gs');
	
?>