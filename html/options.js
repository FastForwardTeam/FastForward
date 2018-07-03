chrome.storage.local.get(["custom_bypasses"],(result)=>{
	let customBypasses=(result&&result.custom_bypasses)?JSON.parse(result.custom_bypasses):{},
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
						content:'let b=document.getElementById("button")\nif(b&&b.href)\n\tlocation.href=b.href\n'
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
})
chrome.storage.sync.get(["no_notifications","no_tracker_bypass"],(result)=>{
	let notificationsCheckbox=document.getElementById("option-notifications"),
	trackerBypassCheckbox=document.getElementById("option-tracker-bypass")
	if(!result.no_notifications||result.no_notifications!=="true")
	{
		notificationsCheckbox.setAttribute("checked","checked")
	}
	if(!result.no_tracker_bypass||result.no_tracker_bypass!=="true")
	{
		trackerBypassCheckbox.setAttribute("checked","checked")
	}
	notificationsCheckbox.onchange=()=>{
		notificationsCheckbox.setAttribute("disabled","disabled")
		chrome.storage.sync.set({
			no_notifications:(!notificationsCheckbox.checked).toString()
		},()=>{
			notificationsCheckbox.removeAttribute("disabled")
		})
	}
	trackerBypassCheckbox.onchange=()=>{
		trackerBypassCheckbox.setAttribute("disabled","disabled")
		chrome.storage.sync.set({
			no_tracker_bypass:(!trackerBypassCheckbox.checked).toString()
		},()=>{
			trackerBypassCheckbox.removeAttribute("disabled")
		})
	}
})
