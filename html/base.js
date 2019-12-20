const brws=(typeof browser=="undefined"?chrome:browser)
document.querySelectorAll("[data-message]").forEach(e=>e.textContent=brws.i18n.getMessage(e.getAttribute("data-message")))
document.querySelectorAll("[data-message-nbsp]").forEach(e=>e.innerHTML=brws.i18n.getMessage(e.getAttribute("data-message-nbsp")).split(" ").join("&nbsp;"))
