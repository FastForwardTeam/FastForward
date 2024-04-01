import BypassDefinition from './BypassDefinition.js'

export default class Linkvertise extends BypassDefinition {
  constructor () {
    super()
    // custom bypass required bases can be set here
  }

  execute () {
    if (/[\?&]r=/.test(window.location.href.toString())) {
      const urlParams = new URLSearchParams(window.location.search)
      const r = urlParams.get('r')
      this.helpers.safelyNavigate(atob(decodeURIComponent(r)))
    }

    const lvt_this = this
    this.helpers.bypassRequests(async data => {
      if (data.currentTarget?.responseText?.includes('tokens')) {
        const response = JSON.parse(data.currentTarget.responseText)

        if (!response.data.valid)
          return lvt_this.helpers.insertInfoBox(
            'Please solve the captcha, afterwards we can immediately redirect you'
          )

        const target_token = response.data.tokens['TARGET']
        const ut = localStorage.getItem('X-LINKVERTISE-UT')
        const linkvertise_link = location.pathname.replace(/\/[0-9]$/, '')

        let result = await fetch(
          `https://publisher.linkvertise.com/api/v1/redirect/link/static${linkvertise_link}?X-Linkvertise-UT=${ut}`
        )
        let json = await result.json()

        if (json?.data.link.target_type !== 'URL') {
          return lvt_this.helpers.insertInfoBox(
            'Due to copyright reasons we are not bypassing linkvertise stored content (paste, download etc)'
          )
        }

        if (!json?.data.link.id) return

        const json_body = {
          serial: btoa(
            JSON.stringify({
              timestamp: new Date().getTime(),
              random: '6548307',
              link_id: json.data.link.id
            })
          ),
          token: target_token
        }

        result = await fetch(
          `https://publisher.linkvertise.com/api/v1/redirect/link${linkvertise_link}/target?X-Linkvertise-UT=${ut}`,
          {
            method: 'POST',
            body: JSON.stringify(json_body),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )
        json = await result.json()

        if (json?.data.target) {
          lvt_this.helpers.safelyNavigate(json.data.target)
        }
      }
    })
  }
}

export const matches = ['linkvertise.com', 'linkvertise.net', 'link-to.net']
