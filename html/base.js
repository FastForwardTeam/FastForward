const brws=(typeof browser=="undefined"?chrome:browser)
document.documentElement.setAttribute("dir",brws.i18n.getMessage("@@bidi_dir"))
if(window.matchMedia("(prefers-color-scheme: dark)").matches)
{
	document.documentElement.className="uk-light uk-background-secondary"
}
let link=document.createElement("link")
link.rel="stylesheet"
link.href="uikit/uikit-"+brws.i18n.getMessage("@@bidi_dir")+".css"
document.head.appendChild(link)
let style=document.createElement("style")
style.textContent="p{font-size:1rem}"
document.head.appendChild(style)
const timer=(message,secondsLeft,callback)=>{
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
