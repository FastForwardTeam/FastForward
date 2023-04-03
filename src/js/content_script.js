const brws = typeof browser !== 'undefined' ? browser : chrome;
async function getOptions() {
  return new Promise((resolve) => {
    brws.storage.local.get('options').then((result) => {
      resolve(result.options);
    });
  });
}

function getExtBaseURL() {
  return brws.runtime.getURL('/');
}

async function injectScript() {
  let options = await getOptions();
  if (
    options.whitelist &&
    matchDomains(window.location.hostname, options.whitelist)
  ) {
    console.log('FastForward: Site whitelisted');
    return;
  }
  let script = document.createElement('script');
  script.src =
    brws.runtime.getURL('injection_script.js') +
    '?' +
    new URLSearchParams({ ext_base_URL: getExtBaseURL() }); //pass base url to injection script https://stackoverflow.com/a/9517879
  script.onload = function () {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}
function fetchResource(input, init) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ input, init }, (messageResponse) => {
      const [response, error] = messageResponse;
      if (response === null) {
        reject(error);
      } else {
        // Use undefined on a 204 - No Content
        const body = response.body ? new Blob([response.body]) : undefined;
        resolve(
          new Response(body, {
            status: response.status,
            statusText: response.statusText,
          })
        );
      }
    });
  });
}

//ff + first 10 characters of SHA256 of fastforward to prevent collisions
document.addEventListener('ff53054c0e13_crowdQuery', async function (event) {
  let options = await getOptions();
  if (options.optionCrowdBypass === false) {
    const src = brws.runtime.getURL('helpers/infobox.js');
    const insertInfoBox = await import(src);
    insertInfoBox(brws.i18n.getMessage('crowdDisabled'));
    return;
  }
  let data = event.detail;
  let url = 'https://crowd.fastforward.team/crowd/query_v1';
  let params = new URLSearchParams();
  params.append('domain', data.domain);
  params.append('path', data.path);
  fetchResource(url, {
    method: 'POST',
    body: params.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(function (response) {
      if (response.status === 200) {
        response.text().then(function (text) {
          document.dispatchEvent(
            new CustomEvent('ff53054c0e13_crowdResponse', { detail: text })
          );
        });
      }
    })
    .catch(function (error) {
      console.trace(error);
    });
});

function matchDomains(inputString, domains) {
  let domainList = domains.split('\n');
  for (let domain of domainList) {
    let regex = new RegExp('^' + domain.replace(/\*/g, '[^.]+') + '$');
    if (regex.test(inputString)) {
      return true;
    }
  }
  return false;
}

document.addEventListener(
  'ff53054c0e13_crowdContribute',
  async function (event) {
    let options = await getOptions();
    if (options.optionCrowdBypass === false) {
      const src = brws.runtime.getURL('helpers/infobox.js');
      const insertInfoBox = await import(src);
      insertInfoBox('Enable crowd bypass');
      return;
    }
    let data = event.detail;
    let url = 'https://crowd.fastforward.team/crowd/contribute_v1';
    let params = new URLSearchParams();
    params.append('domain', data.domain);
    params.append('path', data.path);
    params.append('target', data.target);
    fetchResource(url, {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).catch(function (error) {
      console.trace(error);
    });
  }
);

function onFFClipboardSet(event) {
  const { key, value } = event.detail;
  chrome.storage.local.get('ffclipboard', (result) => {
    const ffclipboard = result.ffclipboard || {};
    ffclipboard[key] = value;
    chrome.storage.local.set({ ffclipboard });
  });
}

function onFFClipboardGet(event) {
  const { key } = event.detail;
  chrome.storage.local.get('ffclipboard', (result) => {
    const value = result.ffclipboard ? result.ffclipboard[key] : undefined;
    const responseEvent = new CustomEvent('ff53054c0e13_ffclipboardResponse', {
      detail: { key, value },
    });
    document.dispatchEvent(responseEvent);
  });
}

function onFFClipboardClear(event) {
  const { key } = event.detail;
  chrome.storage.local.get('ffclipboard', (result) => {
    if (result.ffclipboard) {
      delete result.ffclipboard[key];
      chrome.storage.local.set({ ffclipboard: result.ffclipboard });
    }
  });
}

injectScript();
document.addEventListener('ff53054c0e13_ffclipboardSet', onFFClipboardSet);
document.addEventListener('ff53054c0e13_ffclipboardGet', onFFClipboardGet);
document.addEventListener('ff53054c0e13_ffclipboardClear', onFFClipboardClear);
