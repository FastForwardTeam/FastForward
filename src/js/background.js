import * as constants from './constants.js';

const isFirefox = /Firefox/i.test(navigator.userAgent);

// Check if the browser is Firefox
if (isFirefox) {
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      browser.storage.local.get('consentStatus').then(function (data) {
        const consentStatus = data.consentStatus;
        if (consentStatus !== 'granted') {
          browser.tabs.create({
            url: 'html/consent.html',
          });
          return;
        }
      });
      return;
    }
  });
}

const brws = typeof browser !== 'undefined' ? browser : chrome;
const fetchDomains = ['crowd.fastforward.team', 'redirect-api.work.ink']; //only allow requests to these domains

async function getOptions() {
  return new Promise((resolve) => {
    brws.storage.local.get('options').then((result) => {
      resolve(result.options);
    });
  });
}

function ffclipboardClear() {
  brws.storage.local.set({ ff_clipboard: '{}' });
}

function clearCrowdIgnoredURLs() {
  brws.storage.local.set({ crowd_ignore: '{}' });
}

function firstrun(details) {
  if (details.reason == 'install' || details.reason == 'update') {
    brws.tabs.create({ url: 'https://fastforward.team/firstrun' });
    ffclipboardClear();
    brws.storage.local.set({ tempDisableCrowd: 'false' });
    brws.storage.local.set({ version: brws.runtime.getManifest().version });
    brws.runtime.openOptionsPage(); //required for loading default options, to do: implement a better way
    brws.declarativeNetRequest.updateDynamicRules({
      addRules: constants.beforeNavigateRules,
      removeRuleIds: constants.beforeNavigateRules.map((rule) => rule.id),
    });
  }
}

function preflight(details) {
  let url = new URL(details.url);
  if (url.hostname !== 'fastforward.team') {
    return;
  }
  //navigate
  if (url.pathname === '/bypassed') {
    let ext_url = new URL(brws.runtime.getURL(''));
    url.hostname = ext_url.hostname;
    url.protocol = ext_url.protocol;
    url.pathname = '/html' + url.pathname;
    if (url.searchParams.get('crowd') === 'true') {
      url.pathname =
        url.pathname.split('/').slice(0, -1).join('/') + '/crowd-bypassed.html';
    } else {
      url.pathname =
        url.pathname.split('/').slice(0, -1).join('/') +
        '/before-navigate.html';
    }

    brws.tabs.update(details.tabId, {
      url: url.href,
    });
  }
}

function reEnableCrowdBypassStartup() {
  brws.storage.local.get(['tempDisableCrowd']).then((result) => {
    if (result.tempDisableCrowd === 'true') {
      brws.storage.local.get(['options']).then((result) => {
        let opt = result.options;
        opt.optionCrowdBypass = true;
        brws.storage.local.set({ options: opt });
      });
    }
    brws.storage.local.set({ tempDisableCrowd: 'false' });
  });
}

brws.alarms.onAlarm.addListener((alarm) => {
  brws.storage.local.get(['tempDisableCrowd']).then((result) => {
    if (
      alarm.name === 'enableCrowdBypass' &&
      result.tempDisableCrowd === 'true'
    ) {
      brws.storage.local.get(['options']).then((result) => {
        let opt = result.options;
        opt.optionCrowdBypass = true;
        brws.storage.local.set({ options: opt });
        brws.storage.local.set({ tempDisableCrowd: 'false' });
      });
    }
  });
});

brws.runtime.onInstalled.addListener(firstrun);
brws.runtime.onStartup.addListener(() => {
  ffclipboardClear();
  clearCrowdIgnoredURLs();
  reEnableCrowdBypassStartup();
  brws.storage.local.set({ version: brws.runtime.getManifest().version });
});

brws.runtime.onMessage.addListener((request, _, sendResponse) => {
  (async () => {
    let options = await getOptions();
    if (options.optionCrowdBypass === false) {
      return;
    }
    let url;
    request.type === 'crowdQuery'
      ? (url = 'https://crowd.fastforward.team/crowd/query_v1')
      : (url = 'https://crowd.fastforward.team/crowd/contribute_v1');

    let params = new URLSearchParams();

    if (request.type !== 'followAndContribute') {
      for (let key in request.detail) {
        params.append(key, request.detail[key]);
      }
    } else {
      for (let key in request.detail) {
        if (key === 'target') {
          let dest = new URL(request.detail[key]);
          if (!fetchDomains.includes(dest.hostname)) {
            return;
          }
          let res = await fetch(dest.href, {
            method: 'GET',
            redirect: 'follow',
          });
          params.append(key, res.url);
        } else {
          params.append(key, request.detail[key]);
        }
      }
    }

    let response = await fetch(url, {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (request.type === 'crowdQuery')
      response.text().then((res) => {
        sendResponse(res);
      });
  })();
  return true;
});

brws.storage.onChanged.addListener(() => {
  getOptions().then((options) => {
    if (typeof options === 'undefined') {
      return;
    }
    if (options.optionBlockIpLoggers === false) {
      brws.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ['ipLoggerRuleset'],
      });
    } else {
      brws.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ['ipLoggerRuleset'],
      });
    }
    if (options.optionTrackerBypass === false) {
      brws.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ['trackerRuleset'],
      });
    } else {
      brws.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ['trackerRuleset'],
      });
    }
  });
});
