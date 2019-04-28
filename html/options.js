//Options
const enabledCheckbox=document.getElementById("option-enabled"),
trackerBypassCheckbox=document.getElementById("option-tracker-bypass"),
instantNavigationCheckbox=document.getElementById("option-instant-navigation"),
instantNavigationTrackersCheckbox=document.getElementById("option-instant-navigation-trackers"),
blockIPLoggersCheckbox=document.getElementById("option-block-ip-loggers"),
crowdBypassCheckbox=document.getElementById("option-crowd-bypass")
brws.storage.sync.get(["disable","no_tracker_bypass","instant_navigation","no_instant_navigation_trackers","allow_ip_loggers","crowd_bypass_opt_out"],res=>{
	if(res==undefined)
	{
		res={}
	}
	if(!res.disable||res.disable!=="true")
	{
		enabledCheckbox.setAttribute("checked","checked")
	}
	if(!res.no_tracker_bypass||res.no_tracker_bypass!=="true")
	{
		trackerBypassCheckbox.setAttribute("checked","checked")
	}
	if(res.instant_navigation&&res.instant_navigation==="true")
	{
		instantNavigationCheckbox.setAttribute("checked","checked")
	}
	if(!res.no_instant_navigation_trackers||res.no_instant_navigation_trackers!=="true")
	{
		instantNavigationTrackersCheckbox.setAttribute("checked","checked")
	}
	if(!res.allow_ip_loggers||res.allow_ip_loggers!=="true")
	{
		blockIPLoggersCheckbox.setAttribute("checked","checked")
	}
	if(!res.crowd_bypass_opt_out||res.crowd_bypass_opt_out!=="true")
	{
		crowdBypassCheckbox.setAttribute("checked","checked")
	}
	instantNavigationTrackersLogic()
	enabledCheckbox.onchange=()=>{
		brws.storage.sync.set({
			disable:(!enabledCheckbox.checked).toString()
		})
	}
	trackerBypassCheckbox.onchange=()=>{
		brws.storage.sync.set({
			no_tracker_bypass:(!trackerBypassCheckbox.checked).toString()
		})
		instantNavigationTrackersLogic()
	}
	instantNavigationCheckbox.onchange=()=>{
		brws.storage.sync.set({
			instant_navigation:instantNavigationCheckbox.checked.toString()
		})
		instantNavigationTrackersLogic()
	}
	instantNavigationTrackersCheckbox.onchange=()=>{
		brws.storage.sync.set({
			no_instant_navigation_trackers:(!instantNavigationTrackersCheckbox.checked).toString()
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
function instantNavigationTrackersLogic()
{
	if(!trackerBypassCheckbox.checked||instantNavigationCheckbox.checked)
	{
		instantNavigationTrackersCheckbox.setAttribute("disabled","disabled")
	}
	else
	{
		instantNavigationTrackersCheckbox.removeAttribute("disabled")
	}
}

//Custom Bypasses
var example=`// Some examples of what you can do with custom bypasses:
domainBypass("example.com", function()
{
	ensureDomLoaded(function()
	{
		safelyNavigate(a.querySelector("a#skip_button[href]").href)
		// Make sure to use safelyNavigate(url) to avoid bad redirects.
	})
})
hrefBypass(/example\\.(com|org)/, function()
{
	// This bypass would trigger on example.com
	// if we didn't already have a bypass for it.
})
// Feel free to replace this with your own code now!
// Changes are saved automatically.
`,saveTimer,editor=ace.edit("userscript",{mode:"ace/mode/javascript",theme:"ace/theme/monokai"}),
span=document.querySelector("[data-message='optionsUserscriptsSubtitle']")
span.innerHTML=span.textContent.replace("GitHub","<a href='https://github.com/timmyrs/Universal-Bypass/blob/master/content_script.js' target='_blank'>GitHub</a>")
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
