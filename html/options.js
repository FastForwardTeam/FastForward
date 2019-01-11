var example=`//Some examples of what you can do with custom bypasses:
domainBypass("example.com", function()
{
	ensureDomLoaded(function()
	{
		let button = document.getElementById("skip-button")
		if(button != null)
		{
			button.click()
		}
	})
})
hrefBypass(/example\\.(com|org)/, function()
{
	// This bypass won't trigger on example.com because
	// we have already defined a bypass for example.com.
	sI(function()
	{
		// sI is a copy of window.setInterval.
		// You may also use sT (setTimeout), ev (eval),
		// and safelyNavigate(url) in your bypasses.
		console.log("A second has passed")
	}, 1000)
})
// Feel free to replace this with your own code now!
// Changes are automatically saved.
`, saveTimer, editor=ace.edit("userscript",{mode:"ace/mode/javascript",theme:"ace/theme/monokai"})
brws.storage.local.get(["userscript"],res=>{
	if(res&&res.userscript)
	{
		editor.setValue(res.userscript)
	}
	else
	{
		editor.setValue(example)
		brws.storage.local.set({
			userscript: example
		})
	}
	editor.resize()
	editor.clearSelection()
	editor.on("change", ()=>{
		clearInterval(saveTimer)
		saveTimer=setTimeout(()=>{
			brws.storage.local.set({
				userscript: editor.getValue()
			})
		},500)
	})
})
brws.storage.sync.get(["disable","instant_navigation","no_tracker_bypass","allow_ip_loggers","crowd_bypass_opt_out"],res=>{
	if(res==undefined)
	{
		res={}
	}
	let enabledCheckbox=document.getElementById("option-enabled"),
	instantNavigationCheckbox=document.getElementById("option-instant-navigation"),
	trackerBypassCheckbox=document.getElementById("option-tracker-bypass"),
	blockIPLoggersCheckbox=document.getElementById("option-block-ip-loggers"),
	crowdBypassCheckbox=document.getElementById("option-crowd-bypass")
	if(!res.disable||res.disable!=="true")
	{
		enabledCheckbox.setAttribute("checked","checked")
	}
	if(res.instant_navigation&&res.instant_navigation==="true")
	{
		instantNavigationCheckbox.setAttribute("checked","checked")
	}
	if(!res.no_tracker_bypass||res.no_tracker_bypass!=="true")
	{
		trackerBypassCheckbox.setAttribute("checked","checked")
	}
	if(!res.allow_ip_loggers||res.allow_ip_loggers!=="true")
	{
		blockIPLoggersCheckbox.setAttribute("checked","checked")
	}
	if(!res.crowd_bypass_opt_out||res.crowd_bypass_opt_out!=="true")
	{
		crowdBypassCheckbox.setAttribute("checked","checked")
	}
	enabledCheckbox.onchange=()=>{
		brws.storage.sync.set({
			disable:(!enabledCheckbox.checked).toString()
		})
	}
	instantNavigationCheckbox.onchange=()=>{
		brws.storage.sync.set({
			instant_navigation:instantNavigationCheckbox.checked.toString()
		})
	}
	trackerBypassCheckbox.onchange=()=>{
		brws.storage.sync.set({
			no_tracker_bypass:(!trackerBypassCheckbox.checked).toString()
		})
	}
	blockIPLoggersCheckbox.onchange=()=>{
		brws.storage.sync.set({
			allow_ip_loggers:(!blockIPLoggersCheckbox.checked).toString()
		})
	}
	crowdBypassCheckbox.onchange=()=>{
		brws.storage.sync.set({
			crowd_bypass_opt_out:(!crowdBypassCheckbox.checked).toString()
		})
	}
})
