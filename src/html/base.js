const brws=(typeof browser=="undefined"?chrome:browser)
document.documentElement.setAttribute("dir",brws.i18n.getMessage("@@bidi_dir"))
const timer=(message,secondsLeft,cancelable,callback)=>{
	if(secondsLeft>=0)
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
			titleElm.textContent=title
			div.classList.add("hidden")
		},
		tick=()=>{
			if(secondsLeft<=0)
			{
				cancel()
				callback()
				return
			}
			titleElm.textContent="("+secondsLeft+") "+title
			if(secondsLeft==1)
			{
				p.textContent=brws.i18n.getMessage(message+"Singular")+" "
			}
			else
			{
				p.textContent=brws.i18n.getMessage(message).replace("%",secondsLeft)+" "
			}
			if(cancelable)
			{
				let a=document.createElement("a")
				a.href="#"
				a.onclick=cancel
				a.textContent=brws.i18n.getMessage("cancel")
				p.appendChild(a)
			}
		}
		div.classList.remove("hidden")
		tick()
		return tid
	}
}
