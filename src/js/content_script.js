function getWhitelistedSites() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["whitelistedSites"], function (result) {
      let whitelistedSites = result.whitelistedSites || [];
      resolve(whitelistedSites);
    });
  });
}

getWhitelistedSites().then((whitelistedSites) => {
  if (!whitelistedSites.includes(window.location.hostname)) {
    let script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    script.onload = (function () {
      this.remove();
    })(document.head || document.documentElement).appendChild(script);
  }
});
