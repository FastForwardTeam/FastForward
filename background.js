chrome.runtime.onInstalled.addListener(details=>{
	if(details.reason=="install")
		window.open(chrome.extension.getURL("/html/firstrun.html"))
})
chrome.runtime.setUninstallURL("https://goo.gl/forms/H8FswYQ2a37LSxc13")

var trackerBypassEnabled=true,customBypasses={};
chrome.storage.sync.get(["no_tracker_bypass"],result=>{
	if(result&&result.no_tracker_bypass&&result.no_tracker_bypass==="true")
	{
		trackerBypassEnabled=false
	}
})
chrome.storage.local.get(["custom_bypasses"],result=>
{
	if(result&&result.custom_bypasses)
	{
		customBypasses=JSON.parse(result.custom_bypasses)
	}
})
chrome.storage.onChanged.addListener(changes=>{
	if(changes.custom_bypasses)
	{
		customBypasses=JSON.parse(changes.custom_bypasses.newValue)
	}
	if(changes.no_tracker_bypass)
	{
		trackerBypassEnabled=(changes.no_tracker_bypass.newValue!=="true");
	}
})

chrome.webRequest.onBeforeRequest.addListener(details=>{
	if(!trackerBypassEnabled||details.method!="GET"||details.type!="main_frame")
		return
	let destination
	if(new URL(details.url).pathname=="/")
		return
	let xhr=new XMLHttpRequest()
	xhr.onreadystatechange=()=>{
		if(xhr.readyState==4&&xhr.status==200)
		{
			let json=JSON.parse(xhr.responseText)
			if(json&&json.destination)
				destination=json.destination
		}
	}
	xhr.open("GET","https://api.hell.sh/redirect/"+encodeURIComponent(details.url),false)
	xhr.send()
	if(destination)
	{
		if(destination!=details.url)
			return{redirectUrl:destination}
	}
},{urls:getTrackerPatterns()},["blocking"])

var getTrackerPatterns=()=>{
	let trackerPatterns=[
	"*://*.bit.ly/*",
	"*://*.goo.gl/*",
	"*://*.page.link/*"
	],
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

	# SkypeGrab

	skypegrab.net
	sĸype.com
	en.sĸype.com
	web.sĸype.com
	www.sĸype.com
	csgopot.zone
	hackfȯrums.net
	hackfȯrums.com
	imgúr.com
	battlė.net
	us.battlė.net
	eu.battlė.net
	r1p.pw
	webprofile.me
	anonymousforum.pw
	freeanonymous.host
	ts3free.top
	viphackforum.xyz
	bbcnews.today
	privatexmpp.me
	topstreaming.us
	topcdn.biz
	hackernews.online
	ampnode.host
	spoofing.host
	cubeupload.xyz
	exploit-db.xyz
	gyazoo.xyz
	ipddoser.xyz
	skypecracker.xyz
	postimage.co

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
			else if(line.substr(0,1)=="i.")
				line=line.substr(1)
			if(trackerPatterns.indexOf(line)==-1)
				trackerPatterns.push("*://*."+line+"/*")
		}
	}
	return trackerPatterns
}
