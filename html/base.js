var brws=(typeof browser=="undefined"?chrome:browser)
document.querySelectorAll("[data-message]").forEach(e=>e.textContent=brws.i18n.getMessage(e.getAttribute("data-message")))
