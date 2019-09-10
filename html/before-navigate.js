const args=new URLSearchParams(location.search)
if(args.has("target"))
{
	let span=document.querySelector("[data-message='beforeNavigateDestination']")
	span.innerHTML=span.innerHTML.replace("%",'<a></a>')
	let a=span.querySelector("a")
	a.textContent=a.href=args.get("target")
	brws.storage.sync.get(["navigation_delay"],res=>{
		let secondsLeft=res.navigation_delay
		if(secondsLeft<61)
		{
			let div=document.getElementById("timer"),
			timer=setInterval(()=>{
				secondsLeft--
				updateSpan()
				if(secondsLeft<=0)
				{
					location.href=args.get("target")
					clearInterval(timer)
				}
			},1000)
			div.style.display="block"
			const span=div.querySelector("span"),updateSpan=()=>{
				span.textContent=brws.i18n.getMessage("beforeNavigateTimer"+(secondsLeft==1?"Singular":"")).replace("%",secondsLeft)
			}
			updateSpan()
		}
	})
}
else
{
	history.back()
}
