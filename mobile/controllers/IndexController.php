<?PHP

class IndexController extends Controller{
	public function _init(){
		$this->view->BODY_CLASS = "index";
	}

	public function indexAction(){
		$this->view->TITLE = $this->view->TITLE;
	}
	
	public function pairingAction(){
		$this->view->TITLE = 'Pairing - '.$this->view->TITLE;
		$this->view->BODY_CLASS .= " connect";
	}
	
	public function tutorialAction(){
		$this->view->TITLE = 'Tutorial - '.$this->view->TITLE;
	}
}
