//Here are the basic methods for a "Page". This can (and should) be extended.
/**
  TABLE OF CONTENTS:
	Page
	IndexPage
	ConnectPage
	PlaylistPage
	PlayerPage
	SearchPage
	ErrorPage
*/
function Page(app){
	if(!app) return;
	this.app = app;
}

Page.prototype.onStartUp = function(){
	//On every page, do this:
	if(!this.app.isConnectedToServer()){
		app.errorHandler.handleLostConnection();
	}
	var allowedAnonymusPages = ['Page', 'IndexPage', 'ConnectPage', 'PasswordPage']
	if(!this.app.remote.isConnectedToGroovesharkClient() && allowedAnonymusPages.indexOf(this.constructor.name) < 0)
		this.app.errorHandler.handleNoGSClientError();
	
	this.refreshGroovesharkClient();
	this.refreshPlayer();
	this.refreshHeader();
	this.refreshFooter();
};

Page.prototype.getSmallArtwork = function(song){
	if(!song.artFilename){
		if(song.AlbumID) //TinySongAPI
			return "http://images.gs-cdn.net/static/albums/80_"+song.AlbumID+".jpg"; //Sometimes PNG, but mostly jpg.. It'll do until we get the real GS API.
		else
			return "http://images.gs-cdn.net/static/albums/80_album.png";
	}
	else
		return "http://images.gs-cdn.net/static/albums/80_"+song.artFilename;
}

Page.prototype.getBigArtwork = function(song){
	if(!song.artFilename)
		return "http://images.gs-cdn.net/static/albums/500_album.png"
	else
		return "http://images.gs-cdn.net/static/albums/"+song.artFilename;
}

Page.currentSongInterval = 0;
Page.prototype.refreshPlayer = function(){
	var client = this.app.remote.getCurrentGroovesharkClient();
	if(client){ 
		if(client.currentSong && client.currentSong.status != 'none' && client.currentSong.status != 'completed'){
			var song = client.currentSong;
			
			$('.player .current-artist-name').html(song.artistName);
			$('.player .current-album-name').html(song.albumName);
			$('.player .current-album-img').attr('src', this.getSmallArtwork(song));
			$('.player .current-song-name').html(song.songName);
		
			if(!($('.player .current-volume').parent().find('.ui-focus').length)){ //If it's not being used (else, it's a bit glitchy)
				$('.player .current-volume').attr('value', client.volume);
				$('.player .current-volume').parent('.ui-slider').find('.ui-slider-range').css('width', client.volume+'%');
				$('.player .current-volume').parent('.ui-slider').find('.ui-slider-handle').css('left', client.volume+'%');
				$('.player .current-volume').parent('.ui-slider').find('.ui-slider-bg').css('width', client.volume+'%');
			}
			var val = $('.player .current-volume').attr('value'); //Use value, so the image is refreshed correctly if he's using the slider
			$('.player .volume-btn').removeClass('sound0');
			$('.player .volume-btn').removeClass('sound1');
			$('.player .volume-btn').removeClass('sound2');
			$('.player .volume-btn').removeClass('sound3');
			$('.player .volume-btn').addClass('sound'+(Math.ceil(val/34)));
			
			$('.player .current-time').attr('max', client.calculatedDuration);
			$('.player .current-time').attr('value', client.position);
			
			if(!($('.player .current-time').parent().find('.ui-focus').length)){ //If it's not being used (else, it's a bit glitchy)
				valPercent = client.position / client.calculatedDuration * 100;
				$('.player .current-time').parent('.ui-slider').find('.ui-slider-range').css('width', valPercent+'%');
				$('.player .current-time').parent('.ui-slider').find('.ui-slider-handle').css('left', valPercent+'%');
				$('.player .current-time').parent('.ui-slider').find('.ui-slider-bg').css('width', valPercent+'%');
			}
			
			var advance = function (){
				client.position += 1000;
				valPercent = client.position / client.calculatedDuration * 100;
				$('.player .current-time').parent().find('.ui-slider-range').css('width', valPercent+'%');
				$('.player .current-time').parent().find('.ui-slider-handle').css('left', valPercent+'%');
				$('.player .current-time').parent().find('.ui-slider-bg').css('width', valPercent+'%');
			}

			clearInterval(Page.currentSongInterval);
		
			if(!client.isPlaying || client.isLoading){
				$('.player .current-status').removeClass('pause');
				$('.player .current-status').addClass('play');
			}
			else{ //He is playing the song!
				Page.currentSongInterval = setInterval(advance, 1000);
				$('.player .current-status').removeClass('play');
				$('.player .current-status').addClass('pause');
			}
	
			$('.player .current-repeat').removeClass('repeat0');
			$('.player .current-repeat').removeClass('repeat1');
			$('.player .current-repeat').removeClass('repeat2');
			$('.player .current-repeat').removeClass('active');
			$('.player .current-repeat').addClass('repeat'+client.repeat);

			if(client.shuffleOn)
				$('.player .current-shuffle').addClass('active');
			else
				$('.player .current-shuffle').removeClass('active');
		}
		else{
			//Empty/null song
			$('#footer-container h3, #footer-container .seekSlider, #footer-container .artistAlbumLine, #footer-container #footer-button-bar, #footer-container #footer-volume').css('visibility', 'hidden');
		}
	}
	else{
		
	}
}

Page.prototype.refreshGroovesharkClient = function(){
	if(this.app.remote.isConnectedToGroovesharkClient()){
		$('.GSClient-name').html(this.app.remote.getCurrentGroovesharkClient().name);
		$('.GSClient-uid').html(this.app.remote.getCurrentGroovesharkClient().name);
	}
}

Page.prototype.refreshHeader = function(){
	if(Application.history.length > 1)
		$('#header-container #back-button').show();
	else
		$('#header-container #back-button').hide();
		
	if(this.app.remote.isConnectedToGroovesharkClient()){
		$('#header-container .connectedTo').show();
		$('#header-container #search-button').show();
	}
	else{
		$('#header-container .connectedTo').hide();
		$('#header-container #search-button').hide();
	}
}

Page.prototype.refreshFooter = function(){
	if(this.app.remote.isConnectedToGroovesharkClient()){
		$('.currently-playing').show();
	}
	else{
		$('.currently-playing').hide();
	}
};

/* Index */
function IndexPage(app){
	Page.call(this, app);
}
IndexPage.prototype = new Page(0);
IndexPage.prototype.constructor = IndexPage;

IndexPage.prototype.onStartUp = function(){
	Page.prototype.onStartUp.call(this);
	this.refreshGrooveSharkList();
};

IndexPage.prototype.refreshGrooveSharkList = function(){
	var gsClients = this.app.remote.getGroovesharkClients();
	$('.list-grooveshark .item:not(.prototype)').remove();
	for(i in gsClients){
		this.addGroovesharkClientToList(gsClients[i]);
	}
}

IndexPage.prototype.addGroovesharkClientToList = function(client){
	var A = this.app;
	var item = $('.list-grooveshark').find('.item.prototype').clone();
	item.removeClass('prototype');
	var html = $.replaceAll(item.html(), {'{UID}': client.uid, '{NAME}': client.name})
	item.html(html);
	if(client.activated){
		item.click(function(){
			A.remote.setCurrentGroovesharkClient(client);
		});
	}
	else{
		item.removeClass('goto').click(function(){return false;});
		item.addClass('deactivated');
	}
	$('.list-grooveshark').append(item);
};

/* Connect */
function ConnectPage(app){
	Page.call(this, app);
}
ConnectPage.prototype = new Page(0);

ConnectPage.prototype.onStartUp = function(){
	Page.prototype.onStartUp.call(this);

	var app = this.app;
	
	var connectFunct = function(data){
		if(data['is_paired'] || data['is_already_paired']){
			$('#guid_input').removeClass('invalid');
			app.goto('/', true);
		}
		else{
			if(data['hasPassword']){
				$('.uid-step').hide();
				$('.password-step').show();
				document.getElementById("password_input").focus();
				if(data['wrongPassword'])
					$('#password_input').addClass('invalid');
			}
			else
				$('#guid_input').addClass('invalid');
		}
	};
	
	$("#connect").bind("click", function(event, ui){
		var UID = $('#guid_input').val();
		var password = $('#password_input').val();
		app.remote.connectTo(UID, password, connectFunct);
	});
	
	$("#connectCancel").bind("click", function(event, ui){
		goBack();
	});
	
	$("#guid_input").bind("keypress", function(event, ui){
		if(event.which == 13) {
			var UID = $('#guid_input').val();
			var password = $('#password_input').val();
			app.remote.connectTo(UID, password, connectFunct);
		}
	});
	
	document.getElementById("guid_input").focus();
};

/* Playlist */
function PlaylistPage(app){
	Page.call(this, app);
}
PlaylistPage.prototype = new Page(0);
PlaylistPage.prototype.constructor = PlaylistPage;

PlaylistPage.prototype.onStartUp = function(){
	Page.prototype.onStartUp.call(this);
	
	this.refreshPlaylist();
};

PlaylistPage.prototype.createNewElem = function(song){
	var elemHTML = $('#playlistListView .playlistItem.prototype').outerhtml();
	
	elemHTML = $.replaceAll(elemHTML, {'{SONG_ID}': song.songId, "{SONG_NAME}": song.songName, "{ALBUM_NAME}": song.albumName, "{ARTIST_NAME}": song.artistName, "{IMAGE_URL}": this.getSmallArtwork(song)})
	
	newElem = $(elemHTML);
	newElem.removeClass('prototype');
	
	newElem.attr('queueIndex', song.queueIndex);
	
	var client = this.app.remote.getCurrentGroovesharkClient();
	newElem.bind('click',function(){
		client.playSongFromPlaylist($(this).attr('queueindex'));
	});

	newElem.find('.btDelete').bind('click',function(e){
		client.removeSongFromPlaylist($(this).parents('.playlistItem').attr('queueindex'));
		e.stopPropagation();
		return false;
	});
	
	return newElem;
};

PlaylistPage.prototype.refreshPlaylist = function(){
	var _this = this;
	if(this.app.remote.isConnectedToGroovesharkClient()){
		var client = this.app.remote.getCurrentGroovesharkClient();
		
		var list = $('#playlistListView');
		var list_items = $('#playlistListView .playlistItem:not(.prototype)');
		
		var songs = client.currentPlaylist;
		
		//Bullshit functions to increment/decrement/getValues from hashtables
		var incr = function(dict, ind){	if(dict[""+ind]) dict[""+ind]++; else dict[""+ind]=1; };
		var decr = function(dict, ind){ if(dict[""+ind]) dict[""+ind]--; else dict[""+ind]=0; };
		var getInt = function(dict, ind){ if(dict[""+ind]) return dict[""+ind]; else return 0; };
		
		var dictionnary_list_items = {};
		$(list_items).each(function(){
			incr(dictionnary_list_items, $(this).attr('queueindex'));
		});
		
		var dictionnary_songs = {};
		$(songs).each(function(){
			incr(dictionnary_songs, this.queueIndex);
		});
		
		//Add missing items
		$(songs).each(function(){
			var i = ""+this.queueIndex;
			if(!dictionnary_list_items[i] || getInt(dictionnary_songs,i) > getInt(dictionnary_list_items,i)){ //Then it's missing from the list (might be a double tho, which is why the second condition is there.
				var newElem = _this.createNewElem(this);
				list.append(newElem);
				incr(dictionnary_list_items, i);
			}
		});
		
		//Remove removed items AND set current
		var currentSongIndex = client.currentSong.queueIndex;
		var list_items = $('#playlistListView .playlistItem:not(.prototype)'); //Refresh the list, it has certainly changed!
		$(list_items).removeClass('current');
		$(list_items).each(function(){
			var sId = $(this).attr('queueindex');
			if(currentSongIndex == sId)
				$(this).addClass('current');
			if(getInt(dictionnary_list_items,sId) > getInt(dictionnary_songs,sId)){ //It hasn't been checked (enough times). It was probably deleted.
				$(this).remove();
				decr(dictionnary_list_items, sId);
			}
		});
		
		//Reorder items
		var parent = $('#playlistListView');
		var childs = parent.children('.playlistItem:not(.prototype)');
		var childs = childs.detach().sort(function(a, b) {
			var a_qi = $(a).attr('queueindex');
			var b_qi = $(b).attr('queueindex');
			var val = 0;
			$(songs).each(function(){
				if(this.queueIndex == a_qi){
					val = 1;
					return;
				}
				if(this.queueIndex == b_qi){
					val = -1;
					return;
				}
			});
			return val;
		});
		parent.append(childs)
	}
};

PlaylistPage.prototype.refreshPlayer = function(){
	Page.prototype.refreshPlayer.call(this);
	var list_items = $('#playlistListView .playlistItem:not(.prototype)');
	$(list_items).removeClass('current');
	var client = this.app.remote.getCurrentGroovesharkClient();
	var currentSongIndex = client.currentSong.queueIndex;
	$('#playlistListView .playlistItem[queueindex='+currentSongIndex+']').addClass('current');
};

/* Player */
function PlayerPage(app){
	Page.call(this, app);
}
PlayerPage.prototype = new Page(0);
PlayerPage.prototype.constructor = PlayerPage;

PlayerPage.bindedWindow = false;
PlayerPage.prototype.onStartUp = function(){
	Page.prototype.onStartUp.call(this);
	var song = this.app.remote.getCurrentGroovesharkClient().currentSong;
	
	var __resizeImage = function() {
		var availableHeight = $(window).height() - $('#header-container').height() - $('#footer-container').height() - 1;
		var availableWidth = Math.min($('#image-album').parent().width(), $(window).width());
		var heightImg = $('#image-album').height();
		var widthImg = $('#image-album').width();
		
		if(widthImg/availableWidth < heightImg/availableHeight){
			$('#image-album').height(availableHeight);
			$('#image-album').width("auto");
			$('#image-album').css('margin-top', 0);
		}
		else{
			$('#image-album').width(availableWidth);
			$('#image-album').height('auto');
			var extraHeight = availableHeight - $('#image-album').outerHeight();
			$('#image-album').css('margin-top', extraHeight/2);
		}
	}
	
	$('#image-album').load(__resizeImage);
	if(!PlayerPage.bindedWindow){
		PlayerPage.bindedWindow = true;
		$(window).resize(__resizeImage);
	}
	
	$('#image-album').attr('src', this.getBigArtwork(song));
	
	$('.volume .volume-btn').click(function(){ $(this).parent().toggleClass('active'); });
};

PlayerPage.prototype.refreshPlayer = function(){
	Page.prototype.refreshPlayer.call(this);
	var song = this.app.remote.getCurrentGroovesharkClient().currentSong;
	$('#image-album').attr('src', this.getBigArtwork(song));
}

/* Search */
function SearchPage(app){
	Page.call(this, app);
}
SearchPage.prototype = new Page(0);
SearchPage.prototype.constructor = SearchPage;

SearchPage.prototype.onStartUp = function(){
	Page.prototype.onStartUp.call(this);

	var _this = this;

	var lastText = $("#search-input").val();
	var changeFct = function(){
		var val = $(this).val();
		if(lastText != val){ //If the value changed. Else, don't resend a request for nothing! (+it'll make the advanced_play stuff blow up!)
			var i = ++SearchPage.lastResultListSeq;
			if(val.length >= 3){
				lastText = val;
				$.getJSON('/search_bridge.php?q='+val, function(data) {
					_this.setResultList(data, i)
				});
			}
			else
				_this.setResultList([], i)
		}
	}
	$("#search-input").change(changeFct)
	$("#search-input").keyup(changeFct)
	
	$("#search-input").focus();
	
	$("#back").click(function(){
		_this.app.goBack();
	});
};

SearchPage.lastResultListSeq = 0;
SearchPage.prototype.setResultList = function(songs, seqId){
	if(seqId < SearchPage.lastResultListSeq) //Asynchronus calls
		return;
	SearchPage.lastResultListSeq = seqId;

	var _this = this;
	var client = this.app.remote.getCurrentGroovesharkClient();
	
	var list = $('.search #playlistListView');
	$('.search #playlistListView .playlistItem:not(.prototype)').remove();
	$('.search #playlistListView .add_song_advanced:not(.prototype)').remove();

	for(i in songs){
		var song = songs[i];
		var elemHTML = list.find('.playlistItem.prototype').outerhtml();
		var songAdder = list.find('.add_song_advanced.prototype').outerhtml();

		elemHTML = $.replaceAll(elemHTML, {'{SONG_ID}': song.SongID, "{SONG_NAME}": song.SongName, "{ALBUM_NAME}": song.AlbumName, "{ARTIST_NAME}": song.ArtistName , "{IMAGE_URL}": this.getSmallArtwork(song) })

		newElem = $(elemHTML);
		newElem.removeClass('prototype');
		
		newSongAdder = $(songAdder);
		newSongAdder.removeClass('prototype');
		newSongAdder.attr('song-id', song.SongID);

		newSongAdder.find('.play_now').bind('click', function(e) {
			var songId = $(this).parents('.add_song_advanced').attr('song-id');
			client.addSongNextToQueueAndPlay(songId);
			_this.app.goto('/remote/player', true)
		});
		
		newSongAdder.find('.add_next').bind('click', function(e) {
			var songId = $(this).parents('.add_song_advanced').attr('song-id');
			client.addSongNextToQueue(songId);
			$('.btAdd.active').removeClass('active');
			$(this).parents('.add_song_advanced').slideUp(500);
			$(this).parents('.add_song_advanced').attr('shown', "false");
		});
		
		newSongAdder.find('.add_last').bind('click', function(e) {
			var songId = $(this).parents('.add_song_advanced').attr('song-id');
			client.addSongLastToQueue(songId);
			$('.btAdd.active').removeClass('active');
			$(this).parents('.add_song_advanced').slideUp(500);
			$(this).parents('.add_song_advanced').attr('shown', "false");
		});
		
		newElem.find('.btAdd').bind('click',function(e){
			var elem = $(this).parents('.playlistItem').next();
			$('.btAdd.active').removeClass('active');
			$(this).parents('.playlistItem').parent().find('.add_song_advanced').each(function() {
				if($(this).attr('shown') == "true" && $(elem).attr('song-id') != $(this).attr('song-id')) {
					$(this).slideUp(500);
					$(this).attr('shown', "false");
				}
			});
			
			$(elem).clearQueue();
			if($(elem).attr('shown') == "false") {
				$(this).addClass('active');
				$(elem).slideDown(500);	
				$(elem).attr('shown', "true");
			} else {
				$(elem).slideUp(500);
				$(elem).attr('shown', "false");
			}
			e.stopPropagation();
		});
		
		newElem.bind('click',function(e){
			var songId = $(this).attr('song-id');
			client.addSongLastToQueue(songId);
			return false;
		});
	
		list.append(newElem);
		list.append(newSongAdder);
	}
};

/* Error */
function ErrorPage(app){
	Page.call(this, app);
}
ErrorPage.prototype = new Page(0);
ErrorPage.prototype.constructor = ErrorPage;
