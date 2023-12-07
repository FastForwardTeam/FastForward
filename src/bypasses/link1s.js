import BypassDefinition from './BypassDefinition.js'

export default class Link1s extends BypassDefinition {
  constructor () {
    super()
  }
  execute () {
    this.helpers.watchForElement('#link1s[href]', a =>
      this.helpers.safelyNavigate(a.href)
    )
    this.helpers.watchForElement('#link1s-snp button', b => b.click())
    this.helpers.watchForElement('.skip-ad a.btn', a => {
      setInterval(() => {
        this.helpers.safelyNavigate(a.href)
      }, 50) // wait for a moment for url to be updated
    })
  }
}

export const matches = ['link1s.com', 'anhdep24.com']
