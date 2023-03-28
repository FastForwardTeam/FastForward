//Constants needed for bypassing
export const ODP = (t, p, o) => {
  try {
    Object.defineProperty(t, p, o);
  } catch (e) {
    console.trace("[FastForward] Couldn't define", p);
  }
};
export const setTimeout = window.setTimeout;
export const setInterval = window.setInterval;
export const URL = window.URL;
export const docSetAttribute = document.documentElement.setAttribute.bind(
  document.documentElement
);
let navigated = false;

//Functions used in bypassing
import { insertInfoBox } from './infobox.js';

export function transparentProperty(name, valFunc) {
  let real;
  ODP(window, name, {
    set: (_) => (real = _),
    get: () => valFunc(real),
  });
}

export function unsafelyAssignWithReferer(target, referer) {
  location.href = `https://fastforward.team/navigate?target=${encodeURIComponent(
    target
  )}&referer=${encodeURIComponent(referer)}`;
}

export function finish() {
  bypassed = true;
  docSetAttribute('{{channel.stop_watching}}', '');
}

export function countIt(func) {
  docSetAttribute('{{channel.count_it}}', '');
  setTimeout(func, 10);
}

export function keepLooking(func) {
  bypassed = false;
  if (typeof func == 'function') {
    func();
  }
}
export function persistHash(here) {
  ensureDomLoaded(() => {
    document
      .querySelectorAll('form[action]')
      .forEach((e) => (e.action += '#' + here));
    document.querySelectorAll('a[href]').forEach((e) => (e.href += '#' + here));
  });
}

export function decodeURIEncodedMod(s) {
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
    );
  } catch (e) {
    return null;
  }
}

export function ensureDomLoaded(func) {
  if (['interactive', 'complete'].indexOf(document.readyState)) {
    func();
  } else {
    let triggered = false;
    document.addEventListener('DOMContentLoaded', () => {
      if (!triggered) {
        triggered = true;
        setTimeout(func, 1);
      }
    });
  }
}

export function ifElement(query, func, extraFunc) {
  ensureDomLoaded(() => {
    let e = document.querySelector(query);
    if (e) {
      func(e);
    } else if (extraFunc) {
      extraFunc();
    }
  });
}

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

/*example: www.fastforward.team/hmm?s=53, domain=fastforward.team path=hmm?s=53
Include subdomain if it's not www. */
export function crowdQuery(domain, path) {
  var data = {
    domain: domain,
    path: path,
  };
  //ff + first 10 characters of SHA256 of fastforward to prevent collisions
  document.dispatchEvent(
    new CustomEvent('ff53054c0e13_crowdQuery', { detail: data })
  );
}
//target must be a fully qualified URL with protocol
export function crowdContribute(domain, path, target) {
  var data = {
    domain: domain,
    path: path,
    target: target,
  };
  //ff + first 10 characters of SHA256 of fastforward to prevent collisions
  document.dispatchEvent(
    new CustomEvent('ff53054c0e13_crowdContribute', { detail: data })
  );
}

export function unsafelyNavigate(target, referer = null) {
  //The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
  if (navigated) {
    return;
  }
  let url = `https://fastforward.team/bypassed?target=${encodeURIComponent(
    target
  )}`;
  if (referer) url += `&referer=${encodeURIComponent(referer)}`;

  switch (
    target //All values here have been tested using "Take me to destinations after 0 seconds."
  ) {
    case (/(krnl\.place|hugegames\.io)/.exec(target) || {}).input:
      url += '&safe_in=15';
      break;
    case (/(bowfile\.com)/.exec(target) || {}).input:
      url += '&safe_in=20';
      break;
    case (/(flux\.li)/.exec(target) || {}).input:
      url += '&safe_in=25';
      break;
  }
  unsafelyAssign(url);
}

export function parseTarget(target) {
  return target instanceof HTMLAnchorElement ? target.href : target;
}

export function safelyNavigate(target, drophash) {
  target = parseTarget(target);
  if (!isGoodLink(target)) return false;

  // bypassed=true
  let url = new URL(target);
  if (!drophash && (!url || !url.hash)) target += location.hash;

  unsafelyNavigate(target);
  return true;
}

export function unsafelyAssign(target) {
  navigated = true;
  window.onbeforeunload = null;
  location.assign(target);
}

export function safelyAssign(target) {
  target = parseTarget(target);
  if (navigated || !isGoodLink(target)) return false;
  bypassed = true;
  let url = new URL(target);
  if (!url || !url.hash) target += location.hash;
  unsafelyAssign(target);
  return true;
}

export function isGoodLink(link) {
  if (
    typeof link !== 'string' ||
    link.split('#')[0] === location.href.split('#')[0]
  ) {
    return false;
  }
  try {
    let u = new URL(decodeURI(link).trim().toLocaleLowerCase());
    //check if host is a private/internal ip
    if (
      u.hostname === 'localhost' ||
      u.hostname === '[::1]' ||
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(u.hostname)
    ) {
      return false;
    }
    const parts = u.hostname.split('.');
    if (
      parts[0] === '10' ||
      (parts[0] === '172' &&
        parseInt(parts[1], 10) >= 16 &&
        parseInt(parts[1], 10) <= 31) ||
      (parts[0] === '192' && parts[1] === '168')
    ) {
      return false;
    }
    // Check if protocol is safe
    let safeProtocols = [
      'http:',
      'https:',
      'mailto:',
      'irc:',
      'telnet:',
      'tel:',
      'svn:',
    ];
    if (!safeProtocols.includes(u.protocol)) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

export async function bypassRequests(execution_method) {
  const rawOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', execution_method);
    rawOpen.apply(this, arguments);
  };

  const rawFetch = window.fetch;
  window.fetch = async (requestInfo, init) => {
    const result = await rawFetch(requestInfo, init);
    execution_method(result);
    return Promise.resolve(result);
  };
}

export default {
  insertInfoBox,
  ensureDomLoaded,
  awaitElement,
  crowdQuery,
  crowdContribute,
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
  URL,
};
