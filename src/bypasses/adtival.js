import BypassDefinition from './BypassDefinition.js';

export default class Adtival extends BypassDefinition {
  constructor() {
    super();
    this.ensure_dom = true;
  }

  execute() {
    console.log('Adtival found!');

    const executor = async () => {
      const El = window.livewire.components.components()[0];

      const payload = {
        fingerprint: El.fingerprint,
        serverMemo: El.serverMemo,
        updates: [
          {
            payload: {
              event: 'getData',
              id: 'whathappen',
              params: [],
            },
            type: 'fireEvent',
          },
        ],
      };

      const response = await fetch(
        location.origin + '/livewire/message/pages.show',
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Livewire': 'true',
            'X-CSRF-TOKEN': window.livewire_token,
          },
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      const json = await response.json();

      // ensure URL
      const url = new URL(json.effects.emits[0].params[0]);

      this.helpers.safelyAssign(url.href);
      // this.helpers.unsafelyNavigate(url.href, location.href)
    };

    // special case for sekilastekno. modbaca(?)
    if (RegExp(/(modebaca|sekilastekno)\.com/).exec(location.host)) {
      this.helpers.ifElement("form[method='post']", (a) => {
        console.log('addRecord...');

        const input = document.createElement('input');
        input.value = window.livewire_token;
        input.name = '_token';
        input.hidden = true;
        a.appendChild(input);
        a.submit();
      });

      // ...same step as miuiku and vebma
      this.helpers.ifElement('button[x-text]', async () => {
        console.log('getLink..');
        executor();
      });

      return;
    }

    // adtival getLink on miuiku
    this.helpers.ifElement("div[class='max-w-5xl mx-auto']", async () => {
      console.log('Executing..');
      executor();
    });

    // adtival b64UrlLastPage
    this.helpers.ifElement("button[id='copyVideoURL']", () => {
      const shortID = new URLSearchParams(window.location.search).get(
        'shortid'
      );

      this.helpers.safelyAssign(atob(shortID));
    });
  }
}

export const matches = [
  /movienear\.me|lewat\.club|tautan\.pro|(droidtamvan|gubukbisnis|onlinecorp)\.me|(liveshootv|modebaca|haipedia|sekilastekno|miuiku|vebma)\.com|shrink\.world|link\.mymastah\.xyz|(sportif|cararoot)\.id|healthinsider\.online/,
  'www.adtival.network',
];
