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

//ff + first 10 characters of SHA256 of fastforward to prevent collisions
document.addEventListener('ff53054c0e13_crowdQuery', async (event) => {
  let data = event.detail;
  const response = await chrome.runtime.sendMessage({
    type: 'crowdQuery',
    detail: data,
  });
  console.log(response);
  document.dispatchEvent(
    new CustomEvent('ff53054c0e13_crowdResponse', { detail: response })
  );
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

document.addEventListener('ff53054c0e13_crowdContribute', (event) => {
  let data = event.detail;
  chrome.runtime.sendMessage({
    type: 'crowdContribute',
    detail: data,
  });
});
document.addEventListener('ff53054c0e13_followAndContribute', (event) => {
  let data = event.detail;
  chrome.runtime.sendMessage({
    type: 'followAndContribute',
    detail: data,
  });
});

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
