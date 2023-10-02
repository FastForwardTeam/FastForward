import BypassDefinition from './BypassDefinition.js';

export default class Spaste extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    this.helpers.insertInfoBox('Please complete the captcha to continue');
    const doTheThing = f => setTimeout(() => {
      let item = document.querySelector('#currentCapQue').textContent;
      document.querySelectorAll('.markAnswer').forEach(as => {
        if (as.querySelector('img').getAttribute('src').toLowerCase().indexOf(item) > -1) {
          as.click();
        }
      });
      f();
    }, 200);
    document.querySelector('#captchaVerifiedStatus').click();
    doTheThing(() => doTheThing(() => doTheThing(() => document.querySelector('#template-contactform-submit').click())));
  }
}

export const matches = ['spaste.com/s', 'spaste.com/site'];
