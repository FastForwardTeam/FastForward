chrome.runtime.onInstalled.addListener(function(details)
{
	if(details.reason == "install")
	{
		window.open(chrome.extension.getURL("/html/firstrun.html"));
	}
});
chrome.runtime.setUninstallURL("https://goo.gl/forms/H8FswYQ2a37LSxc13");
