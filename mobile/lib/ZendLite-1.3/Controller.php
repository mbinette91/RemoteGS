<?PHP
//ZendLite v1.3
//Date: January 2013

abstract class Controller{
	private $data;
	protected $view;

	public function __construct($view){
		$this->view = $view;
		$this->_init();
	}
	
	public function _init(){}

	public function __get ( $name ){ return $this->data[$name];}
	public function __set ( $name , $value ){ $this->data[$name] = $value; }
	public function __isset( $name ){ return isset($this->data[$name]); }
}