<?PHP
//ZendLite v1.3
//Date: January 2013

/* We've decided not to add the additional parameters here... Zend_LITE_ and _SIMPLE_Router! */
class SimpleRouter { //We've decided to kill the abstract class Router to simplify ZendLite (Lite!!).
	private $routes; /* FIFO */
	private $view_path;
	private $controller_path;
	private $controller_name;
	private $action_name;

	public function __construct(){
		$this->routes = array();
	
		$url = $_SERVER["REQUEST_URI"];
		list($url)=explode('?', $url);

		$_controller = 'index';
		$_action = 'index'; 
		
		$this->_init();
	
		$this->_route($url, $_controller, $_action);
		if( ! $this->_isValidRoute($url, $_controller, $_action) ){
			$this->_routeError($_controller, $_action);
		}

		$this->view_path = $this->_generateViewPath($_controller, $_action);
		$this->controller_path = $this->_generateControllerPath($_controller, $_action);
		$this->controller_name = $this->_generateControllerClassName($_controller, $_action);
		$this->action_name = $this->_generateActionMethodName($_controller, $_action);
	}

	public function _init(){
	}

	/* Hooks for __construct (Maybe we should create a new cohesive class for Routing..?) */
	protected function _route($url, &$controller, &$action){
		//"return" by reference
		foreach($this->routes as $arr){
			$matches = array();
			if(preg_match('/\/'.$arr[1].'/', $url, $matches)){
				$this->_routePattern($arr[0], $matches, $controller, $action);
				return;
			}
		}
		$url_parts = array_values(array_filter(explode("/", $url)));
	
		if(count($url_parts) == 1 && strpos($url_parts[0] ,'.') !== false){
			$controller = 'index';
			$action_parts = explode(".", $url_parts[0]);
			$action = $action_parts[0];
		}
		else if(count($url_parts) == 1){
			$controller = $url_parts[0];
			$action = 'index';
		}
		elseif(count($url_parts) >= 2){
			$controller = $url_parts[0];
			$action_parts = explode(".", $url_parts[1]);
			$action = $action_parts[0];
		}
	}

	protected function _routePattern($pattern_id, $matches, &$controller, &$action){
		//"return" by reference
		throw new Exception('You must implement this _routePattern if you want to use regex routes!');
	}
	
	protected function _routeError(&$controller, &$action){
		//"return" by reference
		$controller = 'error';
		$action = 'index';
	}

	protected function _isValidRoute($url, $controller, $action){
		$_file_view = $this->_generateViewPath($controller, $action);
		$_file_controller = $this->_generateControllerPath($controller, $action);

		if( empty($controller) || empty($action) 
			|| !preg_match('/[a-z0-9]/i', $controller.$action)
			|| !file_exists($_file_view)
			|| !file_exists($_file_controller))
				return false;

		return true;
	}

	protected function _generateViewPath($controller, $action){
		return 'views/'.$controller.'/'.$action.'.php';
	}

	protected function _generateControllerPath($controller, $action){
		return 'controllers/'.$this->_generateControllerClassName($controller, $action).'.php';
	}
	
	protected function _generateControllerClassName($controller, $action){
		return ucwords($controller).'Controller';
	}
	
	protected function _generateActionMethodName($controller, $action){
		return $action.'Action';
	}
	
	protected function addRoute($pattern_id, $pattern){
		$this->routes[] = array($pattern_id, str_replace("/", "\\/", $pattern));
	}

	public function getControllerPath(){
		return $this->controller_path;
	}
	
	public function getViewPath(){
		return $this->view_path;
	}
	
	public function getControllerName(){
		return $this->controller_name;
	}
	
	public function getActionName(){
		return $this->action_name;
	}
}