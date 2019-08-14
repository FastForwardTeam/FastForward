const brws=(typeof browser=="undefined"?chrome:browser),
platform=brws.runtime.getURL("").split("-")[0],
getRedirectUrl=(url,tracker)=>(instantNavigation||(tracker&&instantNavigationTrackers)?url:brws.runtime.getURL("html/before-navigate.html")+"?target="+encodeURIComponent(url)),
getRedirect=(url,tracker)=>({redirectUrl:getRedirectUrl(url,tracker)}),
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

//Install & Uninstall Actions
brws.runtime.onInstalled.addListener(details=>{
	if(details.reason=="install")
	{
		if(platform=="moz")
		{
			brws.windows.create({url:"https://universal-bypass.org/firstrun"})
		}
		else
		{
			window.open("https://universal-bypass.org/firstrun")
		}
	}
})

//Keeping track of options
var enabled=true,trackerBypassEnabled=true,instantNavigationTrackers=false,blockIPLoggers=true,crowdEnabled=true,userscript=""
brws.storage.sync.get(["disable","no_tracker_bypass","instant_navigation","no_instant_navigation_trackers","allow_ip_loggers","crowd_bypass_opt_out"],res=>{
	if(res)
	{
		enabled=(!res.disable||res.disable!=="true")
		if(!enabled)
		{
			brws.browserAction.setIcon({path: {
				"40": "icon_disabled/40.png",
				"48": "icon_disabled/48.png",
				"128": "icon_disabled/128.png",
				"150": "icon_disabled/150.png",
				"176": "icon_disabled/176.png",
				"512": "icon_disabled/512.png"
			}})
		}
		trackerBypassEnabled=(!res.no_tracker_bypass||res.no_tracker_bypass!=="true")
		instantNavigation=(res.instant_navigation&&res.instant_navigation==="true")
		instantNavigationTrackers=(!res.no_instant_navigation_trackers||res.no_instant_navigation_trackers!=="true")
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
		if(enabled)
		{
			brws.browserAction.setIcon({path: {
				"40": "icon/40.png",
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
				"40": "icon_disabled/40.png",
				"48": "icon_disabled/48.png",
				"128": "icon_disabled/128.png",
				"150": "icon_disabled/150.png",
				"176": "icon_disabled/176.png",
				"512": "icon_disabled/512.png"
			}})
		}
	}
	if(changes.no_tracker_bypass)
	{
		trackerBypassEnabled=(changes.no_tracker_bypass.newValue!=="true")
	}
	if(changes.instant_navigation)
	{
		instantNavigation=(changes.instant_navigation.newValue==="true")
	}
	if(changes.no_instant_navigation_trackers)
	{
		instantNavigationTrackers=(changes.no_instant_navigation_trackers.newValue!=="true")
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

//Messaging
brws.runtime.onMessage.addListener((req, sender, respond) => {
	switch(req.type)
	{
		case "can-run":
		respond({
			enabled: enabled,
			crowdEnabled: crowdEnabled,
			userscript: userscript
		})
		break

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
		break

		default:
		console.warn("Invalid message:", req)
	}
})
brws.runtime.onConnect.addListener(port => {
	console.assert(port.name == "adlinkfly-info")
	port.onMessage.addListener(msg => {
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
		if(iu.substr(iu.length - 1) != "/")
		{
			iu += "/"
		}
		xhr.open("GET", iu+"info", true)
		xhr.send()
	})
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
brws.webRequest.onBeforeRequest.addListener(details=>{
	return {redirectUrl:brws.runtime.getURL("html/options.html")+details.url.substr(36)}
},{types:["main_frame"],urls:["https://universal-bypass.org/options"]},["blocking"])

//Preflight Bypasses
brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(details.url.substr(details.url.indexOf("url=")+4))
	}
},{types:["main_frame"],urls:[
"*://*/st?api=*&url=*",
"*://*.zxro.com/u/*?url=*",
"*://*.leechall.com/redirect.php?url=*"
]},["blocking"])

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
"*://*.news-gg.com/l/?*",
"*://*.mobile01.com/redirect.php?*",
"*://ref.gamer.com.tw/redir.php?*"
]},["blocking"])


brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.search)
		{
			return getRedirect(url.search.substr(1)+url.hash)
		}
	}
},{types:["main_frame"],urls:[
"*://*.anonym.to/?*",
"*://*.anonymz.com/?*",
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?rel=")+5)))
	}
},{types:["main_frame"],urls:["*://*.kharismanews.com/?rel=*"]},["blocking"])

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
		return getRedirect(atob(details.url.substr(details.url.indexOf("?kesehatan=")+11)))
	}
},{types:["main_frame"],urls:["*://*.infosia.xyz/?kesehatan=*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(new URL(details.url).searchParams.values().next().value))
	}
},{types:["main_frame"],urls:[
"*://*.pafpaf.info/?*=*",
"*://*.binerfile.info/?*=*",
"*://kurosafety.menantisenja.com/?*=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?r=")+3)))
	}
},{types:["main_frame"],urls:[
"*://*.yumechan.club/?r=*",
"*://*.celeclub.org/?r=*",
"*://*.duniaislamku.com/?r=*",
"*://*.situsbaru.me/?r=*",
"*://*.polrec.site/?r=*",
"*://*.space.tribuntekno.com/?r=*",
"*://*.jossbingit.xyz/?r=*",
"*://*.starzone.cc/?r=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return encodedRedirect(details.url.substr(details.url.indexOf("?s=")+3))
	}
},{types:["main_frame"],urls:[
"*://*.ouo.io/s/*?s=*",
"*://*.ouo.io/qs/*?s=*",
"*://*.cpmlink.net/s/*?s=*"
]},["blocking"])

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
		if(url!=details.url&&isGoodLink(url))
		{
			return getRedirect(url)
		}
	}
},{types:["main_frame"],urls:["http://gslink.co/a/*"]},["blocking"])

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

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("id"))
		{
			return getRedirect(atob(url.searchParams.get("id").split("").reverse().join("")))
		}
	}
},{types:["main_frame"],urls:["*://*.masterads.info/instagram/campanha.php?*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("token"))
		{
			return getRedirect(atob(url.searchParams.get("token")))
		}
	}
},{types:["main_frame"],urls:["*://*.mundodocinema.ga/redirecionamento_final?*"]},["blocking"])

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

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("href"))
		{
			return getRedirect(url.searchParams.get("href"))
		}
	}
},{types:["main_frame"],urls:["*://*.maranhesduve.club/?*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("id"))
		{
			return getRedirect(atob(url.searchParams.get("id")).split("!").join("a").split(")").join("e").split("_").join("i").split("(").join("o").split("*").join("u"))
		}
	}
},{types:["main_frame"],urls:[
"*://*.safelinkconverter.com/*?*",
"*://*.safelinkreview.com/*?*",
"*://*.safelinkreviewx.com/*?*",
"*://*.safelinkreview.co/*?*",
"*://*.awsubsco.ml/*?*",
"*://*.awsubsco.cf/*?*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		return getRedirect(atob(url.search.replace("?","")))
	}
},{types:["main_frame"],urls:[
"*://*.hikarinoakariost.info/out/?*",
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("dest"))
		{
			return getRedirect(url.searchParams.get("dest"))
		}
	}
},{types:["main_frame"],urls:["*://*.ecleneue.com/pushredirect/?*"]},["blocking"])

//Ouo.io/press Crowd Bypass
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
"*://*.ouo.io/*/*",
"*://*.ouo.press/*/*"
]},["blocking","responseHeaders"])

//Fixing Content-Security-Policy on Firefox because apparently extensions have no special privileges in Firefox
if(platform=="moz")
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
	},{types:["main_frame"],urls:["<all_urls>"]},["blocking","responseHeaders"])
}

//Tracker Bypass using Apimon.de
function resolveRedirect(url)
{
	let xhr=new XMLHttpRequest(),destination
	xhr.onload=()=>{
		let json=JSON.parse(xhr.responseText)
		if(json&&json.destination)
			destination=json.destination
	}
	xhr.open("GET","https://apimon.de/redirect/"+encodeURIComponent(url),false)
	xhr.send()
	return destination
}
brws.webRequest.onBeforeRequest.addListener(details=>{
	if(trackerBypassEnabled&&new URL(details.url).pathname!="/")
	{
		let destination=resolveRedirect(details.url)
		if(destination&&destination!=details.url)
		{
			return getRedirect(destination,true)
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
	if(new URL(details.url).pathname!="/")
	{
		if(trackerBypassEnabled)
		{
			let destination=resolveRedirect(details.url)
			if(destination&&destination!=details.url)
			{
				return getRedirect(destination,true)
			}
		}
		if(blockIPLoggers)
		{
			return {redirectUrl:brws.runtime.getURL("html/blocked.html")}
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
		let line=lines[i].trim()
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
