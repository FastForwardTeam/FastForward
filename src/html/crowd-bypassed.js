const args=new URLSearchParams(location.search)
if(args.has("target")&&args.has("referer"))
{
	let span=document.querySelector('[data-message="crowdBypassedInfo"]'),opentimer
	span.innerHTML=span.innerHTML.replace("%",'<a target="_blank"></a>')
	const a=span.querySelector("a"),
	closetimer=()=>brws.storage.sync.get(["crowd_close_delay"],res=>timer("crowdCloseTimer",res.crowd_close_delay,true,()=>{
		brws.runtime.sendMessage({type: "close-tab"})
	}))
	a.textContent=args.get("target")
	a.href=args.has("referer")?"https://universal-bypass.org/navigate"+location.search:args.get("target")
	a.onclick=()=>{
		clearInterval(opentimer)
		closetimer()
	}
	document.getElementById("ignore").href=args.get("referer")+"#ignoreCrowdBypass"
	brws.storage.sync.get(["crowd_open_delay"],res=>opentimer=timer("crowdBypassedTimer",res.crowd_open_delay,true,()=>{
		brws.runtime.sendMessage({
			type: "open-tab",
			url: a.href
		})
		closetimer()
	}))
}
else
{
	history.back()
}
