import BypassDefinition from './BypassDefinition.js'

export default class Firefaucet extends BypassDefinition {
    constructor() {
        super()
        // Custom bypass required bases can be set here
    }

    execute() {
        window.setInterval = f => setInterval(f, 1)
    }
}

export const matches = [ 'firefaucet.win/l/', 'sfirmware.com/downloads-file/', 'apkily.com/getapp$', 'androidtop.net/?do=downloads&id=' ]
