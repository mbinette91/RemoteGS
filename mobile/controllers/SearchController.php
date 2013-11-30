<?PHP

class SearchController extends Controller{
	public function _init(){
		$this->view->BODY_CLASS = "search";
	}

	public function indexAction(){
		$this->view->TITLE = 'Search - '.$this->view->TITLE;
	}
}