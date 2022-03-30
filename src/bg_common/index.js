// common functions for both manifest v2 background page and v3 service worker

import Browser from "webextension-polyfill"

export default function MessageHandler(request, sender) {
  if (request.type === "navigate") {
    Browser.tabs.update(sender.tab.id, {
      url: `index.html#navigate?${request.link}`,
    })
  }
  if (request.type === "assign") {
    Browser.tabs.update(sender.tab.id, {
      url: `index.html#assign?${request.link}`,
    })
  }
}
