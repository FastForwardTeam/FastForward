chrome.runtime.setUninstallURL("https://goo.gl/forms/H8FswYQ2a37LSxc13");

chrome.runtime.onInstalled.addListener(function(details)
{
    if(details.reason == "install")
    {
    	window.open(chrome.extension.getURL("/firstrun/index.html"));
    }
});
