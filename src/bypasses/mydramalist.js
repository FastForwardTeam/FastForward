import BypassDefinition from './BypassDefinition.js'

export default class Mydramalist extends BypassDefinition {
  constructor () {
    super()
  }

  execute () {
    const search_params = location.search
    const decoded_search_params = decodeURIComponent(search_params)
    const full_url = decoded_search_params.replace('?q=', '')
    this.helpers.safelyNavigate(full_url)
  }
}

export const matches = ['mydramalist.com']
