<?php

class WebsiteApplication extends Application{
	public function _init(){
		//session_start(); //Start session first!
		$this->view->TITLE = 'Remote.GS';
		$this->view->BODY_CLASS = '';
	}
	
	public function getHeaderPath(){
		if(isset($_GET['mode']) && $_GET['mode'] == 'ajax')
			return 'layouts/empty.php';
		else
			return 'layouts/header.php';
	}

	public function getFooterPath(){
		if(isset($_GET['mode']) && $_GET['mode'] == 'ajax')
			return 'layouts/empty.php';
		else
			return 'layouts/footer.php';
	}
}
