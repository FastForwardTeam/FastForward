import BypassDefinition from './BypassDefinition.js';

export default class Linkvertise extends BypassDefinition {
    constructor() {
        super();
        // custom bypass required bases can be set here
    }

    execute() {
        if (window.location.href.toString().includes("?r=")) {
            const urlParams = new URLSearchParams(window.location.search);
            const r = urlParams.get('r')
            this.helpers.safelyNavigate(atob(decodeURIComponent(r)));
        }

        const lvt_this = this;

        const rawOpen = window.XMLHttpRequest.prototype.open;

        window.XMLHttpRequest.prototype.open = function () {
            this.addEventListener('load', data => {
                if (data.currentTarget?.responseText?.includes('tokens')) {
                    const response = JSON.parse(data.currentTarget.responseText);

                    if (!response.data.valid)
                        return lvt_this.helpers.insertInfoBox('Please solve the captcha, afterwards we can immediately redirect you');

                    const target_token = response.data.tokens['TARGET'];
                    const ut = localStorage.getItem("X-LINKVERTISE-UT");
                    const linkvertise_link = location.pathname.replace(/\/[0-9]$/, "");


                    fetch(`https://publisher.linkvertise.com/api/v1/redirect/link/static${linkvertise_link}?X-Linkvertise-UT=${ut}`).then(r => r.json()).then(json => {
                        if (json?.data.link.id) {
                            const json_body = {
                                serial: btoa(JSON.stringify({
                                    timestamp: new Date().getTime(),
                                    random: "6548307",
                                    link_id: json.data.link.id
                                })),
                                token: target_token
                            }
                            fetch(`https://publisher.linkvertise.com/api/v1/redirect/link${linkvertise_link}/target?X-Linkvertise-UT=${ut}`, {
                                method: "POST",
                                body: JSON.stringify(json_body),
                                headers: {
                                    "Accept": 'application/json',
                                    "Content-Type": 'application/json'
                                }
                            }).then(r => r.json()).then(json => {
                                if (json?.data.target) {
                                    lvt_this.helpers.safelyNavigate(json.data.target)
                                }
                            })
                        }
                    })
                }
            });
            rawOpen.apply(this, arguments);
        }
    }
}

export const matches = ['linkvertise.com', 'linkvertise.net', 'link-to.net'];
