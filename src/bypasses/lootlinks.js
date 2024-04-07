import BypassDefinition from './BypassDefinition.js'

export default class Lootlinks extends BypassDefinition {
  constructor () {
    super()
    this.ensure_dom = true
  }
  execute () {
    this.helpers.safelyNavigate(p['PUBLISHER_LINK']) // ignore the error
  }
}

export const matches = ['loot-links.com']
