const args=new URLSearchParams(location.search)
if(args.has("target")&&args.has("referer"))
{
	let span=document.querySelector('[data-message="crowdBypassedInfo"]')
	span.innerHTML=span.innerHTML.replace("%",'<a target="_blank"></a>')
	const a=span.querySelector("a")
	a.textContent=args.get("target")
	a.href="https://universal-bypass.org/navigate"+location.search
	document.getElementById("ignore").href=args.get("referer")+"#ignoreCrowdBypass"
	brws.storage.sync.get(["crowd_open_delay"],res=>{
		let secondsLeft=res.crowd_open_delay
		if(secondsLeft<61)
		{
			const div=document.getElementById("timer"),
			timer=setInterval(()=>{
				secondsLeft--
				tick()
			},1000),
			p=div.querySelector("p"),
			brws=(typeof browser=="undefined"?chrome:browser),
			tick=()=>{
				if(secondsLeft<=0)
				{
					if(secondsLeft==0)
					{
						brws.runtime.sendMessage({
							type: "open-tab",
							url: a.href
						})
					}
					else
					{
						div.style.display="none"
						clearInterval(timer)
					}
				}
				if(secondsLeft==1)
				{
					p.textContent=brws.i18n.getMessage("crowdBypassedTimerSingular")
				}
				else
				{
					p.textContent=brws.i18n.getMessage("crowdBypassedTimer").replace("%",secondsLeft)
				}
			}
			div.style.display="block"
			tick()
		}
	})
}
else
{
	history.back()
}
