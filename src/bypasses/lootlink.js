import BypassDefinition from './BypassDefinition.js'

export default class LootLink extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        if (/[?&]r=/.test(window.location.href.toString())) { // https://loot-link.com/s?fJjn&r=
            const urlParams = new URLSearchParams(window.location.search)
            const r = urlParams.get('r')
            const finalURL = decodeURIComponent(escape(atob(r)))
            this.helpers.safelyNavigate(finalURL)
        } else { // https://loot-link.com/s?fJjn
            const originalFetch = window.fetch
            window.fetch = (url, config) => this.customFetch(url, config, originalFetch)
        }
    }

    customFetch(url, config, originalFetch) {
        if (url.includes(`${INCENTIVE_SYNCER_DOMAIN}/tc`)) {
            return originalFetch(url, config).then(response => {
                if (!response.ok) return response.json()
                return this.handleResponse(response)
            });
        }
        return originalFetch(url, config)
    }

    handleResponse(response) {
        return response.clone().json().then(data => {
            this.helpers.insertInfoBox(
                'Please wait a moment while we search for the destination link.'
            );
            let urid = ""
            let action_pixel_url = ""
            data.forEach(item => {
                urid = item.urid
                action_pixel_url = item.action_pixel_url
            });

            const task_id = 54; // magic number

            this.setupWebSocket(urid, task_id)
            navigator.sendBeacon(`https://${urid.substr(-5) % 3}.${INCENTIVE_SERVER_DOMAIN}/st?uid=${urid}&cat=${task_id}`)
            fetch(`https://${INCENTIVE_SYNCER_DOMAIN}/td?ac=1&urid=${urid}&&cat=${task_id}&tid=${TID}`)
            fetch(action_pixel_url)

            return new Response(JSON.stringify(data), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            })
        })
    }

    setupWebSocket(urid, task_id) {
        const ws = new WebSocket(`wss://${urid.substr(-5) % 3}.${INCENTIVE_SERVER_DOMAIN}/c?uid=${urid}&cat=${task_id}&key=${KEY}`)

        ws.onopen = () => setInterval(() => ws.send('0'), 1000)
        ws.onmessage = event => {
            if (event.data.includes('r:')) {
                this.helpers.safelyNavigate(this.decryptData(event.data.replace('r:', '')))
            }
        }
    }

    decryptData(encodedData) {
        let final = ""
        let combinationLink = atob(encodedData)
        let key = combinationLink.substring(0, 5)
        let enc_link = combinationLink.substring(5)
        for (let i = 0; i < enc_link.length; i++) {
            let enc_char = enc_link.charCodeAt(i)
            let keyAtOffset = key.charCodeAt(i % key.length)
            let charcode = enc_char ^ keyAtOffset
            final += String.fromCharCode(charcode)
        }

        return final
    }
}

export const matches = ['lootlinks.co', 'loot-links.com', 'loot-link.com', "linksloot.net", "lootdest.com", "lootlink.org", "lootdest.info", "lootdest.org", "links-loot.com"]
