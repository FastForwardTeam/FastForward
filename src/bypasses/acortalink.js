import BypassDefinition from './BypassDefinition.js'

export default class Acortalink extends BypassDefinition {
    constructor() {
        super()
        this.ensure_dom = true
    }

    execute() {
        function rot13(str) {
            const input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
            let index = x => input.indexOf(x);
            let translate = x => index(x) > -1 ? output[index(x)] : x;
            return str.split('').map(translate).join('');
		}
		// Triggered on example.com and subdomains (e.g. www.example.com)
		this.helpers.ensureDomLoaded(() => {
			// Triggered as soon as the DOM is ready
			window.open = (linkacorta) => {
			    this.helpers.safelyNavigate(rot13(atob(linkacorta.substring(30))));
			};
			GetLink();
		})
    }
}

export const matches = ['acortalink.me']
