function GroovesharkClient(uid, name, hasPassword, activated){
	this.uid = uid;
	this.name = name;
	this.hasPassword = hasPassword;
	this.activated = activated;
};

GroovesharkClient.prototype.setName = function(name){
	this.name = name;
	this.socket.emit('change-name', {name: name});
};

GroovesharkClient.prototype.setPassword = function(password){
	this.hasPassword = password && password != '';
	this.socket.emit('change-password', {password: password});
};

GroovesharkClient.prototype.triggerActivated = function(){
	this.activated = !this.activated;
	this.socket.emit('change-activated', {activated: this.activated});
};