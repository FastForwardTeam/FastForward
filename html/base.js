var brws=(typeof browser=="undefined"?chrome:browser)
document.querySelectorAll("[data-message]").forEach(e=>e.textContent=brws.i18n.getMessage(e.getAttribute("data-message")))
document.querySelectorAll("[data-placeholder]").forEach(e=>e.setAttribute("placeholder",brws.i18n.getMessage(e.getAttribute("data-placeholder"))))
