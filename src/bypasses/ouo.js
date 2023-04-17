import BypassDefinition from "./BypassDefinition.js"

export default class Ouo extends BypassDefinition {
    constructor() {
        super()
    }
    execute() {
        //Bypassing stuff goes here
        if (location.pathname !== '/') {
            if (/(go|fbc)/.test(location.pathname.split("/")[1])) {
                document.querySelector("form").submit()
            }
            else {
                if (document.querySelector("form#form-captcha")) {
                    document.querySelector("form#form-captcha").action = `/xreallcygo${location.pathname}`
                    document.querySelector("form#form-captcha").submit()
                }
                else {
                    this.helpers.crowdBypass()
                }
            }
        }
    }
}
