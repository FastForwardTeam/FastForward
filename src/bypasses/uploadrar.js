import BypassDefinition from './BypassDefinition.js'

export default class Uploadrar extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        document.querySelector('.mngez-free-download').click();
        document.querySelector('#direct_link > a:nth-child(1)').click();
        document.querySelector('#downloadbtn.downloadbtn').click();
    }
}

export const matches = ['uploadrar.com', 'uploadrar.net', 'uptomega.me']
