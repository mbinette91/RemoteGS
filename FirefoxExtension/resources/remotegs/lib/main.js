// This is an active module of the n1kk0r (1) Add-on
exports.main = function() {

    var pageMod = require("sdk/page-mod");
    
    var self = require("sdk/self");
    
    pageMod.PageMod({
        include: "*.grooveshark.com",
        contentScriptFile: self.data.url("extension.js"),
        attachTo: "top"
    });

};