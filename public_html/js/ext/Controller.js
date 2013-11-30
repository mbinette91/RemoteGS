
/*Old code, but still kinda used, for the cookies and stuff..*/
function Controller(){

};

Controller.prototype.setGroovesharkClient = function(gsClient){
	this.gsClient = gsClient;
	gsClient.socket = this.socket;
}

Controller.prototype.getGroovesharkClient = function(){
	return this.gsClient;
};

Controller.prototype.onConnect = function (data) {
	this.setGroovesharkClient(new GroovesharkClient(data['uid'], data['name'], data['hasPassword'], data['activated']));
	
	createCookie('UID', data['uid'], 365);
	createCookie('hash', data['hash'], 365);
};
Controller.prototype.setSocket = function(socket){
	this.socket = socket;
};
