// Manifest v3 service worker
/* global chrome */

import MessageHandler from "./bg_common"

// eslint-disable-next-line
const ignored = self.__WB_MANIFEST

chrome.runtime.onMessage.addListener((message) => {
  MessageHandler(message, message.sender)
})
