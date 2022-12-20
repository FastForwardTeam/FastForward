import BypassDefinition from './BypassDefinition.js'

export default class Sfile extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        this.helpers.ODP(window, 'downloadButton', {
            set: a => {
                if (a?.href) {
                    this.helpers.safelyAssign(a.href)
                }
            }
        })
    }
}

export const matches = ['sfile.mobi', 'sfile.xyz', 'apkmos.com']
