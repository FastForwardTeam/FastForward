let d=document;
if(d instanceof HTMLDocument)
{
	let c=()=>{
		let ODP=Object.defineProperty,n=(t)=>{if(t&&t!=location.href){window.onbeforeunload=null;location.href=t}},
		bp=!1,db=(d,b)=>{if(!bp&&(location.hostname==d||location.hostname.substr(location.hostname.length-(d.length+1))=="."+d)){b();bp=!0}},hb=(h,b)=>{if(!bp&&h.test(location.href)){b();bp=!0}}
		ODP(this,"ysmm",//Adf.ly
		{
			set:(r)=>{
				let I=X="";
				for(let m=0;m<r.length;m++)
					if(m%2==0)I+=r.charAt(m);else X=r.charAt(m)+X
				r=I+X
				let U=r.split("")
				for(m=0;m<U.length;m++)if(!isNaN(U[m]))for(let R=m+1;R<U.length;R++)
					if(!isNaN(U[R])){let S=U[m]^U[R];if(S<10)U[m]=S;m=R;R=U.length}
				r=U.join("")
				r=atob(r)
				r=r.substring(r.length-(r.length-16))
				r=r.substring(0,r.length-16)
				if(r&&(r.indexOf("http://")==0||r.indexOf("https://")==0))
					n(r)
			}
		})
		//LinkBucks
		var actualInitLbjs;
		ODP(this,"initLbjs",{
			set:(_)=>actualInitLbjs=_,
			get:()=>(a,p)=>{
				p.Countdown--
				actualInitLbjs(a,p)
			}
		})
		//Safelink
		let actual_safelink=forced_safelink={counter:0}
		ODP(this,"safelink",
		{
			set:(_)=>{
				ODP(window,"blurred",{
					value:!1,
					writable:!1
				})
				for(let k in _)
				{
					let v=_[k]
					if(forced_safelink[k]===undefined)
						actual_safelink[k]=v
				}
			},
			get:()=>actual_safelink
		})
		for(let key in forced_safelink)
		{
			ODP(safelink,key,
			{
				writable:!1,
				value:forced_safelink[key]
			})
		}
		hb(/ur\.ly|urly\.mobi/,()=>{
			if(location.pathname.length>2&&location.pathname.substr(0,6)!="/goii/")
				n("/goii/"+location.pathname.substr(2)+"?ref="+location.hostname+location.pathname)
		})
		db("cshort.org",()=>{
			ODP(this,"adblock",{
				value:!1,
				writable:!1
			})
			ODP(this,"i",{
				value:0,
				writable:!1
			})
			document.addEventListener("DOMContentLoaded",()=>
			{
				let lT=setInterval(()=>
				{
					if(document.querySelector(".next[href]"))
					{
						clearInterval(lT)
						n(atob(atob(document.querySelector(".next[href]").getAttribute("href"))))
					}
				},100)
			})
		})
		db("link.tl",()=>{
			ODP(this,"countdown",{
				value:0,
				writable:!1
			})
			let lT=setInterval(()=>
			{
				if(document.querySelector(".skip > .btn"))
					document.querySelector(".skip > .btn").click()
			},100);
		})
		db("lucariomods.club",()=>{
			let m=document.createElement("meta")
			m.setAttribute("http-equiv","Content-Security-Policy")
			m.setAttribute("content","upgrade-insecure-requests")
			let hT=setInterval(function()
			{
				if(document.head)
				{
					clearInterval(hT)
					document.head.appendChild(m)
				}
			},10)
			document.addEventListener("DOMContentLoaded",()=>{
				this.open=n
				jQuery.prototype.click=(f)=>f({"preventDefault":()=>{}})
			})
		})
		db("dl.ccbluex.net",()=>{
			var s=location.search.replace("?","")
			if(s.substr(0,7)=="target=")
				n("http://dl.ccbluex.net/download/index.php?file="+s.substr(7))
		})
		db("onepiece-ex.com.br",()=>{
			ODP(this,"seconds",{
				value:1,
				writable:!1
			})
			let lT=setInterval(()=>{
				if(document.getElementById("continuar"))
				{
					clearInterval(lT)
					n(document.getElementById("continuar").href)
				}
			},100)
		})
		db("akoam.net",()=>{
			ODP(this,"timer",{
				value:0,
				writable:!1
			})
			let lT=setInterval(()=>{
				if(document.querySelector(".download_button"))
				{
					clearInterval(lT)
					n(document.querySelector(".download_button").href)
				}
			},100)
		})
		hb(/1v\.to\/t\/.*/,()=>{
			location.pathname=location.pathname.split("/t/").join("/saliendo/")
		})
		db("share-online.biz",()=>{
			ODP(this,"wait",{
				value:2,
				writable:!1
			})
		})
		db("sfile.mobi",()=>{
			ODP(this,"downloadButton",{
				set:function(b)
				{
					if(b&&b.href)
						n(b.href)
				}
			})
		})
		db("mylink.zone",()=>{
			ODP(this,"seconde",{
				value:-1,
				writable:!1
			})
		})
		db("sourceforge.net",()=>{
			var b=document.createElement("button"),d=false
			b.className="direct-download"
			b.style.display="none"
			document.documentElement.appendChild(b)
			ODP(this,"log",{
				value:(m)=>{
					console.log(m)
					if(m=="triggering downloader:start")
						d=true
				},
				writable:!1
			})
			document.addEventListener("DOMContentLoaded",()=>{
				let bT=setInterval(()=>{
					if(d)
					{
						clearInterval(bT)
						location.href="about:blank"
					}
					else b.click()
				},100)
			})
		})
		if(!bp)
			document.addEventListener("DOMContentLoaded",()=>{
				db("adfoc.us",()=>{
					let b=document.querySelector(".skip")
					if(b&&b.href)
						n(b.href)
				})
				db("linkshrink.net",()=>{
					let p=document.getElementById("pause"),s=document.getElementById("skip")
					if(p)
						p.style.display="none"
					if(s)
						s.style.display="block"
				})
				db("sub2unlock.com",()=>{
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
								document.getElementById("link").click()
							}
						})
				})
				db("srt.am",()=>{
					if(document.querySelector(".skip-container"))
					{
						let f=document.createElement("form")
						f.method="POST"
						f.innerHTML='<input type="hidden" name="_image" value="Continue">'
						f=document.body.appendChild(f)
						f.submit()
					}
				})
				db("cpmlink.net",()=>{
					let b=document.getElementById("btn-main")
					if(b&&b.href)
						n(b.href)
				})
				db("admy.link",()=>{
					let f=document.querySelector(".edit_link")
					if(f)
						f.submit()
				})
				db("ysear.ch",()=>{
					let b=document.getElementById("NextVideo")
					if(b&&b.href)
						n(b.href)
				})
				db("1ink.cc",()=>{
					if(typeof SkipAd=="function")
						SkipAd()
				})
				db("v1.94lauin.com",()=>{
					jQuery.prototype._attr=jQuery.prototype.attr
					jQuery.prototype.attr=function(a,v)
					{
						if(!v&&this.selector==".count-timer"&&a=="data-timer")
							return 1
						return this._attr(a,v)
					}
					let lT=setInterval(()=>
					{
						if(document.querySelector(".link-content > a")&&document.querySelector(".link-content > a").getAttribute("href")!="#")
						{
							clearInterval(lT)
							n(document.querySelector(".link-content > a").href)
						}
					},100)
				})
				db("losstor.com",()=>{
					let b=document.getElementById("re_link")
					if(b)
					{
						window.open=n
						b.click()
					}
				})
				db("bagisoft.net",()=>{
					let b=document.getElementById("makingdifferenttimer")
					if(b)
					{
						window.open=n
						b.click()
					}
					else
						jQuery.prototype.animateProgress=(p,f)=>f()
				})
				db("skinnycat.net",()=>{
					let b=document.getElementById("dl")
					if(b&&b.href)
						n(b.href)
				})
				hb(/elsfile\.org|elsfile\.net/,()=>{
					if(document.getElementById("pay_modes"))
					{
						let form = document.createElement("form");
						form.method = "POST";
						form.innerHTML = '<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.toString().substr(1)+'"><input type="hidden" name="fname" value="'+document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent+'"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">';
						form = document.body.appendChild(form);
						form.submit();
					}
					else if(document.getElementById("btn_download"))
					{
						document.getElementById("btn_download").click();
					}
				})
				db("fshare.vn",()=>{
					if("$" in window)
					{
						let f=$("#form-download")
						if(f.length)
						{
							$.ajax({
								"url":f.attr("action"),
								"type":"POST",
								"data":f.serialize()
							}).done((data)=>n(data.url))
						}
					}
				})
				db("extmatrix.com",()=>{
					let b=document.getElementById("dlbutton")
					if(b&&b.hasAttribute("disabled"))
					{
						b.removeAttribute("disabled")
						b.click()
					}
				})
				db("dwindly.io",()=>{
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
							window.open=n
							eval("("+b.onclick.toString().split(";")[0]+"})()")
						}
					}
				})
				db("vpsat.net",()=>{
					n(url)
				})
				db("bluemediafiles.com",()=>{
					if(typeof FinishMessage=="string"&&FinishMessage.indexOf("<a href=")>-1)
					{
						document.write(FinishMessage)
						document.querySelector("a").click()
					}
				})
				db("complete2unlock.com",()=>{
					let jT=setInterval(()=>{
						if(typeof $=="function")
						{
							clearInterval(jT)
							$(document).ready(()=>setTimeout(()=>{
								window.open=(h)=>{return{location:{href:h}}}
								window.setTimeout=(f)=>f()
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
				db("hidelink.club",()=>{
					if(hash)
						n(decodeURIComponent(atob(hash)).replace("%23", "#"))
				})
				if(bp)
					return
				//GemPixel Premium URL Shortener
				if(typeof appurl!="undefined"&&typeof token!="undefined")
				{
					let scripts=document.getElementsByTagName("script")
					for(let i in scripts)
					{
						let script=scripts[i];
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
									cont = cont.split(/var count = [0-9]*;/).join("let count=0;")
								}
								else
								{
									cont = "let count=0;" + cont
								}
								cont = cont.split("$(window).on('load', ").join("let r=(f)=>f();r(");
								let sI=setInterval
								this.setInterval=(f)=>f()
								eval(cont)
								this.setInterval=sI
								n(document.querySelector("a.redirect").href)
								return
							}
						}
					}
					//Ally Captcha
					if(document.getElementById("messa")&&document.getElementById("html_element"))
					{
						document.getElementById("messa").className+=" hidden"
						document.getElementById("html_element").className=document.getElementById("html_element").className.split("hidden").join("").trim();
					}
				}
				//Soralink Plugin
				if(document.querySelector(".sorasubmit"))
				{
					document.querySelector(".sorasubmit").click()
					return
				}
				let rCL=()=>((document.querySelectorAll("img#pleasewait").length&&document.querySelector(".wait"))||document.getElementById("showlink")||document.getElementById("download")||document.getElementsByTagName("style='margin-top:").length)
				if(typeof changeLink=="function")
				{
					if(rCL())
					{
						this.open=n
						changeLink()
						return
					}
					let cLT=setInterval(()=>{
						if(rCL())
						{
							clearInterval(cLT);
							this.open=n
							changeLink()
						}
					},100)
				}
				if(document.querySelector("#lanjut > #goes"))
				{
					let b=document.querySelector("#lanjut > #goes");
					if(b&&b.href)
						n(b.href)
				}
				if(document.getElementById("waktu")&&document.getElementById("goto"))
				{
					n(document.getElementById("goto").href)
				}
				//Other Templates
				if(document.querySelector("form#skip")&&document.getElementById("btn-main")&&!document.querySelector(".g-recaptcha"))
					document.querySelector("form#skip").submit()
				if(document.getElementById("countdown")&&document.querySelector(".seconds"))
					document.querySelector(".seconds").textContent="0"
				//Shorte.st
				if(typeof app!="undefined"&&"options"in app&&"intermediate"in app.options)
				{
					app.options.intermediate.timeToWait=3
					let b=document.getElementById(app.options.intermediate.skipButtonId),
					lT=setInterval(()=>
					{
						if(b.className.indexOf("show")>-1)
						{
							clearInterval(lT)
							n(app.options.intermediate.destinationUrl)
						}
					},100)
					return
				}
				//GetsURL.com
				if(document.querySelector(".img-responsive[alt='Gets URL']")&&typeof x!="undefined")
				{
					let b=document.getElementById("link")
					if(b)
					{
						n(b.href+"&ab"+x)
						return
					}
				}
				//Linkvertise.net
				if(document.querySelector(".logo > a[href='http://linkvertise.net'] > img[src='/assets/img/linkvertise.png']"))
				{
					let b=document.querySelector("[data-download]")
					if(b)
					{
						n(b.getAttribute("data-download"))
						return
					}
				}
				//OpenLoad
				if(document.querySelectorAll("img[src='/assets/img/logo.png'][alt='Openload']").length)
				{
					secondsdl=0
					return
				}
				//SafelinkU
				if(document.querySelector("b[style='color: #3e66b3']")&&document.querySelector("b[style='color: #3e66b3']").textContent=="SafelinkU")
				{
					let _sI=setInterval
					setInterval=(f)=>_sI(f,10)
					let lT=_sI(()=>{
						if(document.querySelector("a.btn.btn-primary.btn-lg.get-link[href]")&&document.querySelector("a.btn.btn-primary.btn-lg.get-link[href]").getAttribute("href").substr(0,11)!="javascript:")
						{
							clearInterval(lT)
							n(document.querySelector("a.btn.btn-primary.btn-lg.get-link[href]").href)
						}
					},100)
					return
				}
				else if(document.querySelector("b[style='color : #3e66b3']")&&document.querySelector("b[style='color: #3e66b3']").textContent=="Shortener url?")
				{
					document.querySelector("button.btn.btn-success[type='submit']").click()
					return
				}
				//KuroSafe
				if(document.querySelector("a#mybutton.btn.btn-md.btn-primary[href^='https://www.kurosafe.online/']")||document.querySelector("a#mybutton.btn.btn-md.btn-primary[href^='https://kurosafe.online/']"))
				{
					n(document.getElementById("mybutton").href)
					return
				}
				//SafeLinkReview.com
				if(document.querySelector(".navbar-brand")&&document.querySelector(".navbar-brand").textContent.trim()=="Safe Link Review"&&document.querySelector(".button.green"))
				{
					this.open=n
					document.querySelector(".button.green").click()
					return
				}
				if(location.hostname=="decrypt2.safelinkconverter.com"&&document.querySelector(".redirect_url a"))
				{
					this.open=n
					document.querySelector(".redirect_url a").click();
					return
				}
				let t=document.querySelector("title")
				if(t)
				{
					//Viid.su
					if(t.textContent.trim()=="Viid.su")
					{
						let b=document.getElementById("link-success-button")
						if(b&&b.getAttribute("data-url"))
						{
							n(b.getAttribute("data-url"))
							return
						}
					}
				}
				setInterval(()=>{
					//Shorte.st Embed
					if(document.querySelectorAll(".lay-sh.active-sh").length)
					{
						let elm=document.querySelectorAll(".lay-sh.active-sh")[0]
						elm.parentNode.removeChild(elm)
					}
				},500);
			})
	},//
	i=(t)=>{
		s=d.createElement("script")
		s.innerHTML=t
		s=d.documentElement.appendChild(s)
		setTimeout(()=>{d.documentElement.removeChild(s)},10)
	}
	i("("+c+")()")
	chrome.storage.local.get(["custom_bypasses"],(result)=>
	{
		let evalResult=(result)=>{
			if(result.custom_bypasses)
			{
				let cB=JSON.parse(result.custom_bypasses)
				for(let n in cB)
				{
					let b=cB[n],cs=b.content
					if(b.domains=="*")
						i(cs)
					else
					{
						let ds=b.domains.split(",")
						for(let di in ds)
						{
							let d=ds[di];
							if(location.hostname==d||location.hostname.substr(location.hostname.length-(d.length+1))=="."+d)
								i(cs)
						}
					}
				}
			}
		}
		if(["interactive","complete"].indexOf(document.readyState)>-1)
			evalResult(result)
		else
			document.addEventListener("DOMContentLoaded",()=>evalResult(result))
	})
}
