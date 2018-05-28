let d=document;
if(d instanceof HTMLDocument)
{
	let c=()=>{
		let ODP=Object.defineProperty,n=(t)=>{if(t&&t!=location.href){window.onbeforeunload=null;location.href=t}},
		bp=!1,db=(d,b)=>{if(!bp&&(location.hostname==d||location.hostname.substr(location.hostname.length-(d.length+1))=="."+d)){b();bp=!0}},hb=(h,b)=>{if(!bp&&h.test(location.href)){b();bp=!0}};
		Object.defineProperty=(o,p,a)=>{if(o!==window||(p!="ysmm"&&p!="app_vars"))ODP(o,p,a)}//uBo unbreaker
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
		//AdLinkFly
		let actual_app_vars=forced_app_vars={counter_start:"load",force_disable_adblock:"0"},isALF=!1
		ODP(this,"app_vars",
		{
			set:(_)=>{isALF=!0},
			get:()=>actual_app_vars
		});
		for(let key in forced_app_vars)
		{
			ODP(app_vars,key,
			{
				writeable:!1,
				value:forced_app_vars[key]
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
			ODP(this,"rr",{
				set:(f)=>{
					f();
					if(document.querySelector(".skip > .btn"))
						document.querySelector(".skip > .btn").click()
				},
				get:()=>()=>{}
			})
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
		document.addEventListener("DOMContentLoaded",()=>{
			Object.defineProperty=ODP
			if(bp)
				return
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
			hb(/croco\.site\/ok\//,()=>{
				let b=document.getElementById("btn-main")
				if(b)
					b.click()
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
			db("elsfile.org",()=>{
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
				let f=$("#form-download");
				if(f.length)
				{
					$.ajax({
						"url":f.attr("action"),
						"type":"POST",
						"data":f.serialize()
					}).done(function(data)
					{
						n(data.url)
					})
				}
			})
			if(bp)
				return
			if(isALF)
			{
				let b1=document.getElementById("invisibleCaptchaShortlink")
				if(b1)
				{
					let cT=setInterval(()=>{
						if(invisibleCaptchaShortlink!==undefined)
						{
							clearInterval(cT)
							b1.click()
						}
					},100);
				}
				if("$" in this&&$("#go-link").length)
				{
					let bT=setInterval(()=>{
						let f=$("#go-link")
						$.ajax({
							dataType:"json",
							type:"POST",
							url:f.attr("action"),
							data:f.serialize(),
							success:(t)=>{
								if(t.url)
								{
									clearInterval(bT)
									n(t.url)
								}
							},
							error:(t)=>{console.log("An error occured: "+t.status+" "+t.statusText)}
						})
					},1000)
					$(".banner").html("").hide()
				}
				let b2=document.querySelector(".get-link")
				if(b2)
				{
					let lT=setInterval(()=>{
						if(!document.querySelectorAll(".get-link.disabled").length)
						{
							clearInterval(lT)
							if(b2.hasAttribute("href"))
								n(b2.href)
							else
								b2.click()
						}
					},100)
				}
				if(document.querySelectorAll(".skip-ad").length)
				{
					let lT=setInterval(()=>{
						if(document.querySelectorAll(".skip-ad .btn[href]").length)
						{
							clearInterval(lT)
							n(document.querySelectorAll(".skip-ad .btn[href]")[0].href)
						}
					},100)
				}
				return
			}
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
			if(((document.querySelectorAll("img#pleasewait").length&&document.querySelector(".wait"))||document.getElementById("showlink")||document.getElementById("download"))&&typeof changeLink=="function")
			{
				this.open=n
				changeLink()
				return
			}
			if(document.querySelector("#lanjut > #goes"))
			{
				let b=document.querySelector("#lanjut > #goes");
				if(b&&b.href)
					n(b.href)
			}
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
		if(result.custom_bypasses)
		{
			let cB=JSON.parse(result.custom_bypasses)
			for(let n in cB)
			{
				let b=cB[n],cs=b.content
				if(b.domains=="*")i(cs)
					else
					{
						let ds=b.domains.split(",")
						for(let i in ds)
						{
							let d=ds[i];
							if(location.hostname==d||location.hostname.substr(location.hostname.length-(d.length+1))=="."+d)i(cs)
						}
				}
			}
		}
	});
}
