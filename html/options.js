//Bypass counter
brws.storage.local.get(["bypass_counter"],res=>{
	if(res.bypass_counter>1)
	{
		const p=document.querySelector("[data-message='bypassCounter']")
		p.innerHTML=p.innerHTML.replace("%","<b>"+res.bypass_counter+"</b>")
		document.getElementById("counter").style.display="block"
	}
})

//Options
document.getElementById("version").textContent=brws.runtime.getManifest().version
document.querySelector("[data-message='optionsNavigationDelay']").innerHTML=document.querySelector("[data-message='optionsNavigationDelay']").innerHTML.replace("%",'<input id="option-navigation-delay" type="number" min="0" max="60" skip="1" style="width:34px">')
document.querySelector("[data-message='optionsCrowdAutoOpen']").innerHTML=document.querySelector("[data-message='optionsCrowdAutoOpen']").innerHTML.replace("%",'<input id="option-crowd-open-delay" type="number" min="0" max="60" skip="1" style="width:34px">')
const enabledCheckbox=document.getElementById("option-enabled"),
enabledLabel=document.querySelector("label[for='option-enabled']"),
navigationDelayInput=document.getElementById("option-navigation-delay"),
navigationDelayCheckbox=document.getElementById("navigation-delay-toggle"),
trackerBypassCheckbox=document.getElementById("option-tracker-bypass"),
instantNavigationTrackersCheckbox=document.getElementById("option-instant-navigation-trackers"),
blockIPLoggersCheckbox=document.getElementById("option-block-ip-loggers"),
crowdBypassCheckbox=document.getElementById("option-crowd-bypass"),
crowdOpenDelayInput=document.getElementById("option-crowd-open-delay"),
crowdOpenDelayCheckbox=document.getElementById("option-crowd-open-delay-toggle"),
infoBoxCheckbox=document.getElementById("option-info-box")
let navigationDelayInputTimer,crowdOpenDelayInputTimer
brws.storage.sync.get(["disable","navigation_delay","no_tracker_bypass","no_instant_navigation_trackers","allow_ip_loggers","crowd_bypass_opt_out","crowd_open_delay","no_info_box"],res=>{
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
	if(res.navigation_delay>60)
	{
		navigationDelayInput.value=0
		navigationDelayInput.setAttribute("disabled","disabled")
	}
	else
	{
		navigationDelayInput.value=res.navigation_delay
		navigationDelayCheckbox.setAttribute("checked","checked")
	}
	if(res.no_tracker_bypass!=="true")
	{
		trackerBypassCheckbox.setAttribute("checked","checked")
	}
	if(res.no_instant_navigation_trackers!=="true")
	{
		instantNavigationTrackersCheckbox.setAttribute("checked","checked")
	}
	if(res.allow_ip_loggers!=="true")
	{
		blockIPLoggersCheckbox.setAttribute("checked","checked")
	}
	if(res.crowd_bypass_opt_out!=="true")
	{
		crowdBypassCheckbox.setAttribute("checked","checked")
	}
	if(res.crowd_open_delay>60)
	{
		crowdOpenDelayInput.value=0
		crowdOpenDelayInput.setAttribute("disabled","disabled")
	}
	else
	{
		crowdOpenDelayInput.value=res.crowd_open_delay
		crowdOpenDelayCheckbox.setAttribute("checked","checked")
	}
	if(res.no_info_box!=="true")
	{
		infoBoxCheckbox.setAttribute("checked","checked")
	}
	instantNavigationTrackersLogic()
	enabledCheckbox.onchange=function()
	{
		enabledLabel.style.color=""
		brws.storage.sync.set({
			disable:(!this.checked).toString()
		})
	}
	navigationDelayInput.oninput=()=>{
		clearTimeout(navigationDelayInputTimer)
		navigationDelayInputTimer=setTimeout(()=>{
			brws.storage.sync.set({
				navigation_delay:navigationDelayInput.value
			})
			instantNavigationTrackersLogic()
		},300)
	}
	navigationDelayCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			navigation_delay:(this.checked?navigationDelayInput.value:61)
		})
		if(this.checked)
		{
			navigationDelayInput.removeAttribute("disabled")
		}
		else
		{
			navigationDelayInput.setAttribute("disabled","disabled")
		}
		instantNavigationTrackersLogic()
	}
	trackerBypassCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			no_tracker_bypass:(!this.checked).toString()
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
		if(this.checked)
		{
			crowdOpenDelayCheckbox.removeAttribute("disabled")
			crowdOpenDelayLogic()
		}
		else
		{
			crowdOpenDelayCheckbox.setAttribute("disabled","disabled")
			crowdOpenDelayInput.setAttribute("disabled","disabled")
		}
	}
	crowdOpenDelayCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			crowd_open_delay:(this.checked?crowdOpenDelayInput.value:61)
		})
		crowdOpenDelayLogic()
	}
	crowdOpenDelayInput.oninput=function()
	{
		clearTimeout(crowdOpenDelayInputTimer)
		crowdOpenDelayInputTimer=setTimeout(()=>{
			brws.storage.sync.set({
				crowd_open_delay:crowdOpenDelayInput.value
			})
		},300)
	}
	infoBoxCheckbox.onchange=function()
	{
		brws.storage.sync.set({
			no_info_box:(!this.checked).toString()
		})
	}
})
function instantNavigationTrackersLogic()
{
	if(!trackerBypassCheckbox.checked||(navigationDelayCheckbox.checked&&navigationDelayInput.value==0))
	{
		instantNavigationTrackersCheckbox.setAttribute("disabled","disabled")
	}
	else
	{
		instantNavigationTrackersCheckbox.removeAttribute("disabled")
	}
}
function crowdOpenDelayLogic()
{
	if(crowdOpenDelayCheckbox.checked)
	{
		crowdOpenDelayInput.removeAttribute("disabled")
	}
	else
	{
		crowdOpenDelayInput.setAttribute("disabled","disabled")
	}
}

//Highlight option from hash
let hash=location.hash.toString().replace("#","")
if(hash)
{
	document.querySelector("[for='"+hash+"']").className="highlight"
}

//Custom Bypasses
var example=`// Some examples of what you can do with custom bypasses:
domainBypass("example.com", () => {
	// Triggered on example.com and subdomains (e.g. www.example.com)
	ensureDomLoaded(() => {
		// Triggered as soon as the DOM is ready
		// You can use ifElement to check if an element is available via document.querySelector:
		ifElement("a#skip_button[href]", a => {
			safelyNavigate(a.href)
			// safelyNavigate makes sure the given URL is valid
		}, () => {
			// Optional function to be called if the given element is not available
		})
	})
	// You can also use awaitElement to wait until an element is available via a query selector:
	awaitElement("a#skip_button[href]", a => {
		safelyNavigate(a.href)
	})
})
domainBypass(/example\\.(com|org)/, () => {
	// Triggered if the regex matches any part of the hostname
})
hrefBypass(/example\\.(com|org)/, () => {
	// Triggered if the regex matches any part of the URL
})
// Enjoy! Your changes will be saved automatically.
`,saveTimer,editor=ace.edit("userscript",{mode:"ace/mode/javascript",theme:"ace/theme/monokai"}),
span=document.querySelector("[data-message='optionsUserscriptsDescription']")
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
