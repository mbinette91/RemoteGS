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