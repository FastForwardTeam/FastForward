//If you want to add your own bypass, go to injection_script.js
if(document instanceof Document)
{
	let clipboardIndex=location.hash.indexOf("#bypassClipboard="),ignoreCrowdBypass=false,bypassClipboard=""
	if(location.hash.substr(-18)=="#ignoreCrowdBypass")
	{
		ignoreCrowdBypass=true
		location.hash=location.hash.substr(0,location.hash.length-18)
	}
	if(clipboardIndex!=-1)
	{
		bypassClipboard=location.hash.substr(clipboardIndex+17)
		location.hash=location.hash.substr(0,location.hash.length-bypassClipboard.length-17)
	}
	if(location.hash.substr(-18)=="#ignoreCrowdBypass")
	{
		ignoreCrowdBypass=true
		location.hash=location.hash.substr(0,location.hash.length-18)
	}
	const simplifyDomain=domain=>{
		if(domain.substr(0,4)=="www.")
		{
			domain=domain.substr(4)
		}
		return domain
	}
	const brws=(typeof browser=="undefined"?chrome:browser)
	brws.runtime.sendMessage({type: "content"}, res => {
		if(!res.enabled)
		{
			return
		}
		const channel = res.channel,
		observer = new MutationObserver(mutations => {
			if(document.documentElement.hasAttribute(channel.stop_watching))
			{
				document.documentElement.removeAttribute(channel.stop_watching)
				observer.disconnect()
			}
			else if(document.documentElement.hasAttribute(channel.count_it))
			{
				document.documentElement.removeAttribute(channel.count_it)
				brws.runtime.sendMessage({type:"count-it"})
			}
			else if(document.documentElement.hasAttribute(channel.crowd_referer))
			{
				referer=document.documentElement.getAttribute(channel.crowd_referer)
				document.documentElement.removeAttribute(channel.crowd_referer)
			}
			else if(document.documentElement.hasAttribute(channel.crowd_domain))
			{
				domain=simplifyDomain(document.documentElement.getAttribute(channel.crowd_domain))
				document.documentElement.removeAttribute(channel.crowd_domain)
			}
			else if(document.documentElement.hasAttribute(channel.crowd_path))
			{
				crowdPath=document.documentElement.getAttribute(channel.crowd_path)
				document.documentElement.removeAttribute(channel.crowd_path)
			}
			else if(document.documentElement.hasAttribute(channel.crowd_query))
			{
				document.documentElement.removeAttribute(channel.crowd_query)
				let port=brws.runtime.connect({name: "crowd-query"})
				port.onMessage.addListener(msg=>{
					if(msg=="")
					{
						document.documentElement.setAttribute(channel.crowd_queried, "")
					}
					else
					{
						location.assign("https://fastforward.team/crowd-bypassed?target="+encodeURIComponent(msg)+"&referer="+encodeURIComponent(referer))
						//The background script will intercept the request and redirect to html/crowd-bypassed.html
					}
					port.disconnect()
				})
				port.postMessage({domain, crowdPath})
			}
			else if(document.documentElement.hasAttribute(channel.crowd_contribute))
			{
				const target=document.documentElement.getAttribute(channel.crowd_contribute)
				document.documentElement.removeAttribute(channel.crowd_contribute)
				brws.runtime.sendMessage({
					type: "crowd-contribute",
					data: "domain="+encodeURIComponent(domain)+"&path="+encodeURIComponent(crowdPath)+"&target="+encodeURIComponent(target)
				})
			}
			else if(document.documentElement.hasAttribute(channel.adlinkfly_info))
			{
				document.documentElement.removeAttribute(channel.adlinkfly_info)
				if(crowdPath==location.pathname.substr(1))
				{
					let port=brws.runtime.connect({name: "adlinkfly-info"})
					port.onMessage.addListener(msg=>{
						document.documentElement.setAttribute(channel.adlinkfly_target, msg)
						port.disconnect()
					})
					port.postMessage(location.href)
				}
				else
				{
					document.documentElement.setAttribute(channel.adlinkfly_target, "")
				}
			}
			else if(document.documentElement.hasAttribute(channel.bypass_clipboard))
			{
				const clipboard=document.documentElement.getAttribute(channel.bypass_clipboard)
				document.documentElement.removeAttribute(channel.bypass_clipboard)
				brws.runtime.sendMessage({
					type: "bypass-clipboard",
					data: clipboard
				})
			}
		})
		observer.observe(document.documentElement, {attributes: true})

		let domain=simplifyDomain(location.hostname),
		crowdPath=location.pathname.substr(1),
		referer=location.href

		//ffclipboard reciever
		window.addEventListener("message", function(event) {
			// We only accept messages from ourselves
			if (event.source != window) {
				return;
			}
			if (event.data.type === "ffclipboardSet") {
				brws.storage.local.set({ff_clipboard: event.data.text})
			}
		});
		brws.storage.local.get('ff_clipboard', function(result) {
			ffClipboard_stored = result.ff_clipboard

			//encodeURIcomponent and replace whatever's not encoded, https://stackoverflow.com/a/16435373/17117909
			ffClipboard_stored = encodeURIComponent(ffClipboard_stored).replace(/\-/g, "%2D").replace(/\_/g, "%5F").replace(/\./g, "%2E").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29")
			let script=document.createElement("script")
			script.innerHTML=`(()=>{
				const crowdEnabled=`+(res.crowdEnabled?"true":"false")+`,
				ignoreCrowdBypass=`+(ignoreCrowdBypass?"true":"false")+`,
				bypassClipboard="`+bypassClipboard.split("\\").join("\\\\").split("\"").join("\\\"")+`"
				let ffClipboard_stored="`+ffClipboard_stored+`"
				if(location.href=="https://fastforward.team/firstrun")
				{
					location.replace("https://fastforward.team/firstrun?1")
					return
				}
				`+res.injectionScript+`
			})()`
			script=document.documentElement.appendChild(script)
			setTimeout(()=>document.documentElement.removeChild(script),10)
	});
	})
}
