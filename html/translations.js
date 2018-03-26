let elms = document.querySelectorAll("[data-message]");
for(let i in elms)
{
	let elm = elms[i];
	if(elm instanceof HTMLElement)
	{
		elm.textContent = chrome.i18n.getMessage(elm.getAttribute("data-message"));
	}
}
