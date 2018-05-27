let r=chrome.runtime;
r.onInstalled.addListener((d)=>{if(d.reason=="install")window.open(chrome.extension.getURL("/html/firstrun.html"))});
r.setUninstallURL("https://goo.gl/forms/H8FswYQ2a37LSxc13");
