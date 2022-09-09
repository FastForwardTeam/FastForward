  /////////////////////////////////////////////////////////////////////////////////////////////
 // If you want to add your own bypass, add it above the relevant "Insertion point" comment //
/////////////////////////////////////////////////////////////////////////////////////////////
const bypass_definitions = new Map();
const href_bypasses = new Map();
class FastForwardBypassDefinition  {
	constructor({url, is_regex, execution}) {
		this.url = url;
		this.is_regex = is_regex;
		this.execution = execution;
	}

	update({url, is_regex, execution}) {
		this.url = url;
		this.is_regex = is_regex;
		this.execution = execution;
	}
}
//Variables
let isGoodLink_allowSelf=false
//Copying important functions to avoid interference from other extensions or the page
const ODP=(t,p,o)=>{try{Object.defineProperty(t,p,o)}catch(e){console.trace("[FastForward] Couldn't define",p)}},
setTimeout=window.setTimeout,setInterval=window.setInterval,URL=window.URL,docSetAttribute=document.documentElement.setAttribute.bind(document.documentElement),
transparentProperty=(name,valFunc)=>{
	let real
	ODP(window,name,{
		set:_=>real=_,
		get:()=>valFunc(real)
	})
},
isGoodLink=link=>{
	if(typeof link !== "string"||(link.split("#")[0]==location.href.split("#")[0]&&!isGoodLink_allowSelf))
	{
		return false
	}
	try
	{
		let u = new URL(decodeURI(link).trim().toLocaleLowerCase())
		//check if host is a private/internal ip
		if (u.hostname === 'localhost' || u.hostname === '[::1]' || /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(u.hostname)) {
			return false
		}
		var parts = u.hostname.split('.');
		if (parts[0] === '10' || (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || (parts[0] === '192' && parts[1] === '168')) {
			return false
		}
		// Check if protocol is safe
		let safeProtocols = ["http:", "https:", "mailto:", "irc:", "telnet:", "tel:", "svn:"]
		if (!safeProtocols.includes(u.protocol)) {
			return false
		}
	}
	catch(e)
	{
		return false
	}
	return true
},
unsafelyAssign=target=>{
	navigated=true
	window.onbeforeunload=null
	location.assign(target)
},
unsafelyNavigate=target=>{
	if(navigated)
	{
		return
	}
	//The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
	let url="https://fastforward.team/bypassed?target="+encodeURIComponent(target)+"&referer="+encodeURIComponent(referer)
	switch(target)//All values here have been tested using "Take me to destinations after 0 seconds."
	{
		case (/(krnl\.place|hugegames\.io)/.exec(target)||{}).input:
		url+="&safe_in=15"
		break;
		case (/(bowfile\.com)/.exec(target)||{}).input:
		url+="&safe_in=20"
		break;
	}
	unsafelyAssign(url)
},
parseTarget=target=>target instanceof HTMLAnchorElement?target.href:target,
safelyNavigate=(target,drophash)=>{
	target=parseTarget(target)
	if(navigated||!isGoodLink(target))
	{
		return false
	}
	bypassed=true
	let url=new URL(target)
	if(!drophash&&(!url||!url.hash))
	{
		target+=location.hash
	}
	unsafelyNavigate(target)
	return true
},
safelyAssign=target=>{
	target=parseTarget(target)
	if(navigated||!isGoodLink(target))
	{
		return false
	}
	bypassed=true
	let url=new URL(target)
	if(!url||!url.hash)
	{
		target+=location.hash
	}
	unsafelyAssign(target)
	return true
},
unsafelyAssignWithReferer=(target,referer)=>{
	//The background script will intercept this request and handle it.
	location.href="https://fastforward.team/navigate?target="+encodeURIComponent(target)+"&referer="+encodeURIComponent(referer)
},
finish=()=>{
	bypassed=true
	docSetAttribute("{{channel.stop_watching}}","")
},
countIt=f=>{
	docSetAttribute("{{channel.count_it}}","")
	setTimeout(f,10)
},
keepLooking=f=>{
	bypassed=false
	if(typeof f=="function")
	{
		f()
	}
}
domainBypass=(domain,f)=>{
	let FastForward_definition = new FastForwardBypassDefinition({url: domain, is_regex: typeof domain !== 'string' && 'test' in domain, execution: f});
	if (bypass_definitions.has(domain.toString())) {
		FastForward_definition = bypass_definitions.get(domain.toString());
	}
	FastForward_definition.update({url: domain, is_regex: typeof domain !== 'string' && 'test' in domain, execution: f});
	bypass_definitions.set(domain.toString(), FastForward_definition);

	if(typeof f!="function")
	{
		alert("FastForward: Bypass for "+domain+" is not a function")
	}
	if(typeof domain=="string")
	{
		if(location.hostname === domain || location.hostname.substr(location.hostname.length-(domain.length+1)) === "." + domain)
		{
			FastForward_definition.execution();
		}
	}
	else if("test" in domain)
	{
		if(domain.test(location.hostname))
		{
			FastForward_definition.execution();
		}
	}
	else
	{
		console.error("[FastForward] Invalid domain:",domain)
	}
},
hrefBypass=(regex,f)=>{
	let FastForward_definition = new FastForwardBypassDefinition({url: domain, is_regex: true, execution: f});
	if (href_bypasses.has(domain.toString())) {
		FastForward_definition = href_bypasses.get(domain.toString());
	}
	FastForward_definition.update({url: domain, is_regex: true, execution: f});
	href_bypasses.set(domain.toString(), FastForward_definition);
	if(bypassed)
	{
		return
	}
	if(typeof f!="function")
	{
		alert("FastForward: Bypass for "+domain+" is not a function")
	}
	let res=regex.exec(location.href)
	if(res)
	{
		bypassed=true
		FastForward_definition.execution(res)
	}
},
ensureDomLoaded=(f,if_not_bypassed)=>{
	if(if_not_bypassed&&bypassed)
	{
		return
	}
	if(["interactive","complete"].indexOf(document.readyState)>-1)
	{
		f()
	}
	else
	{
		let triggered=false
		document.addEventListener("DOMContentLoaded",()=>{
			if(!triggered)
			{
				triggered=true
				setTimeout(f,1)
			}
		})
	}
},
ifElement=(q,f,ef)=>ensureDomLoaded(()=>{
	let e=document.querySelector(q)
	if(e)
	{
		f(e)
	}
	else if(ef)
	{
		ef()
	}
}),
awaitElement=(q,f)=>ensureDomLoaded(()=>{
	let t=setInterval(()=>{
		let e=document.querySelector(q)
		if(e)
		{
			f(e)
			clearInterval(t)
		}
	},10)
	setInterval(()=>clearInterval(t),30000)
}),
crowdDomain=d=>{
	if(crowdEnabled&&d)
	{
		docSetAttribute("{{channel.crowd_domain}}",d)
	}
},
crowdPath=p=>{
	if(crowdEnabled&&p)
	{
		docSetAttribute("{{channel.crowd_path}}",p)
	}
},
crowdReferer=r=>{
	if(r)
	{
		docSetAttribute("{{channel.crowd_referer}}",r)
	}
},
crowdBypass=(f,a)=>{
	if(!f)
	{
		f=()=>{}
	}
	if(crowdEnabled)
	{
		if(ignoreCrowdBypass)
		{
			f()
		}
		else
		{
			docSetAttribute("{{channel.crowd_query}}","")
			let iT=setInterval(()=>{
				if(document.documentElement.hasAttribute("{{channel.crowd_queried}}"))
				{
					clearInterval(iT)
					document.documentElement.removeAttribute("{{channel.crowd_queried}}}")
					insertInfoBox("{{msg.crowdWait}}")
					f()
				}
			},20)
		}
	}
	else if(a)
	{
		f()
	}
	else
	{
		insertInfoBox("{{msg.crowdDisabled}}")
	}
},
crowdContribute=(target,f)=>{
	if(typeof f!="function")
	{
		f=()=>{}
	}
	if(crowdEnabled&&isGoodLink(target))
	{
		docSetAttribute("{{channel.crowd_contribute}}",target)
		setTimeout(f,10)
	}
	else
	{
		f()
	}
},
contributeAndNavigate=target=>{
	if(!navigated&&isGoodLink(target))
	{
		crowdContribute(target,()=>unsafelyNavigate(target))
	}
},
insertInfoBox=text=>ensureDomLoaded(()=>{
	// ffibv1 = FastForwardInfoBoxVersion1
	let infobox_container = document.querySelector('div#ffibv1');

	if (!infobox_container) {
		infobox_container = document.createElement('div');
		infobox_container.setAttribute('id', 'ffibv1');
		infobox_container.setAttribute('style', `
			z-index: 99999999; position: fixed; bottom: 0; line-height:normal;
			right: 0; padding: 20px; color:#111; font-size:21px;
			font-family:-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol;
			max-width:500px; display: flex; flex-direction: column-reverse;
		`);

		document.body.appendChild(infobox_container);
	}
	const div=document.createElement("div");
	div.style='margin-left:20px; margin-bottom: 20px;background:#eee;border-radius:10px;padding:20px;box-shadow:#111 0px 5px 40px;cursor:pointer'
	div.innerHTML='<img src="{{icon/48.png}}" style="width:24px;height:24px;margin-right:8px"><span style="display:inline"></span>'
	div.setAttribute("tabindex","-1")
	div.setAttribute("aria-hidden","true")
	const span=div.querySelector("span")
	span.textContent=text
	div.onclick=()=>infobox_container.removeChild(div)
	infobox_container.appendChild(div)
	setTimeout(()=>infobox_container.removeChild(div), 7000);
}),
backgroundScriptBypassClipboard=c=>{
	if(c)
	{
		docSetAttribute("{{channel.bypass_clipboard}}",c)
	}
},
persistHash=h=>ensureDomLoaded(()=>{
	document.querySelectorAll("form[action]").forEach(e=>e.action+="#"+h)
	document.querySelectorAll("a[href]").forEach(e=>e.href+="#"+h)
}),
//decodes https://stackoverflow.com/a/16435373/17117909
decodeURIEncodedMod=(s)=>{
    try{
        return decodeURIComponent(s.replace(/\%2D/g, "-").replace(/\%5F/g, "_").replace(/\%2E/g, ".").replace(/\%21/g, "!").replace(/\%7E/g, "~").replace(/\%2A/g, "*").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")"));
    }catch (e) {
		return null
    }
}

//Backwards compatibility for ffclipboard
versionString = 'FAST_FORWARD_EXTERNAL_VERSION'
let versionPatchNumber = Number(versionString.split(".").pop())
let ffClpbrdSupported = false
if(versionPatchNumber >= 1924) {
	ffClpbrdSupported = true
}
if (ffClpbrdSupported) {
	ffClipboard_stored = decodeURIEncodedMod(ffClipboard_stored) //ffClipboard_stored is defined in content_script.js
} else {
	ffClipboard_stored = '{}'
}
class ffClipboard {
	constructor() { }
	//returns an ffclipboard entry, if id does not exist, returns null
	static get(id) {
		try {
			var ffClipboardObj = JSON.parse(ffClipboard_stored)
		} catch (e) {
			return null
		}
		if (ffClipboardObj) {
			if (ffClipboardObj[id]) {
				return ffClipboardObj[id]
			} else {
				return null
			}
		} else {
			return null
		}
	}
	//sets ffclipboard contents, if id does not exist, creates it
	static set(id, value) {
		try {
			var ffClipboardObj = JSON.parse(ffClipboard_stored)
		} catch (e) {
			return null
		}
		if (ffClipboardObj) {
			ffClipboardObj[id] = value
			let message = { type: "ffclipboardSet", text: JSON.stringify(ffClipboardObj) }
			window.postMessage(message, "*") //send message to content script
			ffClipboard_stored = JSON.stringify(ffClipboardObj)
		} else {
			return null
		}
	}
	//deletes ffclipboard contents and frees up storage, if id does not exist, does nothing
	static free(id) {
		try {
			var ffClipboardObj = JSON.parse(ffClipboard_stored)
		} catch (e) {
			return null
		}
		if (ffClipboardObj) {
			if (ffClipboardObj[id]) {
				delete ffClipboardObj[id]
				let message = { type: "ffclipboardSet", text: JSON.stringify(ffClipboardObj) }
				window.postMessage(message, "*")
				ffClipboard_stored = JSON.stringify(ffClipboardObj)
			} else {
				return
			}
		} else {
			return
		}
	}
}
let navigated=false,
bypassed=false,
domain=location.hostname,
referer=location.href
if(domain.substr(0,4)=="www.")
{
	domain=domain.substr(4)
}
ODP(window,"blurred",{
	value:false,
	writable:false
})
ODP(window,"window_focus",{
	value:true,
	writable:false
})
//adf.ly
ODP(window,"ysmm",{
	set:r=>{
		let a,m,I="",X=""
		for(m=0;m<r.length;m++)
		{
			if(m%2==0)
			{
				I+=r.charAt(m)
			}
			else
			{
				X=r.charAt(m)+X
			}
		}
		r=I+X
		a=r.split("")
		for(m=0;m<a.length;m++)
		{
			if(!isNaN(a[m]))
			{
				for(var R=m+1;R<a.length;R++)
				{
					if(!isNaN(a[R]))
					{
						let S=a[m]^a[R]
						if(S<10)
						{
							a[m]=S
						}
						m=R
						R=a.length
					}
				}
			}
		}
		r=a.join('')
		r=atob(r)
		r=r.substring(r.length-(r.length-16))
		r=r.substring(0,r.length-16)
		safelyNavigate(r)
	},
	get:()=>"undefined"
})
//LinkBucks
let actualInitLbjs
ODP(window,"initLbjs",{
	set:(_)=>actualInitLbjs=_,
	get:()=>(a,p)=>{
		crowdBypass(()=>{
			JSON.parse=new Proxy(JSON.parse,{
				apply:(...a)=>{
					let json=Reflect.apply(...a)
					if(json&&json.Url)
					{
						contributeAndNavigate(json.Url)
					}
					return json
				}
			})
		})
		actualInitLbjs(a,p)
	}
})
//Safelink
let forced_safelink={counter:0,adblock:false,click2x:false},actual_safelink=forced_safelink
ODP(window,"safelink",
{
	set:_=>{
		for(let k in _)
		{
			if(forced_safelink[k]===undefined)
			{
				actual_safelink[k]=_[k]
			}
		}
	},
	get:()=>{
		ensureDomLoaded(()=>{
			awaitElement(".bagi .link > .result > a[href]",a=>{
				if(isGoodLink(a.href))
				{
					safelyNavigate(a.href)
				}
				else
				{
					a.click()
				}
			})
		})
		return actual_safelink
	}
})
if(typeof safelink!="undefined")
{
	for(let key in forced_safelink)
	{
		ODP(safelink,key,
		{
			writable:false,
			value:forced_safelink[key]
		})
	}
}
//Soralink Wordpress Plugin
ODP(window,"soralink",{
	get:()=>{}
})
//Adtival
ODP(window,"adtival_base64_encode",{
	get:()=>{}
})
domainBypass(/ur\.ly|urly\.mobi/,()=>{
	if(location.pathname.length>2&&location.pathname.substr(0,6)!="/goii/")
	{
		safelyNavigate("/goii/"+location.pathname.substr(2)+"?ref="+location.hostname+location.pathname)
	}
})
domainBypass("akoam.net",()=>{
	ODP(window,"timer",{
		value:0,
		writable:false
	})
	awaitElement(".download_button[href]",safelyNavigate)
})
hrefBypass(/1v\.to\/t\/.*/,()=>location.pathname=location.pathname.split("/t/").join("/saliendo/"))
hrefBypass(/sourceforge\.net\/projects\/.+\/files\/.+\/download/,()=>{
	var b=document.createElement("button"),d=false
	b.className="direct-download"
	b.style.display="none"
	document.documentElement.appendChild(b)
	ODP(window,"log",{
		value:m=>{
			console.log(m)
			if(m=="triggering downloader:start")
				d=true
		},
		writable:false
	})
	ensureDomLoaded(()=>{
		let bT=setInterval(()=>{
			if(d)
			{
				clearInterval(bT)
			}
			else
			{
				b.click()
			}
		},100)
	})
})
domainBypass(/bc\.vc|bcvc\.live/,()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement("a#getLink:not([style^='display'])",a=>a.click())
})
domainBypass("shortly.xyz",()=>{
	if(location.pathname.substr(0,3)=="/r/")
	{
		document.getElementById=()=>({submit:()=>{
			let f=document.querySelector("form")
			f.action="/link#"+document.querySelector("input[name='id']").value
			f.submit()
		}})
	}
	else if(location.pathname=="/link")
	{
		let xhr=new XMLHttpRequest()
		xhr.onload=()=>safelyNavigate(xhr.responseText)
		xhr.open("POST","https://www.shortly.xyz/getlink.php",true)
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
		xhr.setRequestHeader("X-Requested-With","XMLHttpRequest")
		xhr.send("id="+location.hash.substr(1))
	}
})
domainBypass("uploaded.net",()=>{
	let i=0
	window.setTimeout=f=>{
		if(++i==62)
		{
			window.setTimeout=setTimeout
		}
		return setTimeout(f,100)
	}
})
domainBypass(/mylinks\.xyz|mylink\.zone|mylink1\.biz/,()=>{//clictune
	window.setTimeout=f=>setTimeout(f,1)
	awaitElement("#compteur a[href]",a=>safelyNavigate(new URL(a.href).searchParams.get("url")))
})
domainBypass(/shortmoz\.link|skinnycat\.org|safelink\.polrec\.site/,()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement("a.btn.redirect[href^='http']",safelyNavigate)
})
domainBypass("gamesmega.net",()=>{
	ODP(window,"hash",{
		get:()=>"",
		set:_=>safelyNavigate(decodeURIComponent(atob(_)))
	})
})
domainBypass("hokiciki.org",()=>ifElement("a[href^='/get-link/']",safelyAssign))
domainBypass(/wadooo\.com|gotravelgo\.space|pantauterus\.me|liputannubi\.net/,()=>{
	crowdPath(location.hash.substr(1))
	crowdBypass()
})
domainBypass("lnk.news",()=>ifElement("#display_go_form",f=>{
	window.open=()=>{}
},()=>ifElement("#skip_form",()=>{
	Math.random=()=>1
	setTimeout(()=>$("#skip_form").trigger("submit"),50)
})))
hrefBypass(/(uiz\.(io|app)|moon7\.xyz)\/go|tlkm\.id/,()=>{
	Object.freeze(location)
	ensureDomLoaded(()=>{
		const regex=/.*window\.location\.href = "(http[^"]+)";.*/
		document.querySelectorAll("script").forEach(script=>{
			let matches=regex.exec(script.textContent)
			if(matches&&matches[1])
			{
				crowdPath(bypassClipboard)
				contributeAndNavigate(matches[1])
			}
		})
	})
})
hrefBypass(/(prox77|agdd5br)\.com\/analyze\/(.+)/,m=>location.pathname="/result/"+m[2])
hrefBypass(/sfile\.(mobi|xyz)|apkmos\.com/,()=>{
	ODP(window,"downloadButton",{
		set:a=>{
			if(a&&a.href)
			{
				safelyAssign(a.href)
			}
		}
	})
})
hrefBypass(/gixen\.com\/home_1\.php/,()=>{
	const sid=document.cookie.match(/sessionid=(\d+)/)[1]
	if(sid)
	{
		let f=document.createElement("form")
		f.method="POST"
		f.action="home_2.php?sessionid="+sid
		f.innerHTML='<input type="hidden" name="gixenlinkcontinue" value="1">'
		document.documentElement.appendChild(f)
		countIt(()=>f.submit())
	}
})
domainBypass("linkduit.net",()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement("a#download[itemlink]",a=>{
		if(isGoodLink(a.getAttribute("itemlink")))
		{
			safelyAssign(a.getAttribute("itemlink"))
		}
	})
	awaitElement("a.mirror_link[href]",safelyNavigate)
})
domainBypass("tik.lat",()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement(".skip > .wait > .skip > .btn > a[href]",safelyNavigate)
})
domainBypass(/acortalo\.(live|xyz|org)/,()=>{
	if(document.referrer.indexOf("megawarez")>-1)
	{
		const _ce=document.createElement
		document.createElement=t=>{
			let e=_ce.call(document,t)
			e.submit=()=>safelyNavigate(data,true)
			return e
		}
	}
})
domainBypass("apkpsp.com",()=>{
	ODP(window,"downloadButton",{
		set:a=>{
			if(a&&a.href)
			{
				safelyNavigate(a.href)
			}
		}
	})
	window.setInterval=f=>setInterval(f,1)
	awaitElement("form[action^='/blog/golink.php']",f=>f.submit())
})
domainBypass("ipeenk.id",()=>{
	ODP(window,"url_page",{
		get:()=>{
			safelyNavigate(Aes.Ctr.decrypt(location.href.substr(location.href.indexOf("?hash=")+6).split("&")[0],"-encrypt download@ip3enk",256))
		}
	})
})
domainBypass("zt-protect.com",()=>{
	if(location.pathname.substr(0,4)=="/to/")
	{
		location.pathname="/link/"+location.pathname.substr(4)
	}
	else if (location.pathname.substr(0, 10)=="/voirlien/")
	{
		location.pathname="/telecharger/"+location.pathname.substr(10)
	}
	else
	{
		ifElement("a[href] > .showURL",p=>safelyNavigate(p.parentNode.href))
	}
})
domainBypass(/(nofil|onnime)\.net/,()=>{
	if(location.pathname.substr(0,4)=="/dl/")
	{
		location.pathname="/get/"+location.pathname.substr(4)
	}
})
domainBypass("biozkop21.my.id",()=>{
	if(location.pathname=="/download.php")
	{
		location.pathname=location.pathname.replace("/download.php","/download21.php")
	}
})
domainBypass("4shared.com",()=>{
	if(document.cookie.indexOf("exUserId=")==-1)
	{
		document.cookie="exUserId=0; domain=.4shared.com; path=/"
	}
})
domainBypass(/^((www\.)?((safe\.anirocksite|my-code4you\.blogspot|jemerik)\.com|busyfinance\.site|behealth-id\.xyz))$/,()=>{
	let p=new URL(location.href).searchParams
	if(p.has("safe")||p.has("kareeI"))
	{
		ensureDomLoaded(()=>{
			let w=setInterval(()=>{
				if(typeof CryptoJS!="undefined")
				{
					clearInterval(w)
					let u,m=p.get(p.has("safe")?"safe":"kareeI")
					try
					{
						u=CryptoJS.AES.decrypt(m,"CryptoHEXKareela2FyZWVsa3Vu",{format:{
							parse:t=>{
								let r=CryptoJS.lib.CipherParams.create({})
								r.ciphertext=CryptoJS.enc.Hex.parse(t.substr(16))
								r.salt=CryptoJS.enc.Hex.parse(t.substr(0,16))
								return r
							}
						}}).toString(CryptoJS.enc.Utf8).split("||")[0]
					}
					catch(e)
					{
						u=JSON.parse(CryptoJS.AES.decrypt(m,"CryptoJSAESpass").toString(CryptoJS.enc.Utf8)).url
					}
					safelyNavigate(u)
				}
			},100)
		})
	}
})
domainBypass("cheatsquad.gg",()=>{
	ODP(window,"steps",{
		get:()=>[true]
	})
	ODP(window,"youtube",{
		get:()=>1
	})
	ensureDomLoaded(()=>document.querySelectorAll("div.loader").forEach(d=>d.className="check_loader"))
})
domainBypass("pirateproxy.wtf",()=>{
	let search=location.search.replace("?","")
	if(search)
	{
		safelyNavigate("https://"+search)
	}
})
domainBypass("fouadmods.com",()=>{
	ODP(window,"$",{
		writable:false,
		value:()=>({countdown360:d=>{d.onComplete()}})
	})
})
domainBypass(/akwam\.org|old\.akwam\.co/,()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement("a.download_button[href]",safelyNavigate)
})
domainBypass("post.techtutors.site",()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement("a#menuju[href]:not([href='#'])",safelyNavigate)
})
domainBypass("an1.com",()=>{
	window.setTimeout=f=>setTimeout(f,1)
	awaitElement("#waiting > a", a=>a.click())
})
hrefBypass(/online-fix\.me\/ext\//,()=>{
	window.setTimeout=f=>setTimeout(f,1)
	awaitElement("#res > center > button.btn[onclick]",b=>b.onclick())
})
domainBypass(/pahe\.(in|me|ph)/,()=>{
	let _addEventListener=window.addEventListener
	window.addEventListener=(e,f)=>{
		if(e=="load"&&f.toString().indexOf("[n*15];")!==-1)
		{
			_addEventListener(e,()=>eval("("+f.toString().split("[n*15];").join("[n*15]+'#bypassClipboard='+event.target.getAttribute('data-bypass-clipboard')")+")()"))
		}
		else
		{
			_addEventListener(e,f)
		}
	}
	ensureDomLoaded(()=>document.querySelectorAll("acee").forEach(a=>{
		let s=location.pathname.replace(/[^a-zA-Z0-9]/g,""),
		ep=a.parentNode.querySelector("span[style] > b")
		if(ep!==null)
		{
			s+=ep.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		}
		qe=a.previousElementSibling
		while(qe&&qe.tagName!="B"&&qe.tagName!="STRONG"&&qe.tagName!="BR")
		{
			qe=qe.previousElementSibling
		}
		if(qe!==null)
		{
			s+=(qe.tagName=="BR"?qe.previousSibling:qe).textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		}
		s+=a.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		a.setAttribute("data-bypass-clipboard",s)
	}))
})
domainBypass("boost.ink",()=>fetch(location.href).then(r=>r.text()).then(html=>safelyNavigate(atob(html.split('kekw="')[1].split('"')[0]))))
domainBypass("linksunlocked.com",()=>{
	const searchParams=new URLSearchParams(location.search)
	if(searchParams.has("token"))
	{
		safelyNavigate("https://uploadhaven.com/download/"+searchParams.get("token"))
	}
})
domainBypass("samehadaku.vip",()=>ifElement("div.close-button",a=>a.click()))
domainBypass("playhindi.com",()=>transparentProperty("downloadButton",safelyNavigate))
hrefBypass(/daominhha\.com\/download/,()=>{
	var str=(new URL(location.href)).searchParams.get("url");
	str=str.split("");
	str=str.reverse();
	str=str.join("");
	str=str.replaceAll("-","+");
	str=str.replaceAll(".","/");
	str=str.replaceAll(",","=");
	safelyAssign(atob(str));
});
hrefBypass(/(bluemediafiles\.com|pcgamestorrents.org)\/url-generator\.php\?url=/,()=>{
	window.setInterval=f=>setInterval(f,1)
	transparentProperty("Time_Start",t=>t-5000)
	awaitElement("input#nut[src]",i=>i.parentNode.submit())
})
//Insertion point for bypasses running before the DOM is loaded.
hrefBypass(/https:\/\/crackedappsstore\.com\/(?:\\.|[^\\])*\/\?download.*/gm, () => ifElement("a.downloadAPK.dapk_b[href]", a => safelyAssign(a.href)))
domainBypass("downloadr.in",()=>safelyNavigate(new URL(location.href).search.slice(1)))
domainBypass(/^((www\.)?((njiir|healthykk|linkasm|dxdrive|getwallpapers|sammobile|ydfile|mobilemodsapk|dlandroid|download\.modsofapk)\.com|(punchsubs|zedge|fex)\.net|k2s\.cc|muhammadyoga\.me|u\.to|skiplink\.io|(uploadfree|freeupload)\.info|fstore\.biz))$/,()=>window.setInterval=f=>setInterval(f,1))
hrefBypass(/thesimsresource\.com\/downloads\/details\/id\//,()=>window.setTimeout=f=>setTimeout(f,1))
hrefBypass(/firefaucet\.win\/l\/|sfirmware\.com\/downloads-file\/|(apkily\.com\/getapp$)|androidtop\.net\/\?do=downloads\&id=/,()=>window.setInterval=f=>setInterval(f,1))
hrefBypass(/emulator\.games\/download\.php|curseforge\.com\/.*\/download\/[0-9]*/,()=>window.setInterval=f=>setInterval(f,100))
domainBypass(/^((www\.)?((racaty|longfiles|filepuma|portableapps)\.com|indishare\.org|datei\.to|keisekai\.fun|solvetube\.site))$/,()=>window.setTimeout=f=>setTimeout(f,1))
domainBypass(/lkc21\.net|layarkacaxxi\.org/,()=>window.setTimeout=f=>setTimeout(f,100))
domainBypass("fastforward.team",()=>{

	window.fastForwardInstalled = true
	window.fastForwardInternalVersion = "FAST_FORWARD_INTERNAL_VERSION"
	window.fastForwardExternalVersion = "FAST_FORWARD_EXTERNAL_VERSION"
	window.fastForwardInjectionVersion = "FAST_FORWARD_INJECTION_VERSION"

	if (['/bypassed', '/navigate'].includes(location.pathname))
		location.assign(`https://universal-bypass.org${location.pathname}${location.search}`)
})

domainBypass("acortame.xyz", () => {
    if (window.location.hash) unsafelyNavigate(atob(window.location.hash.substr(1)))
})

domainBypass(/linkvertise\.(com|net)|link-to\.net/, () => {
	if (window.location.href.toString().indexOf("?r=") != -1) {
		const urlParams = new URLSearchParams(window.location.search);
		const r = urlParams.get('r')
		safelyNavigate(atob(decodeURIComponent(r)));
	}

	const rawOpen = XMLHttpRequest.prototype.open;

	XMLHttpRequest.prototype.open = function() {
		this.addEventListener('load', data => {
			if (data.currentTarget.responseText.includes('tokens')) {
				const response = JSON.parse(data.currentTarget.responseText);
				if (!response.data.valid)
					return insertInfoBox('Please solve the captcha, afterwards we can immediately redirect you');

				const target_token = response.data.tokens['TARGET'];
				const ut = localStorage.getItem("X-LINKVERTISE-UT");
				const linkvertise_link = location.pathname.replace(/\/[0-9]$/, "");


				fetch(`https://publisher.linkvertise.com/api/v1/redirect/link/static${linkvertise_link}?X-Linkvertise-UT=${ut}`).then(r => r.json()).then(json => {
					if (json?.data.link.target_type !== 'URL') {
						return insertInfoBox('Due to copyright reasons we are not bypassing linkvertise stored content (paste, download etc)');
					}
					if (json?.data.link.id) {
						const json_body = {
							serial: btoa(JSON.stringify({
								timestamp:new Date().getTime(),
								random:"6548307",
								link_id:json.data.link.id
							})),
							token: target_token
						}
						fetch(`https://publisher.linkvertise.com/api/v1/redirect/link${linkvertise_link}/target?X-Linkvertise-UT=${ut}`, {
							method: "POST",
							body: JSON.stringify(json_body),
							headers: {
								"Accept": 'application/json',
								"Content-Type": 'application/json'
							}
						}).then(r=>r.json()).then(json=>{
							if (json?.data.target) {
								safelyNavigate(json.data.target)
							}
						})
					}
				})
			}
		});
		rawOpen.apply(this, arguments);
	}
})

ensureDomLoaded(()=>{
	if(ignoreCrowdBypass)
	{
		persistHash("ignoreCrowdBypass")
	}
	domainBypass(/^((www\.)?((file(factory|-upload)|asdfiles|mega4up)\.com|up-load\.io|cosmobox\.org|rockfile\.co|devdrive\.cloud))$/,()=>insertInfoBox("{{msg.infoFileHoster}}"))
	domainBypass(/linkvertise\.(com|net)|link-to\.net/,()=>insertInfoBox(FAST_FORWARD_INTERNAL_VERSION>=9?"{{msg.infoLinkvertise}}":"We're not allowed to bypass this website but we have negotiated the removal of their most annoying steps."))
	domainBypass("srt.am",()=>{
		if(document.querySelector(".skip-container"))
		{
			let f=document.createElement("form")
			f.method="POST"
			f.innerHTML='<input type="hidden" name="_image" value="Continue">'
			f=document.documentElement.appendChild(f)
			countIt(()=>f.submit())
		}
	})
	domainBypass("complete2unlock.com",()=>{
		let bT=setInterval(()=>{
			let b=document.getElementById("link-success-button"),es=document.querySelectorAll(".unlockpanel")
			if(b&&es.length>0)
			{
				clearInterval(bT)
				window.open=()=>{}
				es.forEach(e=>e.dispatchEvent(new MouseEvent("click")))
				let dT=setInterval(()=>{
					if(!b.hasAttribute("disabled"))
					{
						clearInterval(dT)
						b.dispatchEvent(new MouseEvent("click"))
					}
				},100)
			}
		},300)
		setInterval(()=>clearInterval(bT),30000)
	})
	domainBypass("won.pe",()=>ifElement("#progress",p=>{
		p.setAttribute("aria-valuenow","100")
		awaitElement("#skip_button[href]:not([href=''])",b=>safelyNavigate(window.longURL))
	}))
	domainBypass("gotoo.loncat.in",()=>ifElement("a[href^='http://gotoo.loncat.in/go.php?open=']",safelyNavigate))
	domainBypass("idnation.net",()=>ifElement("#linko[href]",b=>safelyNavigate(b.href)))
	domainBypass("mazika2day.com",()=>ifElement(".linkbtn[href]",b=>safelyNavigate(b.href)))
	domainBypass("ux9.de",()=>{
		ifElement("meta[http-equiv='refresh'][content]",m=>{
			let c=m.content.replace("; url=",";url=")
			if(c.indexOf(";url=") > -1)
			{
				safelyNavigate(c.split(";url=")[1])
			}
		})
	})
	domainBypass("softpedia.com",()=>{
		ifElement("meta[http-equiv='refresh'][content]",m=>{
			let c=m.content.replace("; url=",";url=")
			if(c.indexOf(";url=") > -1)
			{
				safelyAssign(c.split(";url=")[1])
			}
		})
	})
	domainBypass("rapidcrypt.net",()=>ifElement(".push_button.blue[href]",b=>safelyNavigate(b.href)))
	domainBypass("rom.io",()=>crowdBypass(()=>awaitElement("a.final-button[href]",a=>{
		if(isGoodLink(a.href))
		{
			a.parentNode.removeChild(a)
			contributeAndNavigate(a.href)
		}
	})))
	domainBypass("show.co",()=>{
		let s=document.getElementById("show-campaign-data")
		if(s)
		{
			let d=JSON.parse(s.textContent)
			if(d&&"title"in d&&"unlockable"in d)
			{
				document.write("<body></body>")
				if("title"in d)
				{
					["title","h1"].forEach(t=>{
						let e=document.createElement(t)
						e.textContent=d.title
						document.body.appendChild(e)
					})
				}
				if("message"in d.unlockable)
				{
					let p=document.createElement("p")
					p.textContent=d.unlockable.message
					document.body.appendChild(p)
				}
				if("redirect"in d.unlockable&&"url"in d.unlockable.redirect)
				{
					let p=document.createElement("p"),a=document.createElement("a")
					a.textContent=a.href=d.unlockable.redirect.url
					p.appendChild(a)
					document.body.appendChild(p)
				}
				stop()
			}
		}
	})
	domainBypass("vcrypt.net",()=>{
		if(document.querySelector(".btncontinue"))
		{
			document.querySelector("form").submit()
		}
	})
	domainBypass(/1link\.club|bomurl\.com/,()=>{
		window.setInterval=f=>setInterval(f,1)
		let b=document.getElementById("go_next")
		if(b&&isGoodLink(b.href))
		{
			safelyAssign(b.href)
		}
		else
		{
			ifElement("#download",b=>safelyNavigate(b.href))
		}
	})
	hrefBypass(/(4snip\.pw|flare\.icu)\/(out|decode)\//,()=>{
		let f=document.querySelector("form[action^='../out2/']")
		f.setAttribute("action",f.getAttribute("action").replace("../out2/","../outlink/"))
		countIt(()=>f.submit())
	})
	domainBypass("elsfile.org",()=>{
		let f=document.createElement("form")
		f.method="POST"
		f.innerHTML='<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.substr(1)+'"><input type="hidden" name="fname"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">'
		f.querySelector("[name='fname']").value=document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent
		f=document.documentElement.appendChild(f)
		countIt(()=>f.submit())
	})
	domainBypass(/goou\.in|manualsbooks\.com/,()=>ifElement("div#download_link > a#download[href]",safelyNavigate))
	domainBypass("ryn.cc",()=>{
		if(typeof countdown=="function")
		{
			document.write('<div id="link"><p id="timer">0</p></div>')
			countdown()
			safelyNavigate(document.querySelector("#link > a").href)
		}
	})
	domainBypass("connect-trojan.net",()=>{
		ifElement("#post_download > a[onclick]",a=>{
			redireciona=safelyNavigate
			a.onclick()
		})
	})
	domainBypass("binbox.io",()=>{
		let xhr=new XMLHttpRequest()
		xhr.onload=()=>{
			let json=JSON.parse(xhr.responseText)
			if(json&&json.paste&&json.paste.url)
			{
				safelyNavigate(json.paste.url)
			}
			else if(json&&json.paste&&json.paste.text&&typeof sjcl!="undefined")
			{
				let t=sjcl.decrypt(location.hash.substr(1),json.paste.text)
				document.querySelector("#captcha-page").innerHTML='<pre id="paste-text">'+t+'</pre>'
			}
		}
		xhr.open("GET",location.pathname+".json")
		document.cookie="referrer=1"
		xhr.send()
	})
	domainBypass(/lnk2\.cc/,()=>{
		if(location.pathname.substr(0,4)=="/go/")
		{
			document.querySelector("form").submit()
		}
		else
		{
			crowdBypass()
		}
	})
	domainBypass(/ouo\.(press|io)/, () => {
		if(location.pathname !== '/'){
			if(/(go|fbc)/.test(location.pathname.split("/")[1])){
				document.querySelector("form").submit()
			}
			else {
				ifElement("form#form-captcha", form => {
						form.action = `/xreallcygo${location.pathname}`
						form.submit()
				},() => crowdBypass())
			}
		}
	})
	domainBypass(/za\.(gl|uy)/, () => {
		ifElement("form#link-view", form => {
			document.querySelector('#x').value = '192'
			document.querySelector('#y').value = '114'
			document.querySelector('input[name="givenX"]').value = 'VFl0utOEF6a7BiS8YJdqTg=='
			document.querySelector('input[name="givenY"]').value = 'rsW06vBB1oIFVpnFz61t5Q=='
			form.submit()
			return
		})

		ifElement("form#go-link", () => {
			window.setTimeout(() => {
				let payload = new URLSearchParams(new FormData(document.querySelector("#go-link"))).toString();
					fetch(`${location.origin}/links/go`, {
						"headers": {
							"content-type":"application/x-www-form-urlencoded; charset=UTF-8",
							"x-requested-with":"XMLHttpRequest"
						},
						"body":payload,
						"method": "POST",
						"mode": "cors",
					})
					.then(res => res.json())
					.then(res => {
						if(res.status !== "error"){
							safelyNavigate(res.url)
							return
						}
						crowdBypass()
					})
				}, 3500)
		}, () => crowdBypass())
	})
	domainBypass("drivehub.link",()=>ifElement("a#proceed[href]",safelyNavigate))
	domainBypass(/oxy\.st|healthyteeth\.tips/,()=>{awaitElement("a.btn.btn-primary.btn-lg",t=>{safelyAssign(t.href)}),ifElement("button#download[disabled]",t=>{awaitElement("button#download:not([disabled])",t=>{t.click()})})})
	domainBypass("oxy.cloud",()=>{ifElement("button#download[disabled]",d=>{awaitElement("button#download:not([disabled])",d=>{d.click()})})})
	domainBypass("daunshorte.teknologilink.com",()=>safelyAssign(document.querySelector("a[href^='https://teknosafe.teknologilink.com/linkteknolink/safelinkscript.php?']").href))
	domainBypass("imgtaxi.com",()=>document.querySelector("a.overlay_ad_link").click())
	domainBypass("imgkoc.buzz",()=>{ifElement("#newImgE",img=>{
		wuLu()
		safelyNavigate(img.src)
	})})
	    domainBypass("anonym.ninja", () => {
            var a = window.location.href.split('/').slice(-1)[0]
            safelyNavigate(`https://anonym.ninja/download/file/request/${a}`)
            }) 

	domainBypass("do2unlock.com",()=>{
		let a=document.querySelector("a#locked_action_link[href^='/getlink/']")
		if(a)
		{
			safelyAssign("/redirect/"+a.getAttribute("href").substr(9))
			return
		}
		a=document.querySelector("a#redirecting_counter[href]")
		if(a)
		{
			safelyNavigate(a.href)
		}
	})
	domainBypass(/sub2unlock\.(com|net)/,()=>safelyNavigate(document.getElementById("theGetLink").textContent))
	domainBypass("boostme.gg",()=>safelyNavigate(document.querySelector("a[href]#go").href))
	domainBypass(/(driverays|bioskopgo|01nonton|thetecnostar|curimovie|akltu)\.com|cinema21\.tv/,()=>ifElement("a#link[href]",safelyAssign))
	domainBypass(/(wikitrik|linkerload).com/,()=>document.querySelector("#download > form[action='/getlink.php'] > input[type='submit'].button").click())
	domainBypass("dawnstation.com",()=>safelyNavigate(document.querySelector("#tidakakanselamanya.hiddenPlace > a").href))
	domainBypass("hokiwikiped.net",()=>ifElement("a#DrRO[href]",safelyNavigate))
	hrefBypass(/spaste\.com\/(s|site)\//,()=>{
		const doTheThing=f=>setTimeout(()=>{
			let item=document.querySelector("#currentCapQue").textContent
			document.querySelectorAll(".markAnswer").forEach(as=>{
				if(as.querySelector("img").getAttribute("src").toLowerCase().indexOf(item)>-1)
				{
					as.click()
				}
			})
			f()
		},200)
		document.querySelector("#captchaVerifiedStatus").click()
		doTheThing(()=>doTheThing(()=>doTheThing(()=>document.querySelector("#template-contactform-submit").click())))
	})
	domainBypass(/^((www\.)?(((get-click2|informations-library|media-blue|akashirohige|aibouanimelink|wwwfotografgotlin|casperqu|safelinksencrypter)\.blogspot|business\.ominfoupdate|insurance\.5ggyan|majidzhacker|citgratis|tekloggers|pro-bangla|ph\.(apps2app|samapkstore)|blog\.(hulblog|omgmusik|omglyrics))\.com|(pastikan|belajar-bersama2)\.me|(ph|fp)\.(tpaste|ontools)\.net|(blog\.infolanjutan|jkoding)\.xyz|((safe\.onbatch|anonimfiles)\.my|google-playss\.sdetectives)\.id|jackofnine\.site|getlink\.animesanka\.club))$/,()=>{
		let convertfn
		if (typeof convertstr=='function')
		{
			convertfn = convertstr
		}
		if (typeof apps2app=='function')
		{
			convertfn = apps2app
		}
		let u=aesCrypto.decrypt(convertfn(location.href.substr(location.href.indexOf("?o=")+3)),convertfn("root"))
		isGoodLink_allowSelf=true
		if(isGoodLink(u))
		{
			location.hash=""
			safelyNavigate(u)
		}
		else if(typeof uri=="string")
		{
			u=aesCrypto.decrypt(convertfn(uri.substr(uri.indexOf("?o=")+3)),convertfn("root"))
			safelyNavigate(u)
		}
		else if(typeof get_link=="string")
		{
			u=aesCrypto.decrypt(convertfn(get_link),convertfn("root"))
			safelyNavigate(u)
		}
		else if(location.href.indexOf("#go")>-1)
		{
			u=aesCrypto.decrypt(convertfn(location.href.substr(location.href.indexOf("#go")+3)),convertfn("root"))
			location.hash=""
			safelyNavigate(u.split("UI=")[1].split("NF=")[0])
		}
	})
	domainBypass("hello.tribuntekno.com",()=>ifElement("#splash p[style] > u > b > a[href]",safelyNavigate))
	domainBypass("ytsubme.com",()=>{
		ifElement("a#link",a=>{
			aTagChange()
			safelyNavigate(a.href)
		})
	})
	domainBypass("shortlink.in",()=>{
		ifElement("#continueButton.interContinueButton > a[href]",a=>{
			safelyNavigate(a.href)
		},()=>ifElement("frame[src^='interstitualAdTop.php?url=']",f=>safelyAssign(f.src)))
	})
	domainBypass("safe.doramaku.me",()=>{
		document.querySelector("form").setAttribute("action","//"+location.hostname)
		document.querySelector("input").setAttribute("name","link")
	})
	domainBypass("confile.net",()=>{
		ifElement("#verif > form [type='submit']",b=>b.click(),()=>{
			if(typeof downloadButton=="object"&&downloadButton instanceof HTMLAnchorElement)
			{
				safelyNavigate(downloadButton.href)
			}
			else
			{
				window.setInterval=f=>setInterval(f,1)
			}
		})
	})
	domainBypass(/linkshrtn\.com|(xtiny|shrten)\.link/,()=>{
		window.open=u=>window
		window.setTimeout=f=>setTimeout(f,1)
		window.setInterval=f=>setInterval(f,1)
		awaitElement(".complete_btn:not([disabled])",b=>b.onclick({isTrusted:1}))
		document.querySelectorAll(".all_steps > .step_block:not(.step_done)").forEach(e=>{
			e.onclick({isTrusted:1})
			$(window).on("blur")
			$(window).on("focus")
		})
	})
	domainBypass(/linkpoi\.(in|cc|me)/,()=>ifElement("a.btn.btn-primary[href]",safelyNavigate))
	domainBypass(/spacetica\.com|linegee\.net/,()=>setTimeout(()=>{
		let links=[];
		document.querySelectorAll("a.btn[href],a.btn-primary[href],a.btn-xs[href]").forEach(a=>{
			links.push(a.href)
			let events=$._data(a,"events")
			if(events&&"click"in events)
			{
				events.click.forEach(f=>{
					const r=/'.*(http[^']+)';/g
					while(true)
					{
						let matches=r.exec(f.handler)
						if(!matches)
						{
							break;
						}
						if(matches[1])
						{
							links.push(matches[1])
						}
					}
				})
			}
		})
		let true_i=-1;
		for(let i=0;i<links.length;i++)
		{
			if(links[i].indexOf("google.com/search")==-1&&links[i].indexOf("/404")==-1&&!/^https?:\/\/.+\/[0-9a-f]{40,}$/i.exec(links[i]))
			{
				true_i=true_i==-1?i:-2
			}
		}
		if(true_i>-1)
		{
			safelyNavigate(links[true_i])
		}
	},0))
	domainBypass(/uiz\.(io|app)|moon7\.xyz/,()=>crowdBypass(()=>{
		awaitElement("#go-adsredirect",f=>{
			f.action+="#bypassClipboard="+location.pathname.substr(1)
		})
	}))
	hrefBypass(/new\.lewd\.ninja\/external\/game\/([0-9]+)\/([a-z0-9]{64})/,m=>{
		let f=document.createElement("form")
		f.method="POST"
		f.action="https://xxx.lewd.ninja/game/"+m[1]+"/out/"+m[2]
		f=document.body.appendChild(f)
		countIt(()=>f.submit())
	})
	domainBypass("xxx.lewd.ninja",()=>safelyNavigate(document.body.textContent))
	domainBypass(/tr\.link|movienear\.me|lewat\.club|tautan\.pro|(droidtamvan|gubukbisnis|onlinecorp)\.me|(liveshootv|modebaca|haipedia|sekilastekno|miuiku)\.com|shrink\.world|link\.mymastah\.xyz|(sportif|cararoot)\.id|(fcdot|fcc)\.lc/,()=>{
		if(typeof app_vars=="undefined")
		{
			app_vars={}
		}
		keepLooking()
	})
	domainBypass("fc-lc.com",()=>crowdBypass())
	domainBypass("lompat.in",()=>{
		window.open=u=>{
			if(u.substr(0,28)=="http://henpoi.lompat.in/?go="&&u.substr(-4)=="&s=1")
			{
				safelyNavigate(atob(u.substr(28,u.length-32)))
			}
		}
		awaitElement("a[onclick='changeLink()']",changeLink)
	})
	domainBypass("st.flashsubs.web.id",()=>safelyNavigate(document.querySelector("a#proceed").href))
	domainBypass("short-url.link",()=>safelyNavigate(document.querySelector("div[align=center] > strong").textContent))
	domainBypass(/uploadrar\.(com|net)/,()=>{
		ifElement("#downloadbtn",()=>{
			let f=document.createElement("form")
			f.method="POST"
			f.innerHTML='<input name="op" value="download2"><input name="id" value="'+location.pathname.substr(1)+'">'
			document.body.appendChild(f)
			countIt(()=>f.submit())
		})
	})
	domainBypass(/(prox77|agdd5br)\.com/,()=>document.querySelector("#Sbutton").click())
	domainBypass("kuliahmatematika.my.id",()=>safelyNavigate(atob(document.querySelector("input[name='data']").value)))
	domainBypass("shortconnect.com",()=>safelyNavigate(document.querySelector("#loader-link").href))
	domainBypass("elil.cc",()=>{
		crowdBypass()
		awaitElement(".navbar-custom > .container > ul.not-nav > li:not(.d-none) > a.page-scroll[href]:not([href^='javascript:'])",a=>contributeAndNavigate(a.href))
	})
	domainBypass("transmediakreatif.com",()=>ifElement("#download > a[href]",safelyAssign))
	domainBypass(/go\.indonesia-publisher\.id|ciustekno\.me/,()=>{
		if(typeof disqus_config=="function"&&document.querySelector("form#link-view"))
		{
			let o={page:{}}
			disqus_config.call(o)
			safelyNavigate(o.page.url)
		}
	})
	hrefBypass(/mirrorace\.(com|org)\/m\/[a-zA-Z0-9]+\/[0-9]+/,()=>safelyAssign(document.querySelector("a[href*='"+location.search+"']:not([hidden]):not(.uk-hidden)").href))
	domainBypass(/mirrorace\.(com|org)/,()=>{
		ifElement(".uk-modal-close",b=>{
			if(b.textContent=="I have a VPN already")
			{
				b.click()
			}
		})
	})
	domainBypass("pucuktranslation.pw",()=>ifElement("#main > section > center:nth-child(2) > a:nth-child(2)",a=>a.click()))
	domainBypass("gsu.st",()=>ifElement("#Subform input[type='submit'][name='btn'].btn",b=>b.click()))
	domainBypass("mangalist.org",()=>{
		awaitElement("#btt > button.btn.btn-primary.text-center[onclick^='window.location.assign(']",b=>{
			let o=b.getAttribute("onclick")
			safelyNavigate(o.substr(24,o.length-3))
		})
	})
	domainBypass(/(terbit|movies)21\.[a-z]+/,()=>ifElement("a#downloadbutton[href]",a=>countIt(()=>safelyAssign(a.href))))
	domainBypass("onepieceex.net",()=>ifElement("noscript",n=>safelyNavigate(n.textContent)))
	domainBypass("felanovia.com",()=>ifElement("form",f=>countIt(()=>f.submit())))
	domainBypass("redir.animenine.net",()=>ifElement("a#lanjutkeun[href]",safelyNavigate))
	hrefBypass(/download\.id\/thank-you\//,()=>{
		if(typeof download=="function")
		{
			let div=document.createElement("div")
			div.id="link"
			div=document.body.appendChild(div)
			download()
			safelyNavigate(div.querySelector("a").href)
		}
	})
	hrefBypass(/(squidssh|goodssh)\.com\/li\/go\.php/,()=>{
		const p=atob((new URLSearchParams(location.search)).get("short"))
		crowdPath(p)
		crowdBypass(()=>ifElement("form[action='/user/links']",f=>f.action+="#"+p))
	})
	domainBypass(/l\.ndoqp\.com|elnurtech\.com|jo2win\.com/,()=>ifElement("input#real_url",i=>safelyNavigate(i.value)))
	domainBypass("lin-ks.net",()=>{
		if(typeof secondpage=="function")
		{
			secondpage()
		}
		awaitElement("a#skip_button[href]",safelyNavigate)
	})
	hrefBypass(/stayonline\.pro\/l\/(.*)\//,m=>$.post(endpoint,{id:m[1],ref:""},r=>safelyNavigate(r.data.value)))
	domainBypass("xlink.cc",()=>safelyNavigate(JSON.parse(atob(window.bootstrapData)).linkResponse.link.long_url))
	domainBypass("1shortlink.com",()=>awaitElement("#redirect-link[data-href]",a=>safelyNavigate(a.getAttribute("data-href"))))
	domainBypass(/multiup\.(org|eu)/,()=>ifElement("form[target][onsubmit] button[type='submit']",b=>{
		if(!document.querySelector(".g-recaptcha"))
		{
			const f=document.querySelector("form[target][onsubmit]")
			f.target="_self"
			f.onsubmit=""
			b.click()
		}
	},()=>document.querySelectorAll("form > button[namehost]").forEach(e=>{
		let a=document.createElement("a")
		a.href=e.getAttribute("link")
		a.setAttribute("class",e.getAttribute("class"))
		a.textContent=e.textContent
		a.innerHTML='<i class="fa fa-fw fa-download"></i>'+a.innerHTML
		e.closest("footer").replaceChild(a,e.parentNode)
	})))
	domainBypass("mispuani.xyz",()=>{
		let u=decodeURIComponent(location.href.substr(location.href.indexOf("?u=")+3)),
		o=JSON.parse(CryptoJS.AES.decrypt(u,"MispuaniDewaGanteng").toString(CryptoJS.enc.Utf8))
		safelyNavigate(o.url)
	})
	domainBypass("dl.blackmod.net",()=>ifElement("a.button.fa-download[href]",safelyNavigate))
	domainBypass(/(bladesalvador|invistaiptv)\.com/,()=>ifElement(".icon > img[src^='https://api.miniature.io/?']",i=>{
		let url=new URL(i.src)
		if(url.search.indexOf("url="))
		{
			safelyNavigate(decodeURIComponent(url.search.split("url=")[1].split("&")[0]))
		}
	}))
	domainBypass(/bebasdownloadfilm\.com|dl\.(sharemydrive\.xyz|indexmovie\.biz)/,()=>ifElement("frame[src*='/iframe/top.php?']",f=>{
		f.onload=()=>safelyNavigate(f.contentDocument.querySelector("p#skip a").href)
	}))
	domainBypass(/^((www\.)?(midvip\.xyz|midia\.vip))$/,()=>ifElement("button#makingdifferenttimer",b=>b.onclick()))
	domainBypass("midiavip.com",()=>ifElement("button#blocklinkbtn",b=>safelyNavigate(b.dataset.blurl)))
	domainBypass("1ink.cc",()=>ifElement("a#countingbtn[href]",safelyNavigate))
	domainBypass("cuturl.cc",()=>{
		if(typeof PushLink=="function")
		{
			countIt(()=>PushLink())
		}
	})
	domainBypass("intifada1453.team",()=>ifElement("a.short-button[href]",safelyNavigate))
	domainBypass("ahref.co",()=>ifElement(".download_button",a=>safelyAssign(a.parentNode.href)))
	hrefBypass(/mi-globe\.com\/download\//,()=>safelyAssign(dllink))
	domainBypass("cpmlink.net",()=>ifElement("a#btn-main",a=>{
		crowdPath(location.pathname.substr(4))
		contributeAndNavigate(a.href)
	},()=>crowdBypass()))
	domainBypass("subsvip.com",()=>{
		if(typeof link=="function")
		{
			countIt(()=>link())
		}
	})
	domainBypass(/(shon|likn)\.xyz|sloomp\.space/,()=>ifElement("form[action*='/redirect/sgo/']",f=>{
		if(location.pathname.substr(0,4)=="/go/")
		{
			crowdPath(location.pathname.substr(4))
		}
		let s=()=>fetch(f.action,{
			method:"POST",
			headers:{"Content-Type":"application/x-www-form-urlencoded"},
			body:new URLSearchParams(new FormData(f)).toString()
		}).then(r=>contributeAndNavigate(r.headers.get("refresh").split("url=")[1]))
		if(f.querySelector("input[name='g-recaptcha-response']"))
		{
			awaitElement("form[action*='/redirect/sgo/'] > input[name='g-recaptcha-response'][value]",s)
		}
		else
		{
			s()
		}
	},()=>crowdBypass()))
	domainBypass("brpaper.com",()=>safelyNavigate(location.href.replace("downloads","downloader")))
	domainBypass("boo.tw",()=>ifElement("div#shorturl-go",d=>{
		let pp=document.querySelector("#pp").getAttribute("value"),
		kd=document.querySelector("#kd").getAttribute("value"),
		x=d.getAttribute("x"),
		k=(kd-1)/10,
		p=(pp-5)/12,
		kp=k+p
		x=x.substring(4,x.length-kp)
		safelyAssign(isSSL?"https://"+x:"http://"+x)
	}))
	domainBypass(/(kora4top)\.com/,()=>ifElement("div#m1x2 a",safelyNavigate))
	domainBypass(/(forexlap|forex-articles|forexmab)\.com/, () => {
		ensureDomLoaded(() => {
		ifElement("center.oto>a", a => {
			a.click() })
		})
	})
	domainBypass("fx4vip.com", () => {
		ensureDomLoaded(() => {
		ifElement("#button1", a => {
			a.removeAttribute("disabled");
			a.click();
		})
		})
	})
	domainBypass("soft8ware.com",()=>{
		if(typeof count=="number"&&typeof countdown=="function")
		{
			count=1
			countIt()
		}
	})
	hrefBypass(/flarefiles\.com\/drive\/[A-Za-z0-9]+\/genLink\.php/,()=>location.href="serveRequest.php")
	domainBypass("mboost.me",()=>ifElement("#__NEXT_DATA__",s=>safelyNavigate(JSON.parse(s.textContent).props.initialProps.pageProps.data.targeturl)))
	domainBypass("go.geghost.com",()=>ifElement("img[alt='Preview website'][src^='http://www.apercite.fr/api/apercite/320x200/oui/'",i=>safelyNavigate(i.src.substr(48))))
	domainBypass("shorte-st.online",()=>ifElement("#cpt-form",f=>{
		f.target="_self"
		f.submit()
	},()=>ifElement(".the-form",f=>{
		f.target="_self"
		countIt(()=>f.submit())
	})))
	domainBypass("apunkasoftware.net",()=>ifElement("a#dlink[href]",safelyNavigate,()=>ifElement("form#gip_form[action='https://www.apunkasoftware.net/download-process.php']",f=>f.submit())))
	domainBypass("disingkat.in",()=>ifElement("a.redirect[href]",safelyNavigate,()=>{
		if(typeof ab=="number"&&typeof asdf=="function")
		{
			window.open=safelyNavigate
			ab=5
			asdf()
		}
	}))
	domainBypass("dl.filedownload.club",()=>{
		if(typeof fileDownloadLoca=="string"&&fileDownloadLoca!="#")
		{
			safelyAssign(fileDownloadLoca)
		}
	})
	domainBypass("shirosafe.web.id",()=>ifElement("#cus>a[href]",safelyNavigate))
	domainBypass(/(techoow|histotechs)\.com/,()=>{
		window.setTimeout=f=>setTimeout(f,1)
		window.setInterval=f=>setInterval(f,1)
		ifElement("a.btn-success[href]",safelyAssign,()=>ifElement("#count00",a=>{
			a.removeAttribute("disabled")
			if(typeof xlinkd=="string")
			{
				safelyAssign(xlinkd)
			}
			else
			{
				a.click()
			}
		},()=>ifElement("#step1-cap",a=>{
			a.removeAttribute("disabled")
			a.click()
		})))
	})
	domainBypass("filesupload.org",()=>ifElement("a[href='?unlock']",safelyAssign,()=>ifElement(".download-timer",()=>awaitElement(".download-timer>form>input[name='link']",i=>safelyAssign(i.value)))))
	domainBypass("nexusmods.com",()=>{
		if(location.search.includes('file_id')) {
			window.setTimeout=f=>setTimeout(f,1)
			ifElement("#slowDownloadButton",a=>countIt(()=>a.click()))
		}
	})
	domainBypass("myotto.online",()=>ifElement("button#makingdifferenttimer > a[href]",safelyAssign))
	domainBypass("disiniaja.site",()=>ifElement("button > a.button[href]",safelyAssign))
	domainBypass("gsmusbdrivers.com",()=>{
		if(typeof wt=="number")
		{
			wt=0
			countIt()
		}
	})
	domainBypass("filehorse.com",()=>ifElement("a#download_url[href]",a=>{
		if(typeof timerx=="number")
		{
			clearTimeout(timerx)
		}
		safelyAssign(a.href)
	}))
	domainBypass("cshort.org",()=>{
		crowdBypass()
		if(typeof redirect=="function"&&typeof isChrome=="boolean")
		{
			isChrome=false
			window.open=safelyNavigate
			setTimeout(redirect,10000)
		}
	})
	domainBypass("otewe.net",()=>ifElement("#form-human",f=>f.submit(),()=>{
		if(typeof createurl=="function")
		{
			countIt(()=>createurl())
		}
	}))
	domainBypass("vexfile.com",()=>{
		if(typeof levelF=="function")
		{
			countIt(()=>levelF())
		}
	})
	domainBypass("catcut.net",()=>safelyNavigate(atob((new URL(go_url)).searchParams.get("a"))))
	domainBypass("imgdrive.net",()=>ifElement("#redirect-wait",()=>{
		$.post(location.href,{
			cti:1,
			ref:"-",
			rc:0,
			rp:0,
			bt:0,
			bw:"gecko",
			ic:0
		},()=>{
			countIt(()=>location.reload())
		},"text")
	}))
	domainBypass("theartistunion.com",()=>awaitElement(".modal--download",()=>{
		let xhr=new XMLHttpRequest()
		xhr.onload=()=>safelyNavigate(JSON.parse(xhr.responseText).audio_source)
		xhr.open("GET","/api/v3"+location.pathname+".json",true)
		countIt()
		xhr.send()
	}))
	domainBypass("boomx5.com",()=>ifElement("#form",f=>{
		f.action=location.href
		f.innerHTML='<input type="hidden" name="s_s" value="2">'
		countIt(()=>f.submit())
	}))
	domainBypass("cloudgallery.net",()=>ifElement("#soDaBug",i=>{
		if(typeof wuLu=="function")
		{
			wuLu()
			safelyNavigate(i.src)
		}
	}))
	domainBypass("tricxbd.com",()=>ifElement("a#get_btn[href]",safelyAssign))
	domainBypass(/customercareal\.com|(eduinstruct|medific|newswala)\.net/,()=>{
		if(document.querySelector('.navbar-brand').innerText=="Do2Unlock")
		{
			const searchParams=new URLSearchParams(location.search)
			if(searchParams.get("page")==1)
			{
				location.href=location.href.replace("page=1", "page=3")
			}
			safelyNavigate(document.querySelectorAll('[type="text/javascript"]')[6].innerText.split('f\", \"')[1].split("\")")[0])
		}
	})
	domainBypass("iloadit11.info",()=>ifElement("button#timerbtn",()=>{
		let f=document.createElement("form")
		f.method="POST"
		f.innerHTML='<input type="hidden" name="r_clicked" value="1">'
		document.body.appendChild(f)
		countIt(()=>f.submit())
	}))
	domainBypass("sorewa.net",()=>ifElement("p[style='text-align: center;'] > strong > a[href]",safelyNavigate))
	hrefBypass(/akwam\.(net|in\/download)/,()=>ifElement(".btn-loader > a.link.btn.btn-light[href][download]",safelyNavigate))
	domainBypass(/^(lefturl|askquds|goo-2o)\.com|(palsweet|pluslive)\.live|go\.akwam\.in$/,()=>ifElement("a.download-link[href]",safelyNavigate))
	domainBypass("worldofmods.com",()=>ifElement(".repost-button-twitter",b=>{
		window.open=_=>{}
		setTimeout(()=>{
			b.click()
			awaitElement("a#download-button[href]",safelyNavigate)
		},500)
	}))
	domainBypass("linkconfig.com",()=>ifElement("a#download[href]",safelyNavigate))
	domainBypass("suanoticia.online",()=>ifElement("#meio > a[href]",safelyNavigate))
	hrefBypass(/crxne\.de\/crxneunlock\/crxne\/download\//,()=>safelyNavigate("https://crxne.de/crxneunlock/crxne/download/links/downloadlinks.html"))
	domainBypass("shre.su",()=>{
		if(location.pathname!="/redirect")
		{
			countIt(()=>safelyAssign("https://shre.su/redirect"))
		}
	})
	domainBypass("easylinkref.com",()=>ifElement(".easylinkref-go > strong",s=>safelyNavigate(s.textContent)))
	domainBypass("subdowns.com",()=>ifElement("#botao",()=>{
		window.setTimeout=f=>setTimeout(f,1)
		awaitElement("a#botao[href^='http']",safelyNavigate)
	}))
	domainBypass("katfile.com",()=>{
		if(!document.querySelector(".g-recaptcha"))
		{
			window.setTimeout=f=>setTimeout(f,1)
		}
	})
	domainBypass("jk-chat.com",()=>safelyNavigate(atob(location.hash.substr(1))))
	domainBypass("shorten.sh",()=>crowdBypass(()=>ifElement("#go-link",()=>awaitElement("#go-link.go-link",f=>$.post(f.action,$("#go-link").serialize(),d=>contributeAndNavigate(d.url))))))
	domainBypass("urapk.com",()=>ifElement("#ed_dl_link > a[href]",safelyNavigate))
	domainBypass("expertvn.com",()=>{
		crowdPath(location.hash.substr(1))
		crowdBypass(()=>ifElement("form.captcha[action='?']",f=>{
			f.action+=location.hash
		},()=>awaitElement("button#link:not([disabled])",b=>contributeAndNavigate(b.parentNode.href))))
	})
	domainBypass("mediafile.cloud",()=>{
		if(location.search.substr(0,4)=="?pt=")
		{
			awaitElement("a[href*='?download_token=']",a=>crowdContribute(a.href))
		}
		else
		{
			crowdBypass()
		}
	})
	domainBypass("mlwbd.pw",()=>{
		document.querySelectorAll("tr[id^='mov']").forEach(t=>{
			t.querySelector("a[href^='javascript']").onclick=countIt
			t.querySelector("a[href^='javascript']").href=t.querySelector("input[name='FU']").value
		})
	})
	domainBypass("uploadking.net",()=>ifElement("form[name='F1']",f=>countIt(()=>f.submit())))
	domainBypass("5play.ru",()=>ifElement("div.download-result > a[href]",safelyNavigate))
	domainBypass("daunshorte.kertashitam.com",()=>ifElement("div[align=center] > center > a[href]",safelyAssign))
	hrefBypass(/www1\.swatchseries\.to\/freecale\.html\?r\=/,()=>awaitElement("a.push_button.blue[href]:not([href='http://www1.swatchseries.to/'])",safelyNavigate))
	domainBypass("tl.gd",()=>safelyAssign("http://www.twitlonger.com/show"+location.pathname))
	domainBypass("apkmodo.com",()=>{
		ifElement(".show_download_links a[href]",safelyNavigate,()=>{
			if(location.search.substr(0,6)=="?xurl=")
			{
				safelyNavigate("http"+decodeURIComponent(location.search.substr(6)))
			}
		})
	})
	domainBypass("multifilemirror.com",()=>{
		if(location.search!="?action=Download")
		{
			location.search="?action=Download"
		}
	})
	domainBypass("welcome.indihome.co.id",()=>ifElement(`.button-lanjut:not([onclick='stop_timer();'])`,a=>a.click()))
	domainBypass("techrfour.com",()=>ifElement("input[name='newwpsafelink']",i=>{
		const{parse}=JSON,{searchParams}=new URL(parse(atob(i.value)).linkr)
		if(searchParams.has("safelink_redirect"))
		{
			const{safelink,second_safelink_url}=parse(atob(searchParams.get("safelink_redirect")))
			referer=second_safelink_url
			safelyNavigate(safelink)
		}
	}))
	domainBypass("gaminplay.com",()=>{
		const regex=/var YuideaLink = '(.+)';/
		document.querySelectorAll("script").forEach(script=>{
			let matches=regex.exec(script.textContent)
			if(matches&&matches[1])
			{
				safelyNavigate(matches[1])
			}
		})
	})
	domainBypass("dl.helow.id",()=>ifElement("button#btn6",b=>b.onclick()))
	domainBypass("dl.ocanoke.com",()=>{
		crowdPath(location.pathname.split("/").pop())
		crowdBypass(()=>ifElement("#link-view",f=>f.submit(),()=>awaitElement("a.get-link[href]:not(.disabled)",a=>contributeAndNavigate(a.href))))
	})
	domainBypass("tudofinanceiro.club",()=>{
		awaitElement("a#linkarq[href]",safelyAssign)
		awaitElement("a#botao2[href]",safelyAssign)
	})
	domainBypass("apkhubs.com",()=>ifElement("a#downloadbtn",a=>{
		countdown(0)
		safelyNavigate(a.href)
	}))
	domainBypass("favpng.com",()=>ifElement("div#countdown",()=>safelyNavigate("https://files.favpng.com/api_download.php?k="+location.pathname.substr(14))))
	domainBypass("sh.st",()=>ifElement("[data-translate='block_headline']",()=>location.hostname="ceesty.com"))
	domainBypass("apkpsp.xyz",()=>ifElement("span#dwto",s=>{
		window.setInterval=f=>setInterval(f,1)
		s.click()
		awaitElement("span#goto > a[href]",safelyNavigate)
	}))
	domainBypass("maukredit.online",()=>document.getElementById("wpsafe-link").children[0].click())
	domainBypass(/ay\.link|(shtms|aylink)\.co/,()=>{
		var form = $('#go-link')
		$.ajax({
			type: 'POST',
			async: true,
			url: form.attr('action'),
			data: form.serialize() + '&token=' + app['token'],
			dataType: 'json',
			success: function(data) {
				safelyNavigate(data.url);
			}
		});
	})
	domainBypass("forex1pro.com",()=>safelyAssign("https://fx4vip.com"+location.pathname))
	domainBypass("sub4unlock.com",()=>{
		if(typeof fun2=="function")
		{
			window.open=safelyNavigate
			fun2()
		}
	})
	domainBypass("oracle.com",()=>document.querySelectorAll("[data-file]").forEach(e=>{
		//https://gist.github.com/wavezhang/ba8425f24a968ec9b2a8619d7c2d86a6#gistcomment-3377085
		let link=e.getAttribute("data-file"),
		jre8=RegExp("download.oracle.com/otn/java/jdk/8u([0-9]*)-b([0-9]*)/([a-z0-9]{32})/(.*)$","g").exec(link)
		if(jre8&&jre8[3])
		{
			os_type=RegExp("8u[0-9]*-([^-]*)-").exec(jre8[4])[1]
			os_type=(os_type == "macosx")?"unix":os_type
			e.onclick=()=>safelyNavigate("https://javadl.oracle.com/webapps/download/GetFile/1.8.0_"+jre8[1]+"-b"+jre8[2]+"/"+jre8[3]+"/"+os_type+"-i586/"+jre8[4])
		}
	}))
	domainBypass("genlink.cc",()=>{
		$(".check-ad").append("<input name='step' value=2 type='hidden'>")
		let b=$(".real-link")
		if(b.attr("href"))
		{
			safelyNavigate(b.attr("href"))
		}
		else
		{
			b.click()
		}
	})
	hrefBypass(/((psarips\.(com|net|org|eu|in|one|xyz|uk))|(psa\.(one|pm)))\/exit\//,()=>ifElement("form[name='redirect']",f=>{
		window.stop()
		safelyAssign(f.action+"#bypassClipboard=psarips:"+location.pathname.substr(6))
	}))
	domainBypass("rekonise.com",()=>{
		let xhr=new XMLHttpRequest()
		xhr.onload=()=>safelyNavigate(JSON.parse(xhr.responseText).url)
		xhr.open("GET","https://api.rekonise.com/unlocks"+location.pathname,true)
		xhr.send()
	})
	domainBypass("jwfinancas.club",()=>ifElement("a.btn-primary[href]",safelyAssign))
	domainBypass("saver.id",()=>ifElement("input[name='ouyeah']",i=>safelyAssign(i.value)))
	domainBypass("androiddownload.net",()=>{
		awaitElement(".btn-dl-first:not(.disabled)",safelyNavigate)
		awaitElement(".download-timer > a[href]",safelyNavigate)
		insertInfoBox("{{msg.infoFileHoster}}")
	})
	domainBypass("links.shortenbuddy.com",()=>safelyAssign(location.href.replace("links.","")))
	domainBypass("anon.to",()=>ifElement("#redirect_button",safelyNavigate))
	domainBypass("dl-protect1.co",()=>ifElement("#form_link",f=>f.submit(),()=>ifElement(".lienet > a[href]",safelyNavigate)))
	domainBypass("linkdoni.soft98.ir",()=>ifElement(".actions a[href].button.primary",safelyNavigate))
	domainBypass("stfly.me",()=>keepLooking(()=>ifElement("form#submit_data",f=>f.submit(),()=>ifElement("form#myform",f=>{
		referer=f.action
		unsafelyNavigate(location.href)
	}))))
	domainBypass("nbyts.online",()=>ifElement("form#form button[type='submit']",s=>{
		s.removeAttribute("disabled")
		s.click()
	},()=>ifElement("a[href].btn-success",safelyAssign)))
	domainBypass("tecknity.com",()=>{if(typeof counter!="undefined")counter=0})
	domainBypass("url.rizaldi.web.id",()=>ifElement("a#download_link[href]",a=>safelyNavigate(a.href)))
	domainBypass("1bit.space",()=>{
		if(typeof hcaptcha=="object"&&typeof apiCounter=="object")
		{
			window.app_country_visitor=""
			hcaptcha.getResponse=()=>{}
			apiCounter.generateURL()
			apiCounter.redirectTo(document.querySelector("button.button-element-verification"))
		}
	})
	domainBypass("1bitspace.com",()=>{
		if(typeof tokenURL=="string")
		{
			safelyNavigate(atob(tokenURL))
		}
	})
	domainBypass("gethatch.com",()=>ifElement("body > script:nth-child(4)",a=>safelyNavigate(a.innerHTML.split('NoSession: "')[1].split('"')[0])))
	domainBypass("gcloud.live",()=>{
		if(typeof buildDownload=="function"&&location.pathname.substr(0,3)=="/f/")
		{
			fetch("https://gcloud.live/api/source/"+location.pathname.substr(3),{
				"referrer":location.href,
				"method":"POST"
			}).then(res=>res.json()).then(json=>{
				data=json.data
				buildDownload()
			})
		}
	})
	domainBypass("pnd.money",()=>keepLooking(()=>ifElement("form#pnd_redirect_form, form#link-view",f=>f.submit())))
	domainBypass("5mod-file.ru",()=>ifElement("#form",f=>f.submit()))
	domainBypass("kazanclilink.com",()=>ifElement("a#baglantigit",a=>safelyNavigate(a.href)))
	domainBypass("moddingunited.xyz",()=>{if(typeof reverseString=="function")safelyNavigate(reverseString(window.location.search.substring(1)))})
	domainBypass("majorgeeks.com",()=>{
		let it=document.createNodeIterator(document.documentElement,NodeFilter.SHOW_COMMENT,()=>NodeFilter.FILTER_ACCEPT,false);
		let node;
		while(node=it.nextNode())
		{
			if(node.textContent.substr(0, 8)==" Debug: ")
			{
				safelyNavigate(node.textContent.substr(8))
			}
		}
	})
	domainBypass("droidfilehost.com",()=>{if(typeof wt!=="undefined")wt=1})
	domainBypass("kooi.xyz",()=>ifElement("a#link_download",safelyNavigate))
	domainBypass("usdb.animux.de",()=>ifElement("form#timeform",f=>f.submit()))
	domainBypass("www.thegamesdownload.net",()=>awaitElement("#gid",btn=>safelyAssign(btn.value)))
	domainBypass("thefileslocker.com",()=>{
		awaitElement("#method_free",btn=>btn.click())
		awaitElement("[name=F1]",frm=>frm.submit())
	})
	domainBypass("techgeek.digital",()=>{
		ifElement("form",form=>form.submit())
		ifElement("#surl1",a=>a.click())
	})
	domainBypass("adshort.live",()=>{
		let f=$("form#go-link")
		$.ajax({
			dataType:"json",
			type:"POST",
			url:f.attr('action'),
			data:f.serialize(),
			success:res=>safelyNavigate(res.url)
		})
	})
	domainBypass(/educationmedianews\.com|rexoxer\.net/,()=>{
		setTimeout(()=>{
			document.querySelectorAll("script").forEach(script=>{
				result=script.innerHTML.match(/var redirectLink = '(.*)/)
				if(result&&result.length!==0)
				{
					eval(result[0])
					safelyAssign(redirectLink+(ignoreCrowdBypass?"#ignoreCrowdBypass":""))
				}
			})
		},500)
	})
	domainBypass("gplinks.co",()=>{
		crowdPath(location.pathname.split("/").join(""))
		crowdBypass(()=>{
			setTimeout(()=>{
				ifElement("form",form=>{
					$.ajax({
						dataType:"json",
						url:form.action,
						type:"POST",
						data:$(form).serialize(),
						success:res=>contributeAndNavigate(res.url)
					})
				})
			},10000)
		},true)
	})
	domainBypass("adbull.me",()=>ifElement("form#setc",({action})=>{
		unsafelyAssignWithReferer(location.href,action)
	}))
	domainBypass("tinyurl.is", () => ifElement('a[id^="newskip-btn"][href]', safelyAssign))
	domainBypass("journaldupirate.net",()=>{
		ifElement("div.alert a",safelyNavigate,()=>{
			$(".button-blue").first().click()
		})
	})
	domainBypass("textovisia.com", ()=>{
		if(typeof globalThis.startCounter === 'function'){
			const startCounterOrig = startCounter;
			startCounter = ()=>{
				const setIntervalOrig = globalThis.setInterval;
				globalThis.setInterval = fn => setIntervalOrig(fn, 1);
				startCounterOrig();
				globalThis.setInterval = setIntervalOrig;
			};
		}
		if(typeof globalThis.partner_links === 'string'){
			partner_links = [...document.querySelectorAll('.partner_link')]
				.map(x => `&partner_link_${x.dataset.lid}=${x.dataset.key}`)
				.join('');

			const recaptchaCallbackOrig = recaptchaCallback;
			globalThis.recaptchaCallback = response => {
				recaptchaCallbackOrig(response);
				startCounter();
			}
		}
	})
	domainBypass(/acortame\.xyz|shortclicks\.xyz/, () => {
		safelyNavigate(location.origin + "?redir=" + atob(atob(atob(atob(Lnk)))))
	})
	domainBypass("work.ink", () => {
		ifElement("#redirect-button", () => openFinalLink())
	})

	domainBypass("sub2unlock.com", () => {
	    const url = document.URL;
	    if (url.includes("sub2unlock.com/link/unlock")) {
		console.log('URL is unlocked, skipping...')
		return;
	    } else {
		console.log('URL is not unlocked, continuing...')
		const urlSplit = url.split("/");
		const urlLast = urlSplit[urlSplit.length - 1];
		const newurl = 'https://sub2unlock.com/link/unlock/' + urlLast;
		window.location.href = newurl;
	    }
	})

	//Insertion point for domain-or-href-specific bypasses running after the DOM is loaded. Bypasses here will no longer need to call ensureDomLoaded.
	domainBypass("maxurlz.com", () => {
		const regex = /(?<="href=')(.*)(?='>Click here)/
		for (const script of document.getElementsByTagName("script")) {
			const source = script.innerHTML
			if (source.includes("#timer")) {
				safelyNavigate(regex.exec(source)[0])
				break
			}
		}
	})
	domainBypass("megadb.net", () => {
    ifElement("form[name='F1']", function(a) {
        a.submit();
		});
	});
	hrefBypass(/enxf\.net\/resources\/[a-zA-Z-\.\d]+\/download/, () => {
		ifElement(".XGT-Download-form", ex => safelyNavigate(ex.action));
	})
	hrefBypass(/https:\/\/fmoviesdl.com\/links\//, () => {
		ifElement("#link", a => {
		    safelyNavigate(a.href)
		})
	})
	domainBypass("duit.cc", () => {
	    ifElement("#download", download => {
		download.firstChild.submit.click()
	    })
	    ifElement(".btn-fast-download", button => {
		button.click()
	    })
	    if (location.pathname == "/getlink.php") setTimeout(()=>location.reload(), 1000)
	})
	domainBypass("animestc.xyz", () => {
		ifElement("#link-id", a => {
		    fetch("https://protetor.animestc.xyz/api/link/" + a.getAttribute("value")).then(r=>r.json()).then(json=>{
			safelyNavigate(json.link)
		    })
		})
	})
	domainBypass("egao.in", () => {
      ifElement("#SafelinkChecker", button => {
          fetch("https://egao.in/safelink", {
              "headers": {
                  "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
              },
              "body": "id=" + button.dataset.id,
              "method": "POST"
          }).then(r => r.json()).then(j => safelyNavigate(j.data.url))
      })
  })

  domainBypass("benameiran.com", () => {
      ifElement(".su-button", () => {
          [...document.querySelectorAll(".su-button")].forEach(downloadLink => {
              downloadLink.href = downloadLink.id;
              downloadLink.removeAttribute("onclick");
          })
      })
  })
	domainBypass("hairstyless.my.id", () => {
	    ifElement("input[name=newwpsafelink]", input => {
		safelyNavigate(decodeURIComponent(JSON.parse(atob(new URLSearchParams(JSON.parse(atob(input.value)).linkr.substr(25)).get("safelink_redirect"))).safelink)) // lmaoooo
	    })
	})
	// Apparently broken, see PR #18 on UB
	//domainBypass("duit.cc", () => {
	//    ifElement("[name=short]", a => {
	//	safelyNavigate(a.value)
	//    })
	//})


	domainBypass("theepochtimes.com", () => {
	    awaitElement("#landing-page", subscriptionWall => {
			subscriptionWall.remove()
			document.querySelector("#main").style = "";
	    })
	})
	domainBypass("apkdone.com", () => {
	    ifElement("#download", a=>{
			ensureDomLoaded(()=>{
	            countdown(0)
	            safelyNavigate(document.querySelector("#download > a:nth-child(1)").href)
	        })
	    })
	})
	if(bypassed)
	{
		return
	}
	//Adf.ly "Locked" Page
	if(location.pathname=="/ad/locked"&&document.getElementById("countdown")&&document.querySelector("a").textContent=="Click here to continue")
	{
		let wT=setInterval(()=>{
			if(document.getElementById("countdown").textContent=="0")
			{
				clearInterval(wT)
				document.querySelector("a").click()
			}
		},100)
	}
	//Adf.ly Enable Notifications Page
	if(document.getElementById("adfly_bar")!==null&&typeof urlb=="string")
	{
		safelyNavigate(urlb)
	}
	//Adf.ly Pre-Redirect Page
	if(location.pathname.substr(0,13)=="/redirecting/"&&document.querySelector("p[style]").textContent=="For your safety, never enter your password unless you're on the real Adf.ly site.")
	{
		let a=document.querySelector("a[href]")
		if(a)
		{
			safelyNavigate(a.href)
			return finish()
		}
	}
	//Soralink Wordpress Plugin
	const soralink_data={
		"wizardsubs.com":"408631a1f0",
		"www.zonangopi.com":"407ea19f7e",
		"www.conan.id":"e7fc10d9e3",
		"pusatfilm21.biz":"bd943a6562",
		"myonime.com":"3766dd8efb",
		"animersindo.net":"3766dd8efb",
		"animebukatsu.net":"3766dd8efb",
		"kordramas.co":"13a9748daa",
		"koreaku.co":"91f79a3538"
	}
	for(let domain in soralink_data)
	{
		domainBypass(domain,()=>document.querySelectorAll("a[href^='"+location.origin+"?"+soralink_data[domain]+"=']").forEach(a=>{
			a.href+="#bypassClipboard="+a.href.split("?"+soralink_data[domain]+"=")[1]
		}))
	}
	domainBypass("www.tech2learners.com", () => safelyNavigate(downloadButton.href))
	domainBypass("channelmyanmar.org",()=>document.querySelectorAll("a[href^='https://channelmyanmar.org?1c17f28bf0=']").forEach(a=>{
		if(a.classList.contains("FLMBTN-Btn"))
		{
			let qe=a.previousElementSibling
			while(qe&&qe.tagName!="H2")
			{
				qe=qe.previousElementSibling
			}
			a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"")+qe.textContent.split(" ").join("").split("(").join("-").split(")").join("-").toLowerCase()+a.textContent.split(" ").join("").split("(").join("").split(")").join("").toLowerCase()
		}
		else
		{
			a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"")+a.parentNode.firstChild.textContent.toLowerCase().split(" ").join("").split("–").join("")+a.textContent.trim().toLowerCase()
		}
	}))
	domainBypass("ad4msan.com",()=>document.querySelectorAll("a[href^='https://ad4msan.com?9c2a6bf968=']").forEach(a=>{
		if(a.firstChild.tagName=="IMG")
		{
			a.href+="#bypassClipboard="+a.parentNode.textContent.split("|")[0].replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.firstChild.src.split("https://ad4msan.com/")[1].split(".")[0].toLowerCase()
		}
		else
		{
			a.href+="#bypassClipboard="+a.parentNode.textContent.split("|")[0].replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.textContent.split(" ").join("").toLowerCase()
		}
	}))
	domainBypass("oppa.kdramaindo.tv",()=>document.querySelectorAll("a[href^='https://oppa.kdramaindo.tv?38971fecb6=']").forEach(a=>{
		a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"")+a.parentNode.firstChild.textContent.toLowerCase().replace(/[^a-zA-Z0-9]/g,"")+a.textContent.trim().toLowerCase()
	}))
	domainBypass("mkvking.com",()=>document.querySelectorAll("a[href^='https://mkvking.com?c17421bdaf=']").forEach(a=>{
		a.href+="#bypassClipboard="+a.getAttribute("title").split("Download ").join("").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
	}))
	domainBypass("oploverz.in",()=>document.querySelectorAll("a[href*='?id=']").forEach(a=>{
		let ld=a.closest(".list-download")
		if(ld)
		{
			let qe=ld.previousElementSibling
			while(qe&&!qe.classList.contains("title-download"))
			{
				qe=qe.previousElementSibling
			}
			a.href+="#bypassClipboard="+qe.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		}
	}))
	domainBypass("neonime.moe",()=>document.querySelectorAll("a[href^='https://neonime.moe?700ef7c050=']").forEach(a=>{
		a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.parentNode.firstChild.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
	}))
	domainBypass("mmsubs.com",()=>document.querySelectorAll("a[href^='https://mmsubs.com?e75fad73d9=']").forEach(a=>{
		let qe=a.parentNode.previousElementSibling
		while(qe&&!qe.classList.contains("sorattl"))
		{
			qe=qe.previousElementSibling
		}
		if(qe!==null)
		{
			a.href+="#bypassClipboard="+qe.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.parentNode.previousElementSibling.textContent.toLowerCase()+a.textContent.toLowerCase()
		}
	}))
	domainBypass("bakadame.com",()=>document.querySelectorAll("a[href^='https://bakadame.com?e41b7e5034=']").forEach(a=>{
		let qe=a.previousElementSibling
		while(qe&&qe.tagName!="STRONG")
		{
			qe=qe.previousElementSibling
		}
		if(qe!==null)
		{
			a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.closest("div").previousElementSibling.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+qe.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.textContent.toLowerCase()
		}
		else
		{
			a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.closest("ul").previousElementSibling.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.textContent.toLowerCase()
		}
	}))
	domainBypass("drivenime.com",()=>document.querySelectorAll("a[href*='?a82ad005b1=']").forEach(a=>{
		let p=a.parentNode,qe=p.previousElementSibling
		while(qe&&qe.tagName!="H2")
		{
			qe=qe.previousElementSibling
		}
		a.href+="#bypassClipboard="+p.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		if(p.parentNode.classList.contains("post-single-content"))
		{
			a.href+=qe.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		}
		else if(p.parentNode.classList.contains("su-spoiler-content"))
		{
			a.href+=p.parentNode.previousElementSibling.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		}
	}))
	domainBypass("katmoviehd.nl",()=>document.querySelectorAll("a[href^='https://katmoviehd.nl?6de4d3b1de=']").forEach(a=>{
		a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
	}))
	domainBypass("hienzo.com",()=>document.querySelectorAll("a[href^='https://www.losstor.com/?id=']").forEach(a=>{
		a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+a.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
	}))
	domainBypass("animebatch.id",()=>document.querySelectorAll("a[href^='https://tamatekno.net/?id=']").forEach(a=>{
		let ver=a.closest("ul").previousElementSibling,qe=ver,res=a.previousElementSibling
		while(qe&&qe.style.textAlign!="center")
		{
			qe=qe.previousElementSibling
		}
		while(res&&res.tagName!="STRONG")
		{
			res=res.previousElementSibling
		}
		a.href+="#bypassClipboard="+qe.textContent.replace(/[^\w]/g,"").toLowerCase()+res.textContent.replace(/[^\w]/g,"").toLowerCase()+ver.textContent.replace(/[^\w]/g,"").toLowerCase()+a.textContent.replace(/[^\w]/g,"").toLowerCase()
	}))
	domainBypass("koenime.com",()=>document.querySelectorAll("a[href^='https://apasih.pw/?id=']").forEach(a=>{
		let qe=a.closest("ul").previousElementSibling,ep=a.closest(".dlmn321").previousElementSibling
		a.href+="#bypassClipboard="+location.pathname.replace(/[^\w]/g,"")+qe.textContent.replace(/[^\w]/g,"").toLowerCase()+ep.textContent.replace(/[^\w]/g,"").toLowerCase()+a.textContent.replace(/[^\w]/g,"").toLowerCase()
	}))
	domainBypass(/(masteredutech|codecomets)\.com/,()=>safelyAssign(document.querySelector('.btn-captcha').href))
	domainBypass("bakacan.id",()=>document.querySelectorAll("a[href^='https://apasih.pw/?id=']").forEach(a=>{
		let qe=a.previousElementSibling
		while(qe&&qe.tagName!="B")
		{
			qe=qe.previousElementSibling
		}
		a.href+="#bypassClipboard="+location.pathname.replace(/[^\w]/g,"")
		if(qe!==null)
		{
			a.href+=a.closest("ul").previousElementSibling.textContent.replace(/[^\w]/g,"").toLowerCase()+qe.textContent.replace(/[^\w]/g,"").toLowerCase()
		}
		else
		{
			a.href+=a.parentNode.previousElementSibling.textContent.replace(/[^\w]/g,"").toLowerCase()
		}
		a.href+=a.textContent.replace(/[^\w]/g,"").toLowerCase()
	}))
	if(document.querySelector(".sorasubmit"))
	{
		document.querySelector(".sorasubmit").click()
		return finish()
	}
	if(document.querySelector("#goes > #lanjut > a[href]"))//#165
	{
		safelyNavigate(document.querySelector("#goes > #lanjut > a[href]").href)
		return finish()
	}
	if(document.querySelector("#lanjut > #goes[href]"))
	{
		safelyNavigate(document.querySelector("#lanjut > #goes[href]").href)
		return finish()
	}
	if(document.getElementById("waktu")&&document.getElementById("goto"))
	{
		safelyNavigate(document.getElementById("goto").href)
		return finish()
	}
	if(typeof bukalink=="function"&&document.getElementById("bijil1")&&document.getElementById("bijil2"))//gosavelink.com
	{
		window.open=safelyNavigate
		bukalink()
		return finish()
	}
	ifElement(".rurasafesubmit",b=>{
		b.click()
		finish()
	})
	if(typeof changeLink=="function")
	{
		ifElement(".rurasafectrl",()=>{
			let _open=window.open
			window.open=l=>_open(l,"_self")
			if(typeof $!="undefined")
			{
				$(document).ajaxStop(()=>document.querySelector("#showlink").click())
			}
			ifElement("a[href='#generate']",a=>{
				a.click()
			})
		},()=>{
			let cLT=setInterval(()=>{
				if((document.querySelector("img#pleasewait")&&document.querySelector(".wait"))||
					document.getElementById("download")||
					document.getElementsByTagName("style='margin-top:").length||
					document.querySelector(".Visit_Link")||//yametesenpai.xyz
					document.getElementById("daplong")||//converthinks.xyz
					document.querySelector(".eastsafelink")//anjay.info
					)
				{
					clearInterval(cLT)
					window.open=l=>safelyNavigate(l)
					changeLink()
				}
			},100)
		})
	}
	domainBypass("securitystickers.info",()=>{})//This domain is used by soliddrive.co who have backend validation before downloading the file
	if(bypassed)
	{
		return
	}
	if(document.querySelector("form#landing"))
	{
		window.stop()
		let f=document.querySelector("form#landing"),id=location.search.split("?id=")[1],i
		if(bypassClipboard)
		{
			i=bypassClipboard
		}
		else if(document.querySelector("form#landing > div#landing")&&document.querySelector(".soractrl"))
		{
			i=location.hash.substr(1)
			if(i.substr(0,18)=="ignoreCrowdBypass#")
			{
				i=i.substr(18)
			}
		}
		else
		{
			i=id
		}
		f.id=""
		const callback=()=>{
			f.action+="#bypassClipboard="+i
			if(ignoreCrowdBypass)
			{
				f.action+="#ignoreCrowdBypass"
			}
			f.submit()
		}
		if(i)
		{
			if(id)
			{
				// Referers allow the "Was this not correct?" button at html/crowd-bypassed.html to repeat the process, on some sites it has to be changed for that:
				switch(domain)
				{
					case "channelmyanmar.org":
					referer="https://channelmyanmar.org/?1c17f28bf0="+id
					break;

					case "infotekno.net":
					referer="https://ad4msan.com/?9c2a6bf968="+id
					break;

					case "zaqe.xyz":
					referer="https://wizardsubs.com/?408631a1f0="+id
					break;

					case "www.zonangopi.com":
					referer="https://www.zonangopi.com/?407ea19f7e="+id
					break;

					case "paruru.top":
					referer="https://mmsubs.com/?e75fad73d9="+id
					break;

					case "intipanime.com":
					referer="https://bakadame.com/?e41b7e5034="+id
					break;
				}
				referer+="#bypassClipboard="+bypassClipboard
				crowdReferer(referer)
			}
			crowdPath(i)
			crowdBypass(callback,true)
		}
		else
		{
			i=bypassClipboard
			callback()
		}
	}
	if(bypassClipboard&&document.querySelector("img.spoint#showlink")&&document.querySelector(".soractrl"))
	{
		if(!ignoreCrowdBypass)
		{
			insertInfoBox(crowdEnabled?"{{msg.crowdWait}}":"{{msg.crowdDisabled}}")
		}
		const _ce=document.createElement
		document.createElement=(t,o)=>{
			let e=_ce.call(document,t,o)
			if(t=="form")
			{
				const _submit=e.submit
				e.submit=()=>{
					e.action+="&soralink_contribute="+bypassClipboard
					_submit.call(e)
				}
			}
			return e
		}
	}
	//Safelink Wordpress Plugin
	ifElement(".wpsafe-top > form > input.btn.btn-primary[type='submit'][value]",i=>{
		i.click()
		finish()
	})
	if(document.getElementById("wpsafe-generate")&&typeof wpsafegenerate=="function")
	{
		ifElement("#wpsafegenerate > #wpsafe-link > a[href]",a=>{
			safelyNavigate(a.href)
			return finish()
		},()=>{
			let s=new URLSearchParams(location.search)
			if(s.has("go"))
			{
				if(safelyNavigate(atob(s.get("go"))))
					return finish()
			}
			else if(location.pathname.substr(0,4)=="/go/")
			{
				search=atob(location.pathname.substr(4))
				if(search.substr(0,4)=="http")
				{
					safelyNavigate(search)
					return finish()
				}
			}
		})
	}
	ifElement(".wpsafe-bottom > [id^='wpsafe-lin'] > a[href]",a=>{
		safelyNavigate(a.href)
		finish()
	})
	ifElement("a[href*='?safelink_redirect=']",a=>{
		safelyNavigate(new URL(a.href).searchParams.get("safelink_redirect"))
		finish()
	})
	ifElement("form[action*='?safelink_redirect=']",f=>{//#557
		let url=new URL(f.action).searchParams.get("safelink_redirect")
		if(url.substr(0,23)=="http://blankrefer.com/?")
		{
			url=url.substr(23)
		}
		safelyNavigate(url)
		finish()
	})
	if(document.querySelector(".wp-safelink-button"))
	{
		window.setInterval=f=>setInterval(f,1)
		awaitElement(".wp-safelink-button.wp-safelink-success-color",a=>{
			window.open=safelyNavigate
			a.click()
		})
	}
	if(document.querySelector("input[type='hidden'][name='newwpsafelink'][value]"))
	{
		let s=new URLSearchParams(location.search)
		if(s.has("go"))
		{
			safelyNavigate(atob(s.get("go")))
			return finish()
		}
	}
	//wpapk template
	ifElement("a[href].wpapks-download-link",a=>ifElement("#wpapks-pre-download-btn",b=>{
		b.onclick=()=>safelyNavigate(a.href)
	}))
	//Other Templates
	ifElement(".timed-content-client_show_0_30_0",d=>{//technicoz.com
		d.classList.remove("timed-content-client_show_0_30_0")
		d.style.display="block"
		domainBypass("technicoz.com",()=>{
			safelyNavigate(d.querySelector("a").href)
		})
		finish()
	})
	if(document.getElementById("getlink")&&document.getElementById("gotolink")&&(
		document.getElementById("timer")||//tetewlink.me,vehicle-techno.cf#86
		document.getElementById("count")//keisekaikuy.blogspot.com#493
		))
	{
		document.getElementById("gotolink").removeAttribute("disabled")
		document.getElementById("gotolink").click()
		return finish()
	}
	if(document.querySelector("#tungguyabro")&&typeof WaktunyaBro=="number")//short.mangasave.me
	{
		WaktunyaBro=0
		setInterval(()=>{
			if(document.querySelector("#tungguyabro a[href]"))
				safelyNavigate(document.querySelector("#tungguyabro a[href]").href)
		},100)
		return finish()
	}
	if(document.querySelector("#yangDihilangkan > a")&&document.querySelector("#downloadArea > .text-center"))//rathestation.bid
	{
		safelyNavigate(document.querySelector("#yangDihilangkan > a").href)
		return finish()
	}
	if(document.querySelector("a.redirectBTN.disabled")&&document.querySelector(".timer"))//Arablionz.online
	{
		safelyNavigate(document.querySelector("a.redirectBTN.disabled").href)
		return finish()
	}
	if(typeof generate=="function")//lewat.wibuindo.com
	{
		ifElement("#download > a.akani[href]",b=>safelyNavigate(b.href))
	}
	if(document.querySelector(".shortened_link a[href][ng-href][target='_blank']"))//Go2to.com,Go2too.com,Golink.to
	{
		safelyNavigate(document.querySelector(".shortened_link a[href][ng-href][target='_blank']").href)
	}
	if(location.search.startsWith("?n="))//viralking.xyz,indian4uh.com
	{
		ifElement("center a[name=a][href]",a=>{
			safelyNavigate(a.href)
			finish()
		})
	}
	if(typeof adblock_message=="string"&&adblock_message.indexOf("mm1.ink")>-1&&typeof goto=="function")//mm1.ink#442
	{
		$=()=>({attr:(n,v)=>safelyNavigate(atob(v))})
		goto()
	}
	if(document.querySelector("#templatemo_footer > a[href*='teknosafe']")&&document.querySelector("#templatemo_content > div > a[href]"))//teknosafe.kertashitam.com,teknosafe.teknologilink.com
	{
		safelyNavigate(document.querySelector("#templatemo_content > div > a[href]").href)
		return finish()
	}
	ifElement("button#makingdifferenttimer[onclick^='window.location.replace']",b=>{//#522
		b.click()
		finish()
	})
	ifElement("input[type='hidden'][name='mylink'][value^='http']",i=>{//#549
		safelyNavigate(i.value)
		finish()
	})
	if(document.querySelector("a[href='https://facebook.com/realsht.mobi']"))
	{
		ifElement("a#hapus",safelyAssign)
	}
	if(typeof megabux=="object"&&"link"in megabux)//acortaz.com#1460
	{
		safelyNavigate(megabux.link)
	}
	//dl.ccbluex.net
	domainBypass("dl.ccbluex.net",()=>{
		if(location.pathname.substring(0,6)=="/skip/")
		{
			crowdBypass(()=>{
				ifElement("div.top-bar form[method='POST'][action]",f=>{
					awaitElement("div.top-bar form[method='POST'][action] #skip-button[value='Skip AD']",b=>{
						f.action+='#bypassClipboard='+location.pathname.substr(1)
						b.click()
					})
				})
			})
		}
		else if(location.pathname.substring(0,10)=="/download/")
		{
			if(bypassClipboard)
			{
				isGoodLink_allowSelf=true
				crowdPath(bypassClipboard)
				crowdContribute(location.href)
			}
		}
	})
	//adshrink.it
	ifElement("meta[property='og:site_name'][content='Adshrink.it']",()=>{
		let iT=setInterval(()=>{
			if(typeof _sharedData=="object"&&0 in _sharedData&&"destination"in _sharedData[0])
			{
				clearInterval(iT)
				document.write(_sharedData[0].destination)
				safelyNavigate(document.body.textContent)
			}
			else if(typeof ___reactjsD!="undefined"&&typeof window[___reactjsD.o]=="object"&&typeof window[___reactjsD.o].dest=="string")
			{
				clearInterval(iT)
				safelyNavigate(window[___reactjsD.o].dest)
			}
		})
	})
	domainBypass(/(techynroll|threadbolts|techitease)\.com/, ()=>awaitElement("a#enablebtn", a=>safelyAssign(a.href)))
	hrefBypass(/meostream\.com\/links\//,()=> ifElement("a#link",safelyNavigate))
	//XImageSharing
	ifElement('input[type=submit][value="Continue to image..."]', submit => {
		submit.click()
	})
	ifElement('span.roll ~ img.pic', img => {
		// zoom image
		img.removeAttribute("style")
		// remove zoom icon
		img.parentElement.getElementsByClassName("roll")[0].remove()
	})
	domainBypass(/metroupdate\.biz|kangapip\.com/, ()=>myFunction())
	// mmcryptos domains
	domainBypass(/clickscoin\.com|dogeclick\.net|sl\.mcmfaucets\.xyz|short\.mcmcryptos\.xyz/, () => awaitElement("button#mdt", a => a.click()))
	domainBypass("dutchycorp.space", () => ifElement("div#cl1", d => (safelyNavigate(d.getElementsByTagName("a")[0].href))))
	domainBypass("noweconomy.live",()=>{
		ifElement("form",form=>form.submit())
		ifElement("#surl1",a=>a.click())
	})
	domainBypass(/exey\.io/, () => ifElement("button.btn.btn-primary.btn-goo", a => a.click()))
	domainBypass(/yoshare\.net/, () =>{
    		ifElement("input.btn.btn-primary", a => a.click())
    		ifElement("button#btn6", b => b.click())
    	})
	domainBypass("blog2share.com", () => {
		ifElement("div.redirect-message", a => {
			b = a.getElementsByTagName('strong')[0].innerHTML
			safelyNavigate(b)
		})
	})

	hrefBypass(/downloadfreecourse\.com\/generate-link\//, () => {
		ifElement("#downloadlink", (a) => {
			a.onclick()
		})
	})

	domainBypass("mynewsmedia.co", () => {
		awaitElement('a#btn6', b => {
			safelyNavigate(b.href)
		})
		ifElement("button.close.close-btn-open-window", a => {
			a.click()
		})
	})
	domainBypass("100count.net", () => {
		awaitElement("button#mdt", a => (a.click()))
		awaitElement("div#cl1", d => (safelyNavigate(d.getElementsByTagName("a")[0].href)))
	})
	domainBypass("dl.freetutsdownload.net", () => {
	ifElement("h3", a => {
		b = a.getElementsByTagName('strong')[0].innerHTML
		safelyNavigate(b)
		})
	})
	domainBypass("fc-lc.com",()=>awaitElement(".g-recaptcha.btn.btn-primary",b=>b.click()))

	//WPsafelink bypass
	//landing bypass
	ifElement('form#wpsafelink-landing', w => {
		w.submit()
        })
        //generate link bypass
	ifElement('div#wpsafe-link', d => {
		var onc = d.getElementsByTagName("a")[0].getAttribute("onclick") //get onclick attr of anchor in div
		var bs64 = onc.split(/\?safelink_redirect=|',/)[1] //use .split with regex to get destination encoded in base64
		var decoded = JSON.parse(atob(bs64)) //parse base64 to object
		safelyNavigate(decoded.safelink)
        })
	domainBypass(/newforex\.online|world-trips\.net/, () => {
	ifElement("a.submitBtn.btn.btn-primary[href]", a => {
		safelyNavigate(a.href)
		})
	})
	domainBypass(/go\.akwam\.(cc|cx|net|im)/, () => {
		awaitElement("a.download-link[href]", a => {
			safelyNavigate(a.href)
		})
	})
	domainBypass("allkeyshop.com", () => {
		if (location.pathname.includes("outgoinglink/link/")) {
			ifElement("a", a => {
				safelyNavigate(a.href)
			})
		}
	})
	hrefBypass(/sharemods\.com\/([a-z0-9]{12})\//, () => {
		awaitElement("#dForm", a => (a.submit()));
	})

domainBypass('uprot.net', () => {
  ifElement('.button.is-info', b => safelyNavigate(b.closest('a').href))
})

domainBypass('apkadmin.com', () => {
  ifElement('#downloadbtn', b => {
    b.removeAttribute('disabled')
    b.click()
  })
  ifElement('#countdown', c => {
    c.innerHTML = ''
  })
})



	hrefBypass(/mirrored\.to\/files\//,()=> {
		if (location.href.includes('hash')) return; // we already bypassed to here
		const href = document.querySelector(`a[href^="${location.href}"]`).href;
		safelyAssign(href);
	})
	hrefBypass(/mirrored\.to\/(down|get)link\//,()=>ifElement(".centered.highlight a[href]",safelyNavigate))


	domainBypass("tei.ai", () => {
		const token = document.querySelector('#link-view [name="token"]').value;
		const decoded = atob(token.substring(token.indexOf("aHR0")));
		const page = decoded.split('http').pop();
		const link = `http${page}`;
		safelyNavigate(link);
	});
domainBypass("filedm.com",()=>{awaitElement("a#dlbutton",a=>{
    safelyNavigate("http://directdl.xyz/dm.php?id="+a.href.split("_")[1])}
)})

domainBypass("bowfile.com", () => {
	const regex=/.*let next = "(http[^"]+)";.*/
	document.querySelectorAll("script").forEach(script=>{
		let matches=regex.exec(script.textContent)
		if(matches&&matches[1])
		{
			safelyNavigate(matches[1])
		}
	})
})


domainBypass("acorta-link.com", () => {
    const regex=/([a-zA-Z]{1,})= decode_link/
    document.querySelectorAll("script").forEach(script=>{
        const matches=regex.exec(script.text)
        if(matches&&matches[1])
        {
            let url = window[matches[1]]
            if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
                url = "http:" + url;
            }
            safelyNavigate(url)
        }
    })
})

domainBypass("clk.asia", () => {
    ensureDomLoaded(() => {
      const token = document.querySelector('#link-view [name="token"]').value;
      const decoded = atob(token.substring(token.indexOf("aHR0")));
      const page = decoded.split("http").pop();
      const link = `http${page}`;
      safelyNavigate(link);
    });
  });

	//Insertion point for bypasses detecting certain DOM elements. Bypasses here will no longer need to call ensureDomLoaded.
	domainBypass('letsboost.net', () => {
		return safelyAssign(JSON.parse(stepDat).pop().url)
	});
	let t=document.querySelector("title")
	if(!bypassed&&t)
	{
		t=t.textContent.trim()
		switch(t)
		{
			case"Viid.su":
			ifElement("button#link-success-button[data-url]",b=>{
				safelyAssign(b.getAttribute("data-url"))
				finish()
			})
			break;

			case"AdFoc.us":
			ifElement("a.skip[href]",e=>{safelyNavigate(e.href)});
			break;

			case"shortadd : 302 Moved":
			crowdBypass()
			let lT=setInterval(()=>{
				if(typeof $!="undefined")
				{
					clearInterval(lT)
					let _ajax=$.ajax,req=0
					$.ajax=d=>{
						if(typeof d=="object"&&"success"in d&&"dataType"in d&&d.dataType=="json"&&"url" in d&&d.url.length>15&&d.url.substr(-11)=="/skip_timer")
						{
							if("data"in d&&"adblock"in d.data)
							{
								d.data.adblock=false
							}
							if(++req==2)
							{
								d.success=res=>{
									contributeAndNavigate(res.messages.url)
								}
							}
						}
						_ajax(d)
					}
				}
			},10)
			break;

			case "Glinks!":
			ifElement("form[method='POST'] > input[type='submit'][name='btn'].btn",i=>{
				if(i.parentNode.querySelector(".g-recaptcha")==null)
				{
					i.click()
				}
			},()=>{
				ifElement(".btnx",a=>a.click())
			})
			break;

			case "AdFly - Click Allow to continue":
			safelyNavigate((new URLSearchParams(location.search)).get("dest"))
			break;

			default:
			ifElement("a#makingdifferenttimer[href]",b=>{
				if(isGoodLink(t))
				{
					unsafelyNavigate(t)
				}
				else
				{
					safelyNavigate(b.href)
				}
			})

			//Insertion point for bypasses running for a specific site <title>. Please make it fit the switch structure. Bypasses here will no longer need to call ensureDomLoaded.
		}
	}
	//Monitor DOM for disturbances for 10 seconds.
	let dT=setInterval(()=>{
		//Shorte.st Embed
		ifElement(".lay-sh.active-sh",elm=>elm.parentNode.removeChild(elm))
		//AdLinkFly
		if(typeof app_vars=="object")
		{
			if(location.search.substr(0,3)=="?a=")
			{
				if(document.querySelector("img[alt='SafelinkU']"))
				{
					window.setInterval=f=>setInterval(f,10)
				}
				crowdPath(location.search.substr(3))
			}
			domainBypass("adcoinfly.com",()=>document.querySelectorAll("a.btn[href=''], a.btn[href*='clickme']").forEach(e=>e.parentNode.removeChild(e)))
			domainBypass(/(semawur|bercara)\.com|in11\.site/,()=>ifElement("input[type='hidden'][name='alias'][value]",i=>crowdPath(i.value),()=>crowdPath(location.hash.substr(1))))
			domainBypass(/movienear\.me|lewat\.club|tautan\.pro|(droidtamvan|gubukbisnis|onlinecorp)\.me|(liveshootv|modebaca|haipedia|sekilastekno|miuiku)\.com|shrink\.world|link\.mymastah\.xyz|(sportif|cararoot)\.id|healthinsider\.online/,()=>{
				ifElement("input[type='hidden'][name='alias'][value]",i=>{
					i.parentNode.action+="#"+i.value+(ignoreCrowdBypass?"#ignoreCrowdBypass":"")
					crowdPath(i.value)
				},()=>ifElement("form#link-view",f=>{
					f.action+="#"+location.hash.substr(1)+(ignoreCrowdBypass?"#ignoreCrowdBypass":"")
					crowdPath(location.hash.substr(1))
				},()=>crowdPath(location.hash.substr(1))))
			})
			domainBypass(/(atv|adlink)\.pw|safe\.mirrordown\.com|kabarviral\.blog/,()=>crowdPath(location.search.substr(1).split("=")[0]))
			docSetAttribute("{{channel.adlinkfly_info}}","")
			let iT=setInterval(()=>{
				if(document.documentElement.hasAttribute("{{channel.adlinkfly_target}}"))
				{
					clearInterval(iT)
					let t=document.documentElement.getAttribute("{{channel.adlinkfly_target}}")
					if(t=="")
					{
						if(FAST_FORWARD_INTERNAL_VERSION>=10&&bypassClipboard.substr(0,8)=="psarips:")
						{
							persistHash("bypassClipboard="+bypassClipboard)
							crowdDomain("psarips.com")
							crowdPath("/exit/"+bypassClipboard.substr(8))
						}
						crowdBypass(()=>{
							let cT=setInterval(()=>{//                                                                                                                                                                               v spotted on fc-lc.com
								let a=document.querySelector("a.get-link[href]:not([href='']):not([href*='.ads.']):not([href*='//ads.']):not(.disabled), .skip-ad a[href]:not([href='']):not([href*='.ads.']):not([href*='//ads.']), a#surl[href]:not([href='']):not([href*='.ads.']):not([href*='//ads.']), a.pnd-submit-button[href]:not([href^='javascript:'])"),h
								if(a)
								{
									h=a.href
								}
								else
								{
									a=document.querySelector("[enlace]")//adigp.com
									if(a)
									{
										h=a.getAttribute("enlance")
									}
								}
								if(isGoodLink(h))
								{
									if(h.indexOf("://partners.popcent.net/")==-1)//tr.link
									{
										clearInterval(cT)
										a.parentNode.removeChild(a)
										contributeAndNavigate(h)
									}
								}
							},20)
						})
					}
					else
					{
						contributeAndNavigate(t)
					}
				}
			},50)
			domainBypass(/123l\.pw|123link|(linksht|icutlink)\.com/,()=>window.setInterval=f=>setInterval(f,1))
			clearInterval(dT)
		}
		//GemPixel/KBRMedia Premium URL Shortener
		if(typeof appurl=="string"&&typeof token=="string")
		{
			const regex=/var count = [0-9]*;var countdown = setInterval\(function\(\){\$\("[a-z\-.# ]+"\)(\.attr\("href","#pleasewait"\))?(\.attr\("disabled",""\))?\.html\(count( \+ ".+")?\);if \(count < 1\) {clearInterval\(countdown\);(\$\("[a-z\-.# ]+"\)\.attr\("href",|window\.location=)"(https?:\/\/[^"]+)"( \+ hash)?\)?(\.removeAttr\("disabled"\)\.removeClass\("disabled"\))?(\.html\(".+"\))?;}count--;}, 1000\);/
			let contribute=false
			if(!bypassed)
			{
				domainBypass(/al\.ly|ally\.sh|dausel\.co/,()=>{
					crowdBypass()
					contribute=true
					let e=document.getElementById("html_element")
					if(e)
					{
						let m=document.getElementById("messa")
						if(m)
						{
							m.parentNode.removeChild(m)
						}
						e.classList.remove("hidden")
					}
				})
			}
			document.querySelectorAll("script").forEach(script=>{
				let matches=regex.exec(script.textContent)
				if(matches&&matches[5])
				{
					if(contribute)
					{
						contributeAndNavigate(matches[5])
					}
					else
					{
						safelyNavigate(matches[5])
					}
				}
			})
			clearInterval(dT)
		}
		if(typeof redirectpage!="undefined"&&typeof CryptoJS!="undefined")
		{
			document.querySelectorAll("a[href^='"+redirectpage+"']").forEach(a=>{
				let url=CryptoJS.AES.decrypt(atob(new URL(a.href).searchParams.get("token")),"391si8WU89ghkDB5").toString(CryptoJS.enc.Utf8)
				if(isGoodLink(url))
				{
					a.href=url
					a.onclick=countIt
				}
			})
		}
		//Insertion point for bypasses detecting certain DOM elements which may appear up to 10 seconds after page load. Bypasses here will no longer need to call ensureDomLoaded.
		domainBypass("www.tech2learners.com", () => safelyNavigate(downloadButton.href))
	},100)
	setTimeout(()=>clearInterval(dT),10000)//
},true)
