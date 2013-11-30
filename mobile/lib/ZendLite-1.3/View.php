<?PHP
//ZendLite v1.3
//Date: January 2013

class View{
	private $data = array();
	public function __get ( $name ){ return $this->data[$name];}
	public function __set ( $name , $value ){ $this->data[$name] = $value; }
	public function __isset( $name ){ return isset($this->data[$name]); }
	
	public function _partial($path, $args){
		$VIEW = new View();
		foreach($args as $key => $value)
			$VIEW->$key = $value;
		require $path;
	}
};