if(document instanceof HTMLDocument)
{
	let injectionCode=()=>{
		let msgs={},//The translated messages will be loaded in this object for use with the notifications.
		ODP=Object.defineProperty,ev=window.eval,sT=window.setTimeout,sI=window.setInterval,//We're cloning these functions to avoid problems with uBlockOrigin, etc.
		navigated=false,//We only want to navigate once, e.g. to avoid issues with window.open being called multiple times on some sites.
		safelyNavigate=(target)=>{
			if(!navigated&&target&&target!=location.href)
			{
				bypassed=true
				navigated=true
				debugger//Don't want to navigate away just yet when dev tools are open
				let url
				try{url=new URL(target)}catch(e){}
				if(!url||!url.hash)
					target+=location.hash
				window.onbeforeunload=null
				location.href=target
			}
		},
		bypassed=false,//We keep track if we have already executed a bypass to stop all checks
		domainBypass=(domain,func)=>{
			if(!bypassed&&(location.hostname==domain||location.hostname.substr(location.hostname.length-(domain.length+1))=="."+domain))
			{
				func()
				bypassed=true
			}
		},
		hrefBypass=(hrefregex,func)=>{
			if(!bypassed&&hrefregex.test(location.href))
			{
				func()
				bypassed=true
			}
		},
		ensureDomLoaded=(func)=>{
			if(["interactive","complete"].indexOf(document.readyState)>-1)
				func()
			else document.addEventListener("DOMContentLoaded",()=>sT(func,1))
		},
		showNotification=(msg)=>ensureDomLoaded(()=>{//I think this is the only way to transfer data between the injection script and content script which is efficient enough to work with Universal Bypass.
			if(document.getElementById("UNIVERSAL_BYPASS_NO_NOTIFICATIONS"))
				return
			let div=document.createElement("div")
			div.setAttribute("style","position:fixed;right:0;bottom:0;box-shadow:0 0 10px 0 rgba(0,0,0,0.75);color:#000;background:#fff;overflow:hidden;border-radius:3px;padding:10px;margin:20px;z-index:100000;line-height:16px;font-size:18px;font-family:sans-serif;direction:ltr")
			div.innerHTML="<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALDwAACw8BkvkDpQAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4yMfEgaZUAAAFnSURBVDhPY8AFdAJr1ugEVr/WD6gygwqRBnSCau63LD7wXz+k9qNOQK0lVJh4ADJg55WX/2duvwg0pO6TdlCtNVSKOAAz4NyLXxBDgms/6wVU20ClEUA3sCZEN6hmPwxrB9aagsSB/r81fet5sAFwQ0KwGKIXWC+mHVztAMNaofU8YHGgQgOgBpBGgobgAiCFIKcTNEQvsFJHN7C6RzewqhcZ6wXXmgNpC6Ahb+fuvgI3ZBbQEIOQus9a/lUGYAN0gyqUgAY0oGPtwBp9nYBKe5PIps/LD9+GGzB181lQoD7XCqlQARuACwAD2A+o+duKo3fgmieuP/Uf6LLnOkGVGmBFIFOAoZ+AjnUCqiuAmn8ja+5dc/y/XlANQjMI6AZVu+gE1s5Hx0AvfF6w9xpcc9fKo/+BBqNqxgeQE1LH8sOkaQYBmAEdy4CaA6tJ0wwCIAOKJm8iTzMIALPzNJ2g6hv4NTMwAAD+oRymmiME5wAAAABJRU5ErkJggg==\"> "+msg
			div=document.body.appendChild(div)
			sT(()=>{
				document.body.removeChild(div)
			},5000)
		})
		let actual_app_vars
		ODP(this,"app_vars",{//
			set:(v)=>{
				actual_app_vars=v
				ODP(this,"blurred",{
					value:false,
					writable:false
				})
				//SafelinkU
				if(document.querySelector("b[style='color: #3e66b3']")&&document.querySelector("b[style='color: #3e66b3']").textContent=="SafelinkU")
				{
					bypassed=true
					window.setInterval=(f)=>{
						showNotification(msgs.timerSkip)
						return sI(f,10)
					}
					let lT=sI(()=>{
						if(document.querySelector("a.btn.btn-primary.btn-lg.get-link[href]")&&document.querySelector("a.btn.btn-primary.btn-lg.get-link[href]").getAttribute("href").substr(0,11)!="javascript:")
						{
							clearInterval(lT)
							showNotification(msgs.timerSkip)
							safelyNavigate(document.querySelector("a.btn.btn-primary.btn-lg.get-link[href]").href)
						}
					},100)
					return
				}
				if(document.querySelector("b[style='color : #3e66b3']")&&document.querySelector("b[style='color: #3e66b3']").textContent=="Shortener url?")
				{
					return
				}
				//AdLinkFly
				let xhr=new XMLHttpRequest()
				xhr.onreadystatechange=()=>{
					if(xhr.readyState==4&&xhr.status==200)
					{
						let match=/<img src="\/\/api\.miniature\.io\/[a-zA-Z0-9?=&%."]+\n?.+>/.exec(xhr.responseText)
						if(match)
						{
							let url=new URL(new DOMParser().parseFromString("<!DOCTYPE html><html><body>"+match[0].split("\r").join("").split("\n").join(" ")+"</body></html>","text/html").querySelector("img").src)
							console.log(url)
							if(url.search&&url.search.indexOf("url="))
							{
								showNotification(msgs.timerSkip)
								safelyNavigate(decodeURIComponent(url.search.split("url=")[1].split("&")[0]))
							}
						}
					}
				}
				xhr.open("GET",(location.pathname+"/info").replace("//","/"),true)
				xhr.send()
			},
			get:()=>actual_app_vars
		})
		ODP(this,"ysmm",//Adf.ly
		{
			set:r=>{
				let I=X=""
				for(let m=0;m<r.length;m++)
					if(m%2==0)I+=r.charAt(m);else X=r.charAt(m)+X
				r=I+X
				let U=r.split("")
				for(m=0;m<U.length;m++)
				{
					if(!isNaN(U[m]))
					{
						for(let R=m+1;R<U.length;R++)
						{
							if(!isNaN(U[R]))
							{
								let S=U[m]^U[R];
								if(S<10)
									U[m]=S
								m=R
								R=U.length
							}
							r=U.join("")
							r=atob(r)
							r=r.substring(r.length-(r.length-16))
							r=r.substring(0,r.length-16)
							if(r&&(r.indexOf("http://")==0||r.indexOf("https://")==0)&&encodeURI(r)==r)
							{
								showNotification(msgs.timerSkip)
								safelyNavigate(r)
							}
						}
					}
				}
			}
		})
		//LinkBucks
		var actualInitLbjs
		ODP(this,"initLbjs",{
			set:(_)=>actualInitLbjs=_,
			get:()=>(a,p)=>{
				p.Countdown--
				actualInitLbjs(a,p)
				showNotification(msgs.timerLeap.replace("%secs%","1"))
			}
		})
		//Safelink
		let actual_safelink=forced_safelink={counter:0}
		ODP(this,"safelink",
		{
			set:_=>{
				ODP(window,"blurred",{
					value:false,
					writable:false
				})
				for(let k in _)
				{
					let v=_[k]
					if(forced_safelink[k]===undefined)
						actual_safelink[k]=v
				}
				showNotification(msgs.timerSkip)
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
		ODP(this,"WEB_ROOT",{
			set:v=>{
				ODP(this,"seconds",{
					value:0,
					writable:false
				})
				actual_web_root=v
			},
			get:()=>actual_web_root
		})
		hrefBypass(/ur\.ly|urly\.mobi/,()=>{
			if(location.pathname.length>2&&location.pathname.substr(0,6)!="/goii/")
				safelyNavigate("/goii/"+location.pathname.substr(2)+"?ref="+location.hostname+location.pathname)
		})
		domainBypass("cshort.org",()=>{
			ODP(this,"adblock",{
				value:false,
				writable:false
			})
			ODP(this,"i",{
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
						showNotification(msgs.timerSkip)
						safelyNavigate(atob(atob(document.querySelector(".next[href]").getAttribute("href"))))
					}
				},100)
			})
		})
		domainBypass("link.tl",()=>{
			ODP(this,"countdown",{
				value:0,
				writable:false
			})
			let lT=sI(()=>
			{
				if(document.querySelector(".skip > .btn"))
				{
					showNotification(msgs.timerSkip)
					document.querySelector(".skip > .btn").click()
				}
			},100)
		})
		domainBypass("onepiece-ex.com.br",()=>{
			ODP(this,"seconds",{
				value:1,
				writable:false
			})
			let lT=sI(()=>{
				if(document.getElementById("continuar"))
				{
					clearInterval(lT)
					showNotification(msgs.timerSkip)
					safelyNavigate(document.getElementById("continuar").href)
				}
			},100)
		})
		domainBypass("akoam.net",()=>{
			ODP(this,"timer",{
				value:0,
				writable:false
			})
			let lT=sI(()=>{
				if(document.querySelector(".download_button"))
				{
					clearInterval(lT)
					showNotification(msgs.timerSkip)
					safelyNavigate(document.querySelector(".download_button").href)
				}
			},100)
		})
		hrefBypass(/1v\.to\/t\/.*/,()=>{
			location.pathname=location.pathname.split("/t/").join("/saliendo/")
		})
		domainBypass("share-online.biz",()=>{
			let actualWait
			ODP(this,"wait",{
				set:s=>actualWait=s,
				get:()=>{
					showNotification(msgs.timerLeap.replace("%secs%",actualWait-2))
					return 2
				}
			})
		})
		hrefBypass(/sfile\.(mobi|xyz)/,()=>{
			ODP(this,"downloadButton",{
				set:function(b)
				{
					if(b&&b.href)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(b.href)
					}
				}
			})
		})
		domainBypass("mylink.zone",()=>{
			ODP(this,"seconde",{
				set:_=>{},
				get:()=>{
					showNotification(msgs.timerSkip)
					return -1
				}
			})
		})
		domainBypass("sourceforge.net",()=>{
			var b=document.createElement("button"),d=false
			b.className="direct-download"
			b.style.display="none"
			document.documentElement.appendChild(b)
			ODP(this,"log",{
				value:m=>{
					console.log(m)
					if(m=="triggering downloader:start")
					{
						showNotification(msgs.timerSkip)
						d=true
					}
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
			window.setInterval=f=>{
				showNotification(msgs.timerLeap.replace("%secs%","1"))
				return sI(f,800)
			}
		})
		domainBypass("shortly.xyz",()=>{
			if(location.pathname.substr(0,3)=="/r/")
				document.getElementById=()=>({submit:()=>{
					let f=document.querySelector("form")
					f.action="/link#"+document.querySelector("input[name='id']").value
					f.submit()
				}})
			else if(location.pathname=="/link")
			{
				let xhr=new XMLHttpRequest()
				xhr.onreadystatechange=()=>{
					if(xhr.readyState==4&&xhr.status==200)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(xhr.responseText)
					}
				}
				xhr.open("POST","https://www.shortly.xyz/getlink.php",true)
				xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
				xhr.setRequestHeader("X-Requested-With","XMLHttpRequest")
				xhr.send("id="+location.hash.replace("#",""))
			}
		})
		if(!bypassed)
			ensureDomLoaded(()=>{
				hrefBypass(/ouo\.(io|press)/,()=>showNotification(msgs.backend))
				domainBypass("rom.io",()=>showNotification(msgs.backend))
				domainBypass("adfoc.us",()=>{
					let b=document.querySelector(".skip[href]")
					if(b)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(b.href)
					}
				})
				domainBypass("linkshrink.net",()=>{
					let p=document.getElementById("pause"),s=document.getElementById("skip")
					if(p&&s)
					{
						p.style.display="none"
						s.style.display="block"
						showNotification(msgs.timerSkip)
					}
				})
				domainBypass("sub2unlock.com",()=>{
					$(document).ready(()=>{
						let steps=document.querySelectorAll(".uk.unlock-step-link.check")
						if(steps.length)
						{
							for(let i in steps)
								if(i!=0&&steps[i] instanceof HTMLElement&&steps[i].className.substr(0,3)=="uk ")
									steps[i].className = steps[i].className.substr(3)
								steps[0].removeAttribute("target")
								steps[0].setAttribute("href","#")
								steps[0].click()
								showNotification(msgs.timerSkip)
								document.getElementById("link").click()
							}
						})
				})
				domainBypass("srt.am",()=>{
					if(document.querySelector(".skip-container"))
					{
						let f=document.createElement("form")
						f.method="POST"
						f.innerHTML='<input type="hidden" name="_image" value="Continue">'
						f=document.body.appendChild(f)
						showNotification(msgs.timerSkip)
						f.submit()
					}
				})
				domainBypass("admy.link",()=>{
					let f=document.querySelector(".edit_link")
					if(f)
					{
						showNotification(msgs.timerSkip)
						f.submit()
					}
				})
				domainBypass("ysear.ch",()=>{
					let b=document.querySelector("#NextVideo[href]")
					if(b)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(b.href)
					}
				})
				domainBypass("1ink.cc",()=>{
					if(typeof SkipAd=="function")
					{
						showNotification(msgs.timerSkip)
						SkipAd()
					}
				})
				domainBypass("losstor.com",()=>{
					let b=document.getElementById("re_link")
					if(b)
					{
						window.open=safelyNavigate
						showNotification(msgs.timerSkip)
						b.click()
					}
				})
				domainBypass("bagisoft.net",()=>{
					let b=document.getElementById("makingdifferenttimer")
					if(b)
					{
						window.open=safelyNavigate
						showNotification(msgs.timerSkip)
						b.click()
					}
					else
						jQuery.prototype.animateProgress=(p,f)=>f()
				})
				domainBypass("skinnycat.net",()=>{
					let b=document.querySelector("#dl[href]")
					if(b)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(b.href)
					}
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
							}).done(data=>{
								showNotification(msgs.timerSkip)
								safelyNavigate(data.url)
							})
						}
					}
				})
				domainBypass("dwindly.io",()=>{
					//We trick the site into running window.open for the target site by eval'ing the right onclick handler. Please note that eval is needed for this to work.
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
					showNotification(msgs.timerSkip)
				})
				domainBypass("vpsat.net",()=>{
					showNotification(msgs.timerSkip)
					safelyNavigate(url)
				})
				domainBypass("bluemediafiles.com",()=>{
					if(typeof FinishMessage=="string"&&FinishMessage.indexOf("<a href=")>-1)
					{
						showNotification(msgs.timerSkip)
						//The FinishMessage string contains the HTML anchor element needed to get to the destination so we just replace the entire website with it because we don't need any of the other content anymore.
						document.write(FinishMessage)
						document.querySelector("a").click()
					}
				})
				domainBypass("complete2unlock.com",()=>{
					let jT=sI(()=>{
						if(typeof $=="function")
						{
							clearInterval(jT)
							$(document).ready(()=>sT(()=>{
								window.open=h=>({location:{href:h}})
								window.setTimeout=f=>f()
								let bs=document.querySelectorAll("[data-main-url]")
								for(let i in bs)
								{
									let b=bs[i]
									if(b instanceof HTMLElement)
										b.click()
								}
							},100))
						}
					},100)
				})
				domainBypass("hidelink.club",()=>{
					if(hash)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(decodeURIComponent(atob(hash)).replace("%23", "#"))
					}
				})
				domainBypass("won.pe",()=>
				{
					if(document.querySelector(".captcha_loader .progress-bar"))
					{
						document.querySelector(".captcha_loader .progress-bar").setAttribute("aria-valuenow","100")
						showNotification(msgs.timerSkip)
					}
				})
				domainBypass("stealive.club",()=>{
					if(document.getElementById("counter"))
					{
						document.getElementById("counter").innerHTML="0"
						showNotification(msgs.timerSkip)
					}
				})
				hrefBypass(/(binerfile|pafpaf)\.info/,()=>{//KuroSafe
					showNotification(msgs.timerSkip)
					safelyNavigate(document.getElementById("mybutton").href)
				})
				domainBypass("gotoo.loncat.in",()=>{
					safelyNavigate(document.querySelector("a[href^='http://gotoo.loncat.in/go.php?open=']").href)
					showNotification(msgs.timerSkip)
				})
				domainBypass("id-share19.com",()=>{
					let not=false
					this.setTimeout=(f)=>{
						if(!not)
						{
							showNotification(msgs.timerSkip)
							not=true
						}
						return sT(f,1)
					}
					return
				})
				domainBypass("idnation.net",()=>{
					let b=document.querySelector("#linko[href]")
					if(b)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(b.href)
					}
				})
				domainBypass("mazika2day.com",()=>{
					let b=document.querySelector(".linkbtn[href]")
					if(b)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(b.href)
					}
				})
				domainBypass("ux9.de",()=>{
					let m=document.querySelector("meta[http-equiv='refresh'][content]")
					if(m&&m.getAttribute("content").indexOf(";url=http")>-1)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(m.getAttribute("content").split(";url=")[1])
					}
				})
				domainBypass("ity.im",()=>{
					let b=document.querySelector("a[onclick][href]")
					if(b)//This is just an ad bypass
						safelyNavigate(b.href)
				})
				if(bypassed)
					return
				//Adf.ly Pre-Redirect Nonsense
				if(location.pathname.substr(0,13)=="/redirecting/"&&document.querySelector("p[style]").textContent=="For your safety, never enter your password unless you're on the real Adf.ly site."&&document.querySelector("a"))
				{
					safelyNavigate(document.querySelector("a").href)
					return
				}
				//GemPixel Premium URL Shortener
				if(typeof appurl!="undefined"&&typeof token!="undefined")
				{
					//For this bypass to work, we detect a certain inline script and we might have to modify and execute (eval) it. Please note that eval is needed for this to work.
					let scripts=document.getElementsByTagName("script")
					for(let i in scripts)
					{
						let script=scripts[i]
						if(script instanceof HTMLScriptElement)
						{
							let cont=script.textContent
							if(cont.indexOf('clearInterval(countdown);')>-1)
							{
								if(typeof countdown!="undefined")
									clearInterval(countdown)
								if(!document.querySelector("a.redirect"))
								{
									let a=document.createElement("a")
									a.href="#"
									a.className="redirect"
									document.body.appendChild(a)
								}
								if(cont.indexOf("var count = ")>-1)
								{
									cont=cont.split(/var count = [0-9]*;/).join("let count=0;")
								}
								else
								{
									cont="let count=0;"+cont
								}
								cont=cont.split("$(window).on('load', ").join("let r=f=>f();r(")
								window.setInterval=f=>f()
								ev(cont)
								window.setInterval=sI
								showNotification(msgs.timerSkip)
								safelyNavigate(document.querySelector("a.redirect").href)
								return
							}
							else if(cont.trim().substr(0,69)=='!function(a){a(document).ready(function(){var b,c=a(".link-content"),')
							{
								showNotification(msgs.timerSkip)
								safelyNavigate(cont.trim().substr(104).split('",e=0,f=a(".count-timer"),g=f.attr("data-timer"),h=setInterval(')[0])
								return
							}
						}
					}
					if(document.getElementById("messa")&&document.getElementById("html_element"))//Ally Captcha
					{
						document.getElementById("messa").className+=" hidden"
						document.getElementById("html_element").className=document.getElementById("html_element").className.split("hidden").join("").trim()
						return
					}
				}
				//Soralink Wordpress Plugin
				if(document.querySelector(".sorasubmit"))
				{
					showNotification(msgs.timerSkip)
					document.querySelector(".sorasubmit").click()
					return
				}
				if(typeof changeLink=="function"
					||typeof bukalink=="function"//gosavelink.com
					)
				{
					let cLT=sI(()=>{
						if((document.querySelectorAll("img#pleasewait").length&&document.querySelector(".wait"))
							||document.getElementById("showlink")
							||document.getElementById("download")
							||document.querySelector(".Visit_Link")//yametesenpai.xyz
							||document.getElementsByTagName("style='margin-top:").length
							)
						{
							clearInterval(cLT)
							window.open=safelyNavigate
							showNotification(msgs.timerSkip)
							if(typeof changeLink=="function")
								changeLink()
							else if(typeof bukalink=="function")
								bukalink()
							if(document.getElementById("link-download"))//hightech.web.id
							{
								safelyNavigate(document.getElementById("link-download").href)
							}
						}
					},100)
				}
				if(document.querySelector("#lanjut > #goes[href]"))
				{
					showNotification(msgs.timerSkip)
					safelyNavigate(document.querySelector("#lanjut > #goes[href]").href)
					return
				}
				if(document.getElementById("waktu")&&document.getElementById("goto"))
				{
					showNotification(msgs.timerSkip)
					safelyNavigate(document.getElementById("goto").href)
					return
				}
				//Safelink Wordpress Plugin
				if(document.querySelector(".wp-safelink-button"))
				{
					window.setInterval=f=>{
						showNotification(msgs.timerSkip)
						return sI(f,1)
					}
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
					let search=location.search.toString().replace("?", "")
					if(search.substr(0,3)=="go=")
					{
						search=atob(search.substr(3))
						if(search.substr(0,4)=="http")
						{
							showNotification(msgs.timerSkip)
							safelyNavigate(search)
						}
					}
					else if(location.pathname.toString().substr(0,4)=="/go/")
					{
						search=atob(location.pathname.toString().substr(4))
						if(search.substr(0,4)=="http")
						{
							showNotification(msgs.timerSkip)
							safelyNavigate(search)
						}
					}
				}
				//Other Templates
				if(document.querySelector("a#btn-main.disabled")&&typeof Countdown=="function")//Croco,CPMLink,Sloomp.space
				{
					showNotification(msgs.timerSkip)
					safelyNavigate(document.querySelector("a#btn-main.disabled").href)
					return
				}
				if(document.querySelector("a.redirectBTN.disabled")&&document.querySelector(".timer"))//Arablionz.online
				{
					showNotification(msgs.timerSkip)
					safelyNavigate(document.querySelector("a.redirectBTN.disabled").href)
					return
				}
				if(document.querySelector(".shortened_link a[href][ng-href][target='_blank']"))//Go2to.com,Go2too.com,Golink.to
				{
					showNotification(msgs.timerSkip)
					safelyNavigate(document.querySelector(".shortened_link a[href][ng-href][target='_blank']").href)
				}
				if(document.querySelector("form#skip")&&document.getElementById("btn-main")&&!document.querySelector(".g-recaptcha"))
				{
					showNotification(msgs.timerSkip)
					document.querySelector("form#skip").submit()
					return
				}
				if(document.getElementById("countdown")&&document.querySelector(".seconds"))
				{
					if(document.querySelector(".err")&&document.querySelector(".err").textContent=="Skipped countdown")//Mexashare.com
					{
						showNotification(msgs.backend)
					}
					else
					{
						showNotification(msgs.timerSkip)
						document.querySelector(".seconds").textContent="0"
					}
					return
				}
				if(document.querySelector("#ddl #download_link .btn"))
				{
					showNotification(msgs.timerSkip)
					window.open=safelyNavigate
					document.querySelector("#ddl #download_link > .btn").click()
					return
				}
				if(typeof file_download=="function")
				{
					window.setInterval=f=>{
						showNotification(msgs.timerSkip)
						return sI(f,1)
					}
					return
				}
				if(document.querySelector("input[type=\"submit\"][name=\"method_free\"]"))
				{
					showNotification(msgs.timerSkip)
					document.querySelector("input[type=\"submit\"][name=\"method_free\"]").click()
					return
				}
				if(document.getElementById("frmdlcenter")&&document.getElementById("pay_modes"))//elsfile.org Timer
				{
					let form=document.createElement("form")
					form.method="POST"
					form.innerHTML='<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.toString().substr(1)+'"><input type="hidden" name="fname" value="'+document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent+'"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">'
					form=document.body.appendChild(form)
					showNotification(msgs.timerSkip)
					form.submit()
					return
				}
				if(typeof app!="undefined"&&"options"in app&&"intermediate"in app.options)//Shorte.st
				{
					app.options.intermediate.timeToWait=3
					showNotification(msgs.timerLeap.replace("%secs%","2"))
					let b=document.getElementById(app.options.intermediate.skipButtonId),
					lT=sI(()=>{
						if(b.className.indexOf("show")>-1)
						{
							clearInterval(lT)
							safelyNavigate(app.options.intermediate.destinationUrl)
						}
					},100)
					return
				}
				if(document.querySelector(".img-responsive[alt='Gets URL']")&&typeof x!="undefined")//GetsURL.com
				{
					let b=document.getElementById("link")
					if(b)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(b.href+"&ab"+x)
						return
					}
				}
				if(document.querySelector(".logo > a[href='http://linkvertise.net'] > img[src='/assets/img/linkvertise.png']"))//Linkvertise.net
				{
					let b=document.querySelector("[data-download]")
					if(b)
					{
						showNotification(msgs.timerSkip)
						safelyNavigate(b.getAttribute("data-download"))
						return
					}
				}
				if(document.querySelectorAll("img[src='/assets/img/logo.png'][alt='Openload']").length)//OpenLoad
				{
					if(typeof secondsdl!=="undefined")
					{
						secondsdl=0
						showNotification(msgs.timerSkip)
					}
					return
				}
				//SafeLinkReview.com
				if(document.querySelector(".navbar-brand")&&document.querySelector(".navbar-brand").textContent.trim()=="Safe Link Review"&&document.querySelector(".button.green"))
				{
					window.open=safelyNavigate
					showNotification(msgs.timerSkip)
					document.querySelector(".button.green").click()
					return
				}
				if(location.hostname=="decrypt2.safelinkconverter.com"&&document.querySelector(".redirect_url a"))
				{
					window.open=safelyNavigate
					showNotification(msgs.timerSkip)
					document.querySelector(".redirect_url a").click()
					return
				}
				let t=document.querySelector("title")
				if(t)
				{
					if(t.textContent.trim()=="Viid.su")//Viid.su
					{
						let b=document.getElementById("link-success-button")
						if(b&&b.getAttribute("data-url"))
						{
							showNotification(msgs.timerSkip)
							safelyNavigate(b.getAttribute("data-url"))
							return
						}
					}
				}
				sI(()=>{
					if(document.querySelectorAll(".lay-sh.active-sh").length)//Shorte.st Embed
					{
						let elm=document.querySelectorAll(".lay-sh.active-sh")[0]
						elm.parentNode.removeChild(elm)
					}
				},500)
			})
	},//
	//This method of injecting the script seems to be the fastest (faster than uBlockOrigin — which is crucial)
	injectScript=text=>{
		let script=document.createElement("script")
		script.innerHTML=text
		script=document.documentElement.appendChild(script)
		setTimeout(()=>{
			document.documentElement.removeChild(script)
		},10)
		//10ms seem to be enough time for any browser to execute the injected script
	}
	//Inserting the translation strings into our injection code and injecting it into the website.
	injectScript("("+injectionCode.toString().replace("let msgs={},","let msgs={timerSkip:\""+chrome.i18n.getMessage("notificationTimerSkip")+"\",timerLeap:\""+chrome.i18n.getMessage("notificationTimerLeap")+"\",backend:\""+chrome.i18n.getMessage("notificationBackend")+"\"},")+")()")
	chrome.storage.sync.get(["no_notifications"],result=>{
		if(result&&result.no_notifications&&result.no_notifications==="true")
		{
			let evalResult=()=>{
				//As mentioned before, I think this is the best method for transfering data to the injected script
				let div=document.createElement("div")
				div.id="UNIVERSAL_BYPASS_NO_NOTIFICATIONS"
				div.style.display="none"
				document.body.appendChild(div)
			}
			if(["interactive","complete"].indexOf(document.readyState)>-1)evalResult();else document.addEventListener("DOMContentLoaded",evalResult)
		}
	})
	chrome.storage.local.get(["custom_bypasses"],result=>
	{
		let evalResult=result=>{
			if(result&&result.custom_bypasses)
			{
				let customBypasses=JSON.parse(result.custom_bypasses)
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
		if(["interactive","complete"].indexOf(document.readyState)>-1)evalResult(result);else document.addEventListener("DOMContentLoaded",()=>evalResult(result))
	})
}
