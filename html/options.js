chrome.storage.local.get(["disabled_bypasses", "custom_bypasses"], function(result)
{
	let customBypasses = result.custom_bypasses?JSON.parse(result.custom_bypasses):{},
	customBypassesList = document.getElementById("custom-bypasses-list"),
	customBypassName = document.getElementById("custom-bypass-name"),
	customBypassDomains = document.getElementById("custom-bypass-domains"),
	bypassEditor = document.getElementById("custom-bypass-editor"),
	editingBypass = "";
	reloadCustomBypassList();
	document.getElementById("save-custom-bypass").onclick = function()
	{
		saveCustomBypass();
	};
	document.getElementById("delete-custom-bypass").onclick = function()
	{
		customBypassName.value = "";
		saveCustomBypass();
	};

	function reloadCustomBypassList()
	{
		customBypassesList.innerHTML = "";
		customBypasses["+ Add"] = {};
		if(editingBypass == "")
		{
			document.getElementById("custom-bypass-edit-container").style.display = "none";
		}
		else
		{
			document.getElementById("custom-bypass-edit-container").style.display = "block";
		}
		for(let name in customBypasses)
		{
			let a = document.createElement("a");
			a.id = "custom-bypass-" + name;
			a.href = "#userscripts";
			a.className = "list-group-item list-group-item-action" + (editingBypass == name ? " active" : "");
			a.textContent = name;
			a.onclick = function()
			{
				let _active = document.querySelectorAll(".list-group-item.active");
				if(_active.length > 0)
				{
					_active[0].className = "list-group-item list-group-item-action";
				}
				editingBypass = this.id.substr(14);
				if(editingBypass == "+ Add")
				{
					editingBypass = "Untitled Bypass";
					customBypasses[editingBypass] = {
						"domains": "example.com,example.org",
						"content": '// Please note that custom bypasses may get executed after the website has been loaded due to asynchronicity.\nlet domLoadedBypass=function()\n{\n  // Here the DOM is definitely loaded.\n};\n\nif(["interactive","complete"].indexOf(document.readyState)>-1)domLoadedBypass();else document.addEventListener("DOMContentLoaded",domLoadedBypass);\n'
					};
				}
				else
				{
					this.className = "list-group-item list-group-item-action active";
				}
				customBypassName.value = editingBypass;
				customBypassDomains.value = customBypasses[editingBypass].domains;
				bypassEditor.textContent = customBypasses[editingBypass].content;
				saveCustomBypass();
			};
			customBypassesList.appendChild(a);
		}
		delete customBypasses["+ Add"];
	}

	function saveCustomBypass()
	{
		if(customBypassName.value != editingBypass)
		{
			if(customBypassName.value == "")
			{
				if(window.confirm("Do you really want to delete this bypass?"))
				{
					delete customBypasses[editingBypass];
					editingBypass = "";
				}
				else
				{
					customBypassName.value = editingBypass;
				}
			}
			else
			{
				customBypasses[customBypassName.value] = customBypasses[editingBypass];
				delete customBypasses[editingBypass];
				editingBypass = customBypassName.value;
			}
		}
		if(editingBypass != "")
		{
			customBypasses[editingBypass].domains = customBypassDomains.value;
			customBypasses[editingBypass].content = bypassEditor.value;
		}
		chrome.storage.local.set({"custom_bypasses": JSON.stringify(customBypasses)}, function()
		{
			reloadCustomBypassList();			
		});
	}
});
