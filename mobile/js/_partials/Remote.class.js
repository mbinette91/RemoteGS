function GroovesharkClient(remote, uid, name, activated){
	this.uid = uid;
	this.name = name;
	this.activated = activated;
	this.currentSong = {};
	this.currentPlaylist = {};
	this.remote = remote;
}

GroovesharkClient.prototype.removeSongFromPlaylist = function(song_id, callback){
	this.remote.emit('remove', this.uid, {queueIndex: song_id}, callback);
};

GroovesharkClient.prototype.playSongFromPlaylist = function(song_id, callback){
	this.remote.emit('playsong', this.uid, {queueIndex: song_id}, callback);
};

GroovesharkClient.prototype.addSongNextToQueueAndPlay = function(song_id, callback){
	this.remote.emit('add', this.uid, { toPlay: 'song', song_id: song_id, pos: null, playNow: true }, callback);
};

GroovesharkClient.prototype.addSongLastToQueueAndPlay = function(song_id, callback){
	this.remote.emit('add', this.uid, { toPlay: 'song', song_id: song_id, pos: this.currentPlaylist.length+1, playNow: true }, callback);
};

GroovesharkClient.prototype.addSongNextToQueue = function(song_id, callback){ 
	var currentIndex = this.currentPlaylist.length;
	for(i in this.currentPlaylist)
		if(this.currentPlaylist[i].queueIndex == this.currentSong.queueIndex)
			currentIndex=i;
	this.remote.emit('add', this.uid, { toPlay: 'song', song_id: song_id,  pos: parseInt(currentIndex)+1 }, callback);
};

GroovesharkClient.prototype.addSongLastToQueue = function(song_id, callback){ 
	this.remote.emit('add', this.uid, { toPlay: 'song', song_id: song_id,  pos: null }, callback);
};

function Remote(){
	this.observers = [];
	this._groovesharkClients = [];
	this._currentGroovesharkClient = 0;
	
	this.messageId = 0;
	this.callbacks = {};
}
Remote.prototype.init = function(){
	var R = this;
	this.socket = io.connect(Application.BASE_URL+':8080');
	socket = this.socket;
	
	var _initConnect = function(){
		var uid = readCookie('UID');
		var hash = readCookie('hash');
		if(uid && hash)
			socket.emit('remote-register', {uid: uid, hash: hash});
		else
			socket.emit('remote-register');
	};

	this.socket.on('message', function (data) {
		if(data['event'] == 'pairing'){
			if(data['is_paired']){
				var client = new GroovesharkClient(R, data['UID'], data['name'], data['activated']);
				R._groovesharkClients.push(client);
				R.notifyObservers();
			}
			if(R.onConnect)
				R.onConnect(data);
		}
		
		var client = R.getGroovesharkClient(data['from']);
		switch(data.type){
			case 'updatepairinglist':
				socket.emit('pairinglist');
				break;
			case 'pairinglist':
				if(data['clients']){ 
					R._groovesharkClients = [];
					for(i in data['clients']){
						R._groovesharkClients.push(new GroovesharkClient(R, data['clients'][i]['UID'], data['clients'][i]['name'], data['clients'][i]['activated']));
					}
					R.emit('heartbeat', R.getCurrentGroovesharkClient().uid, { }); //Maybe our partner has been removed from the pairinglist :(
				}
				R.notifyObservers();
				break;
			case 'notification':
				R.notifyObservers(data);
				break;
			case 'currentsong':
				client.currentSong = data['song'] || {};
				//DO NOT add "break;". Switch's 'inheritance'.
			case 'currentstatus':
				client.calculatedDuration = data['duration'];
				client.position = data['position'];
				client.isPlaying = data['isPlaying'];
				client.isLoading = data['isLoading'];
				client.repeat = data['repeat'];
				client.shuffleOn = data['shuffleOn'];
				client.volume = data['volume'];
				data['type'] = 'current-song';
				R.notifyObservers(data);
				break;
			case 'currentqueue':
				client.currentPlaylist = data['queue'];
				data['type'] = 'playlist';
				R.notifyObservers(data);
		}
		
		if(data['callback'] && data['original_id']){
			R.callback(data['original_id']);
		}
	});
	
	this.socket.on('client-uid', function (data) {
		var uid = readCookie('UID');
		createCookie('UID', data['uid'], 365);
		createCookie('hash', data['hash'], 365);
		R.notifyObservers();
	});

	this.socket.on('reconnect', function() {
		_initConnect();
		//Let the `client-uid` answer do the init job for you!
	});
	
	this.socket.on('heartbeat', function(data) {
		socket.emit('heartbeat');
	});

	_initConnect();
	
	this.initControls();
}

Remote.prototype.mapSelectorAndCommand = function(selector, command, f){
	var R = this;
	Application.log('Mapping '+selector+' and '+command);
	$('body').delegate(selector, 'click', function(event){
		var client = R._currentGroovesharkClient;
		Application.log('Executing '+command+' on '+selector+' for '+client.uid);
		R.emit(command, client.uid, { }, f);
		event.stopPropagation();
	});
}

Remote.prototype.initControls = function(){
	var R = this;
	this.mapSelectorAndCommand('.playpause', 'playpause');
	this.mapSelectorAndCommand('.player .previous', 'skipb');
	this.mapSelectorAndCommand('.player .next', 'skipf');
	this.mapSelectorAndCommand('.player .shuffle', 'toggleshuffle');
	this.mapSelectorAndCommand('.player .repeat', 'togglerepeat');
	
	$('body').delegate('.player .current-time', 'change', function(event){
		var client = R._currentGroovesharkClient;
		Application.log('Executing seekTime on #slider-fill for '+client.uid);
		var time = $('.player .current-time').val();
		R.emit('seekto', client.uid, { currentTime: time });
	});
	
	$('body').delegate('.player .current-volume', 'change', function(event){
		var client = R._currentGroovesharkClient;
		Application.log('Executing setVolume on #sliderVertical for '+client.uid);
		var volume = $('.player .current-volume').val();
		R.emit('setvolume', client.uid, { volume: volume });
	});
}

Remote.prototype.connectTo = function(UID, password, f){
	this.socket.emit('pairing', { to: UID, password: password } );
	this.onConnect = f;
};

Remote.prototype.refreshCurrentSong = function(){
	this.emit('getcurrentsong', this._currentGroovesharkClient.uid, { });
};

Remote.prototype.refreshPlaylist = function(){
	this.emit('getcurrentqueue', this._currentGroovesharkClient.uid, { });
};

Remote.prototype.addObserver = function(obs){ //Observer pattern
	this.observers.push(obs);
}

Remote.prototype.notifyObservers = function(data){ //Observer pattern
	for(i in this.observers){
		this.observers[i].update(this, data);
	}
};

Remote.prototype.listenTo = function(eventName, callback){ 
	this.socket.on(eventName, callback);
};

Remote.prototype.emit = function(message_type, to, add_args, callback){
	this.messageId++;
	var args = $.extend({ id: this.messageId, to: to, type: message_type }, add_args); 
	if(callback){
		args['callback'] = true;
		this.callbacks[this.messageId+""] = callback;
	}
	this.socket.emit('message', args);
}

Remote.prototype.callback = function(message_id){
	if(typeof this.callbacks[callbackId+""] !== 'undefined')
		this.callbacks[callbackId+""]();
};

Remote.prototype.isConnectedToServer = function(){
	//It's also not connected if the socket is defined but doesn't answer..! But that's handled in the disconnect event (see Application)
	return this.socket;
}

Remote.prototype.isConnectedToGroovesharkClient = function(){
	return this._currentGroovesharkClient;
}

Remote.prototype.getGroovesharkClients = function(){
	return this._groovesharkClients;
};

Remote.prototype.getGroovesharkClient = function(uid){
	for(i in this._groovesharkClients){
		if(this._groovesharkClients[i].uid == uid){
			return this._groovesharkClients[i];
		}
	}
};

Remote.prototype.getCurrentGroovesharkClient = function(){
	return this._currentGroovesharkClient;
};

Remote.prototype.setCurrentGroovesharkClient = function(client){
	this._currentGroovesharkClient = client;
	this.refreshCurrentSong();
	this.refreshPlaylist();
	this.notifyObservers();
};