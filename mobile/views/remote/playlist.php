<div id="header-container">
	<a class="goto home ui-btn-left ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-notext ui-btn-up-a" href="/" data-type="button" data-icon="home" data-iconpos="notext" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="a" title=""><span class="ui-btn-inner"><span class="ui-btn-text"></span><span class="ui-icon ui-icon-home ui-icon-shadow">&nbsp;</span></span></a>
	<h1 class="static-header"><span class="GSClient-name"></span>'s playlist</h1>
	<a class="goto search ui-btn-right ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-icon-notext ui-btn-up-a" data-mini="true" href="/search/" data-type="button" data-icon="search" data-iconpos="notext" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="a" title="Search"><span class="ui-btn-inner"><span class="ui-btn-text">Search</span><span class="ui-icon ui-icon-search ui-icon-shadow">&nbsp;</span></span></a>
</div>

<div id="content-container">
	<div id="content">
		<div class="playlist songlist" id="playlistListView">
			<div class="element playlistItem goto prototype" href="/remote/player" song-id="{SONG_ID}"> 
				<div class="play"></div>
				<img class="cover current-album-img" src="{IMAGE_URL}" />
				<p class="song">{SONG_NAME}</p>
				<p class="artist">{ARTIST_NAME}</p>
				<div class="delete btDelete"></div>
			</div>
		</div>
	</div>
</div>

<?PHP $VIEW->_partial('views/_partials/footer_player.php', $VIEW); ?>

<div class="prototype" type="javascript" cmd="init" js-class="PlaylistPage" body-class="<?PHP echo $VIEW->BODY_CLASS; ?>" title="<?PHP echo $VIEW->TITLE; ?>"></div>