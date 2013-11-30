<?PHP

class RemoteController extends Controller{
	public function _init(){
		$this->view->BODY_CLASS = "remote ";
	}

	public function playlistAction(){
		$this->view->TITLE = 'Playlist - '.$this->view->TITLE;
		$this->view->BODY_CLASS .= "playlist";
	}
	
	public function playerAction(){
		$this->view->TITLE = 'Player - '.$this->view->TITLE;
		$this->view->BODY_CLASS .= "player";
	}
}