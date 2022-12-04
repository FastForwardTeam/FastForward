import BypassDefinition from "./BypassDefinition";

export default class Cbrun extends BypassDefinition {
    constructor() {
        super();
    }
    execute() {
        const a = document.querySelector("a.btn");
        if (a) {
            this.helpers.safelyNavigate(a.href);
        }
    }
}

export const matches = ['cb.run', 'cb.click'];
