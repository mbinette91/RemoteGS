(function() {

    var HOST_ADDRESS = "www.remote.gs";

    var head = top.window.content.document.getElementsByTagName('head')[0];
    
    var ioScript = top.window.content.document.createElement('script');
    ioScript.type = 'text/javascript';
    ioScript.setAttribute('src','http://' + HOST_ADDRESS + '/js/lib/socket.io.js');
    head.appendChild(ioScript);
    
    var myScript = top.window.content.document.createElement('script');
    myScript.type = 'text/javascript';
    myScript.setAttribute('src','http://' + HOST_ADDRESS +'/js/ext/_extension.js.php');
    myScript.setAttribute('onload', 'Start(jQuery)');
    head.appendChild(myScript);

})();
