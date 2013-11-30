	Net = (function() {
		Net.prototype.connected = false;

		function Net() {
			_.bindAll(this);
			this.init();
		}

		Net.prototype.init = function() {
			var script,
				_this = this;
			if (!window.io) {
				script = $.getScript(PATH_TO_LIB_SOCKETIO);
				script.done(function() {
					return _this.start();
				});
				return script.fail(function() {
					return _this.init();
				});
			} else {
				return this.start();
			}
		};

		Net.prototype.start = function() {
			var socket,
				_this = this;
			_this.socket = io.connect(GSR_SOCKETIO_HOST);
			socket = _this.socket;
			
			var _initConnect = function(){
				var uid = readCookie('UID');
				var hash = readCookie('hash');
				if(uid && hash)
					socket.emit('gs-register', {uid: uid, hash: hash});
				else
					socket.emit('gs-register');
					
				GSR.setSocket(socket);
			}
			
			socket.on('client-uid', function(data) {
				_this.connected = true;
				GSR.onConnect(data);
				return GS.trigger('remote:connect');
			});
			
			socket.on('heartbeat', function(data) {
				socket.emit('heartbeat');
			});
			
			socket.on('message', function(data) {
				if(data['server'] && data['type'] == 'heartbeat')
					socket.emit('heartbeat')
				return GS.trigger('remote:data', new Request(data));
			});
			
			socket.on('disconnect', function (data) {
				_this.connected = false;
				return GS.trigger('remote:disconnect');
			});
			
			socket.on('already-connected', function (data) {
				_this.connected = false;
				return GS.trigger('remote:already-connected');
			});
			
			socket.on('reconnecting', function() {
				_this.connected = false;
				return GS.trigger('remote:reconnecting');
			});

			socket.on('reconnect', function() {
				_initConnect();
				//Let the `client-uid` answer do that for you!
				////_this.connected = true;
				////return GS.trigger('remote:reconnect');
			});

			GS.on('remote:send', this.send);
			GS.on('remote:broadcast', this.broadcast);

			_initConnect();
			
			return;
		};

		Net.prototype.stop = function() {
			var _ref;
			if ((_ref = this.socket) != null) {
				_ref.disconnect();
			}
			delete io.sockets[GSR_SOCKETIO_HOST];
			return this.connected = false;
		};

		Net.prototype.send = function(message) {
			var _ref;
			return (_ref = this.socket) != null ? _ref.emit('message', message) : void 0;
		};

		Net.prototype.broadcast = function(message) {
			var _ref;
			return (_ref = this.socket) != null ? _ref.emit('broadcast', message) : void 0;
		};

		return Net;

	})();
