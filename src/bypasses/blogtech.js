import BypassDefinition from './BypassDefinition.js';

export default class BlogTechh extends BypassDefinition {
  constructor() {
    super();
  }

  execute() {
    console.log('blogtechh bypass running');
    this.helpers.awaitElement("button#getlink", button => {
        button.click()
    })
  }
}

export const matches = ['blogtechh.com', 'oko.sh'];
