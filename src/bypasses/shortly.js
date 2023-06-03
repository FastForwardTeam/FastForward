import BypassDefinition from './BypassDefinition.js'

export default class Shortly extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        if (location.pathname.substr(0, 3) === "/r/") {
            document.getElementById = () => ({
                submit: () => {
                    let f = document.querySelector("form")
                    f.action = "/link#" + document.querySelector("input[name='id']").value
                    f.submit()
                }
            })
        }
        else if (location.pathname === "/link") {
            let xhr = new XMLHttpRequest()
            xhr.onload = () => this.helpers.safelyNavigate(xhr.responseText)
            xhr.open("POST", "https://www.shortly.xyz/getlink.php", true)
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
            xhr.send("id=" + location.hash.substr(1))
        }
    }
}

export const matches = ['shortly.xyz']
