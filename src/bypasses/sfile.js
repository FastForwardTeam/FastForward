import BypassDefinition from './BypassDefinition'

export default class Sfile extends BypassDefinition {
  constructor () {
    super()
  }

  execute () {
    ODP(window, 'downloadButton', {
      set: a => {
        if (a && a.href) {
          this.helpers.safelyAssign(a.href)
        }
      }
    })
  }
}

export const matches = ['sfile.mobi', 'sfile.xyz', 'apkmos.com']
