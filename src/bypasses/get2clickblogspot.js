import BypassDefinition from './BypassDefinition.js';

export default class Get2clickblogspot extends BypassDefinition {
  constructor() {
    super();
  }

  execute() {
    // Find the div with the class "hidden btn waves-effect waves-light blue darken-2 white-text" and change it to "btn waves-effect waves-light blue darken-2 white-text"
    document.querySelector('.hidden.btn.waves-effect.waves-light.blue.darken-2.white-text').className = 'btn.waves-effect.waves-light.blue.darken-2.white-text';

    //Find the div with the class btn blue darken-2 waves-effect waves-light white-text hidden and make it btn blue darken-2 waves-effect waves-light white-text
    document.querySelector('.btn.blue.darken-2.waves-effect.waves-light.white-text.hidden').className = 'btn.blue.darken-2.waves-effect.waves-light.white-text';
    //Remove the disabled attribute from the div element above
    document.querySelector('.btn.blue.darken-2.waves-effect.waves-light.white-text').removeAttribute('disabled');
//Wait until the page is changed
    window.addEventListener('load', () => {
      //The url will look like this https://get-click2.blogspot.com/2019/01/0xc60f.live?m=1
      //return the part of the url that is after the date, in this case it is 0xc60f.live?m=1
      let url = location.href.replace(/.*\/\d+\/(.*)/, '$1');
      this.helpers.safelyNavigate(url);
    });
  }
}

export const matches = ['get-click2.blogspot.com/'];
