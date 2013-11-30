	Api = (function() {
		Api.prototype.POSITION_DEFAULT = GS.Services.SWF.playSpecialIndexes.DEFAULT;

		Api.prototype.POSITION_NEXT = GS.Services.SWF.playSpecialIndexes.NEXT;

		Api.prototype.POSITION_LAST = GS.Services.SWF.playSpecialIndexes.LAST;

		Api.prototype.POSITION_REPLACE = GS.Services.SWF.playSpecialIndexes.REPLACE;

		function Api() {
			_.bindAll(this);
			_.extend(this, Backbone.Events);
		}

		Api.prototype.init = function(appModel) {
			var _this = this;
			this.appModel = appModel;
			this.player = this.appModel.get('player');
			GS.on('manatee:change:user', function() {
				return _this.__onUserChange();
			});
			GS.on('player:volumeChange', function(volume) {
				return _this.trigger('player:change:volume', volume);
			});
			GS.on('player:volumeMute', function() {
				var muted;
				muted = !Grooveshark.getIsMuted();
				return _this.trigger('player:change:volume', muted ? 0 : Grooveshark.getVolume());
			});
			GS.on('notification:add', function(notification) {
				return _this.trigger('notification', notification.title || notification.description);
			});
			this.player.on('change:currentQueue', this.__onQueueChange, this);
			this.player.on('change', this.__onPlayerChange, this);
			this.__onQueueChange();
			this.__onPlayerChange({
				changed: this.player.attributes
			});
			return this.__onUserChange();
		};

		Api.prototype.__onUserChange = function() {
			var _ref, _ref1,
				_this = this;
			if (this.user) {
				if ((_ref = this.user.get('favoriteSongs')) != null) {
					_ref.off(null, this.__onFavoritesChange);
				}
				if ((_ref1 = this.user.get('library')) != null) {
					_ref1.off(null, this.__onLibraryChange);
				}
			}
			return this.__getUser().then(function(user) {
				var favsPromise, libraryPromise;
				_this.user = user;
				favsPromise = user.getFavoritesByType('Songs');
				libraryPromise = user.getLibrary();
				favsPromise.then(function(favoriteSongs) {
					if (_this.user === user) {
						favoriteSongs.off(null, _this.__onFavoritesChange);
						return favoriteSongs.on('add remove', _this.__onFavoritesChange);
					}
				});
				libraryPromise.then(function(library) {
					if (_this.user === user) {
						library.off(null, _this.__onLibraryChange);
						return library.on('add remove', _this.__onLibraryChange);
					}
				});
				return $.when(favsPromise, libraryPromise).then(function() {
					return _this.trigger('change:user');
				});
			});
		};

		Api.prototype.__onFavoritesChange = function(song) {
			return this.trigger('user:library:change', new Song(song));
		};

		Api.prototype.__onLibraryChange = function(song) {
			return this.trigger('user:library:change', new Song(song));
		};

		Api.prototype.__onQueueChange = function() {
			var songs, _ref, _ref1;
			if ((_ref = this.currentQueue) != null) {
				_ref.off(null, null, this);
			}
			if ((_ref1 = this.currentQueue) != null) {
				_ref1.get('songs').off(null, null, this);
			}
			this.currentQueue = this.player.get('currentQueue');
			if (this.currentQueue != null) {
				this.currentQueue.on('change', this.__onQueueAttributesChange, this);
				songs = this.currentQueue.get('songs');
				songs.on('add remove reset', _.debounce(this.__onQueueSongsChange, 100), this);
				this.__onQueueSongsChange();
				return this.__onQueueAttributesChange({
					changed: this.currentQueue.attributes
				});
			}
		};

		Api.prototype.__onQueueSongsChange = function() {
			return this.trigger('player:queue:change', this.getCurrentQueue());
		};

		Api.prototype.__onQueueAttributesChange = function(queue) {
			var broadcastListenerChanged, changed, isBroadcastListener, songStatus, update, _ref, _ref1;
			changed = queue.changed;
			isBroadcastListener = typeof GS.isBroadcastListener === "function" ? GS.isBroadcastListener() : void 0;
			broadcastListenerChanged = isBroadcastListener !== this._isBroadcastListener;
			if (broadcastListenerChanged) {
				this._isBroadcastListener = isBroadcastListener;
			}
			update = {};
			if (changed.hasOwnProperty('autoplayEnabled')) {
				update.radio = changed.autoplayEnabled;
			}
			if (changed.hasOwnProperty('isBroadcasting')) {
				update.broadcaster = changed.isBroadcasting;
			}
			if (broadcastListenerChanged) {
				update.broadcastListener = isBroadcastListener;
			}
			if (changed.hasOwnProperty('repeatMode')) {
				update.repeat = changed.repeatMode;
			}
			if (changed.hasOwnProperty('shuffleEnabled')) {
				update.shuffle = changed.shuffleEnabled;
			}
			if (changed.hasOwnProperty('activeSong')) {
				update.song = QueueSong.fromSingle(changed.activeSong);
				if ((_ref = this._activeSong) != null) {
					_ref.off(null, null, this);
				}
				this._activeSong = changed.activeSong;
				if ((_ref1 = changed.activeSong) != null) {
					_ref1.on('change:smile change:frown', this.__onActiveSongAttributesChange, this);
				}
				songStatus = {
					song: QueueSong.fromSingle(changed.activeSong),
					playing: this.player.get('playStatus') === 'playing'
				};
				this.trigger('player:songStatus', songStatus);
			}
			if (!$.isEmptyObject(update)) {
				return this.trigger('player:change', update);
			}
		};

		Api.prototype.__onActiveSongAttributesChange = function(song) {
			return this.trigger('player:change', {
				song: QueueSong.fromSingle(song)
			});
		};

		Api.prototype.__onPlayerChange = function(player) {
			var changed, keys, legacyUpdate, loading, oldPosition, playStatus, update, _ref;
			changed = player.changed;
			update = {};
			if (changed.hasOwnProperty('playStatus')) {
				playStatus = Grooveshark.getCurrentSongStatus().status;
				loading = playStatus === 'loading' || playStatus === 'buffering';
				update.loading = loading;
				update.playing = loading || playStatus === 'playing';
			}
			if (changed.hasOwnProperty('position')) {
				oldPosition = this._playerPosition || 0;
				this._playerPosition = changed.position;
				if (!((0 <= (_ref = changed.position - oldPosition) && _ref <= SECOND))) {
					update.position = changed.position;
				}
			}
			if (changed.hasOwnProperty('duration')) {
				update.duration = changed.duration;
			}
			if (changed.hasOwnProperty('volume') || changed.hasOwnProperty('isMuted')) {
				update.volume = this.getVolume();
			}
			if (!$.isEmptyObject(update)) {
				this.trigger('player:change', update);
			}
			keys = Object.keys(update);
			if (_.any(['loading', 'playing', 'position', 'duration'], function(x) {
				return __indexOf.call(keys, x) >= 0;
			})) {
				playStatus = Grooveshark.getCurrentSongStatus().status;
				loading = playStatus === 'loading' || playStatus === 'buffering';
				legacyUpdate = {};
				legacyUpdate.isLoading = loading;
				legacyUpdate.isPlaying = loading || playStatus === 'playing';
				legacyUpdate.position = this.player.get('position');
				legacyUpdate.duration = this.player.get('duration');
				return this.trigger('player:playbackStatus', legacyUpdate);
			}
		};

		/*
		Public Api
		*/


		Api.prototype.play = function() {
			return Grooveshark.play();
		};

		Api.prototype.pause = function() {
			return Grooveshark.pause();
		};

		Api.prototype.togglePlayPause = function() {
			return Grooveshark.togglePlayPause();
		};

		Api.prototype.previous = function() {
			return Grooveshark.previous();
		};

		Api.prototype.next = function() {
			return Grooveshark.next();
		};

		Api.prototype.seekTo = function(position) {
			return Grooveshark.seekToPosition(position);
		};

		Api.prototype.toggleShuffle = function() {
			return GS.trigger('player:shuffle');
		};

		Api.prototype.toggleRepeat = function() {
			return GS.trigger('player:repeat');
		};

		Api.prototype.toggleRadio = function() {
			return GS.trigger('player:radio');
		};

		Api.prototype.getIsPlaying = function() {
			return Grooveshark.getCurrentSongStatus().status === 'playing';
		};

		Api.prototype.getVolume = function() {
			return Grooveshark.getVolume();
		};

		Api.prototype.setVolume = (function() {
			var setVolume;
			setVolume = function(volume) {
				return Grooveshark.setVolume(Math.max(0, volume));
			};
			return _.throttle(setVolume, 300);
		})();

		Api.prototype.getPlayerState = function() {
			var _ref, _ref1, _ref2;
			return {
				radioOn: ((_ref = this.currentQueue) != null ? _ref.get('autoplayEnabled') : void 0) || false,
				repeat: ((_ref1 = this.currentQueue) != null ? _ref1.get('repeatMode') : void 0) || 0,
				shuffleOn: ((_ref2 = this.currentQueue) != null ? _ref2.get('shuffleEnabled') : void 0) || false
			};
		};

		Api.prototype.getPlaybackStatus = function() {
			var loading, playStatus;
			playStatus = Grooveshark.getCurrentSongStatus().status;
			loading = playStatus === 'loading' || playStatus === 'buffering';
			return {
				isLoading: loading,
				isPlaying: loading || playStatus === 'playing',
				position: this.player.get('position'),
				duration: this.player.get('duration')
			};
		};

		Api.prototype.getPlayer = function() {
			var loading, playStatus;
			playStatus = Grooveshark.getCurrentSongStatus().status;
			loading = playStatus === 'loading' || playStatus === 'buffering';
			return {
				radio: this.currentQueue.get('autoplayEnabled'),
				repeat: this.currentQueue.get('repeatMode'),
				shuffle: this.currentQueue.get('shuffleEnabled'),
				broadcaster: typeof GS.isBroadcaster === "function" ? GS.isBroadcaster() : void 0,
				broadcastListener: typeof GS.isBroadcastListener === "function" ? GS.isBroadcastListener() : void 0,
				loading: loading,
				playing: loading || playStatus === 'playing',
				position: this.player.get('position'),
				duration: this.player.get('duration'),
				volume: this.getVolume(),
				song: this.getCurrentSong()
			};
		};

		Api.prototype.playSong = function(queueIndex) {
			return GS.trigger('player:playSong', Number(queueIndex));
		};

		Api.prototype.removeSong = function(queueIndex) {
			return this.removeSongs([queueIndex]);
		};

		Api.prototype.removeSongs = function(queueIndexes) {
			var gsSongs, i, song, swfSongs, _i, _ref;
			queueIndexes = queueIndexes.map(function(index) {
				return Number(index);
			});
			swfSongs = GS.Services.SWF.getCurrentQueue().songs.filter(function(song) {
				var _ref;
				return _ref = song.queueSongID, __indexOf.call(queueIndexes, _ref) >= 0;
			});
			gsSongs = (function() {
				var _i, _len, _results;
				_results = [];
				for (_i = 0, _len = swfSongs.length; _i < _len; _i++) {
					song = swfSongs[_i];
					_results.push(GS.Models.Song.getCached(song.SongID));
				}
				return _results;
			})();
			for (i = _i = 0, _ref = gsSongs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
				gsSongs[i].set('queueSongID', swfSongs[i].queueSongID);
			}
			return GS.trigger('player:removeSongs', gsSongs);
		};

		Api.prototype.clearQueue = function() {
			return GS.trigger('player:clear');
		};

		Api.prototype.getCurrentQueue = function() {
			var gsQueue, queue, _ref;
			gsQueue = ((_ref = this.currentQueue) != null ? _ref.get('songs') : void 0) || [];
			queue = QueueSong.fromCollection(gsQueue);
			return queue;
		};

		Api.prototype.getCurrentSong = function() {
			var gsSong, _ref;
			gsSong = (_ref = this.currentQueue) != null ? _ref.get('activeSong') : void 0;
			if (gsSong == null) {
				return {};
			}
			return QueueSong.fromSingle(gsSong);
		};

		Api.prototype.voteForSong = function(queueSongId, vote) {
			return GS.trigger('player:voteSong', queueSongId, vote);
		};

		Api.prototype.voteForCurrentSong = function(vote) {
			return Grooveshark.voteCurrentSong(vote);
		};

		Api.prototype.addSongs = function(ids, pos, playNow) {
			var id, req, reqs, songs, _i, _len;
			songs = [];
			reqs = [];
			if (!_.isArray(ids)) {
				ids = [ids];
			}
			for (_i = 0, _len = ids.length; _i < _len; _i++) {
				id = ids[_i];
				req = GS.Models.Song.get(id);
				req.then(function(song) {
					return songs.push(song);
				});
				reqs.push(req);
			}
			return $.when.apply($, reqs).then(function() {
				return GS.trigger("player:addSongs", songs, pos, playNow);
			});
		};

		Api.prototype.addAlbum = function(id, pos, playNow) {
			return GS.Models.Album.get(id).then(function(album) {
				return album.getSongs().then(function(songs) {
					return GS.trigger("player:addSongs", songs.toArray(), pos, playNow, new GS.Models.PlayContext(album));
				});
			});
		};

		Api.prototype.addPlaylist = function(id, pos, playNow) {
			return GS.Models.Playlist.get(id).then(function(playlist) {
				return playlist.getSongs().then(function(songs) {
					return GS.trigger("player:addSongs", songs.toArray(), pos, playNow, new GS.Models.PlayContext(playlist));
				});
			});
		};

		Api.prototype.addLibrary = function(pos, playNow) {
			var _this = this;
			return this.getUserLibrarySongs().then(function(songs) {
				var ids;
				ids = songs.map(function(song) {
					return song.songId;
				});
				return _this.addSongs(ids, pos, playNow);
			});
		};

		Api.prototype.addFavorites = function(pos, playNow) {
			var _this = this;
			return this.getUserFavoriteSongs().then(function(songs) {
				var ids;
				ids = songs.map(function(song) {
					return song.songId;
				});
				return _this.addSongs(ids, pos, playNow);
			});
		};

		Api.prototype.getAlbumSongs = function(id) {
			var _this = this;
			return GS.Models.Album.get(id).pipe(function(album) {
				return mapGsSongsDfd(album.getSongs()).pipe(function(songs) {
					var a;
					a = Album.fromCollection([album])[0];
					a.songs = songs;
					return a;
				});
			});
		};

		Api.prototype.getArtistAlbums = function(id) {
			var _this = this;
			return GS.Models.Artist.get(id).pipe(function(artist) {
				return $.when(artist.getAllAlbums(), artist.getAlbums()).pipe(function() {
					var a, albums, fullAlbums, gsAlbums, others, singlesEPs, yearComparator;
					yearComparator = function(album) {
						var year;
						year = album.attributes.Year;
						if (year) {
							return 1e4 - year;
						} else {
							return 0;
						}
					};
					gsAlbums = new GS.Models.Collections.Albums;
					if (artist.get('hasReleaseTypes')) {
						fullAlbums = new GS.Models.Collections.Albums(artist.get("fullAlbums").filter(GS.Models.Album.hasSongsFilter));
						singlesEPs = new GS.Models.Collections.Albums(artist.get("singlesEPs").filter(GS.Models.Album.hasSongsFilter));
						others = new GS.Models.Collections.Albums(artist.get("others").filter(GS.Models.Album.hasSongsFilter));
						fullAlbums.comparator = yearComparator;
						fullAlbums.sort();
						singlesEPs.comparator = yearComparator;
						singlesEPs.sort();
						gsAlbums.add(fullAlbums.models);
						gsAlbums.add(singlesEPs.models);
						gsAlbums.add(others.models);
					} else {
						albums = new GS.Models.Collections.Albums(artist.get('albums').filter(GS.Models.Album.hasSongsFilter));
						albums.comparator = GS.Models.Album.experimentalNiftyComparator;
						if (albums.comparator != null) {
							albums.sort();
						}
						gsAlbums.add(albums.models);
					}
					a = Artist.fromCollection([artist])[0];
					a.albums = Album.fromCollection(gsAlbums);
					return a;
				});
			});
		};

		Api.prototype.getPlaylistSongs = function(id) {
			var _this = this;
			return GS.Models.Playlist.get(id).pipe(function(playlist) {
				return mapGsSongsDfd(playlist.getSongs()).pipe(function(songs) {
					var p;
					p = Playlist.fromCollection([playlist])[0];
					p.songs = songs;
					return p;
				});
			});
		};

		Api.prototype.addSongsToPlaylist = function(playlistId, songIds) {
			var reqs, songId,
				_this = this;
			reqs = (function() {
				var _i, _len, _results;
				_results = [];
				for (_i = 0, _len = songIds.length; _i < _len; _i++) {
					songId = songIds[_i];
					_results.push(GS.Models.Song.get(songId));
				}
				return _results;
			})();
			return $.when(reqs).then(function() {
				return GS.Models.Playlist.get(playlistId).then(function(playlist) {
					return playlist.addSongs(songIds);
				});
			});
		};

		Api.prototype.addAlbumToPlaylist = function(playlistId, albumId) {
			var _this = this;
			return this.getAlbumSongs(albumId).then(function(album) {
				var song;
				return _this.addSongsToPlaylist(playlistId, (function() {
					var _i, _len, _ref, _results;
					_ref = album.songs;
					_results = [];
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						song = _ref[_i];
						_results.push(song.songId);
					}
					return _results;
				})());
			});
		};

		Api.prototype.search = function(query) {
			var _this = this;
			return GS.Services.API.getResultsFromSearch(query, ['Songs', 'Albums', 'Artists'], false).pipe(function(response) {
				var result;
				result = response.result;
				return {
					songs: result.Songs ? Song.fromCollection(new GS.Models.Collections.Songs(result.Songs)) : void 0,
					albums: result.Albums ? Album.fromCollection(new GS.Models.Collections.Albums(result.Albums)) : void 0,
					artists: result.Artists ? Artist.fromCollection(new GS.Models.Collections.Artists(result.Artists)) : void 0
				};
			});
		};

		Api.prototype.getSearchSuggestions = function(query) {
			return GS.Services.API.getAutocomplete(query, "artist").pipe(function(suggestions) {
				var suggestion, _i, _len, _results;
				_results = [];
				for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
					suggestion = suggestions[_i];
					_results.push(suggestion.ArtistName);
				}
				return _results;
			});
		};

		Api.prototype.getUserLibrarySongs = function(userId) {
			var _this = this;
			return this.__getUser(userId).pipe(function(user) {
				var libraryClone;
				libraryClone = new GS.Models.Collections.Songs(user.get('library').models);
				libraryClone.comparator = _.getModelSort("TSAdded");
				libraryClone.sort();
				return Song.fromCollection(libraryClone);
			});
		};

		Api.prototype.getUserFavoriteSongs = function(userId) {
			var _this = this;
			return this.__getUser(userId).pipe(function(user) {
				var favClone;
				favClone = new GS.Models.Collections.Songs(user.get('favoriteSongs').models);
				favClone.comparator = _.getModelSort("TSAdded");
				favClone.sort();
				return Song.fromCollection(favClone);
			});
		};

		Api.prototype.getFavoritePlaylists = function(userId) {
			var _this = this;
			return this.__getUser(userId).pipe(function(user) {
				var playlists;
				playlists = user.get('favoritePlaylists') || new GS.Models.Collections.Playlists;
				return Playlist.fromCollection(playlists);
			});
		};

		Api.prototype.getUserPlaylists = function(userId) {
			var _this = this;
			return this.__getUser(userId).pipe(function(user) {
				var playlists;
				playlists = user.get('playlists') || new GS.Models.Collections.Playlists;
				return Playlist.fromCollection(playlists);
			});
		};

		Api.prototype.toggleSongInLibrary = function(songId) {
			var _this = this;
			if (!this.user) {
				return;
			}
			return GS.Models.Song.get(songId).then(function(song) {
				var library;
				library = _this.user.get('library');
				if (library.contains(song)) {
					return _this.user.removeSongsFromLibrary([songId]);
				} else {
					return _this.user.addSongsToLibrary([songId]);
				}
			});
		};

		Api.prototype.toggleSongInFavorites = function(songId) {
			var _this = this;
			if (!this.user) {
				return;
			}
			return GS.Models.Song.get(songId).then(function(song) {
				var favs;
				favs = _this.user.get('favoriteSongs');
				if (favs.contains(song)) {
					return _this.user.unfavorite('Songs', [songId]);
				} else {
					return _this.user.favorite('Songs', [songId]);
				}
			});
		};

		Api.prototype.getAlbumArtUrl = function() {
			return GS.Models.Album.artPath;
		};

		Api.prototype.getArtistArtUrl = function() {
			return GS.Models.Artist.artPath;
		};

		Api.prototype.__getUser = function(userId) {
			if (!userId) {
				userId = GS.getLoggedInUserID();
			}
			return GS.Models.User.get(userId);
		};

		return Api;

	})();