import BypassDefinition from './BypassDefinition.js';

export default class Bstlar extends BypassDefinition {
    constructor() {
        super();
    }

    execute() {
        this.helpers.bypassRequests(async data => {
            if (data.currentTarget?.responseText?.includes('tasks')) {
                const response = JSON.parse(data.currentTarget.responseText);
                const userAgent = navigator.userAgent;
                const XSRF_TOKEN = this.getCookie('XSRF-TOKEN');
                const boostellar_session = this.getCookie('boostellar_session')
                const PfufeQwMeP6og9Poi7DmjbGJCcYhyXKQhlPnQ4Ud = this.getCookie('PfufeQwMeP6og9Poi7DmjbGJCcYhyXKQhlPnQ4Ud')
                const cf_clearance = this.getCookie('cf_clearance')
                const task_request = await fetch('https://bstlar.com/api/link-completed', {
                    method: 'POST',
                    headers: {
                        accept: 'application/json, text/plain, */*',
                        authorization: 'null',
                        cookie: `XSRF-TOKEN=${XSRF_TOKEN}; boostellar_session=${boostellar_session}; PfufeQwMeP6og9Poi7DmjbGJCcYhyXKQhlPnQ4Ud=${PfufeQwMeP6og9Poi7DmjbGJCcYhyXKQhlPnQ4Ud}; cf_clearance=${cf_clearance}`,
                        origin: 'https://bstlar.com',
                        pragma: 'no-cache',
                        priority: 'u=1, i',
                        referer: 'https://bstlar.com/hV/krampus',
                        'user-agent': userAgent,
                        'x-xsrf-token': XSRF_TOKEN,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        link_id: response['link']['id']
                    })
                })
                if (task_request.status !== 200) return;
                const task_response = await task_request.text();
                this.helpers.safelyNavigate(task_response)
            }
        });
    }

    getCookie(name) {
        let value = '; ' + document.cookie;
        let parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
}

export const matches = ['bstlar.com'];
