const args=new URLSearchParams(location.search)
if(args.has("target"))
{
	let span=document.querySelector("[data-message='beforeNavigateDestination']")
	span.innerHTML=span.innerHTML.replace("%",'<a></a>')
	let a=span.querySelector("a")
	a.textContent=a.href=args.get("target")
	span=document.querySelector("[data-message='beforeNavigateTimer']")
	span.innerHTML=span.innerHTML.replace("%","<span></span>")
	span=span.querySelector("span")
	brws.storage.sync.get(["navigation_delay"],res=>{
		let secondsLeft=res.navigation_delay,
		timer=setInterval(()=>{
			span.textContent=--secondsLeft
			if(secondsLeft<=0)
			{
				location.href=args.get("target")
				clearInterval(timer)
			}
		},1000)
		span.textContent=secondsLeft
	})
}
else
{
	history.back()
}
