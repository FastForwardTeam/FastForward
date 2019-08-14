//If you want to insert your own bypass, please search for "Insertion point"
if(document instanceof HTMLDocument)
{
	let brws = (typeof browser == "undefined" ? chrome : browser)
	brws.runtime.sendMessage({type: "can-run"}, res => {
		if(!res.enabled)
		{
			return
		}
		let script=document.createElement("script")
		script.innerHTML=`(()=>{
			const crowdEnabled=`+(res.crowdEnabled?"true":"false")+`,
			ODP=(t,p,o)=>{try{Object.defineProperty(t,p,o)}catch(e){console.trace("[Universal Bypass] Couldn't define",p)}},
			//Copying eval, etc. to prevent issues with other extensions, such as uBlockOrigin. Also, note that this is the page level, so there are no security risks in using eval.
			eval=window.eval,setTimeout=window.setTimeout,setInterval=window.setInterval,
			transparentProperty=(name,valFunc)=>{
				let real
				ODP(window,name,{
					set:_=>real=_,
					get:()=>valFunc(real)
				})
			}
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
				unsafelyNavigate(target)
				return true
			},
			finish=()=>{
				bypassed=true
				document.documentElement.setAttribute("data-universal-bypass-stop-watching","")
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
						f()
					}
				}
				else if("test" in domain)
				{
					if(domain.test(location.hostname))
					{
						f()
					}
				}
				else
				{
					console.error("[Universal Bypass] Invalid domain:",domain)
				}
			},
			hrefBypass=(regex,f)=>{
				if(!bypassed&&regex.test(location.href))
				{
					f()
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
				if(crowdEnabled)
				{
					document.documentElement.setAttribute("data-universal-bypass-crowd-path",p)
				}
			},
			crowdBypass=f=>{
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
						document.documentElement.setAttribute("data-universal-bypass-crowd-query","")
						let iT=setInterval(()=>{
							if(document.documentElement.hasAttribute("data-universal-bypass-crowd-queried"))
							{
								clearInterval(iT)
								document.documentElement.removeAttribute("data-universal-bypass-crowd-queried")
								f()
							}
						},20)
					}
				}
			},
			contributeAndNavigate=target=>{
				if(!navigated&&isGoodLink(target))
				{
					if(crowdEnabled)
					{
						document.documentElement.setAttribute("data-universal-bypass-crowd-contribute",target)
						setTimeout(()=>{
							unsafelyNavigate(target)
						},10)
					}
					else
					{
						unsafelyNavigate(target)
					}
				}
			}
			var navigated=false,
			bypassed=false,
			ignoreCrowdBypass=false,
			domain=location.hostname
			if(domain.substr(0,4)=="www.")
			{
				domain=domain.substr(4)
			}
			if(location.href.substr(location.href.length-18)=="#ignoreCrowdBypass")
			{
				ignoreCrowdBypass=true
				history.pushState({},document.querySelector("title").textContent,location.href.substr(0,location.href.length-18))
				ensureDomLoaded(()=>{
					document.querySelectorAll("form[action]").forEach(e=>e.action+="#ignoreCrowdBypass")
					document.querySelectorAll("a[href]").forEach(e=>e.href+="#ignoreCrowdBypass")
				})
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
			let actual_safelink=forced_safelink={counter:0,adblock:false}
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
				get:()=>{
					awaitElement(".bagi .link > .result > a[href]",a=>safelyNavigate(a.href))
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
			//Shorte.st
			transparentProperty("reqwest",r=>(typeof app!="undefined"&&document.querySelector(".skip-add-container .first-img[alt='Shorte.st']"))?a=>{
				if(a.type==="jsonp")
				{
					a.success=s=>contributeAndNavigate(s.destinationUrl)
				}
				r(a)
			}:r)
			domainBypass(/ur\\.ly|urly\\.mobi/,()=>{
				if(location.pathname.length>2&&location.pathname.substr(0,6)!="/goii/")
					safelyNavigate("/goii/"+location.pathname.substr(2)+"?ref="+location.hostname+location.pathname)
			})
			hrefBypass(/universal-bypass\\.org\\/firstrun/,()=>{
				location.href="https://universal-bypass.org/firstrun?1"
			})
			domainBypass("onepiece-ex.com.br",()=>{
				ODP(window,"seconds",{
					value:1,
					writable:false
				})
				awaitElement("#continuar[href]",a=>safelyNavigate(a.href))
			})
			domainBypass("akoam.net",()=>{
				ODP(window,"timer",{
					value:0,
					writable:false
				})
				awaitElement(".download_button[href]",a=>safelyNavigate(a.href))
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
			domainBypass("bc.vc",()=>{
				crowdBypass(()=>{
					window.eval=c=>{
						let j=eval(c)
						if(j.message&&j.message.url)
						{
							contributeAndNavigate(j.message.url)
							return{}
						}
						return j
					}
				})
				awaitElement(".skip_btt > #skip_btt",a=>a.click())
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
					xhr.send("id="+location.hash.replace("#",""))
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
			domainBypass(/mylinks\\.xyz|mylink\\.zone/,()=>{
				window.setTimeout=f=>setTimeout(f,1)
				awaitElement("#compteur a[href]",a=>safelyNavigate(new URL(a.href).searchParams.get("url")))
			})
			domainBypass(/shortmoz\\.link|skinnycat\\.org|safelink\\.polrec\\.site/,()=>{
				window.setInterval=f=>setInterval(f,1)
				awaitElement("a.btn.redirect[href^='http']",a=>safelyNavigate(a.href))
			})
			domainBypass("gamesmega.net",()=>{
				ODP(window,"hash",{
					get:()=>"",
					set:_=>safelyNavigate(decodeURIComponent(atob(_)))
				})
			})
			//Insertion point 1 — insert bypasses running before the DOM is loaded above this comment
			hrefBypass(/njiir\\.com|linkduit\\.net|k2s\\.cc|1link\\.club|cshort\\.(org|xyz)|muhammadyoga\\.me|u\\.to|skiplink\\.io|healthykk\\.com|punchsubs\\.net|linkasm\\.com|firefaucet\\.win\\/l\\/|emulator\\.games\\/download\\.php|2speed\\.net\\/file\\//,()=>{
				window.setInterval=f=>setInterval(f,1)
			})
			domainBypass(/uploadrar\\.com|longfiles\\.com|datei\\.to|id-share19\\.com/,()=>{
				window.setTimeout=f=>setTimeout(f,1)
			})
			if(bypassed)
			{
				return
			}
			ensureDomLoaded(()=>{
				domainBypass("adfoc.us",()=>{
					ifElement(".skip[href]",b=>safelyNavigate(b.href))
				})
				domainBypass("sub2unlock.com",()=>{
					if(location.pathname.substr(0,10)=="/link/get/")
					{
						safelyNavigate(document.getElementById("link").href)
					}
					else ifElement("#getLinkNow",f=>f.submit())
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
					ifElement(".edit_link",f=>f.submit())
				})
				domainBypass("ysear.ch",()=>{
					ifElement("#NextVideo[href]",b=>safelyNavigate(b.href))
				})
				domainBypass(/1ink\\.(cc|live)/,()=>{
					if(typeof SkipAd=="function")
					{
						SkipAd()
					}
				})
				domainBypass("losstor.com",()=>{
					ifElement("#re_link",b=>{
						window.open=safelyNavigate
						b.click()
					})
				})
				domainBypass("dwindly.io",()=>{
					ifElement("#btd1",b=>{
						window.open=()=>{}
						b.click()
					},()=>ifElement("#btd",b=>{
						window.open=safelyNavigate
						eval("("+b.onclick.toString().split(";")[0]+"})()")
					}))
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
					setInterval(()=>clearInterval(bT),30000)
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
				domainBypass("gotoo.loncat.in",()=>{
					ifElement("a[href^='http://gotoo.loncat.in/go.php?open=']",a=>safelyNavigate(a.href))
				})
				domainBypass("idnation.net",()=>{
					ifElement("#linko[href]",b=>safelyNavigate(b.href))
				})
				domainBypass("mazika2day.com",()=>{
					ifElement(".linkbtn[href]",b=>safelyNavigate(b.href))
				})
				domainBypass(/ux9\\.de|pucuktranslation\\.pw/,()=>{
					ifElement("meta[http-equiv='refresh'][content]",m=>{
						if(m.content.indexOf(";url=http") > -1)
						{
							safelyNavigate(m.content.split(";url=")[1])
						}
						else if(m.content.indexOf("; url=http") > -1)
						{
							safelyNavigate(m.content.split("; url=")[1])
						}
					})
				})
				domainBypass("telolet.in",()=>{
					let b=document.querySelector("a#skip[href]")
					if(!b)
					{
						b=document.querySelector(".redirect_url > a[href]")
					}
					if(b)
					{
						safelyNavigate(b.href)
					}
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
					ifElement(".push_button.blue[href]",b=>safelyNavigate(b.href))
				})
				domainBypass("shrink-service.it",()=>{
					if(typeof $=="function"&&typeof $.ajax=="function"&&typeof screenApi=="function")
					{
						let _a=$.ajax
						$.ajax=a=>(a.data&&a.data.set_one?safelyNavigate(atob(a.data.set_one)):_a(a))
						screenApi()
					}
				})
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
				domainBypass("runtyurl.com",()=>{
					let b=document.getElementById("go_next")
					if(b&&isGoodLink(b.href))
					{
						location.href=b.href
					}
					else ifElement("#download",b=>safelyNavigate(b.href))
				})
				hrefBypass(/4snip\\.pw\\/out\\//,()=>{
					let f=document.querySelector("form[action^='../out2/']")
					f.setAttribute("action",f.getAttribute("action").replace("../out2/","../outlink/"))
					f.submit()
				})
				domainBypass(/douploads\\.(com|net)/,()=>{
					ifElement(".seconds",s=>{
						s.textContent="1"
						document.getElementById("chkIsAdd").checked=false
						document.getElementById("downloadBtnClick").style.display="none"
						document.getElementById("downloadbtn").style.display="block"
					})
				})
				domainBypass("elsfile.org",()=>{
					let form=document.createElement("form")
					form.method="POST"
					form.innerHTML='<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.substr(1)+'"><input type="hidden" name="fname" value="'+document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent+'"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">'
					form=document.documentElement.appendChild(form)
					form.submit()
					return finish()
				})
				domainBypass("goou.in",()=>{
					ifElement("div#download_link > a#download[href]",a=>a.href)
				})
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
				domainBypass("shirosafe.web.id",()=>{
					safelyNavigate(document.querySelector("#generate > center > a[style]").href)
				})
				domainBypass("binbox.io",()=>{
					let xhr=new XMLHttpRequest()
					xhr.onload=()=>{
						let json=JSON.parse(xhr.responseText)
						if(json.paste)
						{
							safelyNavigate(json.paste.url)
						}
					}
					xhr.open("GET",location.pathname+".json")
					document.cookie="referrer=1"
					xhr.send()
				})
				domainBypass(/ouo\\.(io|press)/,()=>{
					if(location.pathname.substr(0,4)=="/go/")
					{
						document.querySelector("form").submit()
					}
					else
					{
						crowdBypass()
					}
				})
				domainBypass(/tetew\\.info|siherp\\.com/,()=>{
					ifElement("div.download-link > a[href]",a=>{
						let u=new URL(a.href)
						if(u.searchParams.has("r"))
						{
							safelyNavigate(atob(u.searchParams.get("r")))
						}
						else
						{
							safelyNavigate(a.href)
						}
					})
				})
				domainBypass("drivehub.link",()=>{
					ifElement("a#proceed[href]",a=>safelyNavigate(a.href))
				})
				domainBypass("oxy.cloud",()=>{
					location.href=new URL(document.querySelector("#divdownload > a[href]").href).searchParams.get("predirect")
				})
				domainBypass("daunshorte.teknologilink.com",()=>{
					location.href=document.querySelector("a[href^='https://teknosafe.teknologilink.com/linkteknolink/safelinkscript.php?']").href
				})
				domainBypass("teknosafe.teknologilink.com",()=>{
					safelyNavigate(document.querySelector("#templatemo_content > div > a[href]").href)
				})
				domainBypass("imgtaxi.com",()=>{
					document.querySelector("a.overlay_ad_link").click()
				})
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
				domainBypass("sub2unlock.net",()=>{
					safelyNavigate(document.getElementById("theLinkID").textContent)
				})
				domainBypass("haaretz.co.il",()=>{
					if(location.href.indexOf(".premium")>-1)
					{
						location.href=location.href.replace(".premium","")
					}
				})
				domainBypass("boostme.gg",()=>{
					safelyNavigate(document.querySelector("a[href]#go").href)
				})
				domainBypass("apkmodif.com",()=>{
					safelyNavigate(document.querySelector("input[type='hidden'][name='geturl'][value^='https://']").value)
				})
				domainBypass("driverays.com",()=>{
					safelyNavigate(document.querySelector("a#link[href]").href)
				})
				domainBypass("wikitrik.com",()=>{
					document.querySelector("#download > form[action='/getlink.php'] > input[type='submit'].button").click()
				})
				domainBypass("dawnstation.com",()=>{
					safelyNavigate(document.querySelector("#tidakakanselamanya.hiddenPlace > a").href)
				})
				domainBypass("hokiwikiped.net",()=>{
					ifElement("a#DrRO[href]",a=>safelyNavigate(a.href))
				})
				hrefBypass(/spaste\\.com\\/s\\//,()=>{
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
				domainBypass("get-click2.blogspot.com",()=>{
					let u=aesCrypto.decrypt(convertstr($.urlParam("o")),convertstr("root"))
					if(isGoodLink(u))
					{
						location.hash=""
						safelyNavigate(u)
					}
				})
				domainBypass("hello.tribuntekno.com",()=>{
					ifElement("#splash p[style] > u > b > a[href]",a=>safelyNavigate(a.href))
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
				if(typeof changeLink=="function")
				{
					let cLT=setInterval(()=>{
						if((document.querySelector("img#pleasewait")&&document.querySelector(".wait"))
							||document.getElementById("showlink")
						||document.getElementById("download")
						||document.getElementsByTagName("style='margin-top:").length
						||document.querySelector(".Visit_Link")//yametesenpai.xyz
						||document.getElementById("daplong")//converthinks.xyz
						)
						{
							clearInterval(cLT)
							let _open=window.open
							window.open=l=>{
								if(l.substr(0,22)=="https://api.rurafs.me/")
								{
									window.open=_open
								}
								else
								{
									safelyNavigate(l)
								}
							}
							if(typeof changeLink=="function")
							{
								changeLink()
							}
							else if(document.getElementById("link-download"))//hightech.web.id
							{
								safelyNavigate(document.getElementById("link-download").href)
							}
						}
					},100)
				}
				if(document.querySelector("form#show > [type='submit']") && document.getElementById("tunggu") && document.getElementById("hapus") && typeof counter != "undefined" && typeof countDown != "undefined" && typeof download != "undefined")//realsht.mobi,namiyt.com
				{
					document.querySelector("form#show > [type='submit']").click()
				}
				//Safelink Wordpress Plugin
				ifElement("#wpsafe-linksz > a[href*='?safelink_redirect='], #wpsafegenerate > #wpsafe-linkio > a[href*='?safelink_redirect=']",a=>{
					safelyNavigate(new URL(a.href).searchParams.get("safelink_redirect"))
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
				//GemPixel/KBRMedia Premium URL Shortener
				if(typeof appurl=="string"&&typeof token=="string")
				{
					let regex = /var count = [0-9]*;var countdown = setInterval\\\(function\\\(\\\){\\\$\\\("[a-z.]+"\\\)(\\\.attr\\\("href","#pleasewait"\\\))?(\\\.attr\\\("disabled",""\\\))?\\\.html\\\(count( \\\+ ".+")?\\\);if \\\(count < 1\\\) {clearInterval\\\(countdown\\\);(\\\$\\\("[a-z.]+"\\\)\\\.attr\\\("href",|window\\\.location=)"(https?:\\\/\\\/.+)"( \\\+ hash\\\)\\\.removeAttr\\\("disabled"\\\)\\\.removeClass\\\("disabled"\\\)\\\.html\\\(".+"\\\))?;}count--;}, 1000\\\);/
					document.querySelectorAll("script").forEach(script => {
						let matches = regex.exec(script.textContent)
						if(matches && matches[5])
						{
							safelyNavigate(matches[5])
						}
					})
					if(!bypassed)
					{
						domainBypass(/al\\.ly|ally\\.sh|dausel\\.co/,()=>{
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
				}
				//Shorte.st
				if(typeof app!="undefined"&&document.querySelector(".skip-add-container .first-img[alt='Shorte.st']"))
				{
					window.setInterval=f=>setInterval(f,800)
					return crowdBypass()
				}
				//Link.TL
				ifElement("img.navbar-logo[alt='LinkTL']",()=>{
					ifElement("form#skip_form",f=>{
						f.target=""
						f.submit()
					})
					finish()
				})
				//Other Templates
				ifElement(".timed-content-client_show_0_30_0",d=>{//technicoz.com
					d.classList.remove("timed-content-client_show_0_30_0")
					d.style.display="block"
					domainBypass("technicoz.com",()=>{
						safelyNavigate(d.querySelector("a").href)
					})
					finish()
				})
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
				if(typeof generate=="function")//lewat.wibuindo.com
				{
					ifElement("#download > a.akani[href]",b=>safelyNavigate(b.href))
				}
				if(document.querySelector(".shortened_link a[href][ng-href][target='_blank']"))//Go2to.com,Go2too.com,Golink.to
				{
					safelyNavigate(document.querySelector(".shortened_link a[href][ng-href][target='_blank']").href)
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
				if(location.search.startsWith("?n="))//viralking.xyz,indian4uh.com
				{
					ifElement("center a[name=a][href]",a=>{
						safelyNavigate(a.href)
						finish()
					})
				}
				let t=document.querySelector("title")
				if(t)
				{
					t=t.textContent.trim()
					switch(t)
					{
						case"Viid.su":
						{
							let b=document.querySelector("#link-success-button[data-url]")
							if(b)
							{
								safelyNavigate(b.getAttribute("data-url"))
								return finish()
							}
						}
						break;

						case"shortadd : 302 Moved":
						crowdBypass()
						let lT=setInterval(()=>{
							if(typeof $!="undefined")
							{
								clearInterval(lT)
								let _ajax=$.ajax,req=0
								$.ajax=d=>{
									if(typeof d=="object"&&"success"in d&&"dataType"in d&&d.dataType=="json"&&"url" in d&&d.url.length>15&&d.url.substr(d.url.length-11)=="/skip_timer")
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

						default:
						{
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
							//SafelinkU
							window.setInterval=f=>setInterval(f,10)
							crowdPath(location.search.substr(3))
						}
						domainBypass(/atv\\.pw|safe\\.mirrordown\\.com|kabarviral\\.blog/,()=>{
							crowdPath(location.search.substr(1).split("=")[0])
						})
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
												if(!a)
												{
													a=document.querySelector("[enlace]")//adigp.com
												}
											}
											if(a)
											{
												h=a.href
												if(!isGoodLink(h)&&a.hasAttribute("data-href"))//cuio.io
												{
													h=a.getAttribute("data-href")
												}
												if(!isGoodLink(h)&&a.hasAttribute("enlace"))
												{
													h=a.getAttribute("enlace")
												}
												if(isGoodLink(h))
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
						domainBypass(/123l\\.pw|123link|oke\\.io/,()=>{
							window.setInterval=f=>setInterval(f,1)
						})
						clearInterval(dT)
					}
				},100)
				setTimeout(()=>{
					clearInterval(dT)
				},10000)
			})`
		let dO=new MutationObserver(mutations=>{//
			if(document.documentElement.hasAttribute("data-universal-bypass-stop-watching"))
			{
				document.documentElement.removeAttribute("data-universal-bypass-stop-watching")
				dO.disconnect()
			}
			else if(document.documentElement.hasAttribute("data-universal-bypass-crowd-path"))
			{
				crowdPath=document.documentElement.getAttribute("data-universal-bypass-crowd-path")
				document.documentElement.removeAttribute("data-universal-bypass-crowd-path")
			}
			else if(document.documentElement.hasAttribute("data-universal-bypass-crowd-query"))
			{
				document.documentElement.removeAttribute("data-universal-bypass-crowd-query")
				let xhr=new XMLHttpRequest()
				xhr.onreadystatechange=()=>{
					if(xhr.readyState==4&&xhr.status==200&&xhr.responseText!="")
					{
						location.href="https://universal-bypass.org/crowd-bypassed?target="+encodeURIComponent(xhr.responseText)+"&back="+encodeURIComponent(location.href)
						//The background script will intercept the request and redirect to html/crowd-bypassed.html
					}
					else
					{
						document.documentElement.setAttribute("data-universal-bypass-crowd-queried","")
					}
				}
				xhr.open("POST","https://universal-bypass.org/crowd/query_v1",true)
				xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
				xhr.send("domain="+encodeURIComponent(domain)+"&path="+encodeURIComponent(crowdPath))
			}
			else if(document.documentElement.hasAttribute("data-universal-bypass-crowd-contribute"))
			{
				const target=document.documentElement.getAttribute("data-universal-bypass-crowd-contribute")
				document.documentElement.removeAttribute("data-universal-bypass-crowd-contribute")
				brws.runtime.sendMessage({
					type: "crowd-contribute",
					data: "domain="+encodeURIComponent(domain)+"&path="+encodeURIComponent(crowdPath)+"&target="+encodeURIComponent(target)
				})
			}
			else if(document.documentElement.hasAttribute("data-universal-bypass-adlinkfly-info"))
			{
				document.documentElement.removeAttribute("data-universal-bypass-adlinkfly-info")
				let port=brws.runtime.connect({name: "adlinkfly-info"})
				port.onMessage.addListener(msg => {
					document.documentElement.setAttribute("data-universal-bypass-adlinkfly-target", msg)
					port.disconnect()
				})
				port.postMessage(location.href)
			}
		}),
		domain=location.hostname,
		crowdPath=location.pathname.substr(1)
		if(domain=="api.rurafs.me")
		{
			return
		}
		if(domain.substr(0,4)=="www.")
		{
			domain=domain.substr(4)
		}
		dO.observe(document.documentElement,{attributes:true})
		script.innerHTML+="\n"+res.userscript+"\n})()"
		script=document.documentElement.appendChild(script)
		setTimeout(()=>document.documentElement.removeChild(script),10)
	})
}
