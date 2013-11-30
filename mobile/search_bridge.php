<?PHP 
	if(isset($_GET['q']))
		echo file_get_contents('http://tinysong.com/s/'.urlencode($_GET['q']).'*?format=json&limit=50&key=699de44fc595ec2aeef442b112f6076d');
