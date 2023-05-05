import BypassDefinition from './BypassDefinition.js';

export default class Workink extends BypassDefinition {
    constructor() {
        super();
    }

    async execute() {
        this.helpers
            .crowdQuery(window.location.hostname, window.location.pathname.slice(1))
            .then((dest) => {
                this.helpers.crowdNavigate(dest);
            });
        if (window.location.pathname === '/' && window.location.hostname === 'work.ink') {
            // Do not execute code on homepage of work.ink
        } else {
            this.helpers.insertInfoBox("Please wait for a bit as we work to bypass the site :)")
        }

        this.helpers.ffclipboard.set('workink', window.location.pathname.slice(1)); //will be used in workclick script to contribute
        const websocketUrl = 'wss://redirect-api.work.ink/v1/ws';

        const [encodedUserId, linkCustom] = window.location.pathname
            .slice(1)
            .split('/')
            .slice(-2);
        // decoding encodedUserId
        const BASE =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const loopTimes = encodedUserId.length;
        this.helpers.insertInfoBox(
            'Please wait for a bit as we work to bypass the site :)'
        );
        let decodedUserId = BASE.indexOf(encodedUserId[0]);
        for (let i = 1; i < loopTimes; i++)
            decodedUserId = 62 * decodedUserId + BASE.indexOf(encodedUserId[i]);

        const payloads = {
            announce: JSON.stringify({
                type: 'c_announce',
                payload: {
                    linkCustom: linkCustom,
                    linkUserId: decodedUserId,
                    referer: 'unknown',
                },
            }),
            ping: JSON.stringify({
                type: 'c_ping',
                payload: {},
            }),
            captcha: JSON.stringify({
                type: 'c_recaptcha_response',
                payload: {
                    recaptchaResponse: crypto.randomUUID(),
                },
            }),
            social: (url) =>
                JSON.stringify({
                    type: 'c_social_started',
                    payload: {
                        url,
                    },
                }),
            readArticles: {
                1: JSON.stringify({
                    type: 'c_monetization',
                    payload: {
                        type: 'readArticles',
                        payload: {
                            event: 'start',
                        },
                    },
                }),
                2: JSON.stringify({
                    type: 'c_monetization',
                    payload: {
                        type: 'readArticles',
                        payload: {
                            event: 'closeClicked',
                        },
                    },
                }),
            },
            browserExtension: {
                1: JSON.stringify({
                    type: 'c_monetization',
                    payload: {
                        type: 'browserExtension',
                        payload: {
                            event: 'start',
                        },
                    },
                }),
                2: (token) =>
                    JSON.stringify({
                        type: 'c_monetization',
                        payload: {
                            type: 'browserExtension',
                            payload: {
                                event: 'confirm',
                                token,
                            },
                        },
                    }),
            },
        };
        let ws = new WebSocket(websocketUrl);
        let interval;
        ws.onopen = () => {
            ws.send(payloads.announce);
            interval = setInterval(() => ws.send(payloads.ping), 10 * 1000);
        };
        let socials = [];
        let activeMonetizationTypes = [];
        ws.onmessage = async (e) => {
            const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
            const data = JSON.parse(e.data);
            if (data.error) return;
            const payload = data.payload;

            switch (data.type) {
                case 's_link_info':
                    if (payload.socials) socials.push(...payload.socials);
                    const monetizationTypes = ['readArticles', 'browserExtension'];
                    for (const type of monetizationTypes) {
                        if (payload.monetizationScript.includes(type)) {
                            activeMonetizationTypes.push(type);
                        }
                    }
                    break;
                case 's_start_recaptcha_check':
                    ws.send(payloads.captcha);
                    break;
                case 's_recaptcha_okay':
                    if (socials.length) {
                        for (const [index, social] of socials.entries()) {
                            ws.send(payloads.social(social.url));
                            await sleep(3 * 1000);
                        }
                    }

                    if (activeMonetizationTypes.length) {
                        for (const type of activeMonetizationTypes) {
                            switch (type) {
                                case 'readArticles':
                                    ws.send(payloads.readArticles['1']);
                                    ws.send(payloads.readArticles['2']);
                                    break;
                                case 'browserExtension':
                                    if (activeMonetizationTypes.includes('readArticles'))
                                        await sleep(16 * 1000);
                                    ws.send(payloads.browserExtension['1']);
                                    break;
                            }
                        }
                    }
                    break;
                case 's_monetization':
                    if (payload.type !== 'browserExtension') break;
                    ws.send(payloads.browserExtension['2'](payload.payload.token));
                    break;
                case 's_link_destination': {
                    const url = new URL(payload.url);
                    if (url.searchParams.has('duf')) {
                        payload.url = window.atob(
                            url.searchParams.get('duf').split('').reverse().join('')
                        );
                    }
                    this.helpers.safelyNavigate(payload.url);
                    break;
                }
            }
        };
    }
}

export const matches = ['work.ink'];
