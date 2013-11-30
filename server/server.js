var app = require('http').createServer()
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , mysql = require("mysql2")
  , crypto = require('crypto');

var CONNECTION = mysql.createConnection({ user: 'root', password: '', database: 'remote_gs'});

app.listen(8080);

function HandleDBError(err, w){
	console.log(w)
	console.log(err)
	return;
}

function Log(client, event_type, event_descr){
	event_descr = event_descr? event_descr : '';
	CONNECTION.query('INSERT INTO EVENT_LOG(CLIENT_ID, EVENT_TYPE, EVENT_DESC) VALUES('+(client? client.id : 0)+', "'+event_type+'", "'+event_descr+'")');
}

function PairClients(remote, grooveshark){
	CONNECTION.query('INSERT INTO CLIENT_PAIRING(REMOTE_ID, GROOVESHARK_ID) VALUES('+remote.id+', '+grooveshark.id+')', function(err, rows) {
		Log(remote, 'pairing', 'From: PairClients, PairedTo: '+grooveshark.id+', WithPassword: '+(grooveshark.hasPassword()? 'YES' : 'NO'));
	});
	remote.linkWith(grooveshark);
}

function GetClient(socket, type, id, hash, callback){
	var client = null;
	var newCallback = function(client){
		var finalCallback = function(client){
			client.socket = socket;
			socket.client = client; //Needed when answering calls after the initial connection
			callback(client);
		}
		if(client == null){ //Create a new client
			client = type.create(finalCallback);
		}
		else{ 
			finalCallback(client);
		}
	};
	if(id && hash){
		client = RemoteClient.get(id); //Check if there's a remote connected with that ID
		if(!client) client = GroovesharkClient.get(id); //Check if there's a GS connected with that ID
		if(!client || !client.socket){ //This id is not connected, then load it.
			client = type.load(id, hash, newCallback);
		}
		else{ //Double check we are still communicating with that client.
			var has_answered = false;
			setTimeout(function(){client.socket.emit('heartbeat');},1000); //Wait a second before sending out heartbeat
			client.socket.once('heartbeat', function(){
				has_answered = true;
				if(socket.id != client.socket.id)
					socket.emit('already-connected');
			});
			setTimeout(function(){
				if(!has_answered){
					client.kill(); //Kill the client
					client = type.load(id, hash, newCallback); //(Re)Create the client..!
				}
			}, 5000); //Wait 5 (well... 4) seconds before declaring him dead!
		}
	}
	else{
		newCallback(null);
	}
	return;
}

/* Generic Clients */
function Client(id, hash, name, password, activated){
	this.id = id;
	this.hash = hash;
	this.name = name;
	this.password = password;
	this.activated = activated;
	this.partners = {};
}
Client.DBClientType = -1;
Client.DEFAULT_NAME = "MyClient";
Client.create = function(callback){
	var Class = this; //Static context
	var hash = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2); //Random hash
	CONNECTION.query('INSERT INTO CLIENT(CLIENT_TYPE, CLIENT_HASH, CLIENT_NAME) VALUES('+Class.DBClientType+', "'+hash+'","'+Class.DEFAULT_NAME+'")', function(err, rows) {
		if(err)
			return HandleDBError(err);
		Class.load(rows['insertId'], hash, function(client){
			Log(client, 'create-client');
			if(callback)
				callback(client);
		});
	});
	return;
}
Client.load = function(id, hash, callback){
	var Class = this; //Static context
	id = parseInt(id) || 0;
	if(id <= 0)
		return callback(null);
	CONNECTION.query('SELECT * FROM CLIENT WHERE CLIENT_TYPE = '+Class.DBClientType+' AND ID = '+id+' AND CLIENT_HASH = "'+hash+'"', function(err, rows) {
		if(err)
			return HandleDBError(err, 'Client.load');
		if(rows.length == 1){
			data = rows[0];
			var client = new Class(data['ID'], data['CLIENT_HASH'], data['CLIENT_NAME'], data['CLIENT_PASSWORD'], data['CLIENT_ACTIVATED']);
			Log(client, 'load-client');
			//Load partners
			var startQuery = 'SELECT GROOVESHARK_ID AS PARTNER_ID FROM CLIENT_PAIRING WHERE REMOTE_ID = '; //Assume you are a remote
			var PartnerClass = GroovesharkClient;
			if(data['CLIENT_TYPE'] == GroovesharkClient.DBClientType){
				startQuery = 'SELECT REMOTE_ID AS PARTNER_ID FROM CLIENT_PAIRING WHERE GROOVESHARK_ID = '; //Nope!
				PartnerClass = RemoteClient;
			}
			CONNECTION.query(startQuery+id+'', function(err, rows) {
				if(err)
					return HandleDBError(err, 'Client.load (Partners)');
				for(i in rows){
					var p_id = rows[i]['PARTNER_ID'];
					partner = PartnerClass.get(p_id);
					if(partner){
						partner.linkWith(client);
					}
				}
				if(callback)
					callback(client);
			});
		}
		else if(callback)
			callback(client);
	});
	return;
}
Client.remove = function(client){
	var Class = this; //Static context
	delete Class._instances[client.id];
}
Client.get = function(uid){
	var Class = this; //Static context
	return Class._instances[uid];
}
Client.prototype.kill = function(){
	for(i in this.partners)
		this.unlinkWith(this.partners[i]);
	this.constructor.remove(this);
};
Client.prototype.linkWith = function(client){
	this.partners[client.id] = client; //They can communicate with each others
	client.partners[this.id] = this; //They can communicate with each others
}
Client.prototype.unlinkWith = function(client){
	if(this.partners[client.id])
		this.partners[client.id].socket.emit('message', {type:'updatepairinglist'}); //Last message before our friendship dies! :-(
	if(client.partners[this.id])
		client.partners[this.id].socket.emit('message', {type:'updatepairinglist'}); //Last message before our friendship dies! :-(
	delete this.partners[client.id];
	delete client.partners[this.id];
}

/* RemoteClients */
function RemoteClient(id, hash, name, password, activated){
	Client.call(this, id, hash, name, password, activated);
	RemoteClient._instances[this.id] = this;
}
RemoteClient.create = Client.create;
RemoteClient.load = Client.load;
RemoteClient.get = Client.get;
RemoteClient.remove = Client.remove;
RemoteClient.prototype = new Client();
RemoteClient.prototype.constructor = RemoteClient;
RemoteClient._instances = {};
RemoteClient.DBClientType = 2;
RemoteClient.DEFAULT_NAME = "MyRemote";

/* GroovesharkClients */
function GroovesharkClient(id, hash, name, password, activated){
	Client.call(this, id, hash, name, password, activated);
	GroovesharkClient._instances[this.id] = this;
}
GroovesharkClient.create = Client.create;
GroovesharkClient.load = Client.load;
GroovesharkClient.get = Client.get;
GroovesharkClient.remove = Client.remove;
GroovesharkClient.prototype = new Client();
GroovesharkClient.prototype.constructor = GroovesharkClient;
GroovesharkClient._instances = {};
GroovesharkClient.DBClientType = 1;
GroovesharkClient.DEFAULT_NAME = "MyGrooveshark";

GroovesharkClient.prototype.setName = function(name){
	var pattern = /^[A-Za-z0-9' _?!-]{1,25}$/g;
	if(pattern.test(name));
		this.name = name;
};

GroovesharkClient.prototype.checkPassword = function(password){
	newHash = crypto.createHash('md5').update(password).digest("hex");
	return newHash == this.password;
}

GroovesharkClient.prototype.setPassword = function(password){
	if(password){
		newHash = crypto.createHash('md5').update(password).digest("hex");
		oldHash = this.password;
		if(newHash != oldHash){
			this.password = newHash;
			this.clearPartners();
		}
	}
	else
		this.password = '';
};

GroovesharkClient.prototype.setActivated = function(activated){
	this.activated = (activated? 1 : 0)
};

GroovesharkClient.prototype.update = function(){
	var _this = this;
	CONNECTION.query('UPDATE CLIENT SET CLIENT_NAME = "'+this.name+'", CLIENT_PASSWORD = "'+this.password+'", CLIENT_ACTIVATED = '+this.activated+" WHERE ID = "+this.id, function(err, rows) {
		if(err)
			return HandleDBError(err, 'GroovesharkClient.prototype.update');
		_this.broadcast('message', {type:'updatepairinglist'}); //Broadcast to absolutely everyone even if they're not currently connected to you. They might have to update their "Active Browsers" list!
	});
}

GroovesharkClient.prototype.clearPartners = function(){
	//Clears DB and RAM
	var _this = this;
	CONNECTION.query('DELETE FROM CLIENT_PAIRING WHERE GROOVESHARK_ID = '+_this.id, function(err, rows) {
		Log(_this, 'clear_pairings', 'From: GroovesharkClient::clearPartners');
		_this.broadcast('message', {type:'updatepairinglist'});
	});
	for(i in this.partners){
		this.unlinkWith(this.partners[i]);
	}
	this.partners = {};
};

GroovesharkClient.prototype.hasPassword = function(){
	return this.password != null && this.password != '';
}
GroovesharkClient.prototype.broadcast = function(command, data){
	data = data || {};
	for(i in this.partners){
		data['to'] = this.partners[i].id;
		this.partners[i].socket.emit(command, data);
	}
}

function BindMessage(CLIENT, TypeOfPartners){
	CLIENT.socket.on('message', function (data) {
		if(! data['to'])
			return;
		var to_id = data['to'].toString();
		data['from'] = CLIENT.id;
		var partner = TypeOfPartners.get(to_id);
		if(partner && CLIENT.partners[partner.id] && CLIENT.partners[partner.id].activated){
				partner_socket = partner.socket;
				partner_socket.emit('message', data);
		}
		else{
			CLIENT.socket.emit('invalid-receiver', data);
		}
	});
}

function __initRemoteClient(CLIENT){
	var socket = CLIENT.socket;
	
	BindMessage(CLIENT, GroovesharkClient);
	
	//List pairings
	var _refreshPairings = function (data) {
		var clients = []
		for(i in CLIENT.partners){
			//Send them anyway, but tell the client they are deactivated
			//if(CLIENT.partners[i].activated){ 
				var uid = CLIENT.partners[i].id;
				var name = CLIENT.partners[i].name;
				var activated = CLIENT.partners[i].activated;
				clients.push({UID:uid, name:name, activated:activated});
			//}
		}
		
		socket.emit('message', { type: 'pairinglist', clients: clients });
	}
	socket.on('pairinglist', _refreshPairings);
	
	//Pairing
	socket.on('pairing', function (data) {
		var CLIENT = socket.client;
		var to_id = data['to'].toString();
		var partner = GroovesharkClient.get(to_id);
		if(partner){
			if(!CLIENT.partners[partner.id]){
				if(!(partner.hasPassword() && !data['password'])){
					if(!partner.hasPassword() || partner.checkPassword(data['password'])){
						PairClients(CLIENT, partner);
						socket.emit('message', { event: 'pairing', is_paired: true, UID: to_id, name: partner.name, activated: partner.activated });
					}
					else{
						socket.emit('message', { event: 'pairing', hasPassword:partner.hasPassword(), wrongPassword: true, is_paired: false });
					}
				}
				else{ //You have to ask for a password
					socket.emit('message', { event: 'pairing', hasPassword:partner.hasPassword(), is_paired: false });
				}
			}
			else{
				socket.emit('message', { event: 'pairing', is_paired: false, is_already_paired: true });
			}
		}
		else{
			socket.emit('message', { event: 'pairing', is_paired: false });
		}
	}); //Ask for a password or whatever eventually
	
	socket.on('disconnect', function () {
		CLIENT.kill();
	});
	
	socket.emit('client-uid', {uid: CLIENT.id, hash: CLIENT.hash });
	_refreshPairings();
}

function __initGroovesharkClient(CLIENT){
	var socket = CLIENT.socket;

	BindMessage(CLIENT, RemoteClient);
	
	socket.on('broadcast', function (data) {
		var CLIENT = socket.client;
		data['from'] = CLIENT.id;
		//TO-DO: Don't broadcast to everyone who is your partner, but only to those who are CURRENTLY CONNECTED TO YOU. Because that's a broadcast coming from the GSClient (queue, current-song, etc).
		CLIENT.broadcast('message', data);
	});

	socket.on('change-name', function (data) {
		CLIENT.setName(data['name']);
		CLIENT.update();
	});
	
	socket.on('change-password', function (data) {
		CLIENT.setPassword(data['password']);
		CLIENT.update();
	});
	
	socket.on('change-activated', function (data) {
		CLIENT.setActivated(data['activated']);
		CLIENT.update();
	});
	
	socket.on('disconnect', function () {
		CLIENT.kill();
	});

	socket.emit('client-uid', {uid: CLIENT.id, hash: CLIENT.hash, name:CLIENT.name, activated:CLIENT.activated, hasPassword:CLIENT.hasPassword() });
	CLIENT.broadcast('message', {type:'updatepairinglist'}); //Tell all the remotes to update their partnerslist
}

/* Socket.IO Handling */
io.sockets.on('connection', function (socket) {
	var registered = false;
	
	//GroovesharkClient Registration
	socket.on('gs-register', function (data) {
		if(registered)
			return;
		data = data || {};
		var CLIENT = GetClient(socket, GroovesharkClient, data['uid'], data['hash'], function(client){ __initGroovesharkClient(client); });
		registered = true;
	});
	
	//Remote Registration
	socket.on('remote-register', function (data) {
		if(registered)
			return;
		data = data || {};
		var CLIENT = GetClient(socket, RemoteClient, data['uid'], data['hash'], function(client){ __initRemoteClient(client); });
		registered = true;
	});
});
