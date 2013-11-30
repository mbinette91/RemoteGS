<?PHP
//ZendLite v1.3
//Date: January 2013
require_once('SimpleRouter.php');

abstract class Application{	
	protected $router;
	protected $view;
	protected $controller;

	public function __construct(){
		$this->view = new View();
		$this->router = $this->_createRouter();
	}
	
	public function run(){
		$this->_init();
		$this->controller = $this->_createController( $this->router->getControllerName() );
		$this->_executeControllerAction( $this->controller, $this->router->getActionName() );
	}
	
	public function getViewObject(){
		return $this->view;
	}
	
	public function getControllerObject(){
		return $this->controller;
	}

	public function getViewPath(){
		return $this->router->getViewPath();
	}

	public abstract function getHeaderPath();
	public abstract function getFooterPath();

	/* Hooks for __construct() */
	protected function _createRouter(){
		return new SimpleRouter();
	}

	/* Hooks for run() */
	protected function _init(){
		//Hook called at the beginning of self::run();
	}

	protected function _createController($controllerName){
		require_once $this->router->getControllerPath();
		return new $controllerName($this->view);
	}

	protected function _executeControllerAction($controller, $actionName){
		$controller->$actionName();
	}
}