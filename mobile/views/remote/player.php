<div id="header-container" class="player">
	<img class="cover current-album-img" src="/images/default_cover.png" />
	<p class="song"><span class="current-song-name"></span></p>
	<p class="artist"><span class="current-artist-name"></span></p>
	<div class="playlist-btn goto" href="/remote/playlist"></div>
	<div class="search-btn goto" href="/search/"></div>
	<div class="volume">
		<input class="volume-bar current-volume" type="range" name="slider-volume" id="slider-volume" value="100" min="0" max="100" data-highlight="true" data-theme="a" data-mini="true" />
		<div class="volume-btn sound3"></div>
	</div>
</div>
<div id="content-container" class="player">
	<div id="content-player" class="player">
		<img class="player_cover" id="image-album" src="/images/default_cover.png"/>
	</div>
</div>
<div id="footer-container" class="player">
	<input class="seekSlider current-time" type="range" name="slider-seek" id="slider-seek" value="50" min="0" max="100" data-highlight="true" data-theme="a" data-mini="true" />
	<div class="repeat current-repeat"></div>
	<div class="previous"></div>
	<div class="playpause pause current-status"></div>
	<div class="next"></div>
	<div class="shuffle current-shuffle"></div>
</div>

<div class="prototype" type="javascript" cmd="init" js-class="PlayerPage" body-class="<?PHP echo $VIEW->BODY_CLASS; ?>" title="<?PHP echo $VIEW->TITLE; ?>"></div>
