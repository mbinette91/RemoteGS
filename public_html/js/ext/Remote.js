
},{"./config.coffee":1}],7:[function(require,module,exports){
(function() {
	var Api, Remote;

	Api = require('./api.coffee');

	
	Remote = (function() {
		function Remote() {
			var _this = this;
			_.bindAll(this);
			
			GS.on('remote:data', this.handleData);
			
			Api.on('notification', function(text) {
				return GS.trigger('remote:broadcast', {
					type: 'notification',
					message: text
				});
			});
	
			Api.on('player:songStatus', function(status) {
				return _this.sendCurrentSong(new Request({'broadcast':true}));
			});

			Api.on('player:change', function(player) {
				return _this.sendCurrentStatus(new Request({'broadcast':true}));
			});
		
			Api.on('player:queue:change', function(queue) {
				return _this.sendCurrentQueue(new Request({'broadcast':true}));
			});
		}

		Remote.prototype.handleData = function(request) {
			var args, command;
			this.fake();
			command = request.command;
			args = request.args;
			switch (command) {
				case 'getcurrentsong':
					return this.sendCurrentSong(request);
				case 'getcurrentqueue':
					return this.sendCurrentQueue(request);
				case 'playpause':
					return Api.togglePlayPause();
				case 'skipb':
					return Api.previous();
				case 'skipf':
					return Api.next();
				case 'seekto':
					return Api.seekTo(args['currentTime']);
				case 'setvolume':
					return Api.setVolume(args['volume']);
				case 'toggleshuffle':
					return Api.toggleShuffle();
				case 'togglerepeat':
					return Api.toggleRepeat();
				case 'playsong':
					return Api.playSong(args['queueIndex']);
				case 'remove':
					return Api.removeSong(args['queueIndex']);
				case 'clear':
					return Api.clearQueue();
				case 'add':
					toPlay = args['toPlay'];
					pos = args['pos'];
					playNow = args['playNow'];
					switch (toPlay) {
						case 'song':
							id = args['song_id'];
							return Api.addSongs(id, pos, playNow);
						case 'album':
							id = args['album_id'];
							return Api.addAlbum(id, pos, playNow);
						case 'playlist':
							id = args['playlist_id'];
							return Api.addPlaylist(id, pos, playNow);
						case 'library':
							return Api.addLibrary(pos, playNow);
						case 'favorites':
							return Api.addFavorites(pos, playNow);
					}
				default:
					return this.newHandleCommand(request);
			}
		};
		
		Remote.prototype.newHandleCommand = function(request) {
			var command;
			command = request.command;
			if (this.hasOwnProperty(command)) {
				this[command](request);
			}
		};

		Remote.prototype.sendCurrentQueue = function(request) {
			return request.respond('currentqueue', {
				queue: Api.getCurrentQueue()
			});
		};
		
		Remote.prototype.getCurrentStatus = function() {
			var args = $.extend(Api.getPlayerState(), Api.getPlaybackStatus());
			args['volume'] = Api.getVolume();
			return args;
		};
		
		Remote.prototype.sendCurrentStatus = function(request) {
			var args = this.getCurrentStatus();
			return request.respond('currentstatus', args);
		};
		
		Remote.prototype.sendCurrentSong = function(request) {
			var args = this.getCurrentStatus();
			args['song'] = Api.getCurrentSong() || {};
			return request.respond('currentsong', args);
		};

		Remote.prototype.fake = function() {
			$('.lightbox-interactionTimeout .btn-primary').click();
			return GS.trigger('mousemove');
		};

		return Remote;

	})();

	module.exports = Remote;

}).call(this);