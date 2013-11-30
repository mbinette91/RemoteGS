<?PHP 
	ob_start("ob_gzhandler");
	header("Content-type: text/css; charset: UTF-8");
	header("Cache-control: must-revalidate");
	$offset = 0; //60 * 60;
	$expire = "Expires: ".gmdate("D, d M Y H:i:s", time() + $offset)." GMT";
	header($expire);
?>
/************************ MAIN.CSS.PHP ************************
By: 
For: 
Date: 
****************************************************************/
<?PHP
	include 'CSSRules-1.0.0.php';
	//Partials at the end too! 
	include '_partials/_basics-1.0.0.css.php';
	include '_partials/FirefoxOS.css';
	
	if(0) { ?><script><?php }
?>
.clear {
	clear:both;
}

a, input{
	-webkit-tap-highlight-color: rgba(255, 255, 255, 0); /*Deactivate Android orange tap highlight color...*/
}

a {
	text-decoration:none;
	color:#666;
}
a:hover {
	color:#333;
}

body, html body #content{
	font: 13px Verdana, "Times New Roman", Times, serif;
	font-family: Verdana, "Times New Roman", Times, serif;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

#page{
	overflow:hidden; /*overflow-x and overflow-y*/ 
}

#header-container {
	position:fixed;
	top:0;
	left:0;
	width:100%;
	height:40px;
	background:black;
	z-index:9001;
	
	border: 1px solid #333333;
	background: #111111;
	color: #ffffff;
	font-weight: bold;
	text-shadow: 0 -1px 0 #000000;
	background-image: -webkit-gradient(linear,left top,left bottom,from( #3c3c3c ),to( #111111 ));
	background-image: -webkit-linear-gradient( #3c3c3c,#111111 );
	background-image: -moz-linear-gradient( #3c3c3c,#111111 );
	background-image: -ms-linear-gradient( #3c3c3c,#111111 );
	background-image: -o-linear-gradient( #3c3c3c,#111111 );
	background-image: linear-gradient( #3c3c3c,#111111 );
}

#header-container .back,
#header-container .home{
	position:absolute;
	top:8px;
	left:5px;
}

#header-container .search{
	position:absolute;
	right:5px;
	top:8px;
}

#header-container h1{
	text-align:center;
	vertical-align:middle;
	font-size:16px;
	text-overflow:ellipsis;
	overflow:hidden;
	height:24px;
	white-space:nowrap;
	
	margin-left:50px;
	margin-right:50px;
}

header-container .connectedTo{
	display: none;
}

#header-container .connectedTo{
	display: none;
}

#content {
	padding-top:42px;
	padding-left:0px;
	padding-right:0px;
}

#content-container{
	height:100%;
	max-width: 500px;
	margin: auto;
}

#content .transition-wrapper.outleft {
	transition: all 0.5s;
	-webkit-transform: translateX(-100%);
	-webkit-animation-name: slideouttoleft;
}

#content .transition-wrapper.outright {
	transition: all 0.5s;
	-webkit-transform: translateX(100%);
	-webkit-animation-name: slideouttoleft;
}

@-webkit-keyframes slideouttoleft {
	from { -webkit-transform: translateX(0); }
	to { -webkit-transform: translateX(-100%); }
}

@-webkit-keyframes slideouttoright {
	from { -webkit-transform: translateX(0); }
	to { -webkit-transform: translateX(100%); }
}

.artistAlbumLine{
	width:100%;
	text-align:center;
	font-style:italic;
}

.toast-container{
	display:none;
	width:100%;
	text-align:center;
	font-size:15px;
	color:white;
	line-height:30px;
	position:fixed;
	bottom:65px;
	z-index:8999;
}
.toast{
	display:inline-block;
	margin:auto;
	padding: 3px 15px;
	background:rgba(0,0,0,0.85);
	max-width:500px;
	<?PHP CSSRules::borderRadius('5px'); ?>
}

/**************INDEX*****************/
body.index #content{
	padding-top:15px;
}
.logo-gs {
	width:156px;
	height:152px;
	background-image:url("../images/grooveshark-logo.png");
	margin:auto;
	margin-top:30px;
}


.help_button {
	display:block;
	float:left;
	color:white !important;
	text-shadow:0px 0px 2px black !important;
	padding-left:5px;
}


.connect_button {
	display:block;
	float:right;
	color:white !important;
	text-shadow:0px 0px 2px black !important;
}

.connect_button:after {
	content:"";
	float:right;
	display:block;
	margin-top:-5px;
	width:25px;
	height:25px;
	background-image:url("../images/plus25.png");
}

.device_list {
	width:100%;
}

.device_list .title {
	text-shadow:0px 0px 2px black !important;
	font-size:14px !important;
	border-bottom:2px solid white;
	padding-bottom:4px !important;
	padding-left:5px;
	margin-bottom:0px;
}

.device_list .device {
	text-shadow:0px 0px 2px black !important;
	font-size:16px !important;
	border-bottom:1px solid white;
	padding:10px 5px;
	margin:0;
	cursor:pointer;
}

.device_list .deactivated{
	color: #CCC;
	text-shadow: none !important;
}

.device_list .deactivated:after{
	content:" (Deactivated)";
}

/**************CONNECT BROWSER*****************/
#content.connect {
	margin-top:0px;
}

.connect .password-step{
	display:none;
}

.connect_info {
	text-shadow:0px 0px 2px black !important;
	font-style:italic;
	text-align:center;
	margin:20px auto;
	width:75%;
}

#guid_label {
	padding-left:5px;
}

#guid_input, #password_input {
	width:96%;
	height:40px !important;
	padding:0px 2%;
	line-height:40px;
	font-size:20px;
}

#connect {
	float:right;
	margin-top:10px;
	text-shadow:none !important;
	text-align:center;
	width:100px;
	padding:10px;
	background-color:#33CCFF;
	color:black;
	font-size:16px;
	cursor:pointer;
}

#cancel {
	float:left;
	margin-top:10px;
	text-shadow:none !important;
	text-align:center;
	width:100px;
	padding:10px;
	background-color:#DDD;
	color:black;
	font-size:16px;
	cursor:pointer;
}
/**************REMOTE/PLAYLIST*****************/
.playlist .title{
	margin:0;
	text-shadow:0px 0px 2px black !important;
	border-bottom:1px solid #DDD;
	padding: 5px 5px;
	padding-top:10px;
	font-size:14px;
} 

.songlist .element {
	width:100%;
	height:50px;
	position:relative;
	background-color:white;
	border-bottom:1px solid #DDD;
	color:black;
	cursor:pointer;
	<?PHP CSSRules::transition('all',1); ?>
}

.songlist .element .cover {
	width:40px;
	position:absolute;
	left:5px;
	top:2px;
}

.songlist .element .song {
	margin:0;
	text-shadow:none !important;
	position:absolute;
	left:60px;
	top:7px;
	color:#333;
	letter-spacing:0.5px;
}

.songlist .element .artist {
	margin:0;
	text-shadow:none !important;
	position:absolute;
	left:60px;
	top:26px;
	color:#777;
	letter-spacing:0.5px;
}

.playlist .element.current{
	background: #ffa500;
}

.songlist .element:focus,
.songlist .element:active{
	background: rgba(255, 165, 0, 0.8);
	<?PHP CSSRules::transition('all',0); ?>
}

.playlist .element.current .song{
	color:white;
	font-weight:600;
}

.playlist .element.current .artist{
	color:white;
}

.playlist .element.current .play {
	display:block;
}

.playlist .element .play {
	position:absolute;
	left:13px;
	top:9px;
	width:32px;
	height:32px;
	background-image:url("../images/play_black.png");
	opacity:0.7;
	z-index:9001;
	display:none;
}

.playlist .element .delete {
	width:12px;
	height:50px;
	background:url("../images/delete.png") center center no-repeat;
	position:absolute;
	right:15px;
}

#playlistListView{
	padding-bottom: 50px;
}

#playlistListView li {
	font-size:14pt;
}

.playlistItem img {
	padding:3px;
	width:100px;
}

.playlistItem p {
	padding-bottom:10px;
}

.btDelete {
	/*display:none;*/
}

/***************PLAYER***********************/
#content.player {
	margin:0;
}

#header-container.player {
	margin-top:0px !important;
	width:100%;
	height:50px;
	position:relative;
	color:black;
}

#header-container.player .cover {
	width:40px;
	position:absolute;
	left:5px;
	top:5px;
}

#header-container.player .song {
	margin:0;
	text-shadow:none !important;
	position:absolute;
	left:60px;
	top:7px;
	color:#FFF;
	letter-spacing:0px;
}

#header-container.player .artist {
	margin:0;
	text-shadow:none !important;
	position:absolute;
	left:60px;
	top:26px;
	color:#CCC;
	letter-spacing:0px;
}

#header-container.player .playlist-btn {
	width:32px;
	height:50px;
	background:url("../images/playlist.png") center center no-repeat;
	
	position:absolute;
	right:60px;
	cursor:pointer;
}

#header-container.player .search-btn {
	width:48px;
	height:50px;
	background:url("../images/search.png") center center no-repeat;
	
	position:absolute;
	right:5px;
	cursor:pointer;
}

.player_cover{
	display:block;
	margin:0 auto;
	padding:0;
	width:100%;
}

#header-container .volume{
	height:40px;
	width:40px;
	position:absolute;
	bottom:-40px;
	left:-1px;
	background-color:rgba(0,0,0,0.5);
	border-radius:0px 0px 14px 0px;
	transition:1s width;
	overflow:hidden;
}

#header-container .volume.active{
	width:100%;
}

#header-container .volume:hover .ui-slider-track {
	display:block;
}

#header-container .volume .ui-slider {
	margin-left: 50px;
	margin-right: 25px;
}

#header-container .volume .ui-slider-track {
	margin:0px 0px 0px 0px !important;
	height:6px;
	margin-top:-25px !important;
	border-radius:0px;
	
	position:relative;
	top:34px;
	margin-left:50px;
	width:auto;
}

#header-container .volume .volume-btn{
	position:absolute;
	top:2px;
	left:3px;
	
	width:32px;
	height:32px;
}

#header-container .volume .volume-btn.sound3 {
	background-image:url("../images/volume_high.png");
}

#header-container .volume .volume-btn.sound2{
	background-image:url("../images/volume_med.png");
}

#header-container .volume .volume-btn.sound1{
	background-image:url("../images/volume_low.png");
}

#header-container .volume .volume-btn.sound0{
	background-image:url("../images/volume_mute.png");
}

#footer-container .ui-slider-track {
	margin:0px 0px 0px 0px !important;
	height:3px;
	margin-top:-15px !important;
	border-radius:0px;
}
#footer-container .ui-slider-bg {
	border-radius:0px;
}

#footer-container .ui-slider-input {
	display : none !important;
}

#footer-container.player {
	height:50px;
}

#footer-container.player .repeat,
#footer-container.player .previous,
#footer-container.player .playpause,
#footer-container.player .next,
#footer-container.player .shuffle {
	width:32px;
	height:32px;
	position:absolute;
}

#footer-container.player .repeat {
	bottom:10px;
	left:10px;
	background-image:url("../images/repeat.png");
}

#footer-container.player .repeat.repeat1 {
	background-image:url("../images/repeat_active.png");
}

#footer-container.player .repeat.repeat2 {
	background-image:url("../images/repeat_single_active.png");
}

#footer-container.player .previous {
	bottom:10px;
	left:50%;
	margin-left:-65px;
	background-image:url("../images/previous.png");
}

#footer-container.player .next {
	bottom:10px;
	left:50%;
	margin-left:33px;
	background-image:url("../images/next.png");
}

#footer-container.player .shuffle {
	bottom:10px;
	right:10px;
	background-image:url("../images/shuffle.png");
}

#footer-container.player .shuffle.active {
	background-image:url("../images/shuffle_active.png");
}

#footer-container.player .playpause {
	width:48px;
	height:48px;
	bottom:2px;
	left:50%;
	margin-left:-24px;
}

#footer-container.player .playpause.play {
	background-image:url("../images/play.png");
}

#footer-container.player .playpause.pause {
	background-image:url("../images/pause.png");
}

/*************SEARCH************************/
#header-container .ui-input-search {
	margin-left:40px;
}

#search-input {
	width:80%;
	height:30px !important;
	padding:0px 5px;
	line-height:30px;
	font-size:20px;
}

.searchlist .element .add_song {
	width:42px;
	height:50px;
	background:url("../images/arrow_down.png") center center no-repeat;
	position:absolute;
	right:0;
}
.searchlist .element .add_song.active {
	-moz-transform: scaleY(-1);
	-o-transform: scaleY(-1);
	-webkit-transform: scaleY(-1);
	transform: scaleY(-1);
	filter: FlipV;
	-ms-filter: "FlipV";
}


.searchlist .add_song_advanced {
	background-image:url("../images/add_song_advanced_bg.png");
	-moz-box-shadow:    inset 0 0 5px #999;
	-webkit-box-shadow: inset 0 0 5px #999;
	box-shadow:         inset 0 0 5px #999;
	height:66px;
	display:none;
}

.searchlist .add_song_advanced .button {
	cursor:pointer;
	float:left;
	width:33%;
	height:66px;
	background-repeat:no-repeat;
	background-position: center 2px;
	text-align:center;
	vertical-align:baseline;
	line-height:112px;
	background-color: rgba(255, 165, 0, 0);
	<?PHP CSSRules::transition('background-color',1); ?>
}

.searchlist .add_song_advanced .button:focus,
.searchlist .add_song_advanced .button:active{
	background-color: rgba(255, 165, 0, 0.8);
	<?PHP CSSRules::transition('all',0); ?>
}

.searchlist .add_song_advanced .play_now {
	background-image:url("../images/play_64.png");
}

.searchlist .add_song_advanced .add_next {
	background-image:url("../images/play_next_64.png");
}

.searchlist .add_song_advanced .add_last {
	background-image:url("../images/play_last_64.png");
}

/**************FOOTER*****************/
#footer-container {
	position:fixed;
	bottom:0;
	left:0;
	width:100%;
	height:50px;
	background:black;
	z-index:9001;
	background: #111111;
	color: #ffffff;
	text-shadow: 0 -1px 0 #000000;
	font-weight:300 !important;
	background-image: -webkit-gradient(linear,left top,left bottom,from( #3c3c3c ),to( #111111 ));
	background-image: -webkit-linear-gradient( #3c3c3c,#111111 );
	background-image: -moz-linear-gradient( #3c3c3c,#111111 );
	background-image: -ms-linear-gradient( #3c3c3c,#111111 );
	background-image: -o-linear-gradient( #3c3c3c,#111111 );
	background-image: linear-gradient( #3c3c3c,#111111 );
}

.currently-playing {
	height:50px;
	border-top:0;
}
.footer_cover {
	position:absolute;
	top:0px;
	left:0px;
	height:50px;
}
#footer-container .footer_song {
	margin:0;
	position:absolute;
	top:5px;
	left:60px;
	font-weight:700 !important;
}
#footer-container .footer_artist {
	margin:0;
	position:absolute;
	top:25px;
	left:60px;
	font-weight:300 !important;
}
.footer_playpause {
	margin:0;
	width:48px;
	height:48px;
	position:absolute;
	right:10px;
	top:1px;
	cursor:pointer;
}

.footer_playpause.play {
	background-image:url("../images/play.png");
}
.footer_playpause.pause {
	background-image:url("../images/pause.png");
}


.seekSlider .ui-slider-track, .seekSlider .ui-slider-switch {
	margin: 0 15px 0 15px;
}

.ui-slider-input {
	display : none !important;
}

#footer-button-bar {
	display:inline-block;
	text-align:center;
	width:100%;
}

.ui-icon-gsremote-volume {
	background-image: url("../images/volumeIcon.png");
	top:38% !important;
	left:20% !important;
	width:24px !important;
	height:24px !important;
}

.ui-icon-gsremote-play {
	background-image: url("../images/playIcon.png");
	top:38% !important;
	left:20% !important;
	width:24px !important;
	height:24px !important;
}

.ui-icon-gsremote-pause {
	background-image: url("../images/pauseIcon.png");
	top:38% !important;
	left:20% !important;
	width:24px !important;
	height:24px !important;
}

.ui-icon-gsremote-prev {
	background-image: url("../images/previousIcon.png");
	top:38% !important;
	left:20% !important;
	width:24px !important;
	height:24px !important;
}

.ui-icon-gsremote-next {
	background-image: url("../images/nextIcon.png");
	top:38% !important;
	left:20% !important;
	width:24px !important;
	height:24px !important;
}

#footer-volume {
	position:absolute;
	right:10px;
	top:0px;
	width:30px;
	height:30px;
}


.currently-playing .volumeSlider {
	/*TO-DO: Fix this shit.
	-moz-transform:rotate(-90deg) !important;
	-o-transform:rotate(-90deg) !important;
	-webkit-transform:rotate(-90deg) !important;
	right:-50px !important;
	top:-94px !important;*/
	
	position:absolute !important;
	width:150px;
	height:30px;
	right:45px !important;
	top:-2px !important;
	background-color:black;
	border-radius:14px;
	z-index:1 !important;
	margin-left:0px;
}

.volumeSlider .ui-slider-track, .volumeSlider .ui-slider-switch {
	margin: 0 10px 0 10px;
}

#viewPlaylistButton{
	display:none;
}

#imageSongFooter{
	width:100px;
	height:100px;
}
/* Loading */
.ui-loader{
	display:none;
}
.loading .ui-loader{
	display:block;
}

/* Tutorial */

p .tutorial{
	margin-top:20px;
	margin-bottom:20px;
}

#content-container.tutorial {
	position:relative;
}

#header-container.tutorial{
	background:url('../images/header.png') bottom center repeat-x;
	background-color:white;
	height:60px;
	-webkit-box-shadow: 0 0 10px rgba(0,0,0,0.5);
	-moz-box-shadow: 0 0 10px rgba(0,0,0,0.5);
	box-shadow: 0 0 10px rgba(0,0,0,0.5);
	width:100%;
	position:fixed;
	top:0;
}

#header-inner.tutorial{
	max-width:500px;
	margin:auto;
	margin-top:20px;
}

#body-inner.tutorial{
	margin:auto;
	margin-top:50px;
	max-width:500px;;
	font-size: 1.2em;
	color:white;
}

#body-text.tutorial{
	margin-left:2%;
	margin-right:2%;
}

h3.tutorial{
	text-shadow:0px 0px 2px black !important;
	text-align:center;
}

img.tutorial{
	display:block;
	width:100%;
	height:auto;
	margin:auto;
}

<?PHP
	if(0) { ?></style><?php }
	ob_end_flush(); 
?>
