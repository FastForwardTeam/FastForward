//Install & Uninstall Actions
chrome.runtime.onInstalled.addListener(details=>{
	if(details.reason=="install")
		window.open(chrome.extension.getURL("/html/firstrun.html"))
})
chrome.runtime.setUninstallURL("https://goo.gl/forms/H8FswYQ2a37LSxc13")

//Disableable Tracker Bypass using api.hell.sh. Privacy Policy: https://hell.sh/privacy
var trackerBypassEnabled=true,blockIPLoggers=true,resolveDestination=url=>{
	let xhr=new XMLHttpRequest(),destination
	xhr.onreadystatechange=()=>{
		if(xhr.readyState==4&&xhr.status==200)
		{
			let json=JSON.parse(xhr.responseText)
			if(json&&json.destination)
				destination=json.destination
		}
	}
	xhr.open("GET","https://api.hell.sh/redirect/"+encodeURIComponent(url),false)
	xhr.send()
	console.log(url," -> ",destination)
	return destination
}
chrome.storage.sync.get(["no_tracker_bypass","block_ip_loggers"],result=>{
	if(result&&result.no_tracker_bypass&&result.no_tracker_bypass==="true")
		trackerBypassEnabled=false
	if(result&&result.allow_ip_loggers&&result.allow_ip_loggers==="true")
		blockIPLoggers=false
})
chrome.storage.onChanged.addListener(changes=>{
	if(changes.no_tracker_bypass)
		trackerBypassEnabled=(changes.no_tracker_bypass.newValue!=="true")
	if(changes.allow_ip_loggers)
		blockIPLoggers=(changes.allow_ip_loggers.newValue!=="true")
})
chrome.webRequest.onBeforeRequest.addListener(details=>{
	if(!trackerBypassEnabled||details.method!="GET"||details.type!="main_frame"||new URL(details.url).pathname=="/")
		return
	let destination=resolveDestination(details.url)
	if(destination&&destination!=details.url)
		return{redirectUrl:destination}
},{
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
chrome.webRequest.onBeforeRequest.addListener(details=>{
	if(details.method!="GET"||details.type!="main_frame"||new URL(details.url).pathname=="/")
		return
	if(trackerBypassEnabled)
	{
		let destination=resolveDestination(details.url)
		if(destination&&destination!=details.url)
			return{redirectUrl:destination}
	}
	if(blockIPLoggers)
		return{redirectUrl:chrome.extension.getURL("/html/blocked.html")}
},{urls:getIPLoggerPatterns()},["blocking"])
chrome.webRequest.onBeforeRequest.addListener(details=>{
	return{redirectUrl:decodeURIComponent(details.url.split("?link=")[1])}
},{urls:["*://*.spaste.com/r/*?link=*"]},["blocking"])
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
