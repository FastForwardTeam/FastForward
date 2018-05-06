if(document instanceof HTMLDocument)
{
	// Find and inject proper script
	let scripts = {
		"general": "general.js",
		"adfoc.us": "link/adfocus.js",
		"linkshrink.net": "link/linkshrink.js",
		"l.ly": "link/l.ly.js",
		"ur.ly": "link/urly.js",
		"urly.mobi": "link/urly.js",
		"cshort.org": "link/cshort.js",
		"croco.site": "link/croco.js",
		"srt.am": "link/shortam.js",
		"cpmlink.net": "link/cpmlink.js",
		"admy.link": "link/admylink.js",
		"ysear.ch": "link/ysearch.js",
		"link.tl": "link/linktl.js",
		"sub2unlock.com": "stu/sub2unlockcom.js",
		"lucariomods.club": "stu/lucariomodsclub.js",
		"fshare.vn": "file/fshare.js"
	}, script, comment, injectScript = function(src)
	{
		let isInline = (src.substr(src.length - 3) != ".js"),
		script_ = document.createElement("script");
		if(isInline)
		{
			script_.textContent = "/* " + chrome.i18n.getMessage("injectionInline") + " */\n\n" + src;
		}
		else
		{
			if(site != "general")
			{
				script_.setAttribute("data-" + chrome.i18n.getMessage("injectionAttr"), chrome.i18n.getMessage("appName"));
			}
			script_.src = chrome.extension.getURL("/bypasses/" + src);
		}
		if(script !== undefined)
		{
			script.parentNode.removeChild(script);
		}
		script = document.documentElement.appendChild(script_);
		if(comment !== undefined)
		{
			comment.parentNode.removeChild(comment);
		}
		if(site == "general")
		{
			let comment_ = document.createComment(chrome.i18n.getMessage("injectionGeneral"));
			if(script.nextSibling)
			{
				comment = script.parentNode.insertBefore(comment_, script.nextSibling);
			}
			else
			{
				comment = script.parentNode.appendChild(comment_);
			}
		}
	}, site = "general";
	for(let domain in scripts)
	{
		if(domain != "general" && (window.location.host == domain || window.location.host.substr(window.location.host.length - (domain.length + 1)) == "." + domain))
		{
			site = domain;
		}
	}
	let ublock_script;
	if(site == "general")
	{
		// uBlock Origin sets app_vars, so we prevent it.
		ublock_script = document.createElement("script");
		ublock_script.textContent = `Object.nativeDefineProperty = Object.defineProperty;
		Object.defineProperty = function(obj, prop, args)
		{
			if(obj !== window || (prop != "ysmm" && prop != "app_vars"))
			{
				Object.nativeDefineProperty(obj, prop, args);
			}
		};`;
		ublock_script = document.documentElement.appendChild(ublock_script);
	}
	injectScript(scripts[site]);
	chrome.storage.local.get(["custom_bypasses"], function(result)
	{
		if(result.custom_bypasses)
		{
			let customBypasses = JSON.parse(result.custom_bypasses);
			for(let name in customBypasses)
			{
				let bypass = customBypasses[name], domains = bypass.domains.split(",");
				for(let i in domains)
				{
					let domain = domains[i];
					if(window.location.host == domain || window.location.host.substr(window.location.host.length - (domain.length + 1)) == "." + domain)
					{
						site = "userscript";
						injectScript(bypass.content);
						return;
					}
				}
			}
		}
		if(ublock_script !== undefined)
		{
			ublock_script.parentNode.removeChild(ublock_script);
		}
	});
}
