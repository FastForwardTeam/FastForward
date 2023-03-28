const brws = typeof browser !== 'undefined' ? browser : chrome;
async function getOptions() {
  return new Promise((resolve) => {
    chrome.storage.local.get('options').then((result) => {
      resolve(result.options);
    });
  });
}

function getBaseURL() {
  return 'chrome-extension://' + chrome.runtime.id;
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
    chrome.runtime.getURL('injection_script.js') +
    '?' +
    new URLSearchParams({ ext_base_URL: getBaseURL() }); //pass base url to injection script https://stackoverflow.com/a/9517879
  script.onload = function () {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

//ff + first 10 characters of SHA256 of fastforward to prevent collisions
document.addEventListener('ff53054c0e13_crowdQuery', async function (event) {
  //we shoudn't receive an event if it's disabled but double checking anyway
  let options = await getOptions();
  if (options.optionCrowdBypass === false) {
    const src = chrome.runtime.getURL('helpers/infobox.js');
    const insertInfoBox = await import(src);
    insertInfoBox(brws.i18n.getMessage('crowdDisabled'));
    return;
  }
  let data = event.detail;
  let url = 'https://crowd.fastforward.team/crowd/query_v1';
  let params = new URLSearchParams();
  params.append('domain', data.domain);
  params.append('path', data.path);
  fetch(url, {
    method: 'POST',
    body: params,
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
      console.log(error);
    });
});

document.addEventListener(
  'ff53054c0e13_crowdContribute',
  async function (event) {
    let options = await getOptions();
    if (options.optionCrowdBypass === false) {
      return;
    }
    let data = event.detail;
    let url = 'https://crowd.fastforward.team/crowd/contribute_v1';
    let params = new URLSearchParams();
    params.append('domain', data.domain);
    params.append('path', data.path);
    params.append('target', data.target);
    fetch(url, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).catch(function (error) {
      console.log(error);
    });
  }
);
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

injectScript();
