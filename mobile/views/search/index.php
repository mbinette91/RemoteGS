<div id="header-container">
	<a id="back" class="back ui-btn-left ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-notext ui-btn-up-a" data-type="button" data-icon="home" data-iconpos="notext" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="a" title=""><span class="ui-btn-inner"><span class="ui-btn-text"></span><span class="ui-icon ui-icon-back ui-icon-shadow">&nbsp;</span></span></a>
	<input type="search" name="search-mini" id="search-input" data-theme="c" value="" data-mini="true" />
</div>

<div id="content-container">
	<div id="content">
		<div class="searchlist songlist" id="playlistListView">
			<div class="playlistItem prototype element goto" href="/remote/player" song-id="{SONG_ID}">
				<img class="cover" src="{IMAGE_URL}" />
				<p class="song">{SONG_NAME}</p>
				<p class="artist">{ARTIST_NAME}</p>
				<div class="add_song btAdd"></div>
			</div>
			<div class="add_song_advanced prototype" shown="false">
				<div class="button play_now">Play Now</div>
				<div class="button add_next">Add Next</div>
				<div class="button add_last">Add Last</div>
			</div>
		</div>
	</div>
</div>

<?PHP $VIEW->_partial('views/_partials/footer_player.php', $VIEW); ?>

<div class="prototype" type="javascript" cmd="init" js-class="SearchPage" body-class="<?PHP echo $VIEW->BODY_CLASS; ?>" title="<?PHP echo $VIEW->TITLE; ?>"></div>