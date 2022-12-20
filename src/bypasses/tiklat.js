import BypassDefinition from './BypassDefinition.js'

export default class Tiklat extends BypassDefinition {
  constructor () {
    super()
  }

  execute () {
    window.setInterval = func => setInterval(func, 1)
    this.helpers.awaitElement('.skip > .wait > .skip > .btn > a[href]', a => {
      this.helpers.safelyNavigate(a.href)
    })
  }
}

export const matches = ['tik.lat']
