if(document instanceof HTMLDocument)
{
	let site = "general", scripts = {
		"general": "general.js",
		"adfoc.us": "adfocus.js",
		"linkshrink.net": "linkshrink.js",
		"cshort.org": "cshort.js",
		"croco.site": "croco.js",
		"srt.am": "shortam.js",
		"direkt-wissen.com": "linkvertise.js",
		"cpmlink.net": "cpmlink.js",
		"admy.link": "admylink.js",
		"viid.su": "viidsu.js",
		"sub2unlock.com": "sub2unlockcom.js",
		"fame4.me": "fame4me.js"
	};
	for(let domain in scripts)
	{
		if(domain != "general" && (window.location.host == domain || window.location.host.substr(window.location.host.length - (domain.length + 1)) == "." + domain))
		{
			site = domain;
		}
	}
	let script_ = scripts[site],
	isInline = (script_.substr(script_.length - 3) != ".js"),
	script = document.createElement("script");
	if(isInline)
	{
		script.textContent = "/* " + chrome.i18n.getMessage("injectionInline") + " */\n\n" + script_;
	}
	else
	{
		script.src = chrome.extension.getURL("/bypasses/" + script_);
	}
	if(site != "general")
	{
		script.setAttribute("data-" + chrome.i18n.getMessage("injectionAttr"), chrome.i18n.getMessage("appName"));
	}
	script = document.documentElement.appendChild(script);
	if(site == "general")
	{
		let comment = document.createComment(chrome.i18n.getMessage("injectionGeneral"));
		if(script.nextSibling)
		{
			comment = script.parentNode.insertBefore(comment, script.nextSibling);
		}
		else
		{
			comment = script.parentNode.appendChild(comment);
		}
	}
}
