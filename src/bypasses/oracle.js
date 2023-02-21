import BypassDefinition from './BypassDefinition.js'

export default class Oracle extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        document.querySelectorAll("[data-file]").forEach(e => {
            let link = e.getAttribute("data-file"),
                jre8 = RegExp("download.oracle.com/otn/java/jdk/8u([0-9]*)-b([0-9]*)/([a-z0-9]{32})/(.*)$", "g").exec(link)
            if (jre8 && jre8[3]){
                 os_type = RegExp("8u[0-9]*-([^-]*)-").exec(jre8[4])[1]
                 os_type = (os_type == "macosx") ? "unix" : os_type
                 e.onclick = () => this.helpers.safelyNavigate("https://javadl.oracle.com/webapps/download/GetFile/1.8.0_" + jre8[1] + "-b" + jre8[2] + "/" + jre8[3] + "/" + os_type + "-i586/" + jre8[4])
            }
        })
    }
}

export const matches = ['oracle.com']
