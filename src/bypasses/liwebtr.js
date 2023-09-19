import BypassDefinition from './BypassDefinition.js';

export default class Liwebtr extends BypassDefinition {
    constructor() {
        super();
        // Custom bypass required bases can be set here
    }

    execute() {
        const scriptElements = document.head.getElementsByTagName('script');

        for (const script of scriptElements) {
            if (script.textContent.includes('window.location=')) {
                const urlMatch = script.textContent.match(/window\.location=["'](https:\/\/[^"']+)["']/);

                if (urlMatch && urlMatch[1]) {
                    window.location.href = urlMatch[1];
                    break;
                }
            }
        }
    }
}

export const matches = ['li.web.tr'];
