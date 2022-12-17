document.querySelectorAll("[data-message]").forEach(e=>e.textContent=brws.i18n.getMessage(e.getAttribute("data-message")))
const titleElm=document.querySelector("title"),title=titleElm.textContent
