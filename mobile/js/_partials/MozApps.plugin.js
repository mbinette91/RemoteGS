//TO-DO: 	Here is the code for Mozilla Firefox App integration (The Install Screen)
//			We want to prompt the FFOS user to download our app the first time he arrives on our site.
(function(){
	function install() {
		var manifest_url = Application.BASE_URL+"/manifest.webapp";
		var myapp = navigator.mozApps.install(manifest_url);
		myapp.onsuccess = function(data) {
			// App is installed, leave him alone!
		};
		myapp.onerror = function() {
			// App wasn't installed, info is in
			// installapp.error.name
		};
	};
	
	var pattern_ffos=/Mobile.*Firefox/g;
	if(navigator && navigator.mozApps && pattern_ffos.test(navigator.userAgent)) { //Only on Firefox OS Mobile!
		var request = navigator.mozApps.checkInstalled(Application.BASE_URL+"/manifest.webapp");
		request.onsuccess = function() {
			if (request.result) {
				//If it's installed, leave him alone!
			} else {
				install();
			}
		};
		request.onerror = function() {
			console.log('Error checking installation status: ' + this.error.message);
		};
	} else {
		$('#installButton').hide();
	}
})();
