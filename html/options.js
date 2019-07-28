//Options
const enabledCheckbox=document.getElementById("option-enabled"),
enabledLabel=document.querySelector("label[for='option-enabled']"),
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
	else
	{
		enabledLabel.style.color="red"
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
	enabledCheckbox.onchange=function()
	{
		enabledLabel.style.color=""
		brws.storage.sync.set({
			disable:(!this.checked).toString()
		})
	}
	trackerBypassCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			no_tracker_bypass:(!this.checked).toString()
		})
		instantNavigationTrackersLogic()
	}
	instantNavigationCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			instant_navigation:this.checked.toString()
		})
		instantNavigationTrackersLogic()
	}
	instantNavigationTrackersCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			no_instant_navigation_trackers:(!this.checked).toString()
		})
	}
	blockIPLoggersCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			allow_ip_loggers:(!this.checked).toString()
		})
	}
	crowdBypassCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			crowd_bypass_opt_out:(!this.checked).toString()
		})
	}
})
let hash=location.hash.toString().replace("#","")
if(hash)
{
	document.querySelector("label[for='"+hash+"']").style.background="yellow"
}
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
	// Triggered on example.com and subdomains (e.g. www.example.com)
	ensureDomLoaded(function()
	{
		// Triggered as soon as the DOM is ready
		// You can use ifElement to check if an element is available via document.querySelector:
		ifElement("a#skip_button[href]", a => {
			safelyNavigate(a.href)
			// safelyNavigate makes sure the given URL is valid
		})
	})
	// You can also use awaitElement to wait until a given element is available via document.querySelector:
	awaitElement("a#skip_button[href]", a=> {
		safelyNavigate(a.href)
	})
})
domainBypass(/example\\.(com|org)/, function()
{
	// Triggered if the regex matches any part of the hostname
})
hrefBypass(/example\\.(com|org)/, function()
{
	// Triggered if the regex matches any part of the URL
})
// Enjoy! Your changes will be saved automatically.
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
