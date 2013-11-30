//v.1.0.0
/*String prototype*/
String.prototype.trim = function(){
	sString = this;
	while (sString.substring(0,1) == ' ')
		sString = sString.substring(1, sString.length); 
	while (sString.substring(sString.length-1, sString.length) == ' ')
		sString = sString.substring(0,sString.length-1); 
	return sString; 
};

String.prototype.normalize = function(){
	var str = this;
	var search = "ç,æ,œ,á,é,í,ó,ú,à,è,ì,ò,ù,ä,ë,ï,ö,ü,ÿ,â,ê,î,ô,û,å,e,i,ø,u".split(',');
	var replace = "c,ae,oe,a,e,i,o,u,a,e,i,o,u,a,e,i,o,u,y,a,e,i,o,u,a,e,i,o,u".split(',');
	for(var i = 0; i < search.length; i++)
		str = str.replace(search[i], replace[i]);
	var search = "Ç,Æ,Œ,Á,É,Í,Ó,Ú,À,È,Ì,Ò,Ù,Ä,Ë,Ï,Ö,Ü,Ÿ,Â,Ê,Î,Ô,Û,Å,E,I,Ø,U".split(',');
	var replace = "C,AE,OE,A,E,I,O,U,A,E,I,O,U,A,E,I,O,U,Y,A,E,I,O,U,A,E,I,O,U".split(',');
	for(var i = 0; i < search.length; i++)
		str = str.replace(search[i], replace[i]);
	str = str.toLowerCase();
	str = str.replace(/[^A-Za-z0-9_\-\.]/g,'');
	return str;
};

$.empty = function(a){
	return a == undefined || a == null || a == "" || a.toString().trim() == '' || a == 0;
};

$.replaceAll = function(html, map){
	for(i in map){
		while(html.indexOf(i) !== -1) 
			html = html.replace(i, map[i]);
	}
	return html;
};

$.scrollTo = function(el){
	var posY = 0;
	if(el) //else, scroll to top.
		var posY = $(el).offset().top;
	$('html,body').animate({ scrollTop: posY });
};

$.fn.exists = function(a){
	return this.length;
};

$.fn.equals = function(compareTo) {
  if (!compareTo || this.length != compareTo.length) {
    return false;
  }
  for (var i = 0; i < this.length; ++i) {
    if (this[i] !== compareTo[i]) {
      return false;
    }
  }
  return true;
};

$.fn.triggerSlide = function(target){
	if($(target).is(":visible"))
		$(target).slideUp();
	else
		$(target).slideDown();
}

jQuery.fn.outerhtml = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

AjaxErrorHandler = {
	handle: function(data){
		if(data['error_code'] == 'LOGIN')
			window.location = '/login';
		else{
			console.log('There was an error parsing your request. (#'+data['error_code']+')');
			console.log(data);
		}
	}
};

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
};

function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
};

function eraseCookie(name) {
    createCookie(name, "", -1);
};