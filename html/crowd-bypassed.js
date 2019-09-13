const args=new URLSearchParams(location.search)
if(args.has("target")&&args.has("back"))
{
	let i=document.querySelector('[data-message="crowdBypassedInfo"]')
	i.innerHTML=i.innerHTML.replace("%",'<a></a>')
	let a=i.querySelector("a")
	a.setAttribute("target","_blank")
	a.href=a.textContent=args.get("target")
	document.getElementById("ignore").href=args.get("back")+"#ignoreCrowdBypass"
}
else
{
	history.back()
}
