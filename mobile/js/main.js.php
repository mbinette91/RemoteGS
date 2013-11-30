<?PHP 
	ob_start("ob_gzhandler");
	header("Content-type: text/javascript; charset: UTF-8");
	header("Cache-control: must-revalidate");
?>
/************************* MAIN.JS.PHP **************************
By: 
For: 
Date: 
****************************************************************/
<?PHP
	$offset = 0; //60 * 60;
	$expire = "Expires: ".gmdate("D, d M Y H:i:s", time() + $offset)." GMT";
	header($expire);
	//Partials at the end too!
	include '_partials/_basics-1.0.0.js.php';
	include '_partials/Application.class.js';
	include '_partials/MozApps.plugin.js';
	include '_partials/Page.class.js';
	include '_partials/Remote.class.js';
	include '_partials/ErrorHandler.class.js';

	if(0) { ?><script><?php }
	include '../../configs/config.php';
?>

Application.BASE_URL = '<?PHP echo BASE_URL_MOBILE; ?>'; //Without trailing '/' !
Application.log = function(str){ <?PHP if(APPLICATION_LOG) echo 'console.log(str);'; ?> };

var CURRENT_APP;
$(document).ready(function(){
	CURRENT_APP = new Application();
	CURRENT_APP.onStartUp();
});

<?PHP
	if(0) { ?></style><?php }
	ob_end_flush(); 
?>