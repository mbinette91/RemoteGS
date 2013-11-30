function ErrorHandler(app){
	this.app = app;
}

ErrorHandler.prototype.handleUnableToConnect = function(){
	//TO-DO: Unable to connect to server (but not a disconnect, which is handleLostConnection)
	
}
ErrorHandler.prototype.handleLostConnection = function(){
	//Something is wrong..! Quit the application!
	//Probable causes: 	- Physical network problems
	//					- Server went down
	this.app.goto('/', true);
	this.app.remote._groovesharkClients = [];
	this.app.remote.socket.emit('pairinglist');
}
ErrorHandler.prototype.handleInvalidGroovesharkClient = function(){
	//Something is wrong..! Quit the application!
	//Probable causes: 	- GroovesharkClient changed their password
	//					- GroovesharkClient deactivated the remote
	//					- GroovesharkClient closed their tab
	this.app.goto('/', true);
	this.app.remote._groovesharkClients = [];
	this.app.remote._currentGroovesharkClient = 0;
	this.app.remote.socket.emit('pairinglist');
}
ErrorHandler.prototype.handleNoGSClientError = function(){
	//Probable cause: direct link. Just redirect him to the index page.
	window.location.href = "/";
};

ErrorHandler.prototype.handleAlreadyConnected = function(){
	//Probable cause: They have two tabs on the same browser on m.remote.gs
	$('.toast-container .toast').html('You are already connected from this browser! Check your other tabs!');
	$('.toast-container').fadeIn(400);
	$('.goto').removeClass('goto').click(function(){return false;}); //Stop all navigation
};