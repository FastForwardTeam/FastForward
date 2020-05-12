  /////////////////////////////////////////////////////////////////////////////////////////////
 // If you want to add your own bypass, add it above the relevant "Insertion point" comment //
/////////////////////////////////////////////////////////////////////////////////////////////

//Copying important functions to avoid interference from other extensions or the page
const ODP=(t,p,o)=>{try{Object.defineProperty(t,p,o)}catch(e){console.trace("[Universal Bypass] Couldn't define",p)}},
setTimeout=window.setTimeout,setInterval=window.setInterval,URL=window.URL,
transparentProperty=(name,valFunc)=>{
	let real
	ODP(window,name,{
		set:_=>real=_,
		get:()=>valFunc(real)
	})
},
isGoodLink=link=>{
	if(typeof link!="string"||link.split("#")[0]==location.href.split("#")[0]||link.substr(0,6)=="about:"||link.substr(0,11)=="javascript:")//jshint ignore:line
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
unsafelyNavigate=target=>{
	if(navigated)
	{
		return
	}
	navigated=true
	window.onbeforeunload=null
	//The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
	let url="https://universal-bypass.org/bypassed?target="+encodeURIComponent(target)+"&referer="+encodeURIComponent(referer)
	switch(target)//All values here have been tested using "Take me to destinations after 0 seconds."
	{
		case "https://proxoexploits.com/proxo/continue_two":
		case "https://proxoexploits.com/ProxoKeyKeyLol":
		case "https://api.thinksuggest.org/?m=c&t=j&h=Jump&q=_clickout&pid=linkvertisenet&k=https%3A%2F%2Fproxoexploits.com%2Fproxo%2Fcontinue_two&subid=klickouts":
		case "https://api.thinksuggest.org/?m=c&t=j&h=Jump&q=_clickout&pid=linkvertisenet&k=https%3A%2F%2Fproxoexploits.com%2FProxoKeyKeyLol&subid=klickouts":
		url+="&safe_in=20"
		break;

		case (/fluxteam\.xyz/.exec(target)||{}).input:
		url+="&safe_in=95"
		break;
	}
	location.assign(url)
},
safelyNavigate=(target,drophash)=>{
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
	navigated=true
	window.onbeforeunload=null
	location.assign(target)
	return true
},
finish=()=>{
	bypassed=true
	document.documentElement.setAttribute("{{channel.stop_watching}}","")
},
countIt=f=>{
	document.documentElement.setAttribute("{{channel.count_it}}","")
	setTimeout(f,10)
},
domainBypass=(domain,f)=>{
	if(bypassed)
	{
		return
	}
	if(typeof f!="function")
	{
		alert("Universal Bypass: Bypass for "+domain+" is not a function")
	}
	if(typeof domain=="string")
	{
		if(location.hostname==domain||location.hostname.substr(location.hostname.length-(domain.length+1))=="."+domain)
		{
			bypassed=true
			f()
		}
	}
	else if("test" in domain)
	{
		if(domain.test(location.hostname))
		{
			bypassed=true
			f()
		}
	}
	else
	{
		console.error("[Universal Bypass] Invalid domain:",domain)
	}
},
hrefBypass=(regex,f)=>{
	if(bypassed)
	{
		return
	}
	if(typeof f!="function")
	{
		alert("Universal Bypass: Bypass for "+domain+" is not a function")
	}
	let res=regex.exec(location.href)
	if(res)
	{
		bypassed=true
		f(res)
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
crowdPath=p=>{
	if(crowdEnabled&&p)
	{
		document.documentElement.setAttribute("{{channel.crowd_path}}",p)
	}
},
crowdReferer=r=>{
	if(r)
	{
		document.documentElement.setAttribute("{{channel.crowd_referer}}",r)
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
			document.documentElement.setAttribute("{{channel.crowd_query}}","")
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
		document.documentElement.setAttribute("{{channel.crowd_contribute}}",target)
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
	const div=document.createElement("div")
	div.style='z-index:999999;position:fixed;bottom:20px;right:20px;margin-left:20px;background:#eee;border-radius:10px;padding:20px;color:#111;font-size:21px;box-shadow:#111 0px 5px 40px;max-width:500px;font-family:-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol;cursor:pointer'
	div.innerHTML='<img src="{{icon/48.png}}" style="width:24px;height:24px;margin-right:8px"><span style="display:inline"></span>'
	div.setAttribute("tabindex","-1")
	div.setAttribute("aria-hidden","true")
	const span=div.querySelector("span")
	span.textContent=text
	div.onclick=()=>document.body.removeChild(div)
	document.body.appendChild(div)
})
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
for(let key in forced_safelink)
{
	ODP(safelink,key,
	{
		writable:false,
		value:forced_safelink[key]
	})
}
//Soralink Wordpress Plugin
ODP(window,"soralink",{
	get:()=>{}
})
//Adtival
ODP(window,"adtival_base64_encode",{
	get:()=>{}
})
//Shorte.st
transparentProperty("reqwest",r=>(typeof app!="undefined"&&document.querySelector(".skip-add-container .first-img[alt='Shorte.st']"))?a=>{
	if(a.type==="jsonp")
	{
		a.success=s=>contributeAndNavigate(s.destinationUrl)
	}
	r(a)
}:r)
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
	awaitElement(".download_button[href]",a=>safelyNavigate(a.href))
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
domainBypass(/mylinks\.xyz|mylink\.zone/,()=>{
	window.setTimeout=f=>setTimeout(f,1)
	awaitElement("#compteur a[href]",a=>safelyNavigate(new URL(a.href).searchParams.get("url")))
})
domainBypass(/shortmoz\.link|skinnycat\.org|safelink\.polrec\.site/,()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement("a.btn.redirect[href^='http']",a=>safelyNavigate(a.href))
})
domainBypass("gamesmega.net",()=>{
	ODP(window,"hash",{
		get:()=>"",
		set:_=>safelyNavigate(decodeURIComponent(atob(_)))
	})
})
domainBypass("hokiciki.org",()=>ifElement("a[href^='/get-link/']",a=>safelyAssign(a.href)))
domainBypass(/wadooo\.com|gotravelgo\.space|pantauterus\.me|liputannubi\.net/,()=>{
	crowdPath(location.hash.substr(1))
	crowdBypass()
})
domainBypass("lnk.news",()=>ifElement("#skip_form",f=>goToUrl(),()=>ifElement("#display_go_form",f=>{
	countIt(()=>f.submit())
})))
hrefBypass(/(uiz\.(io|app)|moon7\.xyz)\/go/,()=>{
	Object.freeze(location)
	ensureDomLoaded(()=>{
		const regex=/.*window\.location\.href = "(http[^"]+)";.*/
		document.querySelectorAll("script").forEach(script=>{
			let matches=regex.exec(script.textContent)
			console.log(matches)
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
	awaitElement("a.mirror_link[href]",a=>safelyNavigate(a.href))
})
domainBypass("tik.lat",()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement(".skip > .wait > .skip > .btn > a[href]",a=>safelyNavigate(a.href))
})
domainBypass(/linkvertise\.(com|net)|link-to\.net/,()=>{
	let o={timestamp:new Date().getTime(),random:"375123"},
	url="https://linkvertise.net/api/v1/redirect/link/static"+location.pathname
	fetch(url).then(r=>r.json()).then(json=>{
		if(json&&json.data.link.id)
		{
			o.link_id=json.data.link.id
			url="https://linkvertise.net/api/v1/redirect/link"+location.pathname+"/target?serial="+btoa(JSON.stringify(o))
		}
	}).then(()=>fetch(url)).then(r=>r.json()).then(json=>{
		if(json&&json.data.target)
		{
			safelyNavigate(json.data.target)
		}
	})
	window.setTimeout=f=>setTimeout(f,1)
	window.setInterval=f=>setInterval(f,1)
	window.videojs={getAllPlayers:()=>[{
		on:(e,f)=>f(),
		controlBar:{
			progressControl:{
				disable:()=>{}
			}
		},
		pause:()=>{}
	}]}
	ensureDomLoaded(()=>{
		setInterval(()=>{
			ifElement(".modal.show .web-close-btn",b=>b.click())
		},1000)
		setTimeout(()=>{
			document.querySelectorAll(".todo-block .todo").forEach(d=>d.click())
			setTimeout(()=>ifElement(".todo-btn-nr",b=>{
				b.click()
				setTimeout(()=>ifElement(".btn.countdown-btn.first",a=>{
					countIt(()=>a.click())
				}),100)
			}),2000)
		},2000)
	})
})
domainBypass(/acortalo\.(live|xyz)/,()=>{
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
domainBypass("chaosity.cheatsquad.gg",()=>{
	ODP(window,"steps",{
		get:()=>[true]
	})
	ensureDomLoaded(()=>document.querySelectorAll("div.loader").forEach(d=>d.className="check_loader"))
})
//Insertion point for bypasses running before the DOM is loaded.
domainBypass(/^((www\.)?((njiir|healthykk|linkasm|dxdrive|getwallpapers|sammobile|ydfile)\.com|punchsubs\.net|k2s\.cc|muhammadyoga\.me|u\.to|skiplink\.io|(uploadfree|freeupload)\.info|fstore\.biz))$/,()=>window.setInterval=f=>setInterval(f,1))
hrefBypass(/firefaucet\.win\/l\/|sfirmware\.com\/downloads-file\/|(apkily\.com\/getapp$)|androidtop\.net\/\?do=downloads\&id=/,()=>window.setInterval=f=>setInterval(f,1))
hrefBypass(/emulator\.games\/download\.php|curseforge\.com\/.*\/download\/[0-9]*/,()=>window.setInterval=f=>setInterval(f,100))
domainBypass(/^((www\.)?((racaty|longfiles|filepuma|portableapps)\.com|indishare\.org|datei\.to|keisekai\.fun|solvetube\.site))$/,()=>window.setTimeout=f=>setTimeout(f,1))
domainBypass("lkc21.net",()=>window.setTimeout=f=>setTimeout(f,100))
domainBypass("universal-bypass.org",()=>{
	window.universalBypassInstalled=true
	window.universalBypassInternalVersion=UNIVERSAL_BYPASS_INTERNAL_VERSION
	window.universalBypassExternalVersion="UNIVERSAL_BYPASS_EXTERNAL_VERSION"
	window.universalBypassInjectionVersion="UNIVERSAL_BYPASS_INJECTION_VERSION"
})
ensureDomLoaded(()=>{
	if(ignoreCrowdBypass)
	{
		document.querySelectorAll("form[action]").forEach(e=>e.action+="#ignoreCrowdBypass")
		document.querySelectorAll("a[href]").forEach(e=>e.href+="#ignoreCrowdBypass")
	}
	domainBypass(/^((www\.)?(up-load\.io|cosmobox\.org|filefactory\.com|rockfile\.co))$/,()=>insertInfoBox("{{msg.infoFileHoster}}"))
	domainBypass(/adfoc\.us|ads\.bdcraft\.net/,()=>ifElement(".skip[href]",b=>safelyNavigate(b.href)))
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
	domainBypass("gotoo.loncat.in",()=>ifElement("a[href^='http://gotoo.loncat.in/go.php?open=']",a=>safelyNavigate(a.href)))
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
	domainBypass(/douploads\.(com|net)/,()=>{
		ifElement(".seconds",s=>{
			s.textContent="1"
			document.getElementById("chkIsAdd").checked=false
			document.getElementById("downloadBtnClick").style.display="none"
			document.getElementById("downloadbtn").style.display="block"
		})
	})
	domainBypass("elsfile.org",()=>{
		let f=document.createElement("form")
		f.method="POST"
		f.innerHTML='<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.substr(1)+'"><input type="hidden" name="fname"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">'
		f.querySelector("[name='fname']").value=document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent
		f=document.documentElement.appendChild(f)
		countIt(()=>f.submit())
	})
	domainBypass("goou.in",()=>ifElement("div#download_link > a#download[href]",a=>a.href))
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
			if(json&&json.paste)
			{
				safelyNavigate(json.paste.url)
			}
		}
		xhr.open("GET",location.pathname+".json")
		document.cookie="referrer=1"
		xhr.send()
	})
	domainBypass(/ouo\.(io|press)|lnk2\.cc/,()=>{
		if(location.pathname.substr(0,4)=="/go/")
		{
			document.querySelector("form").submit()
		}
		else
		{
			crowdBypass()
		}
	})
	domainBypass("drivehub.link",()=>ifElement("a#proceed[href]",a=>safelyNavigate(a.href)))
	domainBypass(/oxy\.(cloud|st)/,()=>{
		let params=new URL(document.querySelector("#divdownload > a[href]").href).searchParams
		if(params.has("predirect"))
		{
			safelyAssign(params.get("predirect"))
		}
		else if(params.has("bpredirect"))
		{
			safelyAssign(atob(params.get("bpredirect")))
		}
		else if(params.has("url"))
		{
			safelyAssign(params.get("url"))
		}
	})
	domainBypass("daunshorte.teknologilink.com",()=>safelyAssign(document.querySelector("a[href^='https://teknosafe.teknologilink.com/linkteknolink/safelinkscript.php?']").href))
	domainBypass("imgtaxi.com",()=>document.querySelector("a.overlay_ad_link").click())
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
	domainBypass(/(driverays|bioskopgo|01nonton|thetecnostar|curimovie|akltu)\.com|cinema21\.tv/,()=>ifElement("a#link[href]",a=>safelyAssign(a.href)))
	domainBypass("wikitrik.com",()=>document.querySelector("#download > form[action='/getlink.php'] > input[type='submit'].button").click())
	domainBypass("dawnstation.com",()=>safelyNavigate(document.querySelector("#tidakakanselamanya.hiddenPlace > a").href))
	domainBypass("hokiwikiped.net",()=>ifElement("a#DrRO[href]",a=>safelyNavigate(a.href)))
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
	domainBypass(/^((www\.)?(((get-click2|informations-library|media-blue|akashirohige|aibouanimelink)\.blogspot|business\.ominfoupdate|majidzhacker|citgratis|tekloggers|pro\-bangla)\.com|pastikan\.me|(blog\.infolanjutan|jkoding)\.xyz|safe\.onbatch\.my\.id|jackofnine\.site))$/,()=>{
		let u=aesCrypto.decrypt(convertstr(location.href.substr(location.href.indexOf("?o=")+3)),convertstr("root"))
		if(isGoodLink(u))
		{
			location.hash=""
			safelyNavigate(u)
		}
		else if(typeof uri=="string")
		{
			u=aesCrypto.decrypt(convertstr(uri.substr(uri.indexOf("?o=")+3)),convertstr("root"))
			safelyNavigate(u)
		}
		else if(typeof get_link=="string")
		{
			u=aesCrypto.decrypt(convertstr(get_link),convertstr("root"))
			safelyNavigate(u)
		}
		else if(location.href.indexOf("#go")>-1)
		{
			u=aesCrypto.decrypt(convertstr(location.href.substr(location.href.indexOf("#go")+3)),convertstr("root"))
			location.hash=""
			safelyNavigate(u.split("UI=")[1].split("NF=")[0])
		}
	})
	domainBypass("hello.tribuntekno.com",()=>ifElement("#splash p[style] > u > b > a[href]",a=>safelyNavigate(a.href)))
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
	domainBypass(/spacetica\.com|linkpoi\.(in|cc)/,()=>ifElement("a.btn.btn-primary[href]",a=>safelyNavigate(a.href)))
	domainBypass(/uiz\.(io|app)|moon7\.xyz/,()=>crowdBypass(()=>{
		awaitElement("#go-adsredirect",f=>{
			f.action+="#bypassClipboard="+location.pathname.substr(1)
		})
	}))
	hrefBypass(/mirrored\.to\/files\//,()=>ifElement("#dl_form button",b=>b.click()))
	hrefBypass(/mirrored\.to\/downlink\//,()=>ifElement(".centered.highlight a[href]",a=>safelyNavigate(a.href)))
	hrefBypass(/new\.lewd\.ninja\/external\/game\/([0-9]+)\/([a-z0-9]{64})/,m=>{
		let f=document.createElement("form")
		f.method="POST"
		f.action="https://xxx.lewd.ninja/game/"+m[1]+"/out/"+m[2]
		f=document.body.appendChild(f)
		countIt(()=>f.submit())
	})
	domainBypass("xxx.lewd.ninja",()=>safelyNavigate(document.body.textContent))
	domainBypass(/tr\.link|movienear\.me|lewat\.club|tautan\.pro|(droidtamvan|gubukbisnis)\.me|(liveshootv|modebaca|haipedia|sekilastekno)\.com|shrink\.world|link\.mymastah\.xyz|(sportif|cararoot)\.id/,()=>{
		if(typeof app_vars=="undefined")
		{
			app_vars={}
		}
		bypassed=false
	})
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
	domainBypass("transmediakreatif.com",()=>ifElement("#download > a[href]",a=>safelyAssign(a.href)))
	domainBypass(/go\.indonesia-publisher\.id|ciustekno\.me/,()=>{
		if(typeof disqus_config=="function"&&document.querySelector("form#link-view"))
		{
			let o={page:{}}
			disqus_config.call(o)
			safelyNavigate(o.page.url)
		}
	})
	hrefBypass(/mirrorace\.com\/m\/[a-zA-Z0-9]+\/[0-9]+/,()=>safelyAssign(document.querySelector("a[href*='"+location.search+"']:not([hidden]):not(.uk-hidden)").href))
	domainBypass("mirrorace.com",()=>{
		ifElement(".uk-modal-close",b=>{
			if(b.textContent=="I have a VPN already")
			{
				b.click()
			}
		})
	})
	domainBypass("pucuktranslation.pw",()=>ifElement("a.button.primary[href]",a=>safelyNavigate(a.href)))
	domainBypass("gsu.st",()=>ifElement("#Subform input[type='submit'][name='btn'].btn",b=>b.click()))
	domainBypass("mangalist.org",()=>{
		awaitElement("#btt > button.btn.btn-primary.text-center[onclick^='window.location.assign(']",b=>{
			let o=b.getAttribute("onclick")
			safelyNavigate(o.substr(24,o.length-3))
		})
	})
	domainBypass(/terbit21\.(club|online|host|show|top|cool)/,()=>ifElement("a#downloadbutton[href]",a=>countIt(safelyAssign(a.href))))
	domainBypass("onepieceex.net",()=>ifElement("noscript",n=>safelyNavigate(n.textContent)))
	domainBypass("felanovia.com",()=>ifElement("form",f=>countIt(()=>f.submit())))
	domainBypass("redir.animenine.net",()=>ifElement("a#lanjutkeun[href]",a=>safelyNavigate(a.href)))
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
		awaitElement("a#skip_button[href]",a=>safelyNavigate(a.href))
	})
	hrefBypass(/stayonline\.pro\/l\/(.*)\//,m=>$.post(endpoint,{id:m[1],ref:""},r=>safelyNavigate(r.data.value)))
	domainBypass("xlink.cc",()=>safelyNavigate(JSON.parse(atob(window.bootstrapData)).linkResponse.link.long_url))
	domainBypass("1shortlink.com",()=>awaitElement("#redirect-link[data-href]",a=>safelyNavigate(a.getAttribute("data-href"))))
	domainBypass("multiup.org",()=>ifElement("form[target][onsubmit] button[type='submit']",b=>{
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
	domainBypass("dl.blackmod.net",()=>ifElement("a.button.fa-download[href]",a=>safelyNavigate(a.href)))
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
	domainBypass("1ink.cc",()=>ifElement("a#countingbtn[href]",a=>safelyNavigate(a.href)))
	domainBypass("cuturl.cc",()=>{
		if(typeof PushLink=="function")
		{
			countIt(()=>PushLink())
		}
	})
	domainBypass("intifada1453.team",()=>ifElement("a.short-button[href]",a=>safelyNavigate(a.href)))
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
		fetch(f.action,{
			method:"POST",
			headers:{"Content-Type":"application/x-www-form-urlencoded"},
			body:new URLSearchParams(new FormData(f)).toString()
		}).then(r=>contributeAndNavigate(r.headers.get("refresh").split("url=")[1]))
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
	domainBypass(/(kora4top|forexlap)\.com/,()=>ifElement("div#m1x2 a",a=>safelyNavigate(a.href)))
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
	domainBypass("apunkasoftware.net",()=>ifElement("a#dlink[href]",a=>safelyNavigate(a.href),()=>ifElement("form#gip_form[action='https://www.apunkasoftware.net/download-process.php']",f=>f.submit())))
	domainBypass("disingkat.in",()=>ifElement("a.redirect[href]",a=>safelyNavigate(a.href),()=>{
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
	domainBypass("shirosafe.web.id",()=>ifElement("#cus>a[href]",a=>safelyNavigate(a.href)))
	domainBypass(/(techoow|histotechs)\.com/,()=>{
		window.setTimeout=f=>setTimeout(f,1)
		window.setInterval=f=>setInterval(f,1)
		ifElement("a.btn-success[href]",a=>safelyAssign(a.href),()=>ifElement("#count00",a=>{
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
	domainBypass("filesupload.org",()=>ifElement("a[href='?unlock']",a=>safelyAssign(a.href),()=>ifElement(".download-timer",()=>awaitElement(".download-timer>form>input[name='link']",i=>safelyAssign(i.value)))))
	hrefBypass(/nexusmods\.com\/.*\/mods\/[0-9]*\?tab=files&file_id=[0-9]*$/,()=>{
		window.setTimeout=f=>setTimeout(f,1)
		ifElement("#slowDownloadButton",a=>countIt(()=>a.click()))
	})
	domainBypass("myotto.online",()=>ifElement("button#makingdifferenttimer > a[href]",a=>safelyAssign(a.href)))
	domainBypass("disiniaja.site",()=>ifElement("button > a.button[href]",a=>safelyAssign(a.href)))
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
		if(typeof getId=="function"&&typeof startTimer=="function"&&typeof $=="function")
		{
			getId()
			startTimer()
			setTimeout(()=>{
				if(typeof id=="string")
				{
					$.get("/redirect.php?alias="+location.pathname.substr(1)+"&uuid="+id,contributeAndNavigate)
				}
			},30000)
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
	domainBypass("tricxbd.com",()=>ifElement("a#get_btn[href]",a=>safelyAssign(a.href)))
	domainBypass("do.customercareal.com",()=>ifElement("a#locked_action_link[href]",a=>safelyAssign(a.href),()=>ifElement("div.links_actions > a.blue[href]",a=>safelyAssign(a.href),()=>ifElement("a#redirecting_counter[href]",a=>safelyNavigate(a.href)))))
	domainBypass("iloadit11.info",()=>ifElement("button#timerbtn",()=>{
		let f=document.createElement("form")
		f.method="POST"
		f.innerHTML='<input type="hidden" name="r_clicked" value="1">'
		document.body.appendChild(f)
		countIt(()=>f.submit())
	}))
	domainBypass("sorewa.net",()=>ifElement("p[style='text-align: center;'] > strong > a[href]",a=>safelyNavigate(a.href)))
	domainBypass("akwam.net",()=>ifElement(".btn-loader > a.link.btn.btn-light[href][download]",a=>safelyNavigate(a.href)))
	domainBypass("lefturl.com",()=>ifElement("a.download-link[href]",a=>safelyNavigate(a.href)))
	domainBypass("worldofmods.com",()=>ifElement(".repost-button-twitter",b=>{
		window.open=_=>{}
		setTimeout(()=>{
			b.click()
			awaitElement("a#download-button[href]",a=>safelyNavigate(a.href))
		},500)
	}))
	domainBypass("linkconfig.com",()=>ifElement("a#download[href]",a=>safelyNavigate(a.href)))
	domainBypass("yourtechnology.online",()=>ifElement("#meio > a[href]",a=>safelyAssign(a.href)))
	domainBypass("suanoticia.online",()=>ifElement("#meio > a[href]",a=>safelyNavigate(a.href)))
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
		awaitElement("a#botao[href^='http']",a=>safelyNavigate(a.href))
	}))
	domainBypass("katfile.com",()=>{
		if(!document.querySelector(".g-recaptcha"))
		{
			window.setTimeout=f=>setTimeout(f,1)
		}
	})
	domainBypass("jk-chat.com",()=>safelyNavigate(atob(location.hash.substr(1))))
	domainBypass("shorten.sh",()=>crowdBypass(()=>ifElement("#go-link",()=>awaitElement("#go-link.go-link",f=>$.post(f.action,$("#go-link").serialize(),d=>contributeAndNavigate(d.url))))))
	domainBypass("urapk.com",()=>ifElement("#ed_dl_link > a[href]",a=>safelyNavigate(a.href)))
	domainBypass("ua.techweft.com",()=>ifElement("a.ui.primary.large.button[href]",a=>safelyNavigate(a.href)))
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
	domainBypass("5play.ru",()=>ifElement("div.download-result > a[href]",a=>safelyNavigate(a.href)))
	domainBypass("daunshorte.kertashitam.com",()=>ifElement("div[align=center] > center > a[href]",a=>safelyAssign(a.href)))
	//Insertion point for domain-or-href-specific bypasses running after the DOM is loaded. Bypasses here will no longer need to call ensureDomLoaded.
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
		/*jshint ignore:start*/
		domainBypass(domain,()=>document.querySelectorAll("a[href^='"+location.origin+"?"+soralink_data[domain]+"=']").forEach(a=>{
			a.href+="#bypassClipboard="+a.href.split("?"+soralink_data[domain]+"=")[1]
		}))
		/*jshint ignore:end*/
	}
	domainBypass(/pahe\.(in|me|ph)/,()=>document.querySelectorAll("a.shortc-button.small[href*='?'], a.shortc-button.small[href*='?id=']").forEach(a=>{
		let qe=a.previousElementSibling
		while(qe&&qe.tagName!="B"&&qe.tagName!="STRONG")
		{
			qe=qe.previousElementSibling
		}
		a.href+="#bypassClipboard="+location.pathname.replace(/[^a-zA-Z0-9]/g,"")
		let ep=a.parentNode.querySelector("span[style] > b")
		if(ep!==null)
		{
			a.href+=ep.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		}
		if(qe!==null)
		{
			a.href+=qe.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()
		}
		a.href+=a.textContent.toLowerCase()
	}))
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
	domainBypass("neonime.org",()=>document.querySelectorAll("a[href^='https://neonime.org?700ef7c050=']").forEach(a=>{
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
	if(document.querySelector("input[type='hidden'][name='newwpsafelink'][value]"))
	{
		let s=new URLSearchParams(location.search)
		if(s.has("go"))
		{
			safelyNavigate(atob(s.get("go")))
			return finish()
		}
	}
	//Shorte.st
	if(typeof app!="undefined"&&document.querySelector(".skip-add-container .first-img[alt='Shorte.st']"))
	{
		window.setInterval=f=>setInterval(f,800)
		return crowdBypass()
	}
	//Duit.cc
	if(document.querySelector("script[src='https://duit.cc/js/jquery.1.8.3.js']"))
	{
		ifElement("input[type='hidden'][name='geturl'][value^='http']",i=>{
			safelyNavigate(i.value)
			finish()
		})
	}
	if(document.querySelector("amp-facebook-page[data-href='https://www.facebook.com/duit.cc']"))
	{
		ifElement("#main > #Blog1 a",a=>{
			safelyAssign(a.href)
			finish()
		})
	}
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
	},()=>domainBypass("seputarinfomenarik.com",()=>ifElement("a#hapus",a=>safelyAssign(a.href))))
	//Insertion point for bypasses detecting certain DOM elements. Bypasses here will no longer need to call ensureDomLoaded.
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
			domainBypass(/movienear\.me|lewat\.club|tautan\.pro|(droidtamvan|gubukbisnis)\.me|(liveshootv|modebaca|haipedia|sekilastekno)\.com|shrink\.world|link\.mymastah\.xyz|(sportif|cararoot)\.id|healthinsider\.online/,()=>{
				ifElement("input[type='hidden'][name='alias'][value]",i=>{
					i.parentNode.action+="#"+i.value+(ignoreCrowdBypass?"#ignoreCrowdBypass":"")
					crowdPath(i.value)
				},()=>ifElement("form#link-view",f=>{
					f.action+="#"+location.hash.substr(1)+(ignoreCrowdBypass?"#ignoreCrowdBypass":"")
					crowdPath(location.hash.substr(1))
				},()=>crowdPath(location.hash.substr(1))))
			})
			domainBypass(/(atv|adlink)\.pw|safe\.mirrordown\.com|kabarviral\.blog/,()=>crowdPath(location.search.substr(1).split("=")[0]))
			document.documentElement.setAttribute("{{channel.adlinkfly_info}}","")
			let iT=setInterval(()=>{
				if(document.documentElement.hasAttribute("{{channel.adlinkfly_target}}"))
				{
					clearInterval(iT)
					let t=document.documentElement.getAttribute("{{channel.adlinkfly_target}}")
					if(t=="")
					{
						crowdBypass(()=>{
							let cT=setInterval(()=>{
								let a=document.querySelector("a.get-link[href]:not([href='']):not([href*='.ads.']):not([href*='//ads.']):not(.disabled), .skip-ad a[href]:not([href='']):not([href*='.ads.']):not([href*='//ads.'])"),h
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
	},100)
	setTimeout(()=>clearInterval(dT),10000)//
},true)
