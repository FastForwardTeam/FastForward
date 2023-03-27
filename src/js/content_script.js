const brws = typeof browser !== "undefined" ? browser : chrome;

function getWhitelistedSites() {
  return new Promise((resolve) => {
    brws.storage.local.get(["whitelistedSites"], function (result) {
      let whitelistedSites = result.whitelistedSites || [];
      resolve(whitelistedSites);
    });
  });
}

function getBaseURL() {
  return "chrome-extension://" + chrome.runtime.id;
}

function injectScript() {
  let script = document.createElement("script");
  script.src =
    chrome.runtime.getURL("injection_script.js") +
    "?" +
    new URLSearchParams({ ext_base_URL: getBaseURL() }); //pass base url to injection script https://stackoverflow.com/a/9517879
  script.onload = function () {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

getWhitelistedSites().then((whitelistedSites) => {
  if (!whitelistedSites.includes(window.location.hostname)) {
    injectScript();
  }
});
