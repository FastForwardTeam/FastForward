import BypassDefinition from './BypassDefinition.js';

export default class Workclick extends BypassDefinition {
  constructor() {
    super();
    // custom bypass required bases can be set here
  }

  async execute() {
    const uuid = new URLSearchParams(window.location.search).get('t');
    this.helpers.insertInfoBox(
      'You will need to wait for 10 seconds as the site is loading the destination URL. Please be patient.'
    );
    fetch(`https://redirect-api.work.ink/externalPopups/${uuid}/pageOpened`);
    await new Promise((r) => setTimeout(r, 11 * 1000));
    let { destination } = await fetch(
      `https://redirect-api.work.ink/externalPopups/${uuid}/destination`
    ).then((r) => r.json());
    const url = new URL(destination);
    if (url.searchParams.has('duf')) {
      const finalUrl = window.atob(
        url.searchParams.get('duf').split('').reverse().join('')
      );
      destination = finalUrl;
    }
    let path = await this.helpers.ffclipboard.get('workink');
    this.helpers.ffclipboard.clear('workink');
    this.helpers.followAndContribute('work.ink', path, destination);

    return this.helpers.safelyNavigate(destination);
  }
}

export const matches = ['workink.click'];
