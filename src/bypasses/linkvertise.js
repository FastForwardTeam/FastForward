import BypassDefinition from './BypassDefinition.js';

export default class Linkvertise extends BypassDefinition {
    constructor() {
        super()
    }

    execute() {
        if (/[?&]r=/.test(window.location.href.toString())) {
            const urlParams = new URLSearchParams(window.location.search)
            const r = urlParams.get('r')
            this.helpers.safelyNavigate(atob(decodeURIComponent(r)))
        }

        this.helpers.bypassRequests(async data => {
            if (data.currentTarget?.responseText?.includes('getDetailPageContent')) {
                const response = JSON.parse(data.currentTarget.responseText)
                const access_token = response.data.getDetailPageContent.access_token;
                const ut = localStorage.getItem('X-LINKVERTISE-UT')
                const linkvertise_link = location.pathname.replace(/\/[0-9]$/, '')
                const regexMatch = linkvertise_link.match(/^\/(\d+)\/([\w-]+)$/);
                if (!regexMatch) return;
                const user_id = regexMatch[1];
                const link_vertise_url = regexMatch[2];

                const completeDetailRequest = await fetch(
                    `https://publisher.linkvertise.com/graphql?X-Linkvertise-UT=${ut}`, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'operationName': 'completeDetailPageContent',
                            'variables': {
                                'linkIdentificationInput': {
                                    'userIdAndUrl': {
                                        'user_id': user_id,
                                        'url': link_vertise_url
                                    }
                                },
                                'completeDetailPageContentInput': {
                                    'access_token': access_token
                                }
                            },
                            'query': 'mutation completeDetailPageContent($linkIdentificationInput: PublicLinkIdentificationInput!, $completeDetailPageContentInput: CompleteDetailPageContentInput!) {\n  completeDetailPageContent(\n    linkIdentificationInput: $linkIdentificationInput\n    completeDetailPageContentInput: $completeDetailPageContentInput\n  ) {\n    CUSTOM_AD_STEP\n    TARGET\n    additional_target_access_information {\n      remaining_waiting_time\n      can_not_access\n      should_show_ads\n      has_long_paywall_duration\n      __typename\n    }\n    __typename\n  }\n}'
                        })
                    });
                if (completeDetailRequest.status !== 200) return;
                const completeDetailResponse = await completeDetailRequest.json();
                const TARGET = completeDetailResponse.data.completeDetailPageContent.TARGET;
                if (!TARGET) return;

                const getTargetPageRequest = await fetch(
                    `https://publisher.linkvertise.com/graphql?X-Linkvertise-UT=${ut}`, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'query': 'mutation getDetailPageTarget($linkIdentificationInput: PublicLinkIdentificationInput!, $token: String!) {\n  getDetailPageTarget(\n    linkIdentificationInput: $linkIdentificationInput\n    token: $token\n  ) {\n    type\n    url\n    paste\n    short_link_title\n    __typename\n  }\n}',
                            'variables': {
                                'linkIdentificationInput': {
                                    'userIdAndUrl': {
                                        'user_id': user_id,
                                        'url': link_vertise_url
                                    }
                                },
                                'token': TARGET
                            }
                        })
                    }
                )
                if (getTargetPageRequest.status !== 200) return;
                const targetPageResponse = await getTargetPageRequest.json();
                const targetPageURL = targetPageResponse['data']['getDetailPageTarget']['url'];
                this.helpers.safelyNavigate(targetPageURL);
            }
        })
    }
}

export const matches = ['linkvertise.com', 'linkvertise.net', 'link-to.net']