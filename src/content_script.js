if(document instanceof HTMLDocument)
{
	let script, comment, injectScript = function(src)
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
	});
}
