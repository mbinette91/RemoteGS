;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var uuid;

  uuid = require('./uuid.coffee');

  module.exports = {
    getBrowserId: function() {
      var uid;
      uid = localStorage['gsr_browser_uid'];
      if (!uid) {
        uid = uuid();
        localStorage['gsr_browser_uid'] = uid;
      }
      return uid;
    },
    hasBrowserId: function() {
      return localStorage['gsr_browser_uid'] != null;
    },
    getBrowserName: function() {
      return localStorage['gsr_browser_name'];
    },
    setBrowserName: function(name) {
      localStorage['gsr_browser_name'] = name;
      return GS.trigger('gsremote:sendBrowserInfo', {
        name: name
      });
    },
    setDefaultBrowserName: function() {
      var id, name, userName;
      id = GS.getLoggedInUserID();
      userName = 'Anonymous';
      if (id > -1) {
        userName = GS.Models.User.getCached(id).get('Name');
      }
      userName += userName.charAt(userName.length - 1) === 's' ? "'" : "'s";
      name = "" + userName + " Grooveshark";
      return this.setBrowserName(name);
    },
    hasCustomName: function() {
      var name;
      name = this.getBrowserName();
      return (name != null) && name !== 'Anonymous\' Grooveshark';
    },
    setForceXhr: function(forceXhr) {
      localStorage['gsr_force_xhr'] = forceXhr;
      return GS.trigger('gsremote:config:change:force_xhr', forceXhr);
    },
    getForceXhr: function() {
      var setting;
      setting = localStorage['gsr_force_xhr'] || false;
      if (typeof setting === 'string') {
        return setting = JSON.parse(setting);
      }
    }
  };

}).call(this);


},{"./uuid.coffee":2}],2:[function(require,module,exports){
(function() {
  var BufferClass, i, mathRNG, parse, unparse, uuid, v4, whatwgRNG, _byteToHex, _hexToByte, _rndBytes, _rnds, _rng;

  _rndBytes = new Array(16);

  mathRNG = function() {
    var b, i, r;
    b = _rndBytes;
    i = 0;
    r = void 0;
    while (i < 16) {
      if ((i & 0x03) === 0) {
        r = Math.random() * 0x100000000;
      }
      b[i] = r >>> ((i & 0x03) << 3) & 0xff;
      i++;
    }
    return b;
  };

  if (window.crypto && crypto.getRandomValues) {
    _rnds = new Uint32Array(4);
    whatwgRNG = function() {
      var c;
      crypto.getRandomValues(_rnds);
      c = 0;
      while (c < 16) {
        _rndBytes[c] = _rnds[c >> 2] >>> ((c & 0x03) * 8) & 0xff;
        c++;
      }
      return _rndBytes;
    };
  }

  _rng = whatwgRNG || mathRNG;

  BufferClass = (typeof Buffer === "function" ? Buffer : Array);

  _byteToHex = [];

  _hexToByte = {};

  i = 0;

  while (i < 256) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
    i++;
  }

  parse = function(s, buf, offset) {
    var ii;
    i = (buf && offset) || 0;
    ii = 0;
    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) {
        return buf[i + ii++] = _hexToByte[oct];
      }
    });
    while (ii < 16) {
      buf[i + ii++] = 0;
    }
    return buf;
  };

  unparse = function(buf, offset) {
    var bth;
    i = offset || 0;
    bth = _byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
  };

  v4 = function(options, buf, offset) {
    var ii, rnds;
    i = buf && offset || 0;
    if (typeof options === "string") {
      buf = (options === "binary" ? new BufferClass(16) : null);
      options = null;
    }
    options = options || {};
    rnds = options.random || (options.rng || _rng)();
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    if (buf) {
      ii = 0;
      while (ii < 16) {
        buf[i + ii] = rnds[ii];
        ii++;
      }
    }
    return buf || unparse(rnds);
  };

  uuid = v4;

  uuid.parse = parse;

  uuid.unparse = unparse;

  uuid.BufferClass = BufferClass;

  uuid.mathRNG = mathRNG;

  uuid.whatwgRNG = whatwgRNG;

  module.exports = uuid;

}).call(this);


},{}],3:[function(require,module,exports){
(function() {
  var Album, Api, Artist, HOUR, MINUTE, Model, Playlist, QueueSong, SECOND, Song, mapGsAlbumsDfd, mapGsArtistsDfd, mapGsPlaylistsDfd, mapGsSongsDfd,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SECOND = 1000;

  MINUTE = SECOND * 60;

  HOUR = MINUTE * 60;

  mapGsSongsDfd = function(deffered) {
    var _this = this;
    return deffered.pipe(function(songs) {
      return Song.fromCollection(songs);
    });
  };

  mapGsAlbumsDfd = function(deffered) {
    var _this = this;
    return deffered.pipe(function(albums) {
      return Album.fromCollection(albums);
    });
  };

  mapGsArtistsDfd = function(deffered) {
    var _this = this;
    return deffered.pipe(function(artists) {
      return Artist.fromCollection(artists);
    });
  };

  mapGsPlaylistsDfd = function(deffered) {
    var _this = this;
    return deffered.pipe(function(playlists) {
      return Playlist.fromCollection(playlists);
    });
  };

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

  Model = (function() {
    function Model() {}

    Model.fromSingle = function(gsModel) {
      if (gsModel) {
        return new this(gsModel);
      } else {
        return {};
      }
    };

    Model.fromCollection = function(gsCollection) {
      var _this = this;
      return gsCollection.map(function(model) {
        return _this.fromSingle(model);
      });
    };

    return Model;

  })();

  Song = (function(_super) {
    __extends(Song, _super);

    function Song(gsSong) {
      this.songName = gsSong.get('SongName');
      this.songId = gsSong.get('SongID');
      this.albumName = gsSong.get('AlbumName');
      this.albumId = gsSong.get('AlbumID');
      this.artistName = gsSong.get('ArtistName');
      this.artistId = gsSong.get('ArtistID');
      this.artFilename = gsSong.get('CoverArtFilename');
      this.isFavorite = gsSong.get('isFavorite');
      this.fromLibrary = gsSong.get('fromLibrary');
      this.trackNum = gsSong.get('TrackNum');
    }

    return Song;

  })(Model);

  QueueSong = (function(_super) {
    __extends(QueueSong, _super);

    function QueueSong(gsSong) {
      QueueSong.__super__.constructor.call(this, gsSong);
      this.queueIndex = gsSong.get('queueSongID');
      this.vote = gsSong.get('autoplayVote');
      if (this.vote === 0 && gsSong.get('context').type !== 'radio') {
        this.vote = 1;
      }
    }

    return QueueSong;

  })(Song);

  Album = (function(_super) {
    __extends(Album, _super);

    function Album(gsAlbum) {
      this.albumName = gsAlbum.get('AlbumName');
      this.albumId = gsAlbum.get('AlbumID');
      this.artistName = gsAlbum.get('ArtistName');
      this.artistId = gsAlbum.get('ArtistID');
      this.artFilename = gsAlbum.get('CoverArtFilename');
      this.verified = gsAlbum.get('IsVerified') || 0;
      this.popularity = gsAlbum.get('Popularity');
      this.year = gsAlbum.get('Year');
    }

    return Album;

  })(Model);

  Artist = (function(_super) {
    __extends(Artist, _super);

    function Artist(gsArtist) {
      this.artistName = gsArtist.get('ArtistName');
      this.artistId = gsArtist.get('ArtistID');
    }

    return Artist;

  })(Model);

  Playlist = (function(_super) {
    __extends(Playlist, _super);

    function Playlist(gsPlaylist) {
      this.name = gsPlaylist.get('PlaylistName');
      this.id = gsPlaylist.get('PlaylistID');
      this.isEditable = gsPlaylist.isEditable();
    }

    return Playlist;

  })(Model);

  module.exports = new Api;

}).call(this);


},{}],4:[function(require,module,exports){
(function() {
  var Ui, config, _ref, _ref1, _ref2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  config = require('./config.coffee');

  Ui = (function(_super) {
    __extends(Ui, _super);

    function Ui() {
      _ref = Ui.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Ui.prototype.className = 'user-asset';

    Ui.prototype.id = 'gsr-settings-group';

    Ui.prototype.connected = false;

    Ui.prototype.events = {
      'mouseenter #gsr-settings-button': 'showSettingsDropdown'
    };

    Ui.prototype.initialize = function(connected) {
      var _this = this;
      this.connected = connected || false;
      GS.on('gsremote:connect gsremote:reconnect', function() {
        _this.connected = true;
        return _this.updateText();
      });
      GS.on('gsremote:reconnecting', function() {
        _this.connected = false;
        return _this.updateText();
      });
      $('#header-user-assets').append(this.render().$el);
      return this.updateText();
    };

    Ui.prototype.updateText = function() {
      var text;
      text = 'GSRemote connecting...';
      if (this.connected) {
        text = 'GSRemote';
      }
      return $('#gsr-settings-button .title').text(text);
    };

    Ui.prototype.render = function(evt) {
      this.$el.html('<a id="gsr-settings-button" style="position: relative;display: block;height: 19px;margin-right: 10px;margin-top: 15px;padding: 0 10px;background: none;outline: none;"><span class="title" style="display: inline-block;height: 19px;padding: 0 0 0 7px;margin-right: 5px;float: left;font-size: 12px;font-weight: bold;color: #BBB;text-shadow: 0 1px 0px rgba(0, 0, 0, 0.7);line-height: 19px;">GSRemote connecting...</span><span class="caret" style="top: 9px;display: inline-block;float: left;border-top-color: #BBB" /></a>');
      this.updateText();
      return this;
    };

    Ui.prototype.updateSettingsMenu = function() {
      var items, opts;
      this.settingsMenuOptions = {
        delay: 0,
        notchSize: 6,
        notchX: 16,
        width: 170,
        x: 1,
        y: 30,
        $attached: $('#gsr-settings-button .title'),
        tooltipClass: 'menu user-menu'
      };
      items = [];
      items.push({
        title: 'Pair with device',
        click: function() {
          return GS.trigger('lightbox:open', 'gsrpair');
        }
      });
      items.push({
        title: 'Settings',
        click: function() {
          return GS.trigger('lightbox:open', 'gsrsettings');
        }
      });
      opts = {};
      opts.items = items;
      if (this.settingsMenuTooltip) {
        return this.settingsMenuTooltip.updateMenuOptions(opts.items);
      } else {
        this.settingsMenuTooltip = new GS.Views.Tooltips.Menu(opts);
        this.settingsMenuOptions.views = [this.settingsMenuTooltip];
        return this.settingsMenuOptions.tooltipKey = 'gsr-menu';
      }
    };

    Ui.prototype.showSettingsDropdown = function(evt) {
      var button, _ref1, _ref2;
      if (((_ref1 = this.settingsMenuTooltip) != null ? (_ref2 = _ref1.openDfd) != null ? _ref2.state() : void 0 : void 0) === "pending") {
        return;
      }
      if (!this.settingsMenuTooltip) {
        this.updateSettingsMenu();
      }
      button = $(evt.currentTarget);
      $.hideJJMenu();
      button.addClass('active');
      this.settingsMenuOptions.dfd = $.Deferred();
      GS.trigger('tooltip:open', this.settingsMenuOptions);
      this.settingsMenuTooltip.openDfd = this.settingsMenuOptions.dfd;
      return this.settingsMenuTooltip.openDfd.always(function() {
        return button.removeClass('active');
      });
    };

    return Ui;

  })(Backbone.View);

  GS.Views.Lightboxes.Gsrpair = (function(_super) {
    __extends(Gsrpair, _super);

    function Gsrpair() {
      this.onPair = __bind(this.onPair, this);
      _ref1 = Gsrpair.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Gsrpair.prototype.events = {
      'click #lightbox-footer .submit': 'onStageSubmit',
      'submit form': 'onStageSubmit',
      'input #gsr-pair-key': 'onKeyInput'
    };

    Gsrpair.prototype.type = 'gsrpair';

    Gsrpair.prototype.initialize = function() {
      Gsrpair.__super__.initialize.call(this);
      this.currentStage = 'pair';
      if (!config.hasCustomName()) {
        config.setDefaultBrowserName();
      }
      return GS.on('gsremote:onPair', this.onPair);
    };

    Gsrpair.prototype.render = function() {
      Gsrpair.__super__.render.call(this);
      this.$el.html($('<form>\n    <div id="lightbox-header">\n        <h2 class="title">Add a device</h2>\n        <a id="lightbox-close" class="close btn btn-rounded btn-icon-only btn-dark"><i class="icon icon-ex-white-outline"></i></a>\n    </div>\n    <div id="lightbox-content">\n        <div id="lightbox-content-block">\n            <div id="stage-success" class="hide" style="margin: 2em;">\n                <h2 style="text-align: center;">Congratulations! Your device is now paired.</h2>\n            </div>\n            <div id="stage-firstrun" class="hide" style="margin: 2em;">\n                <label for="gsr-name" class="label"><span>Nearly there! Just give this computer a name to remember it by (e.g. Living Room PC):</span></label>\n                <input id="gsr-name" style="width: 500px;" type="text" name="name" />\n            </div>\n            <div id="stage-pair" style="margin: 1em;">\n                <label for="gsr-pair-key" style="text-align: center">Enter the code given to you by the app.</label>\n                <div style="width: 100%; text-align: center">\n                    <input style="font-size: 4em;width: 7em;height:auto;text-align: center;margin: 10px;color: black;" type="text" id="gsr-pair-key" maxlength="6" name="gsr-pair-key" />\n                </div>\n            </div>\n        </div>\n    </div>\n    <div id="lightbox-footer">\n        <div id="lightbox-footer-right" class="right">\n            <a class="btn btn-large btn-primary submit hide">Done</a>\n        </div>\n        <div id="lightbox-footer-left" class="left" />\n    </div>\n    <button class="hide" type="submit"></button>\n</form>'));
      $('#gsr-pair-key').focus();
      return GS.trigger("lightbox:rendered");
    };

    Gsrpair.prototype.onKeyInput = function(evt) {
      var key;
      key = evt.target.value;
      if (key.length === 6) {
        return GS.trigger('gsremote:pair', key);
      }
    };

    Gsrpair.prototype.onPair = function(outcome) {
      if (outcome === true) {
        if (!config.hasCustomName()) {
          this.currentStage = 'firstrun';
        } else {
          this.currentStage = 'success';
        }
        return this.onStageChange();
      } else {
        return $('#gsr-pair-key').stop().css('background-color', '#FF0000').animate({
          backgroundColor: '#FFFFFF'
        }, 1500);
      }
    };

    Gsrpair.prototype.onStageSubmit = function() {
      var name;
      switch (this.currentStage) {
        case 'firstrun':
          name = $('#gsr-name')[0].value;
          if (name === '') {
            return false;
          }
          config.setBrowserName(name);
          this.currentStage = 'success';
          this.onStageChange();
          break;
        case 'success':
          GS.trigger('lightbox:close');
      }
      return false;
    };

    Gsrpair.prototype.onStageChange = function() {
      switch (this.currentStage) {
        case 'firstrun':
          $('#stage-pair').addClass('hide');
          $('#stage-firstrun').removeClass('hide');
          $('#gsr-name').val(config.getBrowserName());
          $('#gsr-name').select();
          return $('#lightbox-footer .submit').removeClass('hide').text = 'Next';
        case 'success':
          $('#stage-pair').addClass('hide');
          $('#stage-firstrun').addClass('hide');
          $('#stage-success').removeClass('hide');
          $('#lightbox-footer .submit').removeClass('hide').text = 'Done';
          return setTimeout((function() {
            return GS.trigger('lightbox:close');
          }), 2000);
      }
    };

    return Gsrpair;

  })(GS.Views.Lightboxes.Base);

  GS.Views.Lightboxes.Gsrsettings = (function(_super) {
    __extends(Gsrsettings, _super);

    function Gsrsettings() {
      _ref2 = Gsrsettings.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Gsrsettings.prototype.events = {
      'click #lightbox-footer .submit': 'onSubmit',
      'submit form': 'onSubmit'
    };

    Gsrsettings.prototype.type = 'gsrsettings';

    Gsrsettings.prototype.initialize = function() {
      return Gsrsettings.__super__.initialize.call(this);
    };

    Gsrsettings.prototype.render = function() {
      Gsrsettings.__super__.render.call(this);
      this.$el.html($('<form>\n    <div id="lightbox-header">\n        <h2 class="title">GSRemote Settings</h2>\n        <a id="lightbox-close" class="close btn btn-rounded btn-icon-only btn-dark"><i class="icon icon-ex-white-outline"></i></a>\n    </div>\n    <div id="lightbox-content">\n        <div id="lightbox-content-block">\n            <div id="gsr-changename" style="margin: 2em;">\n                <label for="gsr-name" class="label">Thought of a better name for this computer? Change it here (e.g. Living Room PC):</label>\n                <input id="gsr-name" style="width: 500px;" type="text" name="name" />\n            </div>\n            <div id="gsr-changename" style="margin: 2em;">\n                <label for="gsr-name" class="label">Force fallback connection mode (will cause the page to refresh):</label>\n                <input id="gsr-forcexhr" type="checkbox" name="forcexhr" />\n            </div>\n        </div>\n    </div>\n    <div id="lightbox-footer">\n        <div id="lightbox-footer-right" class="right">\n            <a class="btn btn-large btn-primary submit">Done</a>\n        </div>\n        <div id="lightbox-footer-left" class="left" />\n    </div>\n    <button class="hide" type="submit"></button>\n</form>'));
      if (config.getBrowserName() == null) {
        $('#gsr-changename').hide();
      }
      $('#gsr-name')[0].value = config.getBrowserName();
      $('#gsr-forcexhr').attr('checked', config.getForceXhr());
      $('#gsr-forcexhr').click(function() {
        config.setForceXhr($(this).is(':checked'));
        return location.reload();
      });
      return GS.trigger("lightbox:rendered");
    };

    Gsrsettings.prototype.onSubmit = function() {
      var name;
      if ($('#gsr-changename').is(':visible')) {
        name = $('#gsr-name')[0].value;
        if (name === '') {
          return false;
        }
        config.setBrowserName(name);
      }
      GS.trigger('lightbox:close');
      return false;
    };

    return Gsrsettings;

  })(GS.Views.Lightboxes.Base);

  module.exports = Ui;

}).call(this);


},{"./config.coffee":1}],5:[function(require,module,exports){
(function() {
  var nextTick, ready;

  nextTick = require('breeze-nexttick');

  ready = function(callback) {
    var check, modelDeferred;
    if (window.GS && window.GS.ready) {
      modelDeferred = new $.Deferred;
      GS.once('change:page', function(name, status, pageView) {
        var appModel;
        appModel = pageView.currentPageView.model.get('appModel');
        return modelDeferred.resolve(appModel);
      });
      $.when(modelDeferred.promise(), GS.ready).then(callback);
      check = function() {
        var hash;
        if (modelDeferred.state() !== 'resolved') {
          console.log('FIXING THINGS');
          hash = window.location.hash;
          window.location.hash = hash === '' ? '#!/' : '';
          return GS.once('change:page', function() {
            return window.location.hash = hash;
          });
        }
      };
      return GS.ready.then(function() {
        return setTimeout(check, 1000);
      });
    } else {
      return nextTick((function() {
        return ready(callback);
      }));
    }
  };

  ready(function(appModel) {
    var Api, Net, Remote, Ui, checkUi, config, isFirstRun, net, remote, ui;
    config = require('./config.coffee');
    isFirstRun = !config.hasBrowserId();
    Api = require('./api.coffee');
    Remote = require('./remote.coffee');
    Net = require('./net.coffee');
    Ui = require('./ui.coffee');
    Api.init(appModel);
    ui = new Ui;
    net = new Net;
    remote = new Remote;
    checkUi = function() {
      if ($('#gsr-settings-group').length === 0) {
        if (ui != null) {
          ui.remove();
        }
        return ui = new Ui(net.connected);
      }
    };
    setInterval(checkUi, 1000);
    if (isFirstRun) {
      return GS.trigger('lightbox:open', 'gsrpair');
    }
  });

}).call(this);


},{"./config.coffee":1,"./api.coffee":3,"./net.coffee":6,"./remote.coffee":7,"./ui.coffee":4,"breeze-nexttick":8}],8:[function(require,module,exports){
module.exports = require('./lib/nextTick');

},{"./lib/nextTick":9}],9:[function(require,module,exports){
/*!
 * Breeze - process.nextTick browser shim
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .nextTick (fn)
 *
 * Cross-compatible `nextTick` implementation. Uses
 * `process.nextTick` for node and `setTimeout(fn, 0)`
 * for the browser.
 *
 * @param {Function} callback
 * @name nextTick
 * @api public
 */

module.exports = ('undefined' === typeof process || !process.nextTick)
  ? browserNextTick()
  : process.nextTick;

/*!
 * Prepares a cross-browser capable nextTick implementation
 * using either `postMessage` or `setTimeout(0)`.
 *
 * @attr http://dbaron.org/log/20100309-faster-timeouts
 * @api private
 */

function browserNextTick () {
  if (!window || !window.postMessage || window.ActiveXObject) {
    return function (fn) {
      setTimeout(fn, 0);
    }
  }

  var timeouts = []
    , name = '{"name": "breeze-zero-timeout"}';

  window.addEventListener('message', function (e) {
    if (e.source === window && e.data === name) {
//      if (e.stopPropagation) e.stopPropagation();
      if (timeouts.length) timeouts.shift()();
    }
  });

  return function (fn) {
    timeouts.push(fn);
    window.postMessage(name, '*');
  }
}

},{}],6:[function(require,module,exports){
(function() {
  var Net, Request, SOCKET_IO_HOST, config;

  config = require('./config.coffee');

  SOCKET_IO_HOST = 'http://io.gsremote.com:443';

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
        script = $.getScript("" + SOCKET_IO_HOST + "/socket.io/socket.io.js");
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
      if (config.getForceXhr()) {
        socket = io.connect(SOCKET_IO_HOST, {
          transports: ['htmlfile', 'xhr-polling', 'jsonp-polling']
        });
      } else {
        socket = io.connect(SOCKET_IO_HOST);
      }
      socket.on('connect', function() {
        _this.connected = true;
        _this.startHandshake();
        return GS.trigger('gsremote:connect');
      });
      socket.on('message', function(message) {
        return GS.trigger('gsremote:data', new Request(message.id, message.data));
      });
      socket.on('reconnecting', function() {
        _this.connected = false;
        return GS.trigger('gsremote:reconnecting');
      });
      socket.on('reconnect', function() {
        _this.connected = true;
        return GS.trigger('gsremote:reconnect');
      });
      socket.on('has subscribers', function(hasClients) {
        return _this.hasClients = hasClients;
      });
      GS.on('gsremote:send', this.send);
      GS.on('gsremote:broadcast', this.broadcast);
      GS.on('gsremote:pair', this.pair);
      return GS.on('gsremote:sendBrowserInfo', this.sendBrowserInfo, this.socket = socket);
    };

    Net.prototype.stop = function() {
      var _ref;
      if ((_ref = this.socket) != null) {
        _ref.disconnect();
      }
      delete io.sockets[SOCKET_IO_HOST];
      return this.connected = false;
    };

    Net.prototype.startHandshake = function() {
      var name;
      this.sendBrowserInfo({
        id: config.getBrowserId()
      });
      name = config.getBrowserName();
      if (name) {
        return this.sendBrowserInfo({
          name: name
        });
      }
    };

    Net.prototype.sendBrowserInfo = function(msg) {
      var _ref;
      return (_ref = this.socket) != null ? _ref.emit('set info', msg) : void 0;
    };

    Net.prototype.send = function(client, data) {
      var _ref;
      return (_ref = this.socket) != null ? _ref.emit('message', {
        id: client,
        data: data
      }) : void 0;
    };

    Net.prototype.broadcast = function(data) {
      var _ref;
      if (this.hasClients) {
        return (_ref = this.socket) != null ? _ref.emit('broadcast', data) : void 0;
      }
    };

    Net.prototype.pair = function(key) {
      var _ref;
      return (_ref = this.socket) != null ? _ref.emit('pair', key, function(outcome) {
        return GS.trigger('gsremote:onPair', outcome);
      }) : void 0;
    };

    return Net;

  })();

  Request = (function() {
    function Request(clientId, data) {
      this.clientId = clientId;
      this.args = data.split(',');
      this.command = this.args.shift();
    }

    Request.prototype.respond = function(type, msg) {
      if (!msg) {
        return;
      }
      if (type) {
        msg.type = type;
      }
      return GS.trigger('gsremote:send', this.clientId, msg);
    };

    return Request;

  })();

  module.exports = Net;

}).call(this);


},{"./config.coffee":1}],7:[function(require,module,exports){
(function() {
  var Api, PROTOCOL_VER, Remote;

  Api = require('./api.coffee');

  PROTOCOL_VER = 15;

  Remote = (function() {
    function Remote() {
      var _this = this;
      _.bindAll(this);
      GS.on('gsremote:data', this.handleData);
      Api.on('notification', function(text) {
        return GS.trigger('gsremote:broadcast', {
          type: 'notification',
          message: text
        });
      });
      Api.on('player:change:volume', function(level) {
        return GS.trigger('gsremote:broadcast', {
          type: 'volume',
          level: level
        });
      });
      Api.on('player:songStatus', function(status) {
        var song;
        song = status.song || {};
        song.type = 'currentsong';
        return GS.trigger('gsremote:broadcast', song);
      });
      Api.on('player:playbackStatus', function(status) {
        status.type = 'playbackstatus';
        return GS.trigger('gsremote:broadcast', status);
      });
      Api.on('player:change', function(player) {
        player.type = 'player';
        return GS.trigger('gsremote:broadcast', player);
      });
      Api.on('player:queue:change', function(queue) {
        return GS.trigger('gsremote:broadcast', {
          type: 'playqueue',
          queue: queue
        });
      });
      Api.on('user:library:change', function(song) {
        return GS.trigger('gsremote:broadcast', {
          type: 'togglesonglibrary',
          song: song
        });
      });
      Api.on('user:favorites:change', function(song) {
        return GS.trigger('gsremote:broadcast', {
          type: 'togglesongfavorite',
          song: song
        });
      });
      Api.on('change:user', function() {
        return GS.trigger('gsremote:broadcast', {
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

    Remote.prototype.todo = function() {
      return console.log('todo!');
    };

    return Remote;

  })();

  module.exports = Remote;

}).call(this);


},{"./api.coffee":3}]},{},[5])
;