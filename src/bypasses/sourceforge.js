import BypassDefinition from './BypassDefinition'

export default class Sourceforge extends BypassDefinition {
  constructor () {
    super()
  }

  execute () {
    var button = document.createElement('button'),
      d = false
    button.className = 'direct-download'
    button.style.display = 'none'
    document.documentElement.appendChild(button)
    this.helpers.ODP(window, 'log', {
      value: m => {
        console.log(m)
        if (m == 'triggering downloader:start') {
          d = true
        }
      },
      writable: false
    })
    this.helpers.ensureDomLoaded(() => {
      let buttonTimer = setInterval(() => {
        if (d) {
          button.click()
          clearInterval(buttonTimer)
        }
      }, 100)
    })
  }
}

export const matches = ['/sourceforge.net/projects/.+/files/.+/download/']
