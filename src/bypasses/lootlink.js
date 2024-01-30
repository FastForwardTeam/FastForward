import BypassDefinition from './BypassDefinition.js'

export default class LootLink extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        // the bypass to this is reminiscent to decoding cloudflare's email protection but with the exception that this uses the first 5 bytes as the key and cloudflare uses the first 1
        let final = ""
        let combinationLink = atob(p.PUBLISHER_LINK)
        let key = combinationLink.substring(0, 5)
        let enc_link = combinationLink.substring(5)
        for (let i = 0; i < enc_link.length; i++) {
            let enc_char = enc_link.charCodeAt(i)
            let keyAtOffset = key.charCodeAt(i % key.length)
            let charcode = enc_char ^ keyAtOffset
            final += String.fromCharCode(charcode)
        }
        this.helpers.safelyNavigate(final)
    }
}

export const matches = ['lootlinks.co']
