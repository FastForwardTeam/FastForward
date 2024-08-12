import BypassDefinition from './BypassDefinition.js'

export default class Link1s extends BypassDefinition {
  constructor () {
    super()
  }
  execute () {
    switch (window.location.hostname) {
      case 'anhdep24.com':
        this.helpers.watchForElement('.footer', () =>
          clearInterval(window.counter) // skip timer
        )
        this.helpers.watchForElement('#link1s[href]', a =>
          this.helpers.safelyNavigate(a.href) // step 1 & 3
        )
        this.helpers.watchForElement('#link1s-snp', () => window.link1sgo()) // step 2 & 4
        break
      case 'link1s.com':
        this.helpers.ensureDomLoaded(() => {
          // skip all shit
          window.app_vars.counter_value = 0
          window.app_vars.enable_captcha = 'no'
          window.app_vars.force_disable_adblock = '0'
        })
        this.helpers.watchForElement('.skip-ad a.btn', a => {
          setInterval(() => {
            this.helpers.safelyNavigate(a.href)
          }, 10) // wait for a moment for url to be updated
        })
        break
    }
  }
}

export const matches = ['link1s.com', 'anhdep24.com']
