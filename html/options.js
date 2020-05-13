document.querySelector("[data-message='optionsNavigationDelay']").innerHTML=document.querySelector("[data-message='optionsNavigationDelay']").innerHTML.replace("%",'<input id="option-navigation-delay" type="number" min="0" skip="1" style="width:34px">')
document.querySelector("[data-message='optionsCrowdAutoOpen']").innerHTML=document.querySelector("[data-message='optionsCrowdAutoOpen']").innerHTML.replace("%",'<input id="option-crowd-open-delay" type="number" min="0" skip="1" style="width:34px">')
document.querySelector("[data-message='optionsCrowdAutoClose']").innerHTML=document.querySelector("[data-message='optionsCrowdAutoClose']").innerHTML.replace("%",'<input id="option-crowd-close-delay" type="number" min="3" skip="1" style="width:34px">')
document.querySelector("[data-message='optionsUserscriptsDescription']").innerHTML=document.querySelector("[data-message='optionsUserscriptsDescription']").textContent.replace("GitHub","<a href='https://github.com/Sainan/Universal-Bypass/blob/master/injection_script.js' target='_blank'>GitHub</a>")

const updateButton=document.querySelector("[data-message='update']"),
enabledCheckbox=document.getElementById("option-enabled"),
enabledLabel=document.querySelector("label[for='option-enabled']"),
navigationDelayInput=document.getElementById("option-navigation-delay"),
navigationDelayCheckbox=document.getElementById("navigation-delay-toggle"),
trackerBypassCheckbox=document.getElementById("option-tracker-bypass"),
instantNavigationTrackersCheckbox=document.getElementById("option-instant-navigation-trackers"),
blockIPLoggersCheckbox=document.getElementById("option-block-ip-loggers"),
crowdBypassCheckbox=document.getElementById("option-crowd-bypass"),
crowdOpenDelayInput=document.getElementById("option-crowd-open-delay"),
crowdOpenDelayCheckbox=document.getElementById("option-crowd-open-delay-toggle"),
crowdCloseDelayInput=document.getElementById("option-crowd-close-delay"),
crowdCloseDelayCheckbox=document.getElementById("option-crowd-close-delay-toggle"),
instantNavigationTrackersLogic = () => {
	if(!trackerBypassCheckbox.checked||(navigationDelayCheckbox.checked&&navigationDelayInput.value==0))
	{
		instantNavigationTrackersCheckbox.setAttribute("disabled","disabled")
	}
	else
	{
		instantNavigationTrackersCheckbox.removeAttribute("disabled")
	}
},
crowdOpenDelayLogic = () => {
	if(crowdOpenDelayCheckbox.checked)
	{
		crowdOpenDelayInput.removeAttribute("disabled")
	}
	else
	{
		crowdOpenDelayInput.setAttribute("disabled","disabled")
	}
},
crowdCloseDelayLogic = () => {
	if(crowdCloseDelayCheckbox.checked)
	{
		crowdCloseDelayInput.removeAttribute("disabled")
	}
	else
	{
		crowdCloseDelayInput.setAttribute("disabled","disabled")
	}
},
defaultUserScript=`// Some examples of what you can do with custom bypasses:
domainBypass("example.com", () => {
	// Triggered on example.com and subdomains (e.g. www.example.com)
	ensureDomLoaded(() => {
		// Triggered as soon as the DOM is ready
	})
	// You can use ifElement to check if an element is available via document.querySelector:
	ifElement("a#skip_button[href]", a => {
		safelyNavigate(a.href)
		// safelyNavigate asserts that given URL is valid before navigating and returns false if not
	}, () => {
		// Optional function to be called if the given element is not available
	})
	// You can also use awaitElement to wait until an element is available via a query selector:
	awaitElement("a#skip_button[href]", a => {
		safelyAssign(a.href)
		// safelyAssign is the same as safelyNavigate but skips the
		// "You're almost at your destination" page, should the user have it enabled
	})
})
domainBypass(/example\\.(com|org)/, () => {
	// Triggered if the regex matches any part of the hostname
})
hrefBypass(/example\\.(com|org)/, () => {
	// Triggered if the regex matches any part of the URL
})
// Enjoy! Your changes will be saved automatically.
`

let navigationDelayInputTimer,crowdOpenDelayInputTimer,crowdCloseDelayInputTimer,saveTimer

let hash=location.hash.toString().replace("#","")
if(hash)
{
	if(hash=="firstrun")
	{
		document.getElementById("firstrun-alert").classList.remove("uk-hidden")
	}
	else
	{
		let elm=document.querySelector("[for='"+hash+"']")
		if(elm)
		{
			elm.classList.add("uk-text-warning")
		}
	}
}

let editor=ace.edit("userscript",{mode:"ace/mode/javascript",theme:"ace/theme/monokai"})
editor.on("change", ()=>{
	clearInterval(saveTimer)
	saveTimer=setTimeout(()=>{
		brws.storage.local.set({
			userscript: editor.getValue()
		})
	},500)
})

let port=brws.runtime.connect({name:"options"}),wasUpdating=false,devMode=false,amoVersion=false
port.onMessage.addListener(data=>{
	if("extension_version" in data)
	{
		document.getElementById("version").textContent=data.extension_version
	}
	if("amo" in data)
	{
		if(data.amo)
		{
			updateButton.classList.add("uk-hidden")
			amoVersion = true
		}
	}
	if("upstreamCommit" in data)
	{
		if(data.upstreamCommit)
		{
			devMode=false
			document.getElementById("definitionsVersion").innerHTML=brws.i18n.getMessage("definitionsVersion")+" <code>"+data.upstreamCommit.substr(0,7)+"</code>"
			document.getElementById("dev-alert").classList.add("uk-hidden")
		}
		else
		{
			devMode=true
			document.getElementById("definitionsVersion").textContent="Development Mode"
			document.getElementById("dev-alert").classList.remove("uk-hidden")
		}
	}
	if("bypassCounter" in data && data.bypassCounter > 1)
	{
		const counter=document.getElementById("counter"),
		span=counter.querySelector("span")
		span.textContent=brws.i18n.getMessage("bypassCounter")
		span.innerHTML=span.innerHTML.replace("%","<b>"+data.bypassCounter+"</b>")
		counter.classList.remove("uk-hidden")
	}
	if("userScript" in data)
	{
		if(data.userScript)
		{
			editor.setValue(data.userScript)
		}
		else
		{
			editor.setValue(defaultUserScript)
		}
		editor.resize()
		editor.clearSelection()
	}
	if("updateSuccess" in data&&!devMode&&!amoVersion)
	{
		UIkit.notification({
			message:brws.i18n.getMessage("updat"+(data.updateSuccess?"ing":"eNo")),
			status:"primary",
			timeout:3000
		})
	}
	if("updateStatus" in data&&!amoVersion)
	{
		if(data.updateStatus)
		{
			updateButton.setAttribute("disabled","disabled")
			if(data.updateStatus == "updating")
			{
				updateButton.textContent=brws.i18n.getMessage("updating")
				wasUpdating=true
			}
		}
		else
		{
			updateButton.textContent=brws.i18n.getMessage("update")
			updateButton.removeAttribute("disabled")
			if(wasUpdating)
			{
				UIkit.notification({
					message:devMode?"Successfully loaded local bypass definitions.":brws.i18n.getMessage("updateYes"),
					status:"success",
					timeout:3000
				})
				wasUpdating=false
			}
		}
	}
})
updateButton.onclick=()=>{
	if(!updateButton.hasAttribute("disabled"))
	{
		port.postMessage({type:"update"})
	}
}

brws.storage.sync.get(["disable","navigation_delay","no_tracker_bypass","no_instant_navigation_trackers","allow_ip_loggers","crowd_bypass","crowd_open_delay","crowd_close_delay","no_info_box"],res=>{
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
		enabledLabel.classList.add("uk-text-danger")
	}
	if(res.navigation_delay<0)
	{
		navigationDelayInput.value=(res.navigation_delay*-1)-1
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
	if(res.crowd_bypass==="true")
	{
		crowdBypassCheckbox.setAttribute("checked","checked")
	}
	if(res.crowd_open_delay<0)
	{
		crowdOpenDelayInput.value=(res.crowd_open_delay*-1)-1
		crowdOpenDelayInput.setAttribute("disabled","disabled")
	}
	else
	{
		crowdOpenDelayInput.value=res.crowd_open_delay
		crowdOpenDelayCheckbox.setAttribute("checked","checked")
	}
	if(res.crowd_close_delay<0)
	{
		crowdCloseDelayInput.value=(res.crowd_close_delay*-1)-1
		crowdCloseDelayInput.setAttribute("disabled","disabled")
	}
	else
	{
		crowdCloseDelayInput.value=res.crowd_close_delay
		crowdCloseDelayCheckbox.setAttribute("checked","checked")
	}
	instantNavigationTrackersLogic()
	enabledCheckbox.onchange=function()
	{
		enabledLabel.classList.remove("uk-text-danger")
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
		let navigation_delay=parseInt(navigationDelayInput.value)
		if(!this.checked)
		{
			navigation_delay=(navigation_delay+1)*-1
		}
		brws.storage.sync.set({navigation_delay})
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
			crowd_bypass:this.checked.toString()
		})
		if(this.checked)
		{
			crowdOpenDelayCheckbox.removeAttribute("disabled")
			crowdCloseDelayCheckbox.removeAttribute("disabled")
			crowdOpenDelayLogic()
			crowdCloseDelayLogic()
		}
		else
		{
			crowdOpenDelayCheckbox.setAttribute("disabled","disabled")
			crowdOpenDelayInput.setAttribute("disabled","disabled")
			crowdCloseDelayCheckbox.setAttribute("disabled","disabled")
			crowdCloseDelayInput.setAttribute("disabled","disabled")
		}
	}
	crowdOpenDelayCheckbox.onchange=function()
	{
		let crowd_open_delay=parseInt(crowdOpenDelayInput.value)
		if(!this.checked)
		{
			crowd_open_delay=(crowd_open_delay+1)*-1
		}
		brws.storage.sync.set({crowd_open_delay})
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
	crowdCloseDelayCheckbox.onchange=function()
	{
		let crowd_close_delay=parseInt(crowdCloseDelayInput.value)
		if(!this.checked)
		{
			crowd_close_delay=(crowd_close_delay+1)*-1
		}
		else if(crowd_close_delay<3)
		{
			crowd_close_delay=3
		}
		brws.storage.sync.set({crowd_close_delay})
		crowdCloseDelayLogic()
	}
	crowdCloseDelayInput.oninput=function()
	{
		clearTimeout(crowdCloseDelayInputTimer)
		crowdCloseDelayInputTimer=setTimeout(()=>{
			let crowd_close_delay=parseInt(crowdCloseDelayInput.value)
			if(crowd_close_delay<3)
			{
				crowd_close_delay=3
			}
			brws.storage.sync.set({crowd_close_delay})
		},300)
	}
})
