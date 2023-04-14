import BypassDefinition from './BypassDefinition.js'

export default class Admaven extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        //Execute only if the regex matches /.*\/s\?[A-Za-z]{3}/
        if (window.location.pathname.match(/.*\/s\?[A-Za-z0-9]{3}/)) {
            this.helpers.safelyNavigate(document.scripts[0].textContent.split("link: '")[1].split("'")[0])
        }
    }
}

export const matches = ["mega-guy.com", "ofpacksmega.com", "depravityweb.co", "secretpack-links.com", "secret-links.com", "tavernleaks.com", "free-leaks.com", "hotstars-leaks.com", "thepremium.online", "admiregirls-byme.com", "all-fans.online", "pnp-drops.me", "megadropz.com", "goldmega.online", "badgirlsdrop.com", "rareofhub.com", "only-fun.xyz", "megadumpz.com", "leakutopia.site", "xprmpacks.com", "onlymega.co", "tomxcontent.com", "newsociety0.co", "cemendemons.com", "fansmega.com", "premiumstashdrop.com"]
