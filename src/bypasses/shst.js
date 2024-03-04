import BypassDefinition from './BypassDefinition.js'

export default class Shst extends BypassDefinition {
  constructor () {
    super()
  }
  execute () {
    this.helpers.watchForElement('#timer', () => {
        window.app.options.intermediate.timerPageVisibilityChecking = false
        window.app.options.intermediate.displayCaptcha = false
        window.app.options.intermediate.timeToWait = 0
    })
    this.helpers.watchForElement('.skip-btn.show', () => {
        this.helpers.safelyNavigate(window.app.options.intermediate.destinationUrl)
    })
  }
}

export const matches = ['sh.st']
