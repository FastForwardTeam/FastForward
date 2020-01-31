const brws=(typeof browser=="undefined"?chrome:browser),
timer=(message,secondsLeft,callback)=>{
	if(secondsLeft<61)
	{
		const div=document.getElementById("timer"),
		tid=setInterval(()=>{
			secondsLeft--
			tick()
		},1000),
		p=div.querySelector("p"),
		brws=(typeof browser=="undefined"?chrome:browser),
		cancel=()=>{
			clearInterval(tid)
			div.style.display="none"
		},
		tick=()=>{
			if(secondsLeft<=0)
			{
				cancel()
				callback()
			}
			if(secondsLeft==1)
			{
				p.textContent=brws.i18n.getMessage(message+"Singular")
			}
			else
			{
				p.textContent=brws.i18n.getMessage(message).replace("%",secondsLeft)
			}
			p.textContent+=" [ "
			let a=document.createElement("a")
			a.href="#"
			a.textContent=brws.i18n.getMessage("cancel")
			p.appendChild(a)
			p.innerHTML+=" ]"
			p.querySelector("a").onclick=cancel
		}
		div.style.display="block"
		tick()
		return tid
	}
}
document.querySelectorAll("[data-message]").forEach(e=>e.textContent=brws.i18n.getMessage(e.getAttribute("data-message")))
document.querySelectorAll("[data-message-nbsp]").forEach(e=>e.innerHTML=brws.i18n.getMessage(e.getAttribute("data-message-nbsp")).split(" ").join("&nbsp;"))
