const IMPLEMENTATION_ERROR = function_name => {
    throw new Error(`${function_name} must be implemented`)
}

export default class BypassDefinition {
    constructor() {
        this.ensure_dom = false
    }

    set_helpers(helpers) {
        this.helpers = helpers
    }

    execute() {
        IMPLEMENTATION_ERROR()
    }
}
