<?PHP
	require_once('../configs/config.php');

	require_once('browsercheck.php');
?><!DOCTYPE html>
<html>
	<head>
		<!--Created by:
			Mathieu Binette,
			Émile Filteau-Tessier,
			Marc-Antoine Hinse,
			Jérôme Gingras	
		-->
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Grooveshark Remote</title>
		
		<link rel="icon" type="image/png" href="images/favicon.png" />
		<link rel="stylesheet" type="text/css" href="css/index.css"/>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
		<script type="text/javascript" src="js/ext/jquery.konami.min.js"></script>
		<script type="text/javascript">
			 $( window ).konami({
				cheat: function() {
					var s = document.createElement('script'); 
					s.type='text/javascript';
					document.body.appendChild(s);
					s.src='//hi.kickassapp.com/kickass.js';
				}
			});
		</script>
		<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/hhnjbalmjilhihkcmlclbaplnmnalfdi">
	</head>
	<body>
		<div id="content-container">
			<div id="header-container">
				<div id="header-inner">
					<div id="logo">
						<div id="header-text">
							Grooveshark Remote
						</div>
					</div>
					<a href="http://m.remote.gs" id="remote-button">Go to Remote</a>
				</div>
			</div>
			<div id="present-container">
				<div id="present-inner">
					<div id="present-text">
						Control your Grooveshark player from any browser!
					</div>
					<div id="present-extension">
						Download your extension here
						<div id="present-extension-logos">
							<a class="extension" href="ext/FirefoxExtension.xpi"><img src="images/firefoxLogo.png" /></a>
							<a class="extension" href="" onclick="chrome.webstore.install()"><img src="images/chromeLogo.png" /></a>
							<a class="extension" href="ext/SafariExtension.safariextz"><img src="images/safariLogo.png" /></a>
						</div>
					</div>
					<div id="present-phone" ></div>
				</div>
			</div>
			<div id="body-container">
				<div id="body-inner">
					<div id="body-text">
						<p id="first-paragraph-photo">
							Remote.GS is an extension for 
								<a href="http://www.mozilla.org/en-US/firefox/new/">Firefox</a>
							, 
								<a href="https://www.google.com/intl/fr/chrome/browser/">Chrome</a>
							and
								<a href="http://www.apple.com/ca/safari/">Safari</a>
							that allows users to manage their computer's playlist from their mobile phone.
						</p>
						<h3>Desktop</h3>
						<p>
							The first thing you need to do is install the extension found at the top of this page.
						</p>
						<p>
							When you are done installing the extension, just fire up
								<a href="http://www.grooveshark.com">Grooveshark</a>
							and you will be given an Identification Number. From there, you can change the name of your computer
							or add a password to connect to the session.
						</p>
						<h3>Remote</h3>
						<p>
							Now that your desktop is set up, you can manage your playlist using any mobile phone, tablet or desktop by visiting our 
								<a href="http://m.remote.gs">mobile site</a>.
							To pair your device with your Grooveshark playlist, you will need to enter the Identification Number provided by Grooveshark 
							on your mobile device. If you defined a password for your Grooveshark playlist, you will be prompted to enter it.
						</p>
						<p>	
							Once you are connected, you can then manage your playlist, skip songs, delete or add new songs, 
							view the currently playing song on the player and change the volume.
						</p>
					</div>
				</div>
			</div>
		</div>
		<script>
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', '<?PHP echo GOOGLE_ANALYTICS_ID; ?>']);
			_gaq.push(['_trackPageview']);

			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</body>
</html>
