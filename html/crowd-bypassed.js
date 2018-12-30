let params=new URLSearchParams(location.search)
if(params.has("target")&&params.has("back"))
{
	let i=document.querySelector('[data-message="crowdBypassedInfo"]')
	i.innerHTML=i.innerHTML.replace("%",'<a></a>')
	let a=i.querySelector("a")
	a.setAttribute("target","_blank")
	a.href=a.textContent=params.get("target")
	document.getElementById("ignore").href=params.get("back")+"#ignoreCrowdBypass"
}
else
{
	history.back()
}
