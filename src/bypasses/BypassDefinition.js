const IMPLEMENTATION_ERROR = (function_name) => { throw new Error(`${function_name} must be implemented`); }

export default class BypassDefinition {
    execute() { IMPLEMENTATION_ERROR(); }
}
