import BypassDefinition from './BypassDefinition.js';

export default class Downloadrin extends BypassDefinition {
    constructor() {
        super();
        // Custom bypass required bases can be set here
    }

    execute() {
        // Extract query parameters from the current URL and safely navigate
        const queryParams = new URL(location.href).search.slice(1);
        safelyNavigate(queryParams);
    }
}

export const matches = ['downloadr.in'];
