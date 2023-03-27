const brws = typeof browser !== 'undefined' ? browser : chrome;

function handleClick() {
  brws.runtime.openOptionsPage();
}

function ffclipboardClear() {
  brws.storage.local.get({ ff_clipboard: '{}' }, function (data) {
    brws.storage.local.set({ ff_clipboard: data.ff_clipboard });
  });
}

function firstrun() {
  brws.tabs.create({ url: 'https://fastforward.team/firstrun' });
  ffclipboardClear();
}

function preflight(details) {
  let url = new URL(details.url);
  //navigate
  if (url.hostname == 'fastforward.team' && url.pathname == '/bypassed') {
    brws.tabs.update(details.tabId, {
      url: decodeURIComponent(url.searchParams.get('target')),
    });
  }
}

brws.action.onClicked.addListener(handleClick);
brws.runtime.onInstalled.addListener(firstrun);
brws.runtime.onStartup.addListener(ffclipboardClear);
brws.webNavigation.onBeforeNavigate.addListener(
  (details) => preflight(details),
  {
    url: [{ hostContains: 'fastforward.team' }],
  }
);
