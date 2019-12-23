//If you want to add your own bypass, search for "Insertion point"
const ODP=(t,p,o)=>{try{Object.defineProperty(t,p,o)}catch(e){console.trace("[Universal Bypass] Couldn't define",p)}},
//Copying important functions to avoid interference from other extensions or the page
setTimeout=window.setTimeout,setInterval=window.setInterval,
transparentProperty=(name,valFunc)=>{
	let real
	ODP(window,name,{
		set:_=>real=_,
		get:()=>valFunc(real)
	})
},
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
},
unsafelyNavigate=target=>{
	if(navigated)
	{
		return
	}
	navigated=true
	window.onbeforeunload=null
	location.assign("https://universal-bypass.org/bypassed?target="+encodeURIComponent(target)+"&referer="+encodeURIComponent(location.href))
	//The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
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
finish=()=>{
	bypassed=true
	document.documentElement.setAttribute("{{channel.stop_watching}}","")
},
domainBypass=(domain,f)=>{
	if(bypassed)
	{
		return
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
	let res=regex.exec(location.href)
	if(res)
	{
		bypassed=true
		f(res)
	}
},
ensureDomLoaded=f=>{
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
contributeAndNavigate=target=>{
	if(!navigated&&isGoodLink(target))
	{
		if(crowdEnabled)
		{
			document.documentElement.setAttribute("{{channel.crowd_contribute}}",target)
			setTimeout(()=>{
				unsafelyNavigate(target)
			},10)
		}
		else
		{
			unsafelyNavigate(target)
		}
	}
},
insertInfoBox=text=>ensureDomLoaded(()=>{
	if(infoBoxEnabled&&window.innerWidth>800&window.innerHeight>400)
	{
		const div=document.createElement("div")
		div.style='z-index:999999;border-radius:10px;padding:28px;position:fixed;right:30px;bottom:30px;background:#eee;color:#111;font-size:21px;box-shadow:#111 0px 5px 40px;max-width:500px;font-family:-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol'
		div.innerHTML='<img src="{{icon/48.png}}" style="width:24px;height:24px;margin-right:8px"><span style="display:inline"></span>'
		div.setAttribute("tabindex","-1")
		div.setAttribute("aria-hidden","true")
		const span=div.querySelector("span")
		span.textContent=text
		div.onmouseover=()=>{
			if(div.style.height=="")
			{
				div.style.height=div.clientHeight+"px"
			}
			span.textContent="{{msg.infoBoxHide}}"
		}
		div.onmouseout=()=>span.textContent=text
		div.onclick=()=>document.body.removeChild(div)
		document.body.appendChild(div)
	}
})
let navigated=false,
bypassed=false,
domain=location.hostname
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
var actualInitLbjs
ODP(window,"initLbjs",{
	set:(_)=>actualInitLbjs=_,
	get:()=>(a,p)=>{
		p.Countdown--
		actualInitLbjs(a,p)
	}
})
//Safelink
let actual_safelink=forced_safelink={counter:0,adblock:false}
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
domainBypass("hokiciki.org",()=>ifElement("a[href^='/get-link/']",a=>location.href=a.href))
domainBypass(/wadooo\.com|gotravelgo\.space|pantauterus\.me|liputannubi\.net/,()=>{
	crowdPath(location.hash.substr(1))
	crowdBypass()
})
domainBypass("lnk.news",()=>ifElement("#skip_form",f=>goToUrl(),ifElement("#display_go_form",f=>f.submit())))
hrefBypass(/uiz\.io\/go/,()=>{
	Object.freeze(location)
	const regex=/.*window\.location\.href = "(http[^"]+)";.*/
	document.querySelectorAll("script").forEach(script=>{
		let matches=regex.exec(script.textContent)
		console.log(matches)
		if(matches&&matches[1])
		{
			crowdPath(location.hash.substr(1))
			contributeAndNavigate(matches[1])
		}
	})
	bypassed=false
})
hrefBypass(/(prox77|agdd5br)\.com\/analyze\/(.+)/,m=>location.pathname="/result/"+m[2])
hrefBypass(/sfile\.(mobi|xyz)/,()=>{
	ODP(window,"downloadButton",{
		set:a=>{
			if(a&&a.href)
			{
				safelyNavigate(a.href)
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
		f.submit()
	}
})
domainBypass("linkduit.net",()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement("a#download[itemlink]",a=>{
		if(isGoodLink(a.getAttribute("itemlink")))
		{
			location.href=a.getAttribute("itemlink")
		}
	})
	awaitElement("a.mirror_link[href]",a=>safelyNavigate(a.href))
})
domainBypass("mispuani.xyz",()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement("button#buttondewa.mispuanibuttonlink",b=>b.onclick())
})
domainBypass("tik.lat",()=>{
	window.setInterval=f=>setInterval(f,1)
	awaitElement(".skip > .wait > .skip > .btn > a[href]",a=>safelyNavigate(a.href))
})
domainBypass(/linkvertise\.(com|net)|link-to\.net/,()=>{
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
		let xhr=new XMLHttpRequest(),
		script=document.querySelectorAll("script[src]"),
		url=script[script.length-1].src,
		o={timestamp:new Date().getTime()}
		const xhrget=f=>{
			xhr.onload=f
			xhr.open("GET",url)
			xhr.send()
		}
		xhrget(()=>{
			const regex=/random\:"([^"]+)"/
			let matches=regex.exec(xhr.responseText)
			if(matches&&matches[1])
			{
				o.random=matches[1]
				url="https://linkvertise.net/api/v1/redirect/link/static"+location.pathname
			}
			xhrget(()=>{
				let json=JSON.parse(xhr.responseText)
				if(json&&json.data.link.id)
				{
					o.link_id=json.data.link.id
					url="https://linkvertise.net/api/v1/redirect/link"+location.pathname+"/target?serial="+btoa(JSON.stringify(o))
				}
				xhrget(()=>{
					let json=JSON.parse(xhr.responseText)
					if(json&&json.data.target)
					{
						safelyNavigate(json.data.target)
					}
				})
			})
		})
		var div = document.createElement('div');
		div.id = "ogxzi8ZzrLy8S4zhUwyc3jPMlXi1h91bA0bASIiZtyT6cOTlX78HtEyXTK0WUGCY3CO8E4hBYI02ZD9mr7jit7R1YqPdkllJ";
		document.body.appendChild(div);
		setInterval(()=>{
			ifElement(".modal.show .web-close-btn",b=>b.click())
		},1000)
		setTimeout(()=>{
			document.querySelectorAll(".todo-block .todo").forEach(d=>d.click())
		},1000)
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
	window.setInterval=f=>setInterval(f,1)
	awaitElement("a#download[href]",a=>safelyNavigate(a.href))
})
//Insertion point 1 — insert bypasses running before the DOM is loaded above this comment
hrefBypass(/(njiir|healthykk|linkasm|dxdrive|getwallpapers)\.com|punchsubs\.net|k2s\.cc|muhammadyoga\.me|u\.to|skiplink\.io|firefaucet\.win\/l\/|emulator\.games\/download\.php/,()=>window.setInterval=f=>setInterval(f,1))
domainBypass(/(racaty|longfiles|filepuma|filehorse|portableapps)\.com|indishare\.org|datei\.to/,()=>window.setTimeout=f=>setTimeout(f,1))
if(bypassed)
{
	return
}
ensureDomLoaded(()=>{
	if(ignoreCrowdBypass)
	{
		document.querySelectorAll("form[action]").forEach(e=>e.action+="#ignoreCrowdBypass")
		document.querySelectorAll("a[href]").forEach(e=>e.href+="#ignoreCrowdBypass")
	}
	domainBypass("adfoc.us",()=>ifElement(".skip[href]",b=>safelyNavigate(b.href)))
	domainBypass("srt.am",()=>{
		if(document.querySelector(".skip-container"))
		{
			let f=document.createElement("form")
			f.method="POST"
			f.innerHTML='<input type="hidden" name="_image" value="Continue">'
			f=document.documentElement.appendChild(f)
			f.submit()
		}
	})
	domainBypass("bluemediafiles.com",()=>{
		if(typeof FinishMessage=="string"&&FinishMessage.indexOf("<a href=")>-1)
		{
			document.write(FinishMessage)
			safelyNavigate(document.querySelector("a").href)
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
				location.href=c.split(";url=")[1]
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
	domainBypass("1link.club",()=>{
		window.setInterval=f=>setInterval(f,1)
		let b=document.getElementById("go_next")
		if(b&&isGoodLink(b.href))
		{
			location.href=b.href
		}
		else
		{
			ifElement("#download",b=>safelyNavigate(b.href))
		}
	})
	hrefBypass(/4snip\.pw\/(out|decode)\//,()=>{
		let f=document.querySelector("form[action^='../out2/']")
		f.setAttribute("action",f.getAttribute("action").replace("../out2/","../outlink/"))
		f.submit()
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
		f.innerHTML='<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.substr(1)+'"><input type="hidden" name="fname" value="'+document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent+'"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">'
		f=document.documentElement.appendChild(f)
		f.submit()
		return finish()
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
	domainBypass("shirosafe.my.id",()=>{
		ifElement("meta[http-equiv='refresh'][content]",m=>{
			let c=m.content.replace(/'/g,"")
			if(c.indexOf(";url=")>-1)
			{
				safelyNavigate(c.split(";url=")[1])
			}
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
			location.href=params.get("predirect")
		}
		else if(params.has("bpredirect"))
		{
			location.href=atob(params.get("bpredirect"))
		}
	})
	domainBypass("daunshorte.teknologilink.com",()=>location.href=document.querySelector("a[href^='https://teknosafe.teknologilink.com/linkteknolink/safelinkscript.php?']").href)
	domainBypass("imgtaxi.com",()=>document.querySelector("a.overlay_ad_link").click())
	domainBypass("do2unlock.com",()=>{
		let a=document.querySelector("a#locked_action_link[href^='/getlink/']")
		if(a)
		{
			location.href="/redirect/"+a.getAttribute("href").substr(9)
			return
		}
		a=document.querySelector("a#redirecting_counter[href]")
		if(a)
		{
			safelyNavigate(a.href)
		}
	})
	domainBypass(/sub2unlock\.(com|net)/,()=>safelyNavigate(document.getElementById("theGetLink").textContent))
	domainBypass("haaretz.co.il",()=>{
		if(location.href.indexOf(".premium")>-1)
		{
			location.href=location.href.replace(".premium","")
		}
	})
	domainBypass("boostme.gg",()=>safelyNavigate(document.querySelector("a[href]#go").href))
	domainBypass("driverays.com",()=>safelyNavigate(document.querySelector("a#link[href]").href))
	domainBypass("wikitrik.com",()=>document.querySelector("#download > form[action='/getlink.php'] > input[type='submit'].button").click())
	domainBypass("dawnstation.com",()=>safelyNavigate(document.querySelector("#tidakakanselamanya.hiddenPlace > a").href))
	domainBypass("hokiwikiped.net",()=>ifElement("a#DrRO[href]",a=>safelyNavigate(a.href)))
	hrefBypass(/spaste\.com\/s\//,()=>{
		let doTheThing=()=>{
			let item=document.getElementById("currentCapQue").textContent,
			as = document.querySelectorAll(".markAnswer")
			for(let i = 0; i < as.length; i++)
			{
				if(as[i].querySelector("img").getAttribute("src").toLowerCase().indexOf(item)>-1)
				{
					as[i].click();
					break;
				}
			}
		}
		document.getElementById("captchaVerifiedStatus").click()
		setTimeout(()=>{
			doTheThing()
			setTimeout(()=>{
				doTheThing()
				setTimeout(()=>{
					doTheThing()
				}, 200)
			}, 200)
		}, 200)
	})
	domainBypass(/((get-click2|informations-library)\.blogspot|business\.ominfoupdate)\.com|pastikan\.me/,()=>{
		let u=aesCrypto.decrypt(convertstr(location.href.substr(location.href.indexOf("?o=")+3)),convertstr("root"))
		if(isGoodLink(u))
		{
			location.hash=""
			safelyNavigate(u)
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
		},()=>ifElement("frame[src^='interstitualAdTop.php?url=']",f=>location.href=f.src))
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
	domainBypass(/spacetica\.com|linkpoi\.in/,()=>ifElement("a.btn.btn-primary[href]",a=>safelyNavigate(a.href)))
	domainBypass("uiz.io",()=>{
		awaitElement("#go-adsredirect",f=>{
			f.action+="#"+location.pathname.substr(1)
			f.innerHTML+='<input name="go-adsredirect-submit">'
			f.submit()
		})
		bypassed=false
	})
	hrefBypass(/mirrored\.to\/files\//,()=>ifElement("#dl_form button",b=>b.click()))
	hrefBypass(/mirrored\.to\/downlink\//,()=>ifElement(".centered.highlight a[href]",a=>safelyNavigate(a.href)))
	hrefBypass(/new\.lewd\.ninja\/external\/game\/([0-9]+)\/([a-z0-9]{64})/,m=>{
		let f=document.createElement("form")
		f.method="POST"
		f.action="https://xxx.lewd.ninja/game/"+m[1]+"/out/"+m[2]
		f=document.body.appendChild(f)
		f.submit()
	})
	domainBypass("xxx.lewd.ninja",()=>safelyNavigate(document.body.textContent))
	domainBypass(/tr\.link|movienear\.me|lewat\.club/,()=>{
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
	domainBypass("toneden.io",()=>{
		awaitElement(".post-gate-btn",b=>{
			b.click()
			if(location.hash=="#done")
			{
				return
			}
			awaitElement(".post-support-footer",()=>{
				let _open=window.open
				window.open=()=>{}
				document.querySelectorAll(".post-support-options > .gate-btn-box > span > a").forEach(a=>{
					a.href="#"
					a.target=""
					a.click()
				})
				window.open=_open
				let dT=setInterval(()=>{
					if(!b.classList.contains("disabled"))
					{
						clearInterval(dT)
						location.hash="#done"
						location.reload()
					}
				},100)
			})
		})
	})
	domainBypass("st.flashsubs.web.id",()=>safelyNavigate(document.querySelector("a#proceed").href))
	domainBypass("short-url.link",()=>safelyNavigate(document.querySelector("div[align=center] > strong").textContent))
	domainBypass(/uploadrar\.(com|net)/,()=>{
		ifElement("#downloadbtn",()=>{
			let f=document.createElement("form")
			f.method="POST"
			f.innerHTML='<input name="op" value="download2"><input name="id" value="'+location.pathname.substr(1)+'">'
			document.body.appendChild(f)
			f.submit()
		})
	})
	domainBypass(/(prox77|agdd5br)\.com/,()=>document.querySelector("#Sbutton").click())
	domainBypass("kuliahmatematika.my.id",()=>safelyNavigate(atob(document.querySelector("input[name='data']").value)))
	domainBypass("shortconnect.com",()=>safelyNavigate(document.querySelector("#loader-link").href))
	domainBypass("elil.cc",()=>{
		crowdBypass()
		awaitElement(".navbar-custom > .container > ul.not-nav > li:not(.d-none) > a.page-scroll[href]:not([href^='javascript:'])",a=>contributeAndNavigate(a.href))
	})
	domainBypass("transmediakreatif.com",()=>ifElement("#download > a[href]",a=>location.href=a.href))
	domainBypass(/go\.indonesia-publisher\.id|ciustekno\.me/,()=>{
		if(typeof disqus_config=="function"&&document.querySelector("form#link-view"))
		{
			let o={page:{}}
			disqus_config.call(o)
			safelyNavigate(o.page.url)
		}
	})
	hrefBypass(/mirrorace\.com\/m\/[a-zA-Z0-9]+\/[0-9]+/,()=>location.href=document.querySelector("a[href*='"+location.search+"']:not([hidden]):not(.uk-hidden)").href)
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
	domainBypass("terbit21.club",()=>ifElement("a#downloadbutton[href]",a=>location.href=a.href))
	domainBypass("onepieceex.net",()=>ifElement("noscript",n=>safelyNavigate(n.textContent)))
	domainBypass("zflas.com",()=>{
		if(typeof _bh.decode=="function")
		{
			safelyNavigate(_bh.decode(location.href.substr(location.href.indexOf("?go=")+4)))
		}
	})
	domainBypass("felanovia.com",()=>ifElement("form",f=>f.submit()))
	domainBypass("redir.animenine.net",()=>ifElement("a#lanjutkeun[href]",a=>safelyNavigate(a.href)))
	hrefBypass(/download\.id\/downloadfile\//,()=>{
		if(typeof download=="function")
		{
			let div=document.createElement("div")
			div.id="link"
			div=document.body.appendChild(div)
			download()
			safelyNavigate(div.querySelector("a").href)
		}
	})
	hrefBypass(/squidssh\.com\/url\/go\.php/,()=>{
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
	domainBypass("pahe.in",()=>document.querySelectorAll("a.shortc-button.small[href^='https://pahe.in?dd1fa7bc42=']").forEach(a=>{
		let qe=a.previousElementSibling
		while(qe&&qe.tagName!="B")
		{
			qe=qe.previousElementSibling
		}
		a.href+="#bypassClipboard="+location.pathname.split("/").join("").split("-").join("")
		let ep=a.parentNode.querySelector("span[style] > b")
		if(ep!==null)
		{
			a.href+=ep.textContent.split(" ").join("").toLowerCase()
		}
		a.href+=qe.textContent+a.textContent.toLowerCase()
	}))
	domainBypass("wizardsubs.com",()=>document.querySelectorAll("a[href^='https://wizardsubs.com?408631a1f0=']").forEach(a=>{
		a.href+="#bypassClipboard="+location.pathname.split("/").join("").split("-").join("")+a.parentNode.textContent.split(":")[0].split(" ").join("").toLowerCase()
	}))
	domainBypass("channelmyanmar.org",()=>document.querySelectorAll("a[href^='https://channelmyanmar.org?1c17f28bf0=']").forEach(a=>{
		let qe=a.previousElementSibling
		while(qe&&qe.tagName!="H2")
		{
			qe=qe.previousElementSibling
		}
		a.href+="#bypassClipboard="+location.pathname.split("/").join("").split("-").join("")+qe.textContent.split(" ").join("").split("(").join("-").split(")").join("-").toLowerCase()+a.textContent.split(" ").join("").split("(").join("").split(")").join("").toLowerCase()
	}))
	hrefBypass(/stayonline\.pro\/l\/(.*)\//,m=>$.post(endpoint,{id:m[1],ref:""},r=>safelyNavigate(r.data.value)))
	hrefBypass(/nexusmods\.com\/.*\/mods\/[0-9]*\?tab=files&file_id=[0-9]*/,()=>ifElement("button#slowDownloadButton[data-download-url]",b=>safelyNavigate(b.getAttribute("data-download-url"))))
	domainBypass("xlink.cc",()=>safelyNavigate(JSON.parse(atob(window.bootstrapData)).linkResponse.link.long_url))
	domainBypass("1shortlink.com",()=>awaitElement("#redirect-link[data-href]",a=>safelyNavigate(a.getAttribute("data-href"))))
	domainBypass("multiup.org",()=>ifElement("form[target][onsubmit] button[type='submit']",b=>{
		const f=document.querySelector("form[target][onsubmit]")
		f.target="_self"
		f.onsubmit=""
		b.click()
	},()=>document.querySelectorAll("form > button[namehost]").forEach(e=>{
		let a=document.createElement("a")
		a.href=e.getAttribute("link")
		a.setAttribute("class",e.getAttribute("class"))
		a.innerHTML='<i class="fa fa-fw fa-download"></i>'+e.textContent
		e.closest("footer").replaceChild(a,e.parentNode)
	})))
	//Insertion point 2 — insert bypasses running after the DOM is loaded above this comment
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
				if((document.querySelector("img#pleasewait")&&document.querySelector(".wait"))
					||document.getElementById("download")
					||document.getElementsByTagName("style='margin-top:").length
				||document.querySelector(".Visit_Link")//yametesenpai.xyz
				||document.getElementById("daplong")//converthinks.xyz
				||document.querySelector(".eastsafelink")//anjay.info
				)
				{
					clearInterval(cLT)
					window.open=l=>safelyNavigate(l)
					changeLink()
				}
			},100)
		})
	}
	if(document.querySelector("form#landing"))
	{
		let f=document.querySelector("form#landing"),i
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
			i=location.search.split("?id=")[1]
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
	//Other Templates
	ifElement(".timed-content-client_show_0_30_0",d=>{//technicoz.com
		d.classList.remove("timed-content-client_show_0_30_0")
		d.style.display="block"
		domainBypass("technicoz.com",()=>{
			safelyNavigate(d.querySelector("a").href)
		})
		finish()
	})
	if(
		document.getElementById("getlink")&&document.getElementById("gotolink")&&(
	document.getElementById("timer")//tetewlink.me,vehicle-techno.cf#86
	||document.getElementById("count")//keisekaikuy.blogspot.com#493
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
	if(document.querySelector("a#btn-main.disabled")&&typeof Countdown=="function")//cpmlink.net
	{
		safelyNavigate(document.querySelector("a#btn-main.disabled").href)
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
	if(document.querySelector("script[src='https://duit.cc/js/jquery.1.8.3.js']"))
	{
		ifElement("input[type='hidden'][name='geturl'][value^='http']",i=>{
			safelyNavigate(i.value)
			finish()
		})
	}
	if(typeof adblock_message=="string"&&adblock_message.indexOf("mm1.ink")>-1&&typeof goto=="function")//mm1.ink#442
	{
		$=()=>({attr:(n,v)=>safelyNavigate(atob(v))})
		goto()
	}
	if(document.querySelector("#templatemo_footer > a[href='http://teknosafe.kertashitam.com/']")&&document.querySelector("#templatemo_content > div > a[href]"))//teknosafe.kertashitam.com,teknosafe.teknologilink.com
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
	},()=>domainBypass("seputarinfomenarik.com",()=>ifElement("a#hapus",a=>location.href=a.href)))
	let t=document.querySelector("title")
	if(!bypassed&&t)
	{
		t=t.textContent.trim()
		switch(t)
		{
			case"Viid.su":
			ifElement("button#link-success-button[data-url]",b=>{
				location.href=b.getAttribute("data-url")
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
		}
	}
	//Monitor DOM for disturbances for 10 seconds.
	let dT=setInterval(()=>{
		//Shorte.st Embed
		if(document.querySelector(".lay-sh.active-sh"))
		{
			let elm=document.querySelectorAll(".lay-sh.active-sh")[0]
			elm.parentNode.removeChild(elm)
		}
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
			domainBypass(/movienear\.me|lewat\.club/,()=>{
				ifElement("input[type='hidden'][name='alias'][value]",i=>{
					i.parentNode.action+="#"+i.value+(ignoreCrowdBypass?"#ignoreCrowdBypass":"")
					crowdPath(i.value)
				},()=>crowdPath(location.hash.substr(1)))
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
								let a=document.querySelector("a.get-link[href]:not([href='']):not(.disabled), .skip-ad a[href]:not([href=''])"),h
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
									clearInterval(cT)
									a.parentNode.removeChild(a)
									contributeAndNavigate(h)
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
			domainBypass(/123l\.pw|123link|oke\.io|linksht\.com/,()=>window.setInterval=f=>setInterval(f,1))
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
	},100)
	setTimeout(()=>clearInterval(dT),10000)
})
