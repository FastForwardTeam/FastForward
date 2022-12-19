import BypassDefinition from './BypassDefinition'

export default class Earnme extends BypassDefinition {
  constructor () {
    super()
  }

  execute () {
    this.helpers.awaitElement('#tp-snp2', a => {
      a.click()
    })
  }
}

export const matches = ['earnme.club', 'usanewstoday.club']
