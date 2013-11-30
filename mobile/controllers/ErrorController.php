<?PHP

class ErrorController extends Controller{
	public function indexAction(){
		$this->view->BODY_CLASS = "error";
		$this->view->TITLE .= ' - Error';
	}
}