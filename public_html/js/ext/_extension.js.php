<?PHP 
	include '../../../configs/config.php';
?>
var HOST_FILES = '<?PHP echo BASE_URL_DESKTOP; ?>';
var PATH_TO_LIB_SOCKETIO = HOST_FILES + "/js/lib/socket.io.js";
var GSR_SOCKETIO_HOST = '<?PHP echo GSR_SOCKETIO_HOST; ?>';

var TEMP = {};
	
<?PHP
	require('Cookies.js');
	require('Controller.js');
	require('GroovesharkClient.js');
?>

function Start(){ } //Deprecated

GSR = {};
GSR = new Controller();

;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
	var uuid;

	uuid = require('./uuid.coffee');

	module.exports = {

	};

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

	<?PHP require('Api.js'); ?>
	
	<?PHP require('Model.js'); ?>

	module.exports = new Api;

}).call(this);

<?PHP require('UserInterface.js'); ?>

},{"./config.coffee":1}],5:[function(require,module,exports){
(function() {
	var ready;

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
			setTimeout(function(){return ready(callback);}, 500)
		}
	};

	ready(function(appModel) {
		var Api, Net, Remote, Ui, checkUi, config, net, remote, ui;
		config = require('./config.coffee');
		Api = require('./api.coffee');
		Remote = require('./remote.coffee');
		Net = require('./net.coffee');
		Ui = require('./ui.coffee');
		Api.init(appModel);
		ui = new Ui;
		net = new Net;
		remote = new Remote;
		checkUi = function() {
			if ($('#remote-settings-group').length === 0) {
				if (ui != null) {
					ui.remove();
				}
				return ui = new Ui(net.connected);
			}
		};
		GSR.Ui = ui;

		setInterval(checkUi, 1000);
	});

}).call(this);


},{"./config.coffee":1,"./api.coffee":3,"./net.coffee":6,"./remote.coffee":7,"./ui.coffee":4,"breeze-nexttick":8}],8:[function(require,module,exports){

},{}],6:[function(require,module,exports){
(function() {
	var Net, config;

	config = require('./config.coffee');

	<?PHP require('Net.js'); ?>

	Request = (function() {
		function Request(data) {
			this.clientId = data['from'];
			this.args = data;
			this.command = data.type;
		}

		Request.prototype.respond = function(type, msg) {
			if (!msg) {
				msg = {};
			}
			msg.to = this.clientId;
			msg.type = type;
			if (msg['callback']) {
				msg.callback = true;
				msg.original_id = this.args['id'];
			}

			if(this.args['broadcast'])
				return GS.trigger('remote:broadcast', msg);
			else
				return GS.trigger('remote:send', msg);
		};

		return Request;

	})();

	module.exports = Net;

}).call(this);

<?PHP require('Remote.js'); ?>

},{"./api.coffee":3}]},{},[5])
;	
