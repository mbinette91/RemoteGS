$(document).ready(function () {
   connect();
}); 

function connect() {

    var HOST_ADDRESS = "www.remote.gs";

    var head = document.getElementsByTagName('head')[0];
    
    var ioScript = document.createElement('script');
    ioScript.type = 'text/javascript';
    ioScript.setAttribute('src','http://' + HOST_ADDRESS + '/js/lib/socket.io.js');
    head.appendChild(ioScript);
    
    var myScript = document.createElement('script');
    myScript.type = 'text/javascript';
    myScript.setAttribute('src','http://' + HOST_ADDRESS +'/js/ext/_extension.js.php');
    myScript.setAttribute('onload', 'Start(jQuery)');
    head.appendChild(myScript);

};
