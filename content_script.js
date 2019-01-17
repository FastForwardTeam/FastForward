//If you want to insert your own bypass, please search for "Insertion point"
if(document instanceof HTMLDocument)
{
	let brws=(typeof browser=="undefined"?chrome:browser)
	brws.storage.sync.get(["crowd_bypass_opt_out"],res=>{
		document.documentElement.setAttribute("data-crowd-bypass-opt",(res&&res.crowd_bypass_opt_out&&res.crowd_bypass_opt_out==="true"?"o":"i"))
	})
	brws.storage.local.get(["custom_bypasses"],res=>{
		let f=()=>{
			if(res&&res.custom_bypasses)
			{
				let customBypasses=JSON.parse(res.custom_bypasses)
				for(let name in customBypasses)
				{
					let customBypass=customBypasses[name]
					if(customBypass.domains=="*")
						injectScript(customBypass.content)
					else
					{
						let domains=customBypass.domains.split(",")
						for(let i in domains)
						{
							let domain=domains[i]
							if(location.hostname==domain||location.hostname.substr(location.hostname.length-(domain.length+1))=="."+domain)
								injectScript(customBypass.content)
						}
					}
				}
			}
		}
		if(["interactive","complete"].indexOf(document.readyState)>-1)
		{
			f()
		}
		else
		{
			document.addEventListener("DOMContentLoaded",f)
		}
	})
	brws.runtime.sendMessage({},response=>{
		let script=document.createElement("script")
		script.innerHTML=`(()=>{//Hello, this is Universal Bypass' injection!
		let crowdEnabled=`+(response.crowdEnabled?"true":"false")+`,
		ODP=(t,p,o)=>{try{Object.defineProperty(t,p,o)}catch(e){console.trace("[Universal Bypass] Couldn't define",p)}},
		//Copying eval, etc. to prevent issues with other extensions, such as uBlockOrigin. Also, note that this is the page level, so there are no security risks in using eval.
		ev=eval,sT=setTimeout,sI=setInterval,
		isGoodLink=link=>link&&link!=location.href&&link.substr(0,11)!="javascript:",
		navigated=false,
		unsafelyNavigate=target=>{
			if(navigated)
				return
			navigated=true
			location.href="https://universal-bypass.org/before-navigate?target="+encodeURIComponent(target)
			//The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
		},
		safelyNavigate=target=>{
			if(navigated||!isGoodLink(target))
			{
				return false
			}
			bypassed=true
			let url
			try{url=new URL(target)}catch(e){}
			if(!url||!url.hash)
			{
				target+=location.hash
			}
			window.onbeforeunload=null
			unsafelyNavigate(target)
			return true
		},
		bypassed=false,
		finish=()=>{
			bypassed=true
			document.documentElement.setAttribute("data-universal-bypass-stop-watching","")
		},
		domainBypass=(domain,f)=>{
			if(!bypassed&&(location.hostname==domain||location.hostname.substr(location.hostname.length-(domain.length+1))=="."+domain))
			{
				f()
				finish()
			}
		},
		hrefBypass=(regex,f)=>{
			if(!bypassed&&regex.test(location.href))
			{
				f()
				finish()
			}
		},
		ensureDomLoaded=f=>{
			if(["interactive","complete"].indexOf(document.readyState)>-1)
			{
				f()
			}
			else
			{
				document.addEventListener("DOMContentLoaded",()=>sT(f,1))
			}
		},
		crowdBypass=f=>{
			if(crowdEnabled)
			{
				if(location.href.substr(location.href.length-18)=="#ignoreCrowdBypass")
				{
					document.querySelectorAll("form[action]").forEach(e=>e.action+="#ignoreCrowdBypass")
					document.querySelectorAll("a[href]").forEach(e=>e.href+="#ignoreCrowdBypass")
					history.pushState({},document.querySelector("title").textContent,location.href.substr(0,location.href.length-18))
					f()
				}
				else
				{
					let xhr=new XMLHttpRequest()
					xhr.onreadystatechange=()=>{
						if(xhr.readyState==4&&xhr.status==200&&xhr.responseText!="")
						{
							location.href="https://universal-bypass.org/crowd-bypassed?target="+encodeURIComponent(xhr.responseText)+"&back="+encodeURIComponent(location.href)
							//The background script will intercept the request and redirect to html/crowd-bypassed.html because we can't redirect to extension urls in this scope.
						}
						else
						{
							f()
						}
					}
					xhr.open("POST","https://universal-bypass.org/crowd/query_v1",true)
					xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
					xhr.send("domain="+encodeURIComponent(domain)+"&path="+encodeURIComponent(location.pathname.toString().substr(1)))
				}
			}
		},
		contributeAndNavigate=target=>{
			if(!navigated&&isGoodLink(target))
			{
				if(crowdEnabled)
				{
					let xhr=new XMLHttpRequest()
					xhr.onreadystatechange=()=>{
						if(xhr.readyState==4)
						{
							unsafelyNavigate(target)
						}
					}
					xhr.open("POST","https://universal-bypass.org/crowd/contribute_v1",true)
					xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
					xhr.send("domain="+encodeURIComponent(domain)+"&path="+encodeURIComponent(location.pathname.toString().substr(1))+"&target="+encodeURIComponent(target))
				}
				else
				{
					unsafelyNavigate(target)
				}
			}
		},
		domain=location.hostname
		if(domain.substr(0,4)=="www.")
		{
			domain=domain.substr(4)
		}
		ODP(window,"blurred",{
			value:false,
			writable:false
		})
		//adf.ly
		ODP(window,"ysmm",
		{
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
			}
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
		let actual_safelink=forced_safelink={counter:0}
		ODP(window,"safelink",
		{
			set:_=>{
				ODP(window,"blurred",{
					value:false,
					writable:false
				})
				for(let k in _)
				{
					if(forced_safelink[k]===undefined)
					{
						actual_safelink[k]=_[k]
					}
				}
			},
			get:()=>actual_safelink
		})
		for(let key in forced_safelink)
		{
			ODP(safelink,key,
			{
				writable:false,
				value:forced_safelink[key]
			})
		}
		//YetiShare
		let actual_web_root
		ODP(window,"WEB_ROOT",{
			set:v=>{
				ODP(window,"seconds",{
					value:0,
					writable:false
				})
				actual_web_root=v
			},
			get:()=>actual_web_root
		})
		hrefBypass(/ur\\.ly|urly\\.mobi/,()=>{
			if(location.pathname.length>2&&location.pathname.substr(0,6)!="/goii/")
				safelyNavigate("/goii/"+location.pathname.substr(2)+"?ref="+location.hostname+location.pathname)
		})
		hrefBypass(/universal-bypass\\.org\\/firstrun/,()=>{
			location.href="https://universal-bypass.org/firstrun?1"
		})
		domainBypass("cshort.org",()=>{
			ODP(window,"adblock",{
				value:false,
				writable:false
			})
			ODP(window,"i",{
				value:0,
				writable:false
			})
			ensureDomLoaded(()=>
			{
				let lT=sI(()=>
				{
					if(document.querySelector(".next[href]"))
					{
						clearInterval(lT)
						safelyNavigate(atob(atob(document.querySelector(".next[href]").getAttribute("href"))))
					}
				},100)
			})
		})
		domainBypass("link.tl",()=>{
			ODP(window,"countdown",{
				value:0,
				writable:false
			})
			let lT=sI(()=>
			{
				if(document.querySelector(".skip > .btn"))
				{
					clearInterval(lT)
					document.querySelector(".skip > .btn").click()
				}
			},100)
		})
		domainBypass("onepiece-ex.com.br",()=>{
			ODP(window,"seconds",{
				value:1,
				writable:false
			})
			let lT=sI(()=>{
				if(document.getElementById("continuar"))
				{
					clearInterval(lT)
					safelyNavigate(document.getElementById("continuar").href)
				}
			},100)
		})
		domainBypass("akoam.net",()=>{
			ODP(window,"timer",{
				value:0,
				writable:false
			})
			let lT=sI(()=>{
				if(document.querySelector(".download_button"))
				{
					clearInterval(lT)
					safelyNavigate(document.querySelector(".download_button").href)
				}
			},100)
		})
		hrefBypass(/1v\\.to\\/t\\/.*/,()=>{
			location.pathname=location.pathname.split("/t/").join("/saliendo/")
		})
		domainBypass("share-online.biz",()=>{
			ODP(window,"wait",{
				set:s=>0,
				get:()=>{
					return 2
				}
			})
		})
		hrefBypass(/sfile\\.(mobi|xyz)/,()=>{
			ODP(window,"downloadButton",{
				set:b=>{
					if(b&&b.href)
						safelyNavigate(b.href)
				}
			})
		})
		domainBypass("mylink.zone",()=>{
			ODP(window,"seconde",{
				set:_=>{},
				get:()=>{
					return -1
				}
			})
		})
		domainBypass("sourceforge.net",()=>{
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
				let bT=sI(()=>{
					if(d)
						clearInterval(bT)
					else b.click()
				},100)
		})
	})
	domainBypass("bc.vc",()=>{
		window.setInterval=f=>sI(f,800)
		crowdBypass(()=>{
			window.eval=c=>{
				let j=ev(c)
				if(j.message&&j.message.url)
				{
					contributeAndNavigate(j.message.url)
					return{}
				}
				return j
			}
		})
		let sT=setInterval(()=>{
			let a=document.querySelector(".skip_btt > #skip_btt")
			if(a)
			{
				clearInterval(sT)
				a.click()
			}
		},50)
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
			xhr.onreadystatechange=()=>{
				if(xhr.readyState==4&&xhr.status==200)
					safelyNavigate(xhr.responseText)
			}
			xhr.open("POST","https://www.shortly.xyz/getlink.php",true)
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
			xhr.setRequestHeader("X-Requested-With","XMLHttpRequest")
			xhr.send("id="+location.hash.replace("#",""))
		}
	})
	hrefBypass(/emulator\\.games\\/download\\.php/,()=>{
		window.setInterval=f=>sI(f,1)
	})
	domainBypass("noriskdomain.com",()=>{
		let s=new URLSearchParams(location.search)
		if(s.has("u"))
			safelyNavigate(atob(s.get("u")))
	})
	//Insertion point 1 — insert bypasses running before the DOM is loaded above this comment
	if(bypassed)
	{
		return
	}
	ensureDomLoaded(()=>{
		domainBypass("adfoc.us",()=>{
			let b=document.querySelector(".skip[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("sub2unlock.com",()=>{
			if(location.pathname.substr(0,10)=="/link/get/")
			{
				safelyNavigate(document.getElementById("link").href)
			}
			else
			{
				let f=document.getElementById("getLinkNow")
				if(f)
					document.getElementById("getLinkNow").submit()
			}
		})
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
		domainBypass("admy.link",()=>{
			let f=document.querySelector(".edit_link")
			if(f)
				f.submit()
		})
		domainBypass("ysear.ch",()=>{
			let b=document.querySelector("#NextVideo[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("1ink.cc",()=>{
			if(typeof SkipAd=="function")
				SkipAd()
		})
		domainBypass("losstor.com",()=>{
			let b=document.getElementById("re_link")
			if(b)
			{
				window.open=safelyNavigate
				b.click()
			}
		})
		domainBypass("bagisoft.net",()=>{
			let b=document.getElementById("makingdifferenttimer")
			if(b)
			{
				window.open=safelyNavigate
				b.click()
			}
			else
				jQuery.prototype.animateProgress=(p,f)=>f()
		})
		domainBypass("skinnycat.net",()=>{
			let b=document.querySelector("#dl[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("fshare.vn",()=>{
			if("$" in window)
			{
				let f=$("#form-download")
				if(f.length)
				{
					$.ajax({
						"url":f.attr("action"),
						"type":"POST",
						"data":f.serialize()
					}).done(data=>safelyNavigate(data.url))
				}
			}
		})
		domainBypass("dwindly.io",()=>{
			let b=document.getElementById("btd1")
			if(b)
			{
				window.open=()=>{}
				b.click()
			}
			else
			{
				b=document.getElementById("btd")
				if(b)
				{
					window.open=safelyNavigate
					ev("("+b.onclick.toString().split(";")[0]+"})()")
				}
			}
		})
		domainBypass("bluemediafiles.com",()=>{
			if(typeof FinishMessage=="string"&&FinishMessage.indexOf("<a href=")>-1)
			{
				//The FinishMessage string contains the HTML anchor element needed to get to the destination so we just replace the entire website with it because we don't need any of the other content anymore.
				document.write(FinishMessage)
				document.querySelector("a").click()
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
			setInterval(()=>clearInterval(bT),10000)
		})
		domainBypass("hidelink.club",()=>{
			if(hash)
				safelyNavigate(decodeURIComponent(atob(hash)).replace("%23", "#"))
		})
		domainBypass("won.pe",()=>
		{
			if(document.querySelector(".captcha_loader .progress-bar"))
				document.querySelector(".captcha_loader .progress-bar").setAttribute("aria-valuenow","100")
		})
		domainBypass("stealive.club",()=>{
			if(document.getElementById("counter"))
				document.getElementById("counter").innerHTML="0"
		})
		hrefBypass(/((binerfile|pafpaf)\\.info)|(kurosafety\\.menantisenja\\.com)/,()=>{//KuroSafe
			let b=document.querySelector("#mybutton[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("gotoo.loncat.in",()=>{
			let a=document.querySelector("a[href^='http://gotoo.loncat.in/go.php?open=']")
			if(a)
				safelyNavigate(a.href)
		})
		domainBypass("id-share19.com",()=>window.setTimeout=(f)=>sT(f,1))
		domainBypass("idnation.net",()=>{
			let b=document.querySelector("#linko[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("mazika2day.com",()=>{
			let b=document.querySelector(".linkbtn[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("ux9.de",()=>{
			let m=document.querySelector("meta[http-equiv='refresh'][content]")
			if(m&&m.getAttribute("content").indexOf(";url=http")>-1)
			safelyNavigate(m.getAttribute("content").split(";url=")[1])
		})
		domainBypass("telolet.in",()=>{
			let b=document.querySelector("a#skip[href]")
			if(!b)
				b=document.querySelector(".redirect_url > a[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("vipdirect.cc",()=>{
			if(typeof ab=="number"&&typeof asdf=="function")
			{
				ab=5
				window.open=safelyNavigate
				asdf()
			}
		})
		domainBypass("rapidcrypt.net",()=>{
			let b=document.querySelector(".push_button.blue[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("shrink-service.it",()=>{
			if(typeof $=="function"&&typeof $.ajax=="function"&&typeof screenApi=="function")
			{
				let _a=$.ajax
				$.ajax=a=>(a.data&&a.data.set_one?safelyNavigate(atob(a.data.set_one)):_a(a))
				screenApi()
			}
		})
		domainBypass("rom.io",()=>crowdBypass(()=>{
			let cT=setInterval(()=>{
				let a=document.querySelector("a.final-button[href]")
				if(a&&isGoodLink(a.href))
				{
					clearInterval(cT)
					a.parentNode.removeChild(a)
					contributeAndNavigate(a.href)
				}
			},50)
		}))
		domainBypass("show.co",()=>{
			let s=document.getElementById("show-campaign-data")
			if(s)
			{
				let d=JSON.parse(s.textContent)
				if(d&&"title"in d&&"unlockable"in d)
				{
					document.write("<body></body>")
					if("title"in d)
						["title","h1"].forEach(t=>{
							let e=document.createElement(t)
							e.textContent=d.title
							document.body.appendChild(e)
						})
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
			domainBypass("runtyurl.com",()=>{
				let b=document.getElementById("go_next")
				if(b&&isGoodLink(b.href))
				{
					location.href=b.href
				}
				else
				{
					b=document.getElementById("download")
					if(b)
					{
						safelyNavigate(b.href)
					}
				}
			})
			hrefBypass(/4snip\\.pw\\/out\\//,()=>{
				let f=document.querySelector("form[action^='../out2/']")
				f.setAttribute("action",f.getAttribute("action").replace("../out2/","../outlink/"))
				f.submit()
			})
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
			//SafelinkU
			if(typeof app_vars=="object"&&document.querySelector("b[style='color: #3e66b3']")&&document.querySelector("b[style='color: #3e66b3']").textContent=="SafelinkU")
			{
				window.setInterval=(f)=>sI(f,10)
				return finish()
			}
			//GemPixel Premium URL Shortener
			if(typeof appurl!="undefined"&&typeof token!="undefined")
			{
				document.querySelectorAll("script").forEach(script=>{
					if(script instanceof HTMLScriptElement)
					{
						let cont=script.textContent,start=cont.indexOf('clearInterval(countdown);window.location="')
						if(start>-1&&cont.indexOf('";}count--;}, 1000)')>-1)
						{
							safelyNavigate(cont.substr(start+42).split('";}count--;}, 1000)')[0])
						}
					}
				})
			}
			//Soralink Wordpress Plugin
			if(document.querySelector(".sorasubmit"))
			{
				document.querySelector(".sorasubmit").click()
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
			if(typeof changeLink=="function")
			{
				let cLT=sI(()=>{
					if((document.querySelectorAll("img#pleasewait").length&&document.querySelector(".wait"))
						||document.getElementById("showlink")
					||document.getElementById("download")
					||document.getElementsByTagName("style='margin-top:").length
					||document.querySelector(".Visit_Link")//yametesenpai.xyz
					||document.getElementById("daplong")//converthinks.xyz
					)
					{
						clearInterval(cLT)
						window.open=safelyNavigate
						if(typeof changeLink=="function")
							changeLink()
						else if(document.getElementById("link-download"))//hightech.web.id
							safelyNavigate(document.getElementById("link-download").href)
					}
				},100)
			}
			//Safelink Wordpress Plugin
			if(document.querySelector(".wp-safelink-button"))
			{
				window.setInterval=f=>sI(f,1)
				let lT=sI(()=>{
					if(document.querySelector(".wp-safelink-button.wp-safelink-success-color"))
					{
						clearInterval(lT)
						window.open=safelyNavigate
						document.querySelector(".wp-safelink-button.wp-safelink-success-color").click()
					}
				},100)
			}
			if(document.getElementById("wpsafe-generate")&&typeof wpsafegenerate=="function")
			{
				let a=document.querySelector("#wpsafegenerate > #wpsafe-link > a[href]")
				if(a)
				{
					safelyNavigate(a.href)
					return finish()
				}
				else
				{
					let s=new URLSearchParams(location.search)
					if(s.has("go"))
					{
						if(safelyNavigate(atob(s.get("go"))))
							return finish()
					}
					else if(location.pathname.toString().substr(0,4)=="/go/")
					{
						search=atob(location.pathname.toString().substr(4))
						if(search.substr(0,4)=="http")
						{
							safelyNavigate(search)
							return finish()
						}
					}
				}
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
			//Other Templates
			if(document.querySelector(".timed-content-client_show_0_30_0"))//technicoz.com
			{
				document.querySelector(".timed-content-client_show_0_30_0").classList.remove("timed-content-client_show_0_30_0")
				return finish()
			}
			if(document.getElementById("getlink")&&document.getElementById("gotolink")&&document.getElementById("timer"))//tetewlink.me,vehicle-techno.cf
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
			if(document.querySelector("a#btn-main.disabled")&&typeof Countdown=="function")//Croco,CPMLink,Sloomp.space
			{
				safelyNavigate(document.querySelector("a#btn-main.disabled").href)
				return finish()
			}
			if(document.querySelector("a.redirectBTN.disabled")&&document.querySelector(".timer"))//Arablionz.online
			{
				safelyNavigate(document.querySelector("a.redirectBTN.disabled").href)
				return finish()
			}
			if(document.querySelector(".shortened_link a[href][ng-href][target='_blank']"))//Go2to.com,Go2too.com,Golink.to
			{
				safelyNavigate(document.querySelector(".shortened_link a[href][ng-href][target='_blank']").href)
			}
			if(document.querySelector("form#skip")&&document.getElementById("btn-main")&&!document.querySelector(".g-recaptcha"))
			{
				document.querySelector("form#skip").submit()
				return finish()
			}
			if(document.getElementById("countdown")&&document.querySelector(".seconds"))
			{
				let doBypass=true
				domainBypass("mexashare.com",()=>doBypass=false)
				domainBypass("up-4.net",()=>doBypass=false)
				domainBypass("file-upload.com",()=>doBypass=false)
				if(doBypass)
				{
					document.querySelector(".seconds").textContent="0"
				}
				return finish()
			}
			if(document.querySelector("#ddl #download_link .btn"))
			{
				window.open=safelyNavigate
				document.querySelector("#ddl #download_link > .btn").click()
				return finish()
			}
			if(typeof file_download=="function")//2speed.net
			{
				window.setInterval=f=>sI(f,1)
				return finish()
			}
			if(document.querySelector("input[type=\\"submit\\"][name=\\"method_free\\"]"))
			{
				document.querySelector("input[type=\\"submit\\"][name=\\"method_free\\"]").click()
				return finish()
			}
			if(document.getElementById("frmdlcenter")&&document.getElementById("pay_modes"))//elsfile.org
			{
				let form=document.createElement("form")
				form.method="POST"
				form.innerHTML='<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.toString().substr(1)+'"><input type="hidden" name="fname" value="'+document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent+'"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">'
				form=document.documentElement.appendChild(form)
				form.submit()
				return finish()
			}
			let i=document.querySelector("input[name='op'][value^='download']")//nowvideo.club,vidto.stream
			if(i&&i.parentNode.tagName=="FORM")
			{
				let b=document.querySelector("b.err")
				if(!b||b.textContent!="Skipped countdown")//deltabit.co
				{
					i.parentNode.submit()
					return finish()
				}
			}
			if(document.querySelector("a[href^='https://linkshrink.net/homepage'] > img.lgo"))//LinkShrink.net
			{
				let p=document.getElementById("pause"),s=document.getElementById("skip")
				if(p&&s)
				{
					//Automating the click seems to not always work due to ads so we're only skipping the timer
					p.style.display="none"
					s.style.display="block"
				}
			}
			if(document.querySelector(".img-responsive[alt='Gets URL']")&&typeof x!="undefined")//GetsURL.com
			{
				let b=document.getElementById("link")
				if(b)
				{
					safelyNavigate(b.href+"&ab"+x)
					return finish()
				}
			}
			if(document.querySelector(".top-bar a[href='https://linkvertise.net']")&&typeof app!="undefined"&&app.handleRedirect)//Linkvertise.net
			{
				app.countdown=0
				$.post=(u,c)=>c()
				app.handleRedirect()
			}
			if(document.querySelectorAll("img[src='/assets/img/logo.png'][alt='Openload']").length)//OpenLoad
			{
				if(typeof secondsdl!="undefined")
				{
					secondsdl=0
				}
				return finish()
			}
			//SafeLinkReview.com
			if(document.querySelector(".navbar-brand")&&document.querySelector(".navbar-brand").textContent.trim()=="Safe Link Review"&&document.querySelector(".button.green"))
			{
				window.open=safelyNavigate
				document.querySelector(".button.green").click()
				return finish()
			}
			if(location.hostname=="decrypt2.safelinkconverter.com"&&document.querySelector(".redirect_url > div[onclick]"))
			{
				window.open=safelyNavigate
				document.querySelector(".redirect_url > div[onclick]").click()
				return finish()
			}
			let t=document.querySelector("title")
			if(t)
			{
				if(t.textContent.trim()=="Viid.su")//Viid.su
				{
					let b=document.getElementById("link-success-button")
					if(b&&b.getAttribute("data-url"))
					{
						safelyNavigate(b.getAttribute("data-url"))
						return finish()
					}
				}
			}
			//Monitor DOM for disturbances for 3 seconds.
			let dT=sI(()=>{
				//Shorte.st Embed
				if(document.querySelector(".lay-sh.active-sh"))
				{
					let elm=document.querySelectorAll(".lay-sh.active-sh")[0]
					elm.parentNode.removeChild(elm)
				}
				//AdLinkFly
				if(typeof app_vars=="object")
				{
					document.documentElement.setAttribute("data-universal-bypass-adlinkfly-info","")
					let iT=setInterval(()=>{
						if(document.documentElement.hasAttribute("data-universal-bypass-adlinkfly-target"))
						{
							clearInterval(iT)
							let t=document.documentElement.getAttribute("data-universal-bypass-adlinkfly-target")
							if(t=="")
							{
								crowdBypass(()=>{
									let cT=setInterval(()=>{
										let a=document.querySelector("a.get-link")
										if(!a)
										{
											a=document.querySelector(".skip-ad a[href]")
										}
										if(a)
										{
											h=a.href
											if(!isGoodLink(h)&&a.hasAttribute("data-href"))//cuio.io
											{
												h=a.getAttribute("data-href")
											}
											if(isGoodLink(h))
											{
												clearInterval(cT)
												a.parentNode.removeChild(a)
												contributeAndNavigate(h)
											}
										}
									},50)
								})
							}
							else
							{
								contributeAndNavigate(t)
							}
						}
					},50)
					domainBypass("oke.io",()=>window.setInterval=f=>sI(f,1))
					clearInterval(dT)
					finish()
				}
			},100)
			setTimeout(()=>{
				clearInterval(dT)
				finish()
			},3000)
		})`
		let dO=new MutationObserver(mutations=>{
			if(document.documentElement.hasAttribute("data-universal-bypass-adlinkfly-info"))
			{
				document.documentElement.removeAttribute("data-universal-bypass-adlinkfly-info")
				let xhr=new XMLHttpRequest(),t="",iu=location.href
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
									t=decodeURIComponent(url.search.split("url=")[1].split("&")[0])
							}
						}
						document.documentElement.setAttribute("data-universal-bypass-adlinkfly-target",t)
					}
				}
				if(iu.substr(iu.length - 1) != "/")
				{
					iu += "/"
				}
				xhr.open("GET", iu+"info", true)
				xhr.send()
			}
			else if(document.documentElement.hasAttribute("data-universal-bypass-stop-watching"))
			{
				document.documentElement.removeAttribute("data-universal-bypass-stop-watching")
				dO.disconnect()
			}
		});
		dO.observe(document.documentElement, {attributes: true})
		script.innerHTML+="\n"+response.userscript+"\n})()"
		script=document.documentElement.appendChild(script)
		setTimeout(()=>document.documentElement.removeChild(script),10)
	})
}
