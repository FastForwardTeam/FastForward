const brws=(typeof browser=="undefined"?chrome:browser),
firefox=(brws.runtime.getURL("").substr(0,4)=="moz-"),
extension_version=brws.runtime.getManifest().version,
definitions_version="",
getRedirect=(url,referer,safe_in)=>{
	if(!isGoodLink(url))
	{
		return
	}
	let redirectUrl=brws.runtime.getURL("html/before-navigate.html")+"?target="+encodeURIComponent(url)
	if(referer)
	{
		redirectUrl+="&referer="+encodeURIComponent(referer)
	}
	if(safe_in!==undefined)
	{
		redirectUrl+="&safe_in="+safe_in
	}
	countIt()
	return {redirectUrl}
},
encodedRedirect=(url,referer,safe_in)=>getRedirect(decodeURIComponent(url),referer,safe_in),
isGoodLink=link=>{
	if(!link||link.substr(0,6)=="about:"||link.substr(0,11)=="javascript:")//jshint ignore:line
	{
		return false
	}
	try
	{
		new URL(link)
	}
	catch(e)
	{
		return false
	}
	return true
},
countIt=()=>{
	brws.storage.local.set({bypass_counter:++bypassCounter})
	sendToOptions({bypassCounter})
},
resetCounter=()=>{
	bypassCounter=0
	brws.storage.local.set({bypass_counter:0})
	sendToOptions({bypassCounter})
}

// Install handler
brws.runtime.onInstalled.addListener(details=>{
	if(details.reason=="install")
	{
		brws.tabs.create({url:"https://universal-bypass.org/firstrun"})
	}
})

// Uninstall handler
brws.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSdXw-Yf5IaDXZWw4fDHroZkDFOF6hgWEvVDaXT9ZADqnF2reg/viewform")

// Keeping track of options
var bypassCounter=0,enabled=true,instantNavigation=true,trackerBypassEnabled=true,instantNavigationTrackers=false,blockIPLoggers=true,crowdEnabled=true,userScript=""
brws.storage.sync.get(["disable","navigation_delay","no_tracker_bypass","no_instant_navigation_trackers","allow_ip_loggers","crowd_bypass","crowd_bypass_opt_out","crowd_open_delay","crowd_close_delay","no_info_box"],res=>{
	if(res)
	{
		enabled=(!res.disable||res.disable!=="true")
		if(!enabled)
		{
			brws.browserAction.setIcon({path: {
				"48": "icon_disabled/48.png",
				"128": "icon_disabled/128.png",
				"150": "icon_disabled/150.png",
				"176": "icon_disabled/176.png",
				"512": "icon_disabled/512.png"
			}})
		}
		if(res.navigation_delay)
		{
			instantNavigation=(res.navigation_delay==0)
			if(res.navigation_delay==61)
			{
				brws.storage.sync.set({navigation_delay:-1})
			}
		}
		else
		{
			brws.storage.sync.set({navigation_delay:0})
		}
		trackerBypassEnabled=(res.no_tracker_bypass!=="true")
		instantNavigationTrackers=(res.no_instant_navigation_trackers!=="true")
		blockIPLoggers=(res.allow_ip_loggers!=="true")
		if(res.crowd_bypass)
		{
			crowdEnabled=(res.crowd_bypass==="true")
		}
		else
		{
			crowdEnabled=(res.crowd_bypass_opt_out==="false"||!firefox)
			if(crowdEnabled)
			{
				brws.storage.sync.set({crowd_bypass:"true"})
			}
			if(res.crowd_bypass_opt_out)
			{
				brws.storage.sync.remove(["crowd_bypass_opt_out"])
			}
		}
		if(!res.crowd_open_delay||res.crowd_open_delay==61)
		{
			brws.storage.sync.set({crowd_open_delay:-6})
		}
		if(!res.crowd_close_delay||res.crowd_close_delay==61)
		{
			brws.storage.sync.set({crowd_close_delay:-11})
		}
		if(res.no_info_box)
		{
			brws.storage.sync.remove(["no_info_box"])
		}
	}
})
brws.storage.onChanged.addListener(changes=>{
	if(changes.disable)
	{
		enabled=(changes.disable.newValue!=="true")
		if(enabled)
		{
			brws.browserAction.setIcon({path: {
				"48": "icon/48.png",
				"128": "icon/128.png",
				"150": "icon/150.png",
				"176": "icon/176.png",
				"512": "icon/512.png"
			}})
		}
		else
		{
			brws.browserAction.setIcon({path: {
				"48": "icon_disabled/48.png",
				"128": "icon_disabled/128.png",
				"150": "icon_disabled/150.png",
				"176": "icon_disabled/176.png",
				"512": "icon_disabled/512.png"
			}})
		}
	}
	if(changes.navigation_delay)
	{
		instantNavigation=(changes.navigation_delay.newValue==0)
	}
	if(changes.no_tracker_bypass)
	{
		trackerBypassEnabled=(changes.no_tracker_bypass.newValue!=="true")
	}
	if(changes.no_instant_navigation_trackers)
	{
		instantNavigationTrackers=(changes.no_instant_navigation_trackers.newValue!=="true")
	}
	if(changes.allow_ip_loggers)
	{
		blockIPLoggers=(changes.allow_ip_loggers.newValue!=="true")
	}
	if(changes.crowd_bypass)
	{
		crowdEnabled=(changes.crowd_bypass.newValue==="true")
	}
	if(changes.userscript)
	{
		userScript=changes.userscript.newValue
	}
	refreshInjectionScript()
})

// Bypass definition management
let updateStatus = "", injectionScript = "", preflightRules = {}, upstreamInjectionScript = "", upstreamCommit, channel = {}, optionsTab, optionsPort
const updateBypassDefinitions = callback => {
	if(updateStatus != "")
	{
		return
	}
	if(typeof callback != "function")
	{
		callback = () => {}
	}
	updateStatus = "checking"
	sendToOptions({updateStatus})
	const finishDownload = () => {
		channel = {}
		let uniqueness = []
		;["stop_watching","count_it","crowd_referer","crowd_path","crowd_query","crowd_queried","crowd_contribute","adlinkfly_info","adlinkfly_target"].forEach(name => {
			let val
			do
			{
				val = Math.random().toString().substr(2)
			}
			while(uniqueness.indexOf(val) != -1);
			uniqueness.push(val)
			upstreamInjectionScript = upstreamInjectionScript.split("{{channel."+name+"}}").join(channel[name] = "data-" + val)
		})
		;["infoFileHoster","infoOutdated","crowdWait","crowdDisabled"].forEach(name => {
			upstreamInjectionScript = upstreamInjectionScript.split("{{msg."+name+"}}").join(brws.i18n.getMessage(name).split("\\").join("\\\\").split("\"").join("\\\""))
		})
		upstreamInjectionScript = upstreamInjectionScript.split("{{icon/48.png}}").join(brws.runtime.getURL("icon/48.png"))
		refreshInjectionScript()
		updateStatus = ""
		sendToOptions({upstreamCommit, updateStatus})
	}
	let xhr = new XMLHttpRequest()
	xhr.onload = () => {
		updateStatus = "updating"
		upstreamCommit = definitions_version
		sendToOptions({upstreamCommit, updateStatus})
		callback(true)
		upstreamInjectionScript = xhr.responseText
		xhr = new XMLHttpRequest()
		xhr.open("GET", brws.runtime.getURL("rules.json"), true)
		xhr.onload = () => {
			preflightRules = JSON.parse(xhr.responseText)
			finishDownload()
		}
		xhr.send()
	}
	if(definitions_version==="")
	{
		xhr.onerror = () => {
			let xhr = new XMLHttpRequest()
			xhr.onload = () => {
				const latestCommit = JSON.parse(xhr.responseText).sha
				if(latestCommit == upstreamCommit)
				{
					updateStatus = ""
					sendToOptions({updateStatus})
					callback(false)
				}
				else
				{
					updateStatus = "updating"
					if(upstreamCommit == "")
					{
						sendToOptions({upstreamCommit: latestCommit})
					}
					sendToOptions({updateStatus})
					callback(true)
					upstreamCommit = latestCommit
					let downloads = 0
					xhr = new XMLHttpRequest()
					xhr.onload = () => {
						upstreamInjectionScript = xhr.responseText
						if(++downloads == 2)
						{
							finishDownload()
						}
					}
					xhr.onerror = () => {
						if(++downloads == 2)
						{
							finishDownload()
						}
					}
					xhr.open("GET", "https://raw.githubusercontent.com/Sainan/Universal-Bypass/" + upstreamCommit + "/injection_script.js", true)
					xhr.send()
					let xhr2 = new XMLHttpRequest()
					xhr2.onload = () => {
						preflightRules = JSON.parse(xhr2.responseText)
						if(++downloads == 2)
						{
							finishDownload()
						}
					}
					xhr2.onerror = () => {
						if(++downloads == 2)
						{
							finishDownload()
						}
					}
					xhr2.open("GET", "https://raw.githubusercontent.com/Sainan/Universal-Bypass/" + upstreamCommit + "/rules.json", true)
					xhr2.send()
				}
			}
			xhr.onerror = () => {
				updateStatus = ""
				sendToOptions({updateStatus})
				callback(false)
			}
			xhr.open("GET", "https://api.github.com/repos/Sainan/Universal-Bypass/commits/master", true)
			xhr.send()
		}
	}
	xhr.open("GET", brws.runtime.getURL("injection_script.js"), true)
	xhr.send()
},
refreshInjectionScript = () => {
	Object.values(onBeforeRequest_rules).forEach(func => brws.webRequest.onBeforeRequest.removeListener(func))
	Object.values(onBeforeSendHeaders_rules).forEach(func => brws.webRequest.onBeforeSendHeaders.removeListener(func))
	Object.values(onHeadersReceived_rules).forEach(func => brws.webRequest.onHeadersReceived.removeListener(func))
	if(enabled)
	{
		injectionScript = (upstreamInjectionScript + "\n" + userScript)
		.split("UNIVERSAL_BYPASS_INTERNAL_VERSION").join("8")
		.split("UNIVERSAL_BYPASS_EXTERNAL_VERSION").join(extension_version)
		.split("UNIVERSAL_BYPASS_INJECTION_VERSION").join(upstreamCommit?upstreamCommit.substr(0,7):"dev")
		Object.keys(preflightRules).forEach(name=>{
			if(name in onBeforeRequest_rules)
			{
				brws.webRequest.onBeforeRequest.addListener(onBeforeRequest_rules[name],{types:["main_frame"],urls:preflightRules[name]},["blocking"])
			}
			else if(name in onBeforeSendHeaders_rules)
			{
				brws.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders_rules[name],{types:["main_frame","xmlhttprequest"],urls:preflightRules[name]},["blocking","requestHeaders"])
			}
			else if(name in onHeadersReceived_rules)
			{
				brws.webRequest.onHeadersReceived.addListener(onHeadersReceived_rules[name],{types:["main_frame"],urls:preflightRules[name]},["blocking","responseHeaders"])
			}
		})
	}
},
sendToOptions = data => {
	if(optionsPort)
	{
		optionsPort.postMessage(data)
	}
}
if(!definitions_version)
{
	brws.alarms.create("update-bypass-definitions", {periodInMinutes: 60})
	brws.alarms.onAlarm.addListener(alert => {
		console.assert(alert.name == "update-bypass-definitions")
		updateBypassDefinitions()
	})
}

// Messaging
brws.runtime.onMessage.addListener((req, sender, respond) => {
	switch(req.type)
	{
		case "content":
		respond({enabled, channel, crowdEnabled, injectionScript})
		break;

		case "count-it":
		countIt()
		break;

		case "open-tab":
		brws.tabs.create({
			url: req.url
		})
		break;

		case "close-tab":
		brws.tabs.remove(sender.tab.id)
		break;

		case "crowd-contribute":
		if(crowdEnabled)
		{
			let xhr=new XMLHttpRequest()
			xhr.open("POST","https://universal-bypass.org/crowd/contribute_v1",true)
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
			xhr.send(req.data)
		}
		else
		{
			console.warn("Unexpected message:", req)
		}
		break;

		default:
		console.warn("Invalid message:", req)
	}
})
brws.runtime.onConnect.addListener(port => {
	switch(port.name)
	{
		case "options":
		if(optionsTab)
		{
			optionsPort.disconnect()
			brws.tabs.remove(optionsTab)
		}
		optionsTab=port.sender.tab.id
		optionsPort=port
		port.onDisconnect.addListener(()=>{
			optionsTab=undefined
			optionsPort=undefined
		})
		port.onMessage.addListener(req=>{
			switch(req.type)
			{
				case "update":
				updateBypassDefinitions(updateSuccess => port.postMessage({updateSuccess}))
				break;
			}
		})
		port.postMessage({updateStatus, upstreamCommit, bypassCounter, userScript, extension_version, amo: !!definitions_version})
		break;

		case "crowd-query":
		port.onMessage.addListener(msg=>{
			let xhr=new XMLHttpRequest()
			xhr.onreadystatechange=()=>{
				if(xhr.readyState==4)
				{
					port.postMessage(xhr.status==200&&xhr.responseText!=""?xhr.responseText:"")
				}
			}
			xhr.open("POST","https://universal-bypass.org/crowd/query_v1",true)
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
			xhr.send("domain="+encodeURIComponent(msg.domain)+"&path="+encodeURIComponent(msg.crowdPath))
		})
		break;

		case "adlinkfly-info":
		port.onMessage.addListener(msg=>{
			let xhr=new XMLHttpRequest(),t="",iu=msg
			xhr.onload=()=>{
				let i=new DOMParser().parseFromString(xhr.responseText,"text/html").querySelector("img[src^='//api.miniature.io']")
				if(i)
				{
					let url=new URL(i.src)
					if(url.search&&url.search.indexOf("url="))
					{
						t=decodeURIComponent(url.search.split("url=")[1].split("&")[0])
					}
				}
				port.postMessage(t)
			}
			xhr.onerror=()=>port.postMessage(t)
			if(iu.substr(-1) != "/")
			{
				iu += "/"
			}
			xhr.open("GET", iu+"info", true)
			xhr.send()
		})
		break;

		default:
		console.warn("Invalid connection:", port)
	}
})

// Internal redirects to extension URLs to bypass content script limitations
brws.webRequest.onBeforeRequest.addListener(details=>{
	return {redirectUrl:brws.runtime.getURL("html/noscript.html")}
},{types:["main_frame"],urls:["*://universal-bypass.org/firstrun?0"]},["blocking"])
brws.webRequest.onBeforeRequest.addListener(details=>{
	return {redirectUrl:brws.runtime.getURL("html/options.html#firstrun")}
},{types:["main_frame"],urls:["*://universal-bypass.org/firstrun?1"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	let arr=details.url.substr(45).split("&referer="),url=arr[0],safe_in
	arr=arr[1].split("&safe_in=")
	if(arr.length>1)
	{
		safe_in=arr[1]
	}
	return encodedRedirect(url,decodeURIComponent(arr[0]),safe_in)
},{types:["main_frame"],urls:["*://universal-bypass.org/bypassed?target=*&referer=*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	countIt()
	return {redirectUrl:brws.runtime.getURL("html/crowd-bypassed.html")+details.url.substr(43)}
},{types:["main_frame"],urls:["https://universal-bypass.org/crowd-bypassed?*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	return {redirectUrl:brws.runtime.getURL("html/options.html")+details.url.substr(36)}
},{types:["main_frame"],urls:["https://universal-bypass.org/options*"]},["blocking"])

// Navigation handling including presenting referer header to destinations
var refererCache={}
brws.webRequest.onBeforeRequest.addListener(details=>{
	let arr=details.url.substr(45).split("&referer=")
	arr[0]=(new URL(decodeURIComponent(arr[0]))).toString()
	if(arr.length>1)
	{
		refererCache[arr[0]]=decodeURIComponent(arr[1].split("&")[0])
	}
	return {redirectUrl:arr[0]}
},{types:["main_frame"],urls:["*://universal-bypass.org/navigate?target=*"]},["blocking"])

let infoSpec=["blocking","requestHeaders"]
if("EXTRA_HEADERS" in brws.webRequest.OnBeforeSendHeadersOptions)
{
	infoSpec.push("extraHeaders")
}
brws.webRequest.onBeforeSendHeaders.addListener(details=>{
	if(enabled&&details.url in refererCache)
	{
		details.requestHeaders.push({
			name: "Referer",
			value: refererCache[details.url]
		})
		return {requestHeaders: details.requestHeaders}
	}
},{types:["main_frame"],urls:["<all_urls>"]},infoSpec)

brws.webRequest.onBeforeRedirect.addListener(details=>{
	if(enabled&&details.url in refererCache)
	{
		if(details.redirectUrl == details.url + "/")
		{
			refererCache[details.redirectUrl] = refererCache[details.url]
		}
		delete refererCache[details.url]
	}
},{types:["main_frame"],urls:["<all_urls>"]})

brws.webRequest.onCompleted.addListener(details=>{
	if(enabled&&details.url in refererCache)
	{
		delete refererCache[details.url]
	}
},{types:["main_frame"],urls:["<all_urls>"]})

// Preflight Bypasses including Tracker Bypass using Apimon.de
function resolveRedirect(url)
{
	let xhr=new XMLHttpRequest(),destination
	xhr.onload=()=>{
		let json=JSON.parse(xhr.responseText)
		if(json&&json.destination)
		{
			destination=json.destination
		}
	}
	xhr.open("GET","https://apimon.de/redirect/"+encodeURIComponent(url),false)
	xhr.send()
	return destination
}
const onBeforeRequest_rules = {
	path_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("aHR0c")))),
	path_s_encoded: details => encodedRedirect(details.url.substr(details.url.indexOf("/s/")+3)),
	path_r_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("/r/")+3))),
	path_dl_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("/dl/")+4))),
	path_u_id_base64: details => {
		let data=details.url.substr(details.url.indexOf("/u/")+3)
		return getRedirect(atob(data.substr(data.indexOf("/")+1)))
	},
	query_raw: details => {
		let url=new URL(details.url)
		if(url.search)
		{
			return getRedirect(url.search.substr(1)+url.hash)
		}
	},
	query_base64: details => getRedirect(atob((new URL(details.url)).search.replace("?",""))),
	hash_base64: details => {
		let url=new URL(details.url)
		if(url.hash)
		{
			return getRedirect(atob(url.hash.replace("#","")))
		}
	},
	param_url_general: details => {
		let url=details.url.substr(details.url.indexOf("&url=")+5)
		if(url.substr(0,5)=="aHR0c"||url.substr(0,7)=="bWFnbmV")
		{
			url=atob(url.split("&")[0])
		}
		else if(url.substr(0,13)=="http%3A%2F%2F"||url.substr(0,14)=="https%3A%2F%2F")
		{
			url=decodeURIComponent(url.split("&")[0])
		}
		else
		{
			if(url.substr(0,7)!="http://"&&url.substr(0,8)!="https://")
			{
				url="http://"+url
			}
			url+=(new URL(details.url)).hash
		}
		return getRedirect(url,details.url)
	},
	param_url_encoded: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("url"))
		{
			return getRedirect(url.searchParams.get("url"))
		}
	},
	param_xurl_raw_http: details => getRedirect("http"+details.url.substr(details.url.indexOf("?xurl=")+6)),
	param_aurl_encoded: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("aurl"))
		{
			return getRedirect(url.searchParams.get("aurl"))
		}
	},
	param_capital_url_encoded: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("URL"))
		{
			return getRedirect(url.searchParams.get("URL"))
		}
	},
	param_rel_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("?rel=")+5))),
	param_link_encoded: details => encodedRedirect(details.url.substr(details.url.indexOf("link=")+5)),
	param_link_base64: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("link"))
		{
			return getRedirect(atob(url.searchParams.get("link")))
		}
	},
	param_link_encoded_base64: details => getRedirect(decodeURIComponent(atob(details.url.substr(details.url.indexOf("?link=")+6)))),
	param_kesehatan_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("?kesehatan=")+11))),
	param_wildcard_base64: details => getRedirect(atob(new URL(details.url).searchParams.values().next().value)),
	param_r_base64: details => {
		let id=new URL(details.url).pathname.split("/")[1],safe_in
		for(let i in preflightRules.linkvertise_safe_in)
		{
			if(id==i)
			{
				safe_in=preflightRules.linkvertise_safe_in[i]
				break
			}
		}
		return getRedirect(atob(decodeURIComponent(details.url.substr(details.url.indexOf("?r=")+3))),0,safe_in)
	},
	param_kareeI_base64_pipes: details => getRedirect(atob(details.url.substr(details.url.indexOf("?kareeI=")+8)).split("||")[0]),
	param_cr_base64: details => {
		let i=details.url.indexOf("cr=")
		if(i>0)
		{
			return getRedirect(atob(details.url.substr(i+3).split("&")[0]))
		}
	},
	param_a_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("?a=")+3).split("#",1)[0])),
	param_url_base64: details => {
		let i=details.url.indexOf("?url=")
		if(i>0)
		{
			return getRedirect(atob(details.url.substr(i+5).split("&")[0]))
		}
	},
	param_id_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("?id=")+4))),
	param_get_base64: details => {
		let arg=details.url.substr(details.url.indexOf("?get=")+5)
		return getRedirect(atob(arg.substr(0,arg.length-1)))
	},
	param_u_base64: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("u"))
		{
			return getRedirect(atob(url.searchParams.get("u"))+url.hash)
		}
	},
	param_go_base64: details => {
		let b64=details.url.substr(details.url.indexOf("?go=")+4).split("&")[0]
		if(b64.substr(0,5)=="0OoL1")
		{
			b64="aHR0c"+b64.substr(5)
		}
		return getRedirect(atob(b64))
	},
	param_site_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("?site=")+6).split("&")[0])),
	param_reff_base64: details => getRedirect(atob(details.url.substr(details.url.indexOf("?reff=")+6))),
	param_s_encoded: details => encodedRedirect(details.url.substr(details.url.indexOf("?s=")+3),details.url),
	param_dl_encoded_base64: details => encodedRedirect(atob(details.url.substr(details.url.indexOf("?dl=")+4).split("&")[0])),
	param_health_encoded_base64: details => encodedRedirect(atob(details.url.substr(details.url.indexOf("?health=")+8))),
	param_id_reverse_base64: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("id"))
		{
			let t=atob(url.searchParams.get("id").split("").reverse().join(""))
			if(t.substr(-16)=='" target="_blank')
			{
				t=t.substr(0,t.length-16)
			}
			return getRedirect(t)
		}
	},
	param_token_base64: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("token"))
		{
			return getRedirect(atob(url.searchParams.get("token")))
		}
	},
	param_href_encoded: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("href"))
		{
			return getRedirect(url.searchParams.get("href"))
		}
	},
	param_short_encoded: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("short"))
		{
			return getRedirect(url.searchParams.get("short"))
		}
	},
	param_id_base64_replacements: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("id"))
		{
			return getRedirect(atob(url.searchParams.get("id")).split("!").join("a").split(")").join("e").split("_").join("i").split("(").join("o").split("*").join("u"))
		}
	},
	param_dest_encoded: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("dest"))
		{
			return getRedirect(url.searchParams.get("dest"))
		}
	},
	param_go_hex: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("go"))
		{
			let go=url.searchParams.get("go"),a=[]
			for(let i=0;i<go.length-1;i+=2)
			{
				a.push(parseInt(go.substr(i,2),16))
			}
			return getRedirect(String.fromCharCode.apply(String,a))
		}
	},
	param_to_base64: details => {
		let url=new URL(details.url)
		if(url.searchParams.has("to"))
		{
			return getRedirect(atob(url.searchParams.get("to")))
		}
	},
	tracker: details => {
		if(trackerBypassEnabled&&new URL(details.url).pathname!="/")
		{
			let destination=resolveRedirect(details.url)
			if(destination&&destination!=details.url)
			{
				return getRedirect(destination,"tracker")
			}
		}
	},
	ip_logger: details => {
		if(new URL(details.url).pathname!="/")
		{
			if(trackerBypassEnabled)
			{
				let destination=resolveRedirect(details.url)
				if(destination&&destination!=details.url)
				{
					return getRedirect(destination,"tracker")
				}
			}
			if(blockIPLoggers)
			{
				return {redirectUrl:brws.runtime.getURL("html/blocked.html")}
			}
		}
	}
},
onBeforeSendHeaders_rules = {
	useragent_googlebot: details => {
		details.requestHeaders.push({
			name: "User-Agent",
			value: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
		})
		return {requestHeaders: details.requestHeaders}
	},
	useragent_iphone: details => {
		details.requestHeaders.push({
			name: "User-Agent",
			value: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
		})
		return {requestHeaders: details.requestHeaders}
	},
	useragent_chrome: details => {
		if(firefox)
		{
			details.requestHeaders.push({
				name: "User-Agent",
				value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36"
			})
			return {requestHeaders: details.requestHeaders}
		}
	}
},
onHeadersReceived_rules = {
	redirect_persist_id_path: details => {
		let url = new URL(details.url)
		if(url.pathname.substr(0,6)!="/post/")
		{
			for(let i in details.responseHeaders)
			{
				let header = details.responseHeaders[i]
				if(header.name.toLowerCase() == "location")
				{
					details.responseHeaders[i].value += "#" + url.pathname.substr(1)
					break
				}
			}
		}
		return {responseHeaders: details.responseHeaders}
	},
	redirect_persist_id_path_1_letter: details => {
		let url = new URL(details.url)
		for(let i in details.responseHeaders)
		{
			let header = details.responseHeaders[i]
			if(header.name.toLowerCase() == "location")
			{
				details.responseHeaders[i].value += "#" + url.pathname.substr(3).split("/")[0]
				break
			}
		}
		return {responseHeaders: details.responseHeaders}
	},
	contribute_hash: details => {
		if(crowdEnabled&&details.method=="POST")
		{
			let url=new URL(details.url)
			if(url.hash.length>1)
			{
				for(let i in details.responseHeaders)
				{
					let header=details.responseHeaders[i]
					if(header.name.toLowerCase()=="location"&&isGoodLink(header.value))
					{
						let xhr=new XMLHttpRequest()
						xhr.open("POST","https://universal-bypass.org/crowd/contribute_v1",true)
						xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
						xhr.send("domain="+url.host+"&path="+encodeURIComponent(url.hash.substr(1))+"&target="+encodeURIComponent(header.value))
						break
					}
				}
			}
		}
	}
}

brws.storage.local.get(["userscript","bypass_counter"],res=>{
	if(res)
	{
		if(res.userscript)
		{
			userScript=res.userscript
		}
		if(res.bypass_counter)
		{
			bypassCounter=res.bypass_counter
		}
	}
	updateBypassDefinitions()
})

// Very Specific Preflight Bypasses
brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return encodedRedirect(details.url.substr(details.url.indexOf("/12/1/")+6))
	}
},{types:["main_frame"],urls:["*://*.sh.st/r/*/12/1/*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(details.url.substr(details.url.substr(16).indexOf("/")+17))
	}
},{types:["main_frame"],urls:["http://sh.st/st/*/*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=details.url
		do
		{
			let arr=url.substr(19).split("/")
			if(arr.length!=2)
			{
				return
			}
			url=atob(arr[1])
		}
		while(url.length>=19&&url.substr(0,19)=="http://gslink.co/a/");
		if(url!=details.url)
		{
			return getRedirect(url)
		}
	}
},{types:["main_frame"],urls:["http://gslink.co/a/*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("go"))
		{
			return getRedirect("https://clickar.net/"+url.searchParams.get("go"))
		}
	}
},{types:["main_frame"],urls:["*://*.surfsees.com/?*"]},["blocking"])

// Ouo.io/press & lnk2.cc Crowd Bypass
brws.webRequest.onHeadersReceived.addListener(details=>{
	if(enabled&&crowdEnabled)
	{
		let url=new URL(details.url)
		for(let i in details.responseHeaders)
		{
			let header=details.responseHeaders[i]
			if(header.name.toLowerCase()=="location"&&isGoodLink(header.value))
			{
				let xhr=new XMLHttpRequest(),
				domain=url.hostname
				if(domain=="ouo.press")
				{
					domain="ouo.io"
				}
				xhr.open("POST","https://universal-bypass.org/crowd/contribute_v1",true)
				xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
				xhr.send("domain="+domain+"&path="+encodeURIComponent(url.pathname.split("/")[2])+"&target="+encodeURIComponent(header.value))
				break
			}
		}
	}
},{types:["main_frame"],urls:[
"*://*.ouo.io/*/*",
"*://*.ouo.press/*/*",
"*://*.lnk2.cc/*/*"
]},["blocking","responseHeaders"])

// SoraLink Crowd Bypass
let soralink_contribute={}
brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		const arg_index=details.url.indexOf("&soralink_contribute="),url=details.url.substr(0,arg_index)
		if(crowdEnabled)
		{
			soralink_contribute[url]=details.url.substr(arg_index+21)
		}
		return{redirectUrl:url}
	}
},{types:["main_frame"],urls:["*://*/?*=*&soralink_contribute=*"]},["blocking"])

brws.webRequest.onHeadersReceived.addListener(details=>{
	if(enabled)
	{
		if(crowdEnabled && details.url in soralink_contribute)
		{
			if(details.method=="POST")
			{
				for(let i in details.responseHeaders)
				{
					let header=details.responseHeaders[i]
					if(header.name.toLowerCase()=="location"&&isGoodLink(header.value))
					{
						let xhr=new XMLHttpRequest()
						xhr.open("POST","https://universal-bypass.org/crowd/contribute_v1",true)
						xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
						xhr.send("domain="+(new URL(details.url)).host+"&path="+encodeURIComponent(soralink_contribute[details.url])+"&target="+encodeURIComponent(header.value))
						break
					}
				}
			}
			delete soralink_contribute[details.url]
		}
		if(firefox)//Fixing Content-Security-Policy on Firefox because apparently extensions have no special privileges there
		{
			let csp = false
			for(let i in details.responseHeaders)
			{
				if("value"in details.responseHeaders[i]&&["content-security-policy","x-content-security-policy"].indexOf(details.responseHeaders[i].name.toLowerCase())>-1)
				{
					csp = true
					let _policies = details.responseHeaders[i].value.replace(";,",";").split(";"),
					policies = {}
					for(let j in _policies)
					{
						let policy = _policies[j].trim(),name=policy.split(" ")[0]
						policies[name] = policy.substr(name.length).trim().split(" ")
					}
					if(!("script-src"in policies)&&"default-src"in policies)
					{
						policies["script-src"] = policies["default-src"]
						let ni = policies["script-src"].indexOf("'none'")
						if(ni > -1)
						{
							policies["script-src"].splice(ni, 1)
						}
					}
					if("script-src"in policies)
					{
						if(policies["script-src"].indexOf("'unsafe-inline'")==-1)
						{
							policies["script-src"].push("'unsafe-inline'")
						}
					}
					else
					{
						policies["script-src"]=["*","blob:","data:","'unsafe-inline'","'unsafe-eval'"]
					}
					let value=""
					for(let name in policies)
					{
						value+=name
						for(let j in policies[name])
						{
							value+=" "+policies[name][j]
						}
						value+="; "
					}
					details.responseHeaders[i].value=value.substr(0,value.length-2)
				}
			}
			if(csp)
			{
				return{responseHeaders:details.responseHeaders}
			}
		}
	}
},{types:["main_frame"],urls:["<all_urls>"]},["blocking","responseHeaders"])
