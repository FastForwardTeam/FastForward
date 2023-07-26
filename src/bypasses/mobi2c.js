import BypassDefinition from './BypassDefinition.js'

export default class Mobi2c extends BypassDefinition {
    constructor() {
        super()
        // custom bypass required bases can be set here
    }

    execute() {
        // /mobi2c.com|newforex.online|healthy4pepole.com|world-trips.net|forex-gold.net|healdad.com|world2our.com|gamalk-sehetk.com|mobitaak.com|forexit.online|shopforex.online|bluetechno.net/, function() {ClickIfExists('.submitBtn', 3);ClickIfExists('#go_d', 3, 'setInterval');});
        //Click the element .submitBtn after a delay of 3 seconds
        this.helpers.setTimeout(() => {
            document.getElementsByClassName('.submitBtn')[0].click();
        }, 3000);
        //Click the element #go_d every 3 seconds until it is clicked
        this.helpers.setInterval(() => {
            document.getElementById('#go_d')[0].click();
        }, 3000);
    }
}

export const matches = ['mobi2c.com', 'newforex.online', 'healthy4pepole.com', 'world-trips.net', 'forex-gold.net', 'healdad.com', 'world2our.com', 'gamalk-sehetk.com', 'mobitaak.com', 'forexit.online', 'shopforex.online', 'bluetechno.net']
