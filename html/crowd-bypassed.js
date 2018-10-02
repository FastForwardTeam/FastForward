let object={},searchArr=window.location.search.toString().replace("?", "").split("&")
for(let i in searchArr)
{
	let varArr=searchArr[i].split("="),key=decodeURIComponent(varArr[0])
	if(key=="")
		continue
	object[key]=(varArr.length==2?decodeURIComponent(varArr[1]):"")
}
if(object&&object.target&&object.back)
{
	let i=document.querySelector('[data-message="crowdBypassedInfo"]')
	i.innerHTML=i.innerHTML.replace("%",'<a></a>');
	let a=i.querySelector("a")
	a.setAttribute("target","_blank")
	a.href=a.textContent=object.target
	document.getElementById("ignore").href=object.back+"#ignoreCrowdBypass"
}
else history.back()
