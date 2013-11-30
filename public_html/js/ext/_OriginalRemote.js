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
			Api.on('player:change:volume', function(level) {
				return GS.trigger('remote:broadcast', {
					type: 'volume',
					level: level
				});
			});
			Api.on('player:songStatus', function(status) {
				var song;
				song = status.song || {};
				song.type = 'currentsong';
				return GS.trigger('remote:broadcast', song);
			});
			Api.on('player:playbackStatus', function(status) {
				status.type = 'playbackstatus';
				return GS.trigger('remote:broadcast', status);
			});
			Api.on('player:change', function(player) {
				player.type = 'player';
				return GS.trigger('remote:broadcast', player);
			});
			Api.on('player:queue:change', function(queue) {
				return GS.trigger('remote:broadcast', {
					type: 'playqueue',
					queue: queue
				});
			});
			Api.on('user:library:change', function(song) {
				return GS.trigger('remote:broadcast', {
					type: 'togglesonglibrary',
					song: song
				});
			});
			Api.on('user:favorites:change', function(song) {
				return GS.trigger('remote:broadcast', {
					type: 'togglesongfavorite',
					song: song
				});
			});
			Api.on('change:user', function() {
				return GS.trigger('remote:broadcast', {
					type: 'userchanged'
				});
			});
		}

		Remote.prototype.handleData = function(request) {
			var args, command;
			this.fakeActivity();
			command = request.command;
			args = request.args;
			switch (command) {
				case 'control':
					request.command = 'player';
					return this.newHandleCommand(request);
				case 'add':
					request.command = 'queue';
					request.args.unshift('add');
					return this.newHandleCommand(request);
				case 'playfromqueue':
					request.command = 'queue';
					request.args.unshift('play');
					return this.newHandleCommand(request);
				case 'removefromqueue':
					request.command = 'queue';
					request.args.unshift('remove');
					return this.newHandleCommand(request);
				case 'clearplayqueue':
					request.command = 'queue';
					request.args.unshift('clear');
					return this.newHandleCommand(request);
				case 'togglesongfavorite':
					request.args.unshift('togglesongfavorite');
					return this.user(request);
				case 'togglesonglibrary':
					request.args.unshift('togglesonglibrary');
					return this.user(request);
				case 'addsongstoplaylist':
					request.args.unshift('addsongs');
					return this.playlist(request);
				case 'addalbumtoplaylist':
					request.args.unshift('addalbum');
					return this.playlist(request);
				case 'getfullstatus':
					this.sendArtUrls(request);
					this.sendCurrentSong(request);
					this.sendCurrentQueue(request);
					this.sendPlayerState(request);
					this.sendPlaybackStatus(request);
					request.args.unshift('getplaylists');
					return this.user(request);
				case 'getcurrentsong':
					return this.sendCurrentSong(request);
				case 'getplayerstate':
					this.sendCurrentSong(request);
					this.sendPlayerState(request);
					return this.sendPlaybackStatus(request);
				case 'getalbumsongs':
					request.args.unshift('getsongs');
					return this.album(request);
				case 'getartistalbums':
					request.args.unshift('getalbums');
					return this.artist(request);
				case 'getplaylistsongs':
					request.args.unshift('getsongs');
					return this.playlist(request);
				case 'getplaylists':
					request.args.unshift('getplaylists');
					return this.user(request);
				case 'getfavoritesongs':
					request.args.unshift('getfavoritesongs');
					return this.user(request);
				case 'getlibrarysongs':
					request.args.unshift('getlibrarysongs');
					return this.user(request);
				case 'getfavoriteplaylists':
					request.args.unshift('getfavoriteplaylists');
					return this.user(request);
				case 'getvolume':
					request.command = 'player';
					request.args.unshift('getvolume');
					return this.newHandleCommand(request);
				case 'getsearchsuggest':
					return Api.getSearchSuggestions(args.shift()).then(function(suggestions) {
						return request.respond('searchsuggest', {
							artists: suggestions
						});
					});
				case 'version':
					request.command = 'checkversion';
					return this.newHandleCommand(request);
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
			switch (command) {
				case 'getplayer':
					return request.respond('player', Api.getPlayer());
				case 'getarturls':
					return this.sendArtUrls(request);
				case 'getextras':
					return this.sendArtUrls(request);
				case 'getversion':
					return request.respond('version', {
						version: PROTOCOL_VER
					});
				case 'checkversion':
					return request.respond('compatible', {
						isCompatible: true
					});
			}
		};

		Remote.prototype.queue = function(request) {
			var args, id, playNow, pos, toPlay, what, _ref;
			args = request.args;
			what = args.shift();
			switch (what) {
				case 'toggleshuffle':
					return Api.toggleShuffle();
				case 'togglerepeat':
					return Api.toggleRepeat();
				case 'toggleradio':
					return Api.toggleRadio();
				case 'play':
					return Api.playSong(args.shift());
				case 'remove':
					return Api.removeSong(args.shift());
				case 'clear':
					return Api.clearQueue();
				case 'voteforsong':
					return Api.voteForSong(args.shift(), args.shift());
				case 'add':
					toPlay = args.shift();
					_ref = this.getPlayerIndex(args.pop()), pos = _ref[0], playNow = _ref[1];
					switch (toPlay) {
						case 'song':
							id = args.shift();
							return Api.addSongs(id, pos, playNow);
						case 'album':
							id = args.shift();
							return Api.addAlbum(id, pos, playNow);
						case 'playlist':
							id = args.shift();
							return Api.addPlaylist(id, pos, playNow);
						case 'library':
							return Api.addLibrary(pos, playNow);
						case 'favorites':
							return Api.addFavorites(pos, playNow);
					}
			}
		};

		Remote.prototype.player = function(request) {
			var args, what;
			args = request.args;
			what = args.shift();
			switch (what) {
				case 'play':
					return Api.play();
				case 'pause':
					return Api.pause();
				case 'playpause':
					return Api.togglePlayPause();
				case 'skipb':
					return Api.previous();
				case 'skipf':
					return Api.next();
				case 'seekto':
					return Api.seekTo(args.shift());
				case 'voteforcurrentsong':
					return Api.voteForCurrentSong(args.shift());
				case 'volumeup':
					return Api.setVolume(Api.getVolume() + 7);
				case 'volumedown':
					return Api.setVolume(Api.getVolume() - 7);
				case 'setvolume':
					return Api.setVolume(args[0]);
				case 'getvolume':
					return request.respond('volume', {
						level: Api.getVolume()
					});
				case 'getcurrentqueue':
					return this.sendCurrentQueue(request);
				default:
					args.unshift(what);
					return this.queue(request);
			}
		};

		Remote.prototype.album = function(request) {
			var args, id, what;
			args = request.args;
			what = args.shift();
			switch (what) {
				case 'getsongs':
					id = args.shift();
					return Api.getAlbumSongs(id).done(function(album) {
						return request.respond('album', {
							albumId: id,
							artFilename: album.artFilename,
							songs: album.songs
						});
					});
			}
		};

		Remote.prototype.artist = function(request) {
			var args, id, what;
			args = request.args;
			what = args.shift();
			switch (what) {
				case 'getalbums':
					id = args.shift();
					return Api.getArtistAlbums(id).done(function(artist) {
						return request.respond('artist', {
							artistId: id,
							albums: artist.albums
						});
					});
			}
		};

		Remote.prototype.playlist = function(request) {
			var args, id, what;
			args = request.args;
			what = args.shift();
			switch (what) {
				case 'getsongs':
					id = args.shift();
					return Api.getPlaylistSongs(id).done(function(playlist) {
						return request.respond('playlistsongs', {
							id: id,
							songs: playlist.songs
						});
					});
				case 'addsongs':
					return Api.addSongsToPlaylist(args.shift(), args);
				case 'addalbum':
					return Api.addAlbumToPlaylist(args.shift(), args.shift());
			}
		};

		Remote.prototype.user = function(request) {
			var args, what;
			args = request.args;
			what = args.shift();
			switch (what) {
				case 'getlibrarysongs':
					return Api.getUserLibrarySongs().done(function(songs) {
						return request.respond('librarysongs', {
							songs: songs
						});
					});
				case 'getfavoritesongs':
					return Api.getUserFavoriteSongs().done(function(songs) {
						return request.respond('favoritesongs', {
							songs: songs
						});
					});
				case 'getfavoriteplaylists':
					return Api.getFavoritePlaylists().done(function(playlists) {
						return request.respond('favoriteplaylists', {
							playlists: playlists
						});
					});
				case 'getplaylists':
					return Api.getUserPlaylists().done(function(playlists) {
						return request.respond('playlists', {
							playlists: playlists
						});
					});
				case 'togglesonglibrary':
					return Api.toggleSongInLibrary(args.shift());
				case 'togglesongfavorite':
					return Api.toggleSongInFavorites(args.shift());
			}
		};

		Remote.prototype.sendArtUrls = function(request) {
			return request.respond('arturls', {
				albums: Api.getAlbumArtUrl(),
				artists: Api.getArtistArtUrl()
			});
		};

		Remote.prototype.sendCurrentQueue = function(request) {
			return request.respond('playqueue', {
				queue: Api.getCurrentQueue()
			});
		};

		Remote.prototype.sendCurrentSong = function(request) {
			return request.respond('currentsong', Api.getCurrentSong() || {});
		};

		Remote.prototype.sendPlayerState = function(request) {
			return request.respond('playerstate', Api.getPlayerState());
		};

		Remote.prototype.sendPlaybackStatus = function(request) {
			return request.respond('playbackstatus', Api.getPlaybackStatus());
		};

		Remote.prototype.getPlayerIndex = function(position) {
			switch (position) {
				case 'play':
					return [Api.POSITION_DEFAULT, true];
				case 'next':
					return [Api.POSITION_NEXT, false];
				case 'last':
					return [Api.POSITION_LAST, false];
				case 'replace':
					return [Api.POSITION_REPLACE, true];
			}
		};

		Remote.prototype.search = function(request) {
			var query;
			query = request.args.shift();
			return Api.search(query).then(function(results) {
				results.albums = results.albums.slice(0, 5);
				results.artists = results.artists.slice(0, 5);
				return request.respond('searchresults', results);
			});
		};

		Remote.prototype.fakeActivity = function() {
			$('.lightbox-interactionTimeout .btn-primary').click();
			return GS.trigger('mousemove');
		};

		return Remote;

	})();