import BypassDefinition from './BypassDefinition.js';

export default class Crackedappsstore extends BypassDefinition {
  constructor() {
    super();
    this.ensure_dom = true
  }

  execute() {
    // Find the div with the class name "show_download_links" and remove the 'display: none' style
    const ulElement = document.querySelector('#list-downloadlinks');
    let href;

    if (ulElement) {
      const liElements = ulElement.querySelectorAll('li');
      if (liElements.length > 1) {
        href = liElements[1].querySelector('a').href;
      } else if (liElements.length === 1) {
        href = liElements[0].querySelector('a').href;
      }
    }

    this.helpers.safelyNavigate(href);

    // Find the ul with the id list-downloadlinks, find the li in it, and pull the link from the first a tag
    const link2 = document.querySelector('#list-downloadlinks li:first-child a');
    this.helpers.safelyNavigate(link2);
  }
}

export const matches = ['crackedappsstore.com'];
