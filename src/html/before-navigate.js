const args=new URLSearchParams(location.search)
if(args.has("target"))
{
	let span=document.querySelector("[data-message='beforeNavigateDestination']")
	span.innerHTML=span.innerHTML.replace("%",'<a href="#"></a>')
	const a=span.querySelector("a"),referer=args.get("referer")
	a.textContent=args.get("target")
	const when_safe=()=>{
		document.getElementById("unsafe").classList.add("uk-hidden")
		a.href=referer&&referer!="tracker"?"https://universal-bypass.org/navigate"+location.search:args.get("target")
		brws.storage.sync.get(["navigation_delay","no_instant_navigation_trackers"],res=>{
			if(res.navigation_delay==0||(referer=="tracker"&&res.no_instant_navigation_trackers!=="true"))
			{
				document.querySelector("div").innerHTML="<p></p>"
				document.querySelector("p").textContent=brws.i18n.getMessage("beforeNavigateInstant").replace("%",args.get("target"))
				setTimeout(()=>location.href=a.href,10)
			}
			else
			{
				timer("beforeNavigateTimer",res.navigation_delay,true,()=>location.href=a.href)
			}
		})
	}
	if(args.has("safe_in"))
	{
		document.getElementById("unsafe").classList.remove("uk-hidden")
		document.getElementById("options-link").classList.add("uk-hidden")
		timer("beforeNavigateUnsafeTimer",args.get("safe_in"),false,when_safe)
	}
	else
	{
		when_safe()
	}
}
else
{
	history.back()
}
