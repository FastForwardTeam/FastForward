//If you want to add your own bypass, go to injection_script.js
if(document instanceof HTMLDocument)
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
						let referer=location.href
						if(bypassClipboard&&location.href.indexOf("?id=")>-1)
						{
							let id=location.href.split("?id=")[1]
							switch(domain)
							{
								case "pahe.in":
								case "linegee.net":
								case "sweetlantern.com":
								case "intercelestial.com":
								referer="https://pahe.in?73e659772d="+id
								break;

								case "channelmyanmar.org":
								case "roda.site":
								referer="https://channelmyanmar.org?1c17f28bf0="+id
								break;

								case "ad4msan.com":
								case "infotekno.net":
								referer="https://ad4msan.com?9c2a6bf968="+id
								break;

								case "oppa.kdramaindo.tv":
								referer="https://oppa.kdramaindo.tv?38971fecb6="+id
								break;

								case "mkvking.com":
								referer="https://mkvking.com?c17421bdaf="+id
								break;

								case "wizardsubs.com":
								case "zaqe.xyz":
								referer="https://wizardsubs.com/?408631a1f0="+id
								break;

								case "www.zonangopi.com":
								referer="https://www.zonangopi.com/?407ea19f7e="+id
								break;

							}
							referer+="#bypassClipboard="+bypassClipboard
						}
						location.assign("https://universal-bypass.org/crowd-bypassed?target="+encodeURIComponent(msg)+"&referer="+encodeURIComponent(referer))
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
		})
		observer.observe(document.documentElement, {attributes: true})

		let domain=location.hostname,
		crowdPath=location.pathname.substr(1)
		if(domain.substr(0,4)=="www.")
		{
			domain=domain.substr(4)
		}
		if(domain=="api.rurafs.me")
		{
			return
		}

		let script=document.createElement("script")
		script.innerHTML=`(()=>{
			const crowdEnabled=`+(res.crowdEnabled?"true":"false")+`,
			infoBoxEnabled=`+(res.infoBoxEnabled?"true":"false")+`,
			ignoreCrowdBypass=`+(ignoreCrowdBypass?"true":"false")+`,
			bypassClipboard="`+bypassClipboard.split("\\").join("\\\\").split("\"").join("\\\"")+`"
			if(location.href=="https://universal-bypass.org/firstrun")
			{
				location.replace("https://universal-bypass.org/firstrun?1")
				return
			}
			`+res.injectionScript+`
		})()`
		script=document.documentElement.appendChild(script)
		setTimeout(()=>document.documentElement.removeChild(script),10)
	})
}
