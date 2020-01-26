const args=new URLSearchParams(location.search)
if(args.has("target"))
{
	let span=document.querySelector("[data-message='beforeNavigateDestination']")
	span.innerHTML=span.innerHTML.replace("%",'<a></a>')
	const a=span.querySelector("a")
	a.textContent=args.get("target")
	a.href=args.has("referer")?"https://universal-bypass.org/navigate"+location.search:args.get("target")
	brws.storage.sync.get(["navigation_delay"],res=>timer("beforeNavigateTimer",res.navigation_delay,()=>location.href=a.href))
}
else
{
	history.back()
}
