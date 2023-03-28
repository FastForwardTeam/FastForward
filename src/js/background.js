const brws = typeof browser !== 'undefined' ? browser : chrome;

function handleClick() {
  brws.runtime.openOptionsPage();
}

function ffclipboardClear() {
  brws.storage.local.set({ ff_clipboard: '{}' });
}

function clearCrowdIgnoredURLs() {
  brws.storage.local.set({ crowd_ignore: '{}' });
}

function firstrun() {
  brws.tabs.create({ url: 'https://fastforward.team/firstrun' });
  ffclipboardClear();
  brws.storage.local.set({ tempDisableCrowd: 'false' });
  brws.storage.local.set({ version: brws.runtime.getManifest().version });
  brws.runtime.openOptionsPage(); //required for loading default options, to do: implement a better way
}

function preflight(details) {
  let url = new URL(details.url);
  if (url.hostname !== 'fastforward.team') {
    return;
  }
  //navigate
  if (url.pathname === '/bypassed') {
    url.hostname = brws.runtime.id;
    url.protocol = 'chrome-extension:';
    url.pathname = '/html' + url.pathname;
    console.log(url.searchParams.get('crowd'));
    if (url.searchParams.get('crowd') === 'true') {
      url.pathname =
        url.pathname.split('/').slice(0, -1).join('/') + '/crowd-bypassed.html';
    } else {
      url.pathname =
        url.pathname.split('/').slice(0, -1).join('/') +
        '/before-navigate.html';
    }

    brws.tabs.update(details.tabId, {
      url: decodeURIComponent(url.href),
    });
  }
}

// If user restarts the browser before the is alarm triggered
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

// Add a listener for the temp crowd disable alarm
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

brws.action.onClicked.addListener(handleClick);
brws.runtime.onInstalled.addListener(firstrun);
brws.runtime.onStartup.addListener(() => {
  ffclipboardClear();
  clearCrowdIgnoredURLs();
  reEnableCrowdBypassStartup();
  brws.storage.local.set({ version: brws.runtime.getManifest().version });
});
brws.webNavigation.onBeforeNavigate.addListener(
  (details) => preflight(details),
  {
    url: [{ hostContains: 'fastforward.team' }],
  }
);
