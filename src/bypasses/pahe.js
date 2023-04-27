import BypassDefinition from './BypassDefinition.js';

export default class Pahe extends BypassDefinition {
    constructor() {
        super();
    }

    execute() {
        let _addEventListener = window.addEventListener
        window.addEventListener = (e, f) => {
            if (e == "load" && f.toString().indexOf("[n*15];") !== -1) {
                _addEventListener(e, () => eval("(" + f.toString().split("[n*15];").join("[n*15]+'#bypassClipboard='+event.target.getAttribute('data-bypass-clipboard')") + ")()"))
            }
            else {
                _addEventListener(e, f)
            }
        }

        this.helpers.ensureDomLoaded(() => document.querySelectorAll("acee").forEach(a => {
            let s = location.pathname.replace(/[^a-zA-Z0-9]/g, ""),
                ep = a.parentNode.querySelector("span[style] > b")
            if (ep !== null) {
                s += ep.textContent.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
            }
            qe = a.previousElementSibling
            while (qe && qe.tagName != "B" && qe.tagName != "STRONG" && qe.tagName != "BR") {
                qe = qe.previousElementSibling
            }
            if (qe !== null) {
                s += (qe.tagName == "BR" ? qe.previousSibling : qe).textContent.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
            }
            s += a.textContent.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
            a.setAttribute("data-bypass-clipboard", s)
        }))
    }
}

export const matches = ['pahe.in', 'pahe.ph', 'pahe.me'];

