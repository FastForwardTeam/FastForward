import BypassDefinition from './BypassDefinition.js';

export default class Filepuma extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  execute() {
    // Find the last script in the page
    let scripts = document.getElementsByTagName('script');
    let lastScript = scripts[scripts.length - 1];
    // Get the script's source
    let scriptSrc = lastScript.innerHTML;
    // Find the first location.href in the script and get the value of location.href
    let url = scriptSrc.split('location.href = "')[1].split('"')[0];
    alert(url)

  }
}

export const matches = ['filepuma.com'];
