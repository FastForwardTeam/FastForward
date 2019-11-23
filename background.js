const brws=(typeof browser=="undefined"?chrome:browser),
firefox=(brws.runtime.getURL("").substr(0,4)=="moz-"),
getRedirect=(url,referer)=>{
	let r
	if(referer)
	{
		if(referer=="tracker")
		{
			r=(instantNavigation||instantNavigationTrackers?url:brws.runtime.getURL("html/before-navigate.html")+"?target="+encodeURIComponent(url))
		}
		else if(instantNavigation)
		{
			r=(new URL(url)).toString()
			refererCache[r]=referer
		}
		else
		{
			r=brws.runtime.getURL("html/before-navigate.html")+"?target="+encodeURIComponent(url)+"&referer="+referer
		}
	}
	else
	{
		r=(instantNavigation?url:brws.runtime.getURL("html/before-navigate.html")+"?target="+encodeURIComponent(url))
	}
	countIt()
	return {redirectUrl:r}
},
encodedRedirect=(url,referer)=>{
	let r
	if(referer)
	{
		if(instantNavigation)
		{
			r=(new URL(decodeURIComponent(url))).toString()
			refererCache[r]=referer
		}
		else
		{
			r=brws.runtime.getURL("html/before-navigate.html")+"?target="+url+"&referer="+referer
		}
	}
	else
	{
		r=(instantNavigation?decodeURIComponent(url):brws.runtime.getURL("html/before-navigate.html")+"?target="+url)
	}
	countIt()
	return {redirectUrl:r}
},
isGoodLink=link=>{
	if(!link||link.substr(0,6)=="about:"||link.substr(0,11)=="javascript:")
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
countIt=()=>brws.storage.local.set({bypass_counter:++bypassCounter})

//Install handler
brws.runtime.onInstalled.addListener(details=>{
	if(details.reason=="install")
	{
		brws.tabs.create({url:"https://universal-bypass.org/firstrun"})
	}
})

//Keeping track of options
var enabled=true,instantNavigation=true,trackerBypassEnabled=true,instantNavigationTrackers=false,blockIPLoggers=true,crowdEnabled=true,infoBoxEnabled=true,userscript="",bypassCounter=0,refererCache={}
brws.storage.sync.get(["disable","navigation_delay","no_tracker_bypass","no_instant_navigation_trackers","allow_ip_loggers","crowd_bypass_opt_out","crowd_open_delay","no_info_box"],res=>{
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
			if(res.navigation_delay>0)
			{
				instantNavigation=false
			}
		}
		else
		{
			brws.storage.sync.set({navigation_delay:0})
		}
		trackerBypassEnabled=(res.no_tracker_bypass!=="true")
		instantNavigationTrackers=(res.no_instant_navigation_trackers!=="true")
		blockIPLoggers=(res.allow_ip_loggers!=="true")
		crowdEnabled=(res.crowd_bypass_opt_out!=="true")
		if(!res.crowd_open_delay)
		{
			brws.storage.sync.set({crowd_open_delay:61})
		}
		infoBoxEnabled=(res.no_info_box!=="true")
	}
})
brws.storage.local.get(["userscript","bypass_counter"],res=>{
	if(res)
	{
		if(res.userscript)
		{
			userscript=res.userscript
		}
		if(res.bypass_counter)
		{
			bypassCounter=res.bypass_counter
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
	if(changes.crowd_bypass_opt_out)
	{
		crowdEnabled=(changes.crowd_bypass_opt_out.newValue!=="true")
	}
	if(changes.no_info_box)
	{
		infoBoxEnabled=(changes.no_info_box.newValue!=="true")
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
		respond({enabled, crowdEnabled, infoBoxEnabled, userscript})
		break;

		case "open-tab":
		brws.tabs.create({
			url: req.url
		})
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
	let arr=details.url.substr(45).split("&referer=")
	return encodedRedirect(arr[0],arr[1])
},{types:["main_frame"],urls:["https://universal-bypass.org/bypassed?target=*&referer=*"]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	let arr=details.url.substr(45).split("&referer=")
	arr[0]=(new URL(decodeURIComponent(arr[0]))).toString()
	if(arr.length>1)
	{
		refererCache[arr[0]]=arr[1]
	}
	return {redirectUrl:arr[0]}
},{types:["main_frame"],urls:["https://universal-bypass.org/navigate?target=*"]},["blocking"])

let infoSpec=["blocking","requestHeaders"]
if(!firefox)
{
	infoSpec.push("extraHeaders")
}
brws.webRequest.onBeforeSendHeaders.addListener(details=>{
	if(enabled&&details.url in refererCache)
	{
		details.requestHeaders.push({
			name: "Referer",
			value: decodeURIComponent(refererCache[details.url])
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

brws.webRequest.onBeforeRequest.addListener(details=>{
	countIt()
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
"*://*.zxro.com/u/*?url=*"
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
"*://*/safeme/?*",
"*://*.leechall.com/redirect.php?url=*",
"*://*.news-gg.com/l/?*",
"*://*.mobile01.com/redirect.php?*",
"*://*.nurhamka.com/*?url=*",
"*://*.linepc.site/*?url=*",
"*://*.adobedownload.org/redirect/?url=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url).searchParams.get("url")
		if(isGoodLink(url))
		{
			return getRedirect(url)
		}
		url=atob(url)
		if(isGoodLink(url))
		{
			return getRedirect(url)
		}
	}
},{types:["main_frame"],urls:[
"*://*/full?api=*&url=*",
"*://*/full/?api=*&url=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("URL"))
		{
			return getRedirect(url.searchParams.get("URL"))
		}
	}
},{types:["main_frame"],urls:[
"*://*.unlockapk.com/dl/mirror.php?*"
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
"*://kurosafety.menantisenja.com/?*=*",
"*://hightech.web.id/*?*=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let r=atob(details.url.substr(details.url.indexOf("?r=")+3))
		if(isGoodLink(r))
		{
			return getRedirect(r)
		}
	}
},{types:["main_frame"],urls:[
"*://*.linkvertise.com/*?r=*",
"*://*.linkvertise.net/*?r=*",
"*://*.link-to.net/*?r=*",
"*://*/?r=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let i=details.url.indexOf("cr=")
		if(i>0)
		{
			return getRedirect(atob(details.url.substr(i+3).split("&")[0]))
		}
	}
},{types:["main_frame"],urls:[
"*://*.ouo.today/?*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?a=")+3).split("#",1)[0]))
	}
},{types:["main_frame"],urls:[
"*://*.adsafelink.net/generate?a=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?url=")+5)))
	}
},{types:["main_frame"],urls:[
"*://*.mispuani.xyz/*?url=*",
"*://*.zonangopi.ml/p/generate.html?url=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?id=")+4)))
	}
},{types:["main_frame"],urls:[
"*://*/p/*.html?id=*",
"*://*.newsdecorate.com/?id=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let arg=details.url.substr(details.url.indexOf("?get=")+5)
		return getRedirect(atob(arg.substr(0,arg.length-1)))
	}
},{types:["main_frame"],urls:[
"*://safelink.hargawebsite.com/*/?get=*",
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?u=")+3)))
	}
},{types:["main_frame"],urls:[
"*://*.rikucan.com/?u=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?go=")+4)))
	}
},{types:["main_frame"],urls:[
"*://*.telolet.in/?go=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let b64=details.url.substr(details.url.indexOf("?go=")+4).split("&")[0]
		if(b64.substr(0,5)=="0OoL1")
		{
			b64="aHR0c"+b64.substr(5)
		}
		return getRedirect(atob(b64))
	}
},{types:["main_frame"],urls:[
"*://*.lompat.in/?go=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?site=")+6).split("&")[0]))
	}
},{types:["main_frame"],urls:[
"*://*.masreyhan.com/*?site=*",
"*://*.pasardownload.com/*?site=*",
"*://*.vius.info/*?site=*",
"*://*.cariskuy.com/*?site=*",
"*://*.losstor.com/ini/?site=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?reff=")+6)))
	}
},{types:["main_frame"],urls:[
"*://*.remiyu.me/?reff=*",
"*://*.ceksite.id/?reff=*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		return getRedirect(atob(details.url.substr(details.url.indexOf("?kareeI=")+8)).split("||")[0])
	}
},{types:["main_frame"],urls:[
"*://idalponse.blogspot.com/?kareeI=*",
"*://omahsafe.blogspot.com/?kareeI=*"
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
		return encodedRedirect(atob(details.url.substr(details.url.indexOf("?health=")+8)))
	}
},{types:["main_frame"],urls:[
"*://*.newhealthblog.com/?health=*"
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
		return getRedirect(details.url.substr(details.url.substr(16).indexOf("/")+17))
	}
},{types:["main_frame"],urls:["http://sh.st/st/*/*"]},["blocking"])


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
			let t=atob(url.searchParams.get("id").split("").reverse().join(""))
			if(t.substr(t.length-16)=='" target="_blank')
			{
				t=t.substr(0,t.length-16)
			}
			return getRedirect(t)
		}
	}
},{types:["main_frame"],urls:[
"*://*.masterads.info/instagram/campanha.php?*",
"*://*.adssuper.com/instagram/campanha.php?*"
]},["blocking"])

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
},{types:["main_frame"],urls:[
"*://*.maranhesduve.club/?*",
"*://*.sparbuttantowa.pro/*?*"
]},["blocking"])

brws.webRequest.onBeforeRequest.addListener(details=>{
	if(enabled)
	{
		let url=new URL(details.url)
		if(url.searchParams.has("short"))
		{
			return getRedirect(url.searchParams.get("short"))
		}
	}
},{types:["main_frame"],urls:["*://*.duit.cc/*?*"]},["blocking"])

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
		if(url.hash)
		{
			return getRedirect(atob(url.hash.replace("#","")))
		}
	}
},{types:["main_frame"],urls:[
"*://*.acorme.com/*",
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

//Ouo.io/press & lnk2.cc Crowd Bypass
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

//SafelinkU Crowd Bypass
brws.webRequest.onHeadersReceived.addListener(details=>{
	if(enabled)
	{
		let url = new URL(details.url)
		for(let i in details.responseHeaders)
		{
			let header = details.responseHeaders[i]
			if(header.name.toLowerCase() == "location")
			{
				details.responseHeaders[i].value += "#" + url.pathname.substr(1)
				break
			}
		}
		return{responseHeaders:details.responseHeaders}
	}
},{types:["main_frame"],urls:[
"*://*.bercara.com/*",
"*://*.semawur.com/*",
"*://*.in11.site/*"
]},["blocking","responseHeaders"])
brws.webRequest.onHeadersReceived.addListener(details=>{
	if(enabled)
	{
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
		return{responseHeaders:details.responseHeaders}
	}
},{types:["main_frame"],urls:[
"*://*.wadooo.com/g/*",
"*://*.gotravelgo.space/g/*",
"*://*.pantauterus.me/g/*",
"*://*.liputannubi.net/g/*"
]},["blocking","responseHeaders"])

brws.webRequest.onHeadersReceived.addListener(details=>{
	if(enabled&&crowdEnabled&&details.method=="POST")
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
},{types:["main_frame"],urls:[
"*://*.wadooo.com/*",
"*://*.gotravelgo.space/*",
"*://*.pantauterus.me/*",
"*://*.liputannubi.net/*"
]},["blocking","responseHeaders"])

//Fixing Content-Security-Policy on Firefox because apparently extensions have no special privileges there
if(firefox)
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
		{
			destination=json.destination
		}
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
			return getRedirect(destination,"tracker")
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
				return getRedirect(destination,"tracker")
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
