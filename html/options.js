chrome.storage.local.get(["disabled_bypasses","custom_bypasses"],(result)=>{
	let customBypasses=result.custom_bypasses?JSON.parse(result.custom_bypasses):{},
	customBypassesList=document.getElementById("custom-bypasses-list"),
	customBypassName=document.getElementById("custom-bypass-name"),
	customBypassDomains=document.getElementById("custom-bypass-domains"),
	bypassEditor=document.getElementById("custom-bypass-editor"),
	editingBypass="",
	reloadCustomBypassList=()=>{
		customBypassesList.innerHTML=""
		customBypasses["+ Add"]={}
		if(editingBypass)
			document.getElementById("custom-bypass-edit-container").style.display="block"
		else
			document.getElementById("custom-bypass-edit-container").style.display="none"
		for(let name in customBypasses)
		{
			let a=document.createElement("a")
			a.id="custom-bypass-"+name
			a.href="#userscripts"
			a.className="list-group-item list-group-item-action"+(editingBypass==name?" active":"")
			a.textContent=name
			a.onclick=function()
			{
				let _active=document.querySelector(".list-group-item.active")
				if(_active)
					_active.className="list-group-item list-group-item-action"
				editingBypass=this.id.substr(14)
				if(editingBypass=="+ Add")
				{
					customBypasses[editingBypass="Untitled Bypass"]={
						domains:"example.com,example.org",
						content:'let b=document.getElementById("button")\nif(b&&b.href)\n    location.href=b.href'
					}
				}
				else
				{
					this.className="list-group-item list-group-item-action active"
				}
				customBypassName.value=editingBypass
				customBypassDomains.value=customBypasses[editingBypass].domains
				bypassEditor.textContent=customBypasses[editingBypass].content
				saveCustomBypass()
			}
			customBypassesList.appendChild(a)
		}
		delete customBypasses["+ Add"]
	},
	saveCustomBypass=()=>{
		if(customBypassName.value!=editingBypass)
		{
			if(customBypassName.value)
			{
				customBypasses[customBypassName.value]=customBypasses[editingBypass]
				delete customBypasses[editingBypass]
				editingBypass=customBypassName.value
			}
			else
			{
				if(confirm("Do you really want to delete this bypass?"))
				{
					delete customBypasses[editingBypass]
					editingBypass=""
				}
				else
					customBypassName.value=editingBypass
			}
		}
		if(editingBypass!="")
		{
			customBypasses[editingBypass].domains=customBypassDomains.value
			customBypasses[editingBypass].content=bypassEditor.value
		}
		chrome.storage.local.set({custom_bypasses:JSON.stringify(customBypasses)},reloadCustomBypassList);
	}
	reloadCustomBypassList()
	document.getElementById("save-custom-bypass").onclick=saveCustomBypass
	document.getElementById("delete-custom-bypass").onclick=()=>{
		customBypassName.value=""
		saveCustomBypass()
	}
});
