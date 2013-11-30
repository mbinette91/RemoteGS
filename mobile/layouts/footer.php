		</div>
		<div class="toast-container"><div class='toast'></div></div>
		<!--<script src="http://cdn.socket.io/stable/socket.io.js"></script>-->
		<script src="/js/lib/socket.io.js"></script>
		<script src="/js/main.js.php"></script>
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