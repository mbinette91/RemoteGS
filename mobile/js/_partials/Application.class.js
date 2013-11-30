//Here are the basic methods for a "Application".
function Application(){
	this.remote = 0;
	this.errorHandler = new ErrorHandler(this);
};

Application.prototype.isConnectedToServer = function(){ // Are we connected to the server?
	return this.remote && this.remote.isConnectedToServer();
}

Application.prototype.slideContent = function(dir){
	$('#content').wrapInner('<div class="transition-wrapper">');
	setTimeout(function(){$('#content').find('.transition-wrapper').addClass('out'+dir)},1); //Mini delay when manipulating the DOM and applying CSS3 transitions.
}

Application.prototype.loading = function(status){
	if(status == 'show'){
		$('html').addClass('loading');
	}
	else if(status == 'hide'){
		$('html').removeClass('loading');
	}
}

Application.prototype.showNotification = function(message){
	$('.toast-container .toast').html(message);
	$('.toast-container').fadeIn(400).delay(3000).fadeOut(400);
}

Application.prototype.goBack = function(){
	history.back();
}
Application.history = [ document.URL ];
Application.prototype.goto = function(original_url, add_to_history){
	var A = this;
	
	this.loading('show');
	
	if(add_to_history)
		Application.history.push(original_url)

	if(original_url.indexOf("?") !== -1)
		url=original_url+'&mode=ajax';
	else
		url=original_url+'?mode=ajax'
	$.ajax({
		url: url,
		success: function(data){
			if(add_to_history){
				var stateData = {url:original_url, hash:original_url};
				if(history.pushState)
					history.pushState(stateData, '', original_url);
				else if(history.replaceState)
					history.replaceState(stateData, '', original_url);
			}
			A.loading('hide');
			//Change URL on top too and add to stack for BACK browsing maybe (???)
			$('#page').html(''); //Don't put the data directly in there or the 'on' jQuery event bindings won't be attached!
			$('#page').append(data);
			A.preparePage(); //jQuery Mobile && other calls
			_gaq.push(['_trackPageview', original_url]);
		}
	});
}

Application.prototype.preparePage = function(){
	//jQuery Mobile preparation
	$('#page').trigger('pagecreate');
	
	//Execute JAVASCRIPT to prepare the page 
	var A = this;
	A.currentPage = new Page(A);
	$('#page').find("[type='javascript']").each(function(){
		var command = $(this).attr('cmd');
		Application.log('Found javascript instruction on new page, executing '+command+'.');
		if(command == 'init'){
			var c = $(this).attr('js-class');
			Application.log('- Executing '+command+' on '+c+'.');
			if(	window[c] && window[c] ){
				A.currentPage = new window[c](A);
			}
			var cl = $(this).attr('body-class');
			$('body').attr('class', cl);
			var title = $(this).attr('title');
			$('title').html(title);
		}
		$(this).remove();
	});
	A.currentPage.onStartUp();
	
	window.onpopstate = function(event){
		if(event.state){ //Do not trigger first visit.
			A.goto(event.state.url) //Trust the state!
		}
	}
}

Application.prototype.update = function(source, data){ //Observer pattern
	if(this.currentPage){
		//Quick refreshes
		if(data){
			if(data['type'] == 'notification'){
				var gs = this.remote.getCurrentGroovesharkClient();
				if(gs && data['from'] == gs.uid)
					this.showNotification(data['message']);
				return;
			}
			if(data['type'] == 'current-song'){
				this.currentPage.refreshPlayer();
				return;
			}
			if(data['type'] == 'playlist'){
				//Maybe we should do this more like subscriber ish... more dynamic.
				if(this.currentPage.refreshPlaylist)
					this.currentPage.refreshPlaylist();
				return;
			}
		}
		
		//Refresh everything!
		this.currentPage.refreshGroovesharkClient();
		if(this.currentPage.refreshGrooveSharkList){ //If we're on the index page
			this.currentPage.refreshGrooveSharkList();
		}
		this.currentPage.refreshHeader();
		this.currentPage.refreshFooter();
	}
}

Application.prototype.onStartUp = function(){
	$.mobile.defaultTransitionHandler = function(){} //KILL THIS
	var A = this;
	this.remote = new Remote();
	this.remote.addObserver(this);
	this.remote.init();
	this.preparePage();

	this.remote.listenTo('already-connected', function (data) {
		A.errorHandler.handleAlreadyConnected();
	});	
	
	this.remote.listenTo('invalid-receiver', function (data) {
		A.errorHandler.handleInvalidGroovesharkClient();
	});	
	
	this.remote.listenTo('disconnect', function (data) {
		A.errorHandler.handleLostConnection();
	});

	$(document).delegate('.goto', 'click', function(){
		A.slideContent('left');
		A.goto($(this).attr('href'), true);
		return false; //Don't change page!
	});
};