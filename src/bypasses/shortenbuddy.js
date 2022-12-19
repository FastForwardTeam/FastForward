import BypassDefinition from "./BypassDefinition";

export default class Shortenbuddy extends BypassDefinition {
    constructor() {
        super();
    }
    execute() {
        let url = location.href.replace("links.","");
        this.helpers.safelyAssign(url);
    }

}

export const matches = ["links.shortenbuddy.com"];
