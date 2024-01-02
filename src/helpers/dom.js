/**
 * Defines the property of an object with the given name and options. This can be used to find a part of the DOM needed for bypassing. If it fails, it will throw an error.
 * @function
 * @param {Object} t - The target object.
 * @param {string} p - The property name.
 * @param {Object} o - The options (Optional).
 */
export const ODP = (t, p, o) => {
  try {
    Object.defineProperty(t, p, o)
  } catch (e) {
    console.trace("[FastForward] Couldn't define", p)
  }
}
/**
 * Sets a timeout for a function. This is used to bypass link shorteners that use a timer to redirect you.
 * @param {Function} f - The function to call
 * @param {Number} t - The timeout in milliseconds
 */
export const setTimeout = window.setTimeout
/**
 * Sets an interval for a function. Will be called every t milliseconds and will go on forever until clearInterval is called.
 * @param {Function} f - The function to call
 * @param {Number} t - The interval to repeat in milliseconds
 */
export const setInterval = window.setInterval
/**
 * Returns a URL object. Used to find the full URL; useful if the final URL is in the URL.
 * @returns {URL} - The URL object
 */
export const URL = window.URL
/**
 * Sets an attribute of the document. This is used to edit the value of a property of an element or create a new element.
 * @param {String} n - The name of the attribute
 * @param {String} v - The value of the attribute
 */
export const docSetAttribute = document.documentElement.setAttribute.bind(
  document.documentElement
)
let navigated = false

import { insertInfoBox } from './infobox.js'

/**
 * Sets a property of an object to be transparent. This is used to allow the user to access properties that are normally not accessible. This is useful for sites that lock access to the final site for a predefined amount of time.
 * @param {string} name - The name of the property.
 * @param {function} valFunc - The function to call
 */
export function transparentProperty (name, valFunc) {
  let real
  ODP(window, name, {
    set: _ => (real = _),
    get: () => valFunc(real)
  })
}
/**
 * Will change the URL of the page directly by routing it through our servers and setting the referer to the current URL. This is used when the site checks the referer to prevent the user from bypassing the link shortener.
 * @param {string} t - The URL to navigate to.
 * @param {string} r - The referer to use.
 */
export function unsafelyAssignWithReferer (target, referer) {
  location.href = `https://fastforward.team/navigate?target=${encodeURIComponent(
    target
  )}&referer=${encodeURIComponent(referer)}`
}
/**
 * Tells the background script that the bypass is finished. This is used to prevent the script from running again if the user navigates to another page.
 */
export function finish () {
  navigated = true
  docSetAttribute('{{channel.stop_watching}}', '')
}
/**
 * Will set a timer to count down from a specified time and then call a function. This is used to prevent the user from bypassing the link shortener too quickly. By default, this is 10 seconds, so you'll need to use setTimeout to use a different time.
 * @param {function} f - The function to call.
 */
export function countIt (func) {
  docSetAttribute('{{channel.count_it}}', '')
  setTimeout(func, 10)
}
/**
 * Tells the background script to keep looking for a link.
 * This is used to prevent the script from running if the element doesn't exist.
 */
export function keepLooking (func) {
  navigated = false
  if (typeof func == 'function') {
    func()
  }
}
/**
 * Adds a hash to all forms and links on the page.
 * @param {String} h - The hash to add
 */
export function persistHash (here) {
  ensureDomLoaded(() => {
    document
      .querySelectorAll('form[action]')
      .forEach(e => (e.action += '#' + here))
    document.querySelectorAll('a[href]').forEach(e => (e.href += '#' + here))
  })
}
/**
 * Decodes a URI component using a custom script to unescape more characters. This is used to decode the URL of a link shortener if needed. This will not usually be needed, as the built-in decodeURIComponent function will usually be enough.
 * @param {string} u - The URL to decode.
 */
export function decodeURIEncodedMod (s) {
  try {
    return decodeURIComponent(
      s
        .replace(/\%2D/g, '-')
        .replace(/\%5F/g, '_')
        .replace(/\%2E/g, '.')
        .replace(/\%21/g, '!')
        .replace(/\%7E/g, '~')
        .replace(/\%2A/g, '*')
        .replace(/\%27/g, "'")
        .replace(/\%28/g, '(')
        .replace(/\%29/g, ')')
    )
  } catch (e) {
    return null
  }
}
/**
 * Waits for the DOM to be loaded before calling a function. This is used to prevent the script from running before the DOM is loaded. In mv3, this is not needed, as inserting this.ensure_dom = true in the constructor works in the same manner. However, the function is still available for backwards compatibility and for allowing other functions to work.
 * @param {function} f - The function to call.
 */
export function ensureDomLoaded (func) {
  const isDocumentReady = ['interactive', 'complete'].includes(
    document.readyState
  )
  if (isDocumentReady) {
    func()
  } else {
    let triggered = false
    const onDomContentLoaded = () => {
      if (!triggered) {
        triggered = true
        setTimeout(func, 1)
      }
    }

    document.addEventListener('DOMContentLoaded', onDomContentLoaded)
  }
}
/**
 * Will check if an element exists on the page and then call a function by calling ensureDomLoaded. If the element doesn't exist, the function will check if another function is passed and call it if it is. This is used to prevent the script from running if the element doesn't exist. Generally, you will not need to add a second function, but it can be useful at times.
 * @param {string} e - The element to check.
 * @param {function} f - The function to call.
 * @param {function} [f2] - The function to call if the element doesn't exist.
 */
export function ifElement (query, func, extraFunc) {
  ensureDomLoaded(() => {
    let e = document.querySelector(query)
    if (e) {
      func(e)
    } else if (extraFunc) {
      extraFunc()
    }
  })
}

/**
 * Will wait for an element to appear on the page and then call a function. This does depend on ensureDomLoaded to make sure it will work. This is used to prevent the script from running if the element doesn't exist.
 * @param {string} e - The element to check.
 * @param {function} f - The function to call.
 */
export function awaitElement(elem, func) {
  ensureDomLoaded(() => {
    let time = setInterval(() => {
      let element = document.querySelector(elem);
      if (element) {
        func(element);
        clearInterval(time);
      }
    }, 10);
    setInterval(() => {
      clearInterval(time);
    }, 30000);
  });
}

/**
 * Watch for an element to appear on the page. This is used to prevent the script from running if the element doesn't exist. Improved version of waitForElement.
 * @param {string} e - The element to watch.
 * @returns {Promise<any>} A promise that resolves with the element.
 */
export function watchForElement (selector) {
  return new Promise(resolve => {
    const element = document.querySelector(selector)
    if (element) {
      console.log(`[FastForward] Element found: ${element} | Selector: ${selector}`)
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      Array.from(document.querySelectorAll(selector)).forEach(el => {
        console.log(`[FastForward] Element found: ${el} | Selector: ${selector}`)
        resolve(el)
        observer.disconnect()
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true
    })
  })
}

export const ffclipboard = {
  /**
   * Sets a value in the ffclipboard.
   * @param {string} key - The key to set the value for.
   * @param {any} value - The value to set.
   */
  set: function (key, value) {
    const event = new CustomEvent('ff53054c0e13_ffclipboardSet', {
      detail: { key, value }
    })
    document.dispatchEvent(event)
  },
  /**
   * Clears a value from the ffclipboard.
   * @param {string} key - The key to clear the value for.
   */

  clear: function (key) {
    const event = new CustomEvent('ff53054c0e13_ffclipboardClear', {
      detail: { key }
    })
    document.dispatchEvent(event)
  },
  /**
   * Gets a value from the ffclipboard.
   * @param {string} key - The key to get the value for.
   * @returns {Promise<any>} A promise that resolves with the value.
   */
  get: function (key) {
    return new Promise(resolve => {
      function onFFClipboardResponse (event) {
        if (event.detail.key === key) {
          resolve(event.detail.value)
          document.removeEventListener(
            'ff53054c0e13_ffclipboardResponse',
            onFFClipboardResponse
          )
        }
      }

      document.addEventListener(
        'ff53054c0e13_ffclipboardResponse',
        onFFClipboardResponse
      )
      const event = new CustomEvent('ff53054c0e13_ffclipboardGet', {
        detail: { key }
      })
      document.dispatchEvent(event)
    })
  }
}

/**
 * Dispatch a crowdQuery event.
 * @param {string} domain - The domain to include in the event detail.
 * Include subdomain if not www.
 * @param {string} path - The path to include in the event detail.
 * Query string also goes here like a?b=c. Drop the first slash 'a' not '/a'
 * @returns {Promise<string>} Promise will resolve into the path
 */
export function crowdQuery (domain, path) {
  let data = {
    domain: domain,
    path: path
  }
  //ff + first 10 characters of SHA256 of fastforward to prevent collisions
  document.dispatchEvent(
    new CustomEvent('ff53054c0e13_crowdQuery', { detail: data })
  )
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout: crowd response not received'));
    }, 10000); //10 sec timeout

    document.addEventListener('ff53054c0e13_crowdResponse', function (event) {
      clearTimeout(timeout)
      resolve(event.detail)
    })
  })
}

/**
 * Dispatch a crowdContribute event.
 * @param {string} domain - The domain. Include subdomain if not www.
 * @param {string} path - The path. Query string also goes here like a?b=c.
 * Drop the first slash.
 * @param {string} target - The target must be a fully qualified URL including the protocol
 */
export function crowdContribute (domain, path, target) {
  var data = {
    domain: domain,
    path: path,
    target: target
  }
  document.dispatchEvent(
    new CustomEvent('ff53054c0e13_crowdContribute', { detail: data })
  )
}

/**
 * Dispatch a followAndContribute event. To be used when target redirects to the final destination
 * @param {string} domain - The domain. Include subdomain if not www.
 * @param {string} path - The path. Query string also goes here like a?b=c.
 * Drop the first slash.
 * @param {string} target - The target must be a fully qualified URL including the protocol
 */
export function followAndContribute (domain, path, target) {
  var data = {
    domain: domain,
    path: path,
    target: target
  }
  document.dispatchEvent(
    new CustomEvent('ff53054c0e13_followAndContribute', { detail: data })
  )
}
/**
 * Will change the URL of the page directly by routing it through our servers. This is a more secure way to bypass a link shortener, but not as fast as unsafelyAssign. This also prevents the user's IP address from being leaked if the option is turned on in the extension settings.
 * @param {String} u - The URL to navigate to
 */
export function unsafelyNavigate (target, referer = null, crowd = false) {
  //The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
  if (navigated) {
    return
  }
  let url
  if (crowd) {
    url = `https://fastforward.team/bypassed?type=crowd&target=${encodeURIComponent(
      target
    )}`
  } else {
    url = `https://fastforward.team/bypassed?target=${encodeURIComponent(
      target
    )}`
  }

  if (referer) url += `&referer=${encodeURIComponent(referer)}`

  switch (
    target //All values here have been tested using "Take me to destinations after 0 seconds."
  ) {
    case (/(krnl\.place|hugegames\.io)/.exec(target) || {}).input:
      url += '&safe_in=15'
      break
    case (/(bowfile\.com)/.exec(target) || {}).input:
      url += '&safe_in=20'
      break
    case (/(flux\.li)/.exec(target) || {}).input:
      url += '&safe_in=25'
      break
  }
  unsafelyAssign(url)
}
/**
 * Checks for the link inside an a tag and returns the url. This is used to get the URL of links hidden inside an a tag.
 * @param {Element} tar - The element to check
 * @returns {String} - The URL of the link
 */
export function parseTarget (target) {
  return target instanceof HTMLAnchorElement ? target.href : target
}
/**
 * Will check if the URL is safe to navigate to before calling unsafelyNavigate. This is used to prevent the user from navigating to a malicious or nonexistent site. It also routes the URL through our servers to prevent the user's IP address from being leaked.
 * @param {String} u - The URL to navigate to
 */
export function safelyNavigate (target, drophash) {
  target = parseTarget(target)
  if (!isGoodLink(target)) return false

  // bypassed=true
  let url = new URL(target)
  if (!drophash && (!url || !url.hash)) target += location.hash

  unsafelyNavigate(target)
  return true
}
/**
 * Will directly change the URL of the page. This is the most barebones way to bypass a link shortener.
 * All other bypassing methods are built on top of this function.
 * @param {String} u - The URL to navigate to
 */
export function unsafelyAssign (target) {
  navigated = true
  window.onbeforeunload = null
  location.assign(target)
}
/**
 * Will check if the URL is safe to navigate to before calling unsafelyAssign. This is used to prevent the user from navigating to a malicious or nonexistent site.
 * @param {String} u - The URL to navigate to
 */
export function safelyAssign (target) {
  target = parseTarget(target)
  if (navigated || !isGoodLink(target)) return false
  navigated = true
  let url = new URL(target)
  if (!url || !url.hash) target += location.hash
  unsafelyAssign(target)
  return true
}
/**
 * Checks if the URL is safe to navigate to. Checks if site exists and if it uses safe protocols.
 * @param {String} u - The URL to check
 * @returns {Boolean} - True if the URL is safe to navigate to, false otherwise
 */
export function isGoodLink (link) {
  if (
    typeof link !== 'string' ||
    link.split('#')[0] === location.href.split('#')[0]
  ) {
    return false
  }
  try {
    let u = new URL(decodeURI(link).trim().toLocaleLowerCase())
    //check if host is a private/internal ip
    if (
      u.hostname === 'localhost' ||
      u.hostname === '[::1]' ||
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(u.hostname)
    ) {
      return false
    }
    const parts = u.hostname.split('.')
    if (
      parts[0] === '10' ||
      (parts[0] === '172' &&
        parseInt(parts[1], 10) >= 16 &&
        parseInt(parts[1], 10) <= 31) ||
      (parts[0] === '192' && parts[1] === '168')
    ) {
      return false
    }
    // Check if protocol is safe
    let safeProtocols = [
      'http:',
      'https:',
      'mailto:',
      'irc:',
      'telnet:',
      'tel:',
      'svn:'
    ]
    if (!safeProtocols.includes(u.protocol)) {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}
/**
 * Will add an event listener to the page to check for requests and then call a function. This is useful if you need to bypass a link shortener that uses requests to get the final URLs.
 * @param {Function} f - The function to call
 * @returns {Promise} - A promise that resolves when the function is called
 */
export async function bypassRequests (execution_method) {
  const rawOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', execution_method)
    rawOpen.apply(this, arguments)
  }

  const rawFetch = window.fetch
  window.fetch = async (requestInfo, init) => {
    const result = await rawFetch(requestInfo, init)
    execution_method(result)
    return Promise.resolve(result)
  }
}
/**
 * Navigates to the specified URL. To be used for crowd sourced bypasses.
 * @param {string} target - The target URL to navigate to.
 */
export function crowdNavigate(target) {
  unsafelyNavigate(target, null, true);
}

export default {
  insertInfoBox,
  ensureDomLoaded,
  awaitElement,
  watchForElement,
  ffclipboard,
  crowdQuery,
  crowdContribute,
  crowdNavigate,
  followAndContribute,
  unsafelyNavigate,
  parseTarget,
  safelyNavigate,
  unsafelyAssign,
  safelyAssign,
  isGoodLink,
  bypassRequests,
  ifElement,
  transparentProperty,
  unsafelyAssignWithReferer,
  finish,
  countIt,
  keepLooking,
  persistHash,
  decodeURIEncodedMod,
  ODP,
  URL
}
