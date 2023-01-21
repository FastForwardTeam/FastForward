import BypassDefinition from './BypassDefinition.js'

export default class Gixen extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        const sid = document.cookie.match(/sessionid=(\d+)/)[1]
        if (sid){
            let f = document.createElement('form')
            f.method = 'POST'
            f.action = "home_2.php?sessionid=" + sid
            f.innerHTML = '<input type="hidden" name="gixenlinkcontinue" value="1">'
            document.documentElement.appendChild(f)
            this.helpers.countIt(() => f.submit())
        }
    }
}

export const matches = ['gixen.com/home_1.php']
