let params=new URLSearchParams(location.search)
if(params.has("target"))
{
	brws.storage.sync.get(["instant_navigation"],res=>{
		if(res&&res.instant_navigation&&res.instant_navigation==="true")
			location.href=params.get("target")
	})
	let i=document.querySelector('[data-message="beforeNavigateDestination"]')
	i.innerHTML=i.innerHTML.replace("%",'<a></a>')
	let a=i.querySelector("a")
	a.href=a.textContent=params.get("target")
}
else
{
	history.back()
}
