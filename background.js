var brws = (typeof browser == "undefined" ? chrome : browser),
platform = brws.runtime.getURL("").split("-")[0],
//Keeping track of options
enabled = true,
instantNavigation = false,
trackerBypassEnabled = true,
blockIPLoggers = true,
crowdEnabled = true,
userscript="",
getRedirectUrl=url=>(instantNavigation?url:brws.runtime.getURL("html/before-navigate.html")+"?target="+encodeURIComponent(url)),
getRedirect=url=>({redirectUrl:getRedirectUrl(url)}),
encodedRedirect=url=>({redirectUrl:(instantNavigation?decodeURIComponent(url):brws.runtime.getURL("html/before-navigate.html")+"?target="+url)}),
isGoodLink=link=>{
	if(!link||link.split("#")[0]==location.href.split("#")[0]||link.substr(0,6)=="about:"||link.substr(0,11)=="javascript:")
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
}
brws.storage.sync.get(["disable","instant_navigation","no_tracker_bypass","allow_ip_loggers","crowd_bypass_opt_out"],res=>{
	if(res)
	{
		enabled=(!res.disable||res.disable!=="true")
		instantNavigation=(res.instant_navigation&&res.instant_navigation==="true")
		trackerBypassEnabled=(!res.no_tracker_bypass||res.no_tracker_bypass!=="true")
		blockIPLoggers=(!res.allow_ip_loggers||res.allow_ip_loggers!=="true")
		crowdEnabled=(!res.crowd_bypass_opt_out||res.crowd_bypass_opt_out!=="true")
	}
})
brws.storage.local.get(["userscript"],res=>{
	if(res&&res.userscript)
	{
		userscript=res.userscript
	}
})
brws.storage.onChanged.addListener(changes=>{
	if(changes.disable)
	{
		enabled=(changes.disable.newValue!=="true")
	}
	if(changes.instant_navigation)
	{
		instantNavigation=(changes.instant_navigation.newValue==="true")
	}
	if(changes.no_tracker_bypass)
	{
		trackerBypassEnabled=(changes.no_tracker_bypass.newValue!=="true")
	}
	if(changes.allow_ip_loggers)
	{
		blockIPLoggers=(changes.allow_ip_loggers.newValue!=="true")
	}
	if(changes.crowd_bypass_opt_out)
	{
		crowdEnabled=(changes.crowd_bypass_opt_out.newValue!=="true")
	}
	if(changes.userscript)
	{
		userscript=changes.userscript.newValue
	}
})
brws.runtime.onMessage.addListener((req, sender, respond) => {
	switch(req.type)
	{
		case "can-run":
		respond({
			enabled: enabled,
			crowdEnabled: crowdEnabled,
			userscript: userscript
		})
		break;

		case "crowd-contribute": {
			let xhr=new XMLHttpRequest()
			xhr.open("POST","https://universal-bypass.org/crowd/contribute_v1",true)
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
			xhr.send(req.data)
		}
		break;

		case "adlinkfly-info": {
			let xhr=new XMLHttpRequest(),t="",iu=req.url
			xhr.onreadystatechange=()=>{
				if(xhr.readyState==4)
				{
					if(xhr.status==200)
					{
						let i=new DOMParser().parseFromString(xhr.responseText,"text/html").querySelector("img[src^='//api.miniature.io']")
						if(i)
						{
							let url=new URL(i.src)
							if(url.search&&url.search.indexOf("url="))
							{
								t=decodeURIComponent(url.search.split("url=")[1].split("&")[0])
							}
						}
					}
					respond({t: t})
				}
			}
			if(iu.substr(iu.length - 1) != "/")
			{
				iu += "/"
			}
			xhr.open("GET", iu+"info", false)
			xhr.send()
		}
		break;

		default:
		console.warn("Invalid message:", req)
	}
})

//Internal redirects to extension URLs to bypass content script limitations
brws.webRequest.onBeforeRequest.addListener(details=>{
	if(details.url.substr(38)=="1")
	{
		return {redirectUrl:brws.runtime.getURL("html/firstrun.html")}
	}
	else
	{
		return {redirectUrl:brws.runtime.getURL("html/firstrun-noscript.html")}
	}
},{types:["main_frame"],urls:["https://universal-bypass.org/firstrun?*"]},["blocking"])
brws.webRequest.onBeforeRequest.addListener(details=>{
	return encodedRedirect(details.url.substr(52))
},{types:["main_frame"],urls:["https://universal-bypass.org/before-navigate?target=*"]},["blocking"])
brws.webRequest.onBeforeRequest.addListener(details=>{
	return {redirectUrl:brws.runtime.getURL("html/crowd-bypassed.html")+details.url.substr(43)}
},{types:["main_frame"],urls:["https://universal-bypass.org/crowd-bypassed?*"]},["blocking"])

//Preflight Bypasses
brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(details.url.substr(details.url.indexOf("url=")+4))
	}
},{types:["main_frame"],urls:["*://*/st?api=*&url=*","*://*.zxro.com/u/*?url=*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("url"))
		{
			return getRedirect(url.searchParams.get("url"))
		}
	}
},{types:["main_frame"],urls:[
"*://*.raidcall.com.tw/direct.php?url=*",
"*://*.raidcall.com.tw/direct.tips.php?url=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return encodedRedirect(details.url.substr(details.url.indexOf("link=")+5))
	}
},{types:["main_frame"],urls:["*://*.spaste.com/r/*link=*",]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?link=")+6)))
	}
},{types:["main_frame"],urls:["*://*.leechpremium.link/cheat/?link=*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return encodedRedirect(details.url.substr(details.url.indexOf("?s=")+3))
	}
},{types:["main_frame"],urls:["*://*.ouo.io/s/*?s=*","*://*.cpmlink.net/s/*?s=*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return encodedRedirect(details.url.substr(details.url.indexOf("/12/1/")+6))
	}
},{types:["main_frame"],urls:["*://*.sh.st/r/*/12/1/*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return encodedRedirect(details.url.substr(details.url.indexOf("/s/")+3))
	}
},{types:["main_frame"],urls:["*://*.gslink.co/e/*/s/*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("u"))
		{
			return getRedirect(atob(url.searchParams.get("u"))+url.hash)
		}
	}
},{types:["main_frame"],urls:["*://*.noriskdomain.com/*/analyze?*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("/dl/")+4)))
	}
},{types:["main_frame"],urls:["*://*.k2nblog.com/dl/*"]},["blocking"])

brws.webRequest.onHeadersReceived.addListener(details=>{
	if(enabled)
	{
		let url = new URL(details.url), target
		for(let i in details.responseHeaders)
		{
			let header = details.responseHeaders[i]
			if(header.name.toLowerCase() == "location" && isGoodLink(header.value))
			{
				details.responseHeaders[i].value = getRedirectUrl(target = header.value)
				break
			}
		}
		if(target)
		{
			let xhr=new XMLHttpRequest()
			xhr.open("POST","https://universal-bypass.org/crowd/contribute_v1",true)
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
			xhr.send("domain=ouo.io&path="+encodeURIComponent(url.pathname.split("/")[2])+"&target="+encodeURIComponent(target))
			return{responseHeaders:details.responseHeaders}
		}
	}
},{types:["main_frame"],urls:[
"*://*.ouo.io/go/*",
"*://*.ouo.press/go/*",
"*://*.ouo.io/rgo/*",
"*://*.ouo.press/rgo/*"
]},["blocking","responseHeaders"])

//Install & Uninstall Actions
brws.runtime.onInstalled.addListener(details=>{
	if(details.reason == "install")
	{
		if(platform == "ms" || platform == "moz")
		{
			brws.windows.create({url: "https://universal-bypass.org/firstrun"})
		}
		else
		{
			setTimeout(()=>window.open("https://universal-bypass.org/firstrun"),1000)
			// For some reason, Chromium doesn't instantly register the webRequest handlers, so we're waiting.
		}
	}
	else
	{
		//Upgrade configuration
		brws.storage.local.get(["custom_bypasses"],result=>{
			if(!result||!result.custom_bypasses)
			{
				return
			}
			let customBypasses=JSON.parse(result.custom_bypasses),userscript=""
			for(let name in customBypasses)
			{
				userscript += "// " + name + "\ndomainBypass(\"" + customBypasses[name].domains + "\", ()=>{\n" + customBypasses[name].content + "})\n\n"
			}
			brws.storage.local.set({
				userscript: userscript
			}, ()=>brws.storage.local.remove("custom_bypasses"))
		})
	}
})
brws.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSdXw-Yf5IaDXZWw4fDHroZkDFOF6hgWEvVDaXT9ZADqnF2reg/viewform")

//Fixing Content-Security-Policy on Firefox because apparently extensions have no special privileges in Firefox
if(platform == "moz")
{
	brws.webRequest.onHeadersReceived.addListener(details=>{
		if(enabled)
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
						if(policies["script-src"].indexOf("'unsafe-eval'")==-1)
						{
							policies["script-src"].push("'unsafe-eval'")
						}
					}
					else
					{
						policies["script-src"]=["*","blob:","data:","'unsafe-inline'","'unsafe-eval'"]
					}
					let value=""
					for(let name in policies)
					{
						value+=name;
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
	},{types:["main_frame"],urls:["<all_urls>"]},["blocking","responseHeaders"])
}

//Tracker Bypass using Apimon.de; see options for more details.
function resolveRedirect(url)
{
	let xhr=new XMLHttpRequest(),destination
	xhr.onreadystatechange=()=>{
		if(xhr.readyState==4&&xhr.status==200)
		{
			let json=JSON.parse(xhr.responseText)
			if(json&&json.destination)
				destination=json.destination
		}
	}
	xhr.open("GET","https://apimon.de/redirect/"+encodeURIComponent(url),false)
	xhr.send()
	return destination
}
brws.webRequest.onBeforeRequest.addListener(details=>{
	if(trackerBypassEnabled && new URL(details.url).pathname != "/")
	{
		let destination = resolveRedirect(details.url)
		if(destination && destination != details.url)
		{
			return {redirectUrl: destination}
		}
	}
},{
	types:["main_frame"],
	urls:[
	"*://*.great.social/*",
	"*://*.send.digital/*",
	"*://*.snipli.com/*",
	"*://*.shortcm.li/*",
	"*://*.page.link/*",
	"*://*.go2l.ink/*",
	"*://*.buff.ly/*",
	"*://*.snip.li/*",
	"*://*.hive.am/*",
	"*://*.cutt.ly/*",
	"*://*.tiny.ie/*",
	"*://*.bit.ly/*",
	"*://*.goo.gl/*",
	"*://*.bit.do/*",
	"*://*.t2m.io/*",
	"*://*.dis.gd/*",
	"*://*.zii.bz/*",
	"*://*.plu.sh/*",
	"*://*.b.link/*",
	"*://*.po.st/*",
	"*://*.ow.ly/*",
	"*://*.is.gd/*",
	"*://*.1b.yt/*",
	"*://*.1w.tf/*",
	"*://*.t.co/*",
	"*://*.x.co/*"
	]
},["blocking"])
brws.webRequest.onBeforeRequest.addListener(details=>{
	if(new URL(details.url).pathname != "/")
	{
		if(trackerBypassEnabled)
		{
			let destination = resolveRedirect(details.url)
			if(destination && destination != details.url)
			{
				return {redirectUrl: destination}
			}
		}
		if(blockIPLoggers)
		{
			return {redirectUrl: brws.runtime.getURL("html/blocked.html")}
		}
	}
},{types:["main_frame"],urls:getIPLoggerPatterns()},["blocking"])
function getIPLoggerPatterns()
{
	let patterns=[],
	//https://github.com/timmyrs/Evil-Domains/blob/master/lists/IP%20Loggers.txt
	ipLoggers=`viral.over-blog.com
	gyazo.in
	ps3cfw.com
	urlz.fr
	webpanel.space
	steamcommumity.com
	i.imgur.com.de
	www.fuglekos.com

	# Grabify

	grabify.link
	bmwforum.co
	leancoding.co
	quickmessage.io
	spottyfly.com
	spötify.com
	stopify.co
	yoütu.be
	yoütübe.co
	yoütübe.com
	xda-developers.io
	starbucksiswrong.com
	starbucksisbadforyou.com
	bucks.as
	discörd.com
	minecräft.com
	cyberh1.xyz
	discördapp.com
	freegiftcards.co
	disçordapp.com
	rëddït.com

	# Cyberhub (formerly SkypeGrab)

	ġooģle.com
	drive.ġooģle.com
	maps.ġooģle.com
	disċordapp.com
	ìṃgur.com
	transferfiles.cloud
	tvshare.co
	publicwiki.me
	hbotv.co
	gameskeys.shop
	videoblog.tech
	twitch-stats.stream
	anonfiles.download
	bbcbloggers.co.uk

	# Yip

	yip.su
	iplogger.com
	iplogger.org
	iplogger.ru
	2no.co
	02ip.ru
	iplis.ru
	iplo.ru
	ezstat.ru

	# What's their IP

	www.whatstheirip.com
	www.hondachat.com
	www.bvog.com
	www.youramonkey.com

	# Pronosparadise

	pronosparadise.com
	freebooter.pro

	# Blasze

	blasze.com
	blasze.tk

	# IPGrab

	ipgrab.org
	i.gyazos.com`,
	lines=ipLoggers.split("\n")
	for(let i in lines)
	{
		let line=lines[i].trim();
		if(line&&line.substr(0,1)!="#")
		{
			if(line.substr(0,4)=="www.")
				line=line.substr(4)
			else if(line.substr(0,2)=="i.")
				line=line.substr(2)
			else if(line.substr(0,6)=="drive.")
				line=line.substr(6)
			else if(line.substr(0,5)=="maps.")
				line=line.substr(5)
			if(patterns.indexOf(line)==-1)
				patterns.push("*://*."+line+"/*")
		}
	}
	return patterns
}
