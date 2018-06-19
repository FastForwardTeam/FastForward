# Universal Bypass

Don't waste your time with compliance. Universal Bypass automatically skips annoying link shorteners.

[Get the Extension for Chrome and/or Firefox.](https://universal-bypass.org)

## Understanding the Content Script

In an effort to save some bytes, I've given functions and variables some rather ambiguous names, so here's a list of them:

- `ms` is a list of messages for internalization:
  - `ms.tS`: Timer Skip
  - `ms.tL`: Timer Leap (Removed some seconds)
  - `ms.b`: Unbypassable due to backend checks
- `ODP` is `Object.defineProperty`
- `ev` is `eval` (I copy eval because uBlockOrigin replaces it)
- `sT` is `setTimeout`
- `sI` is `setInterval`
- `n(target)` tries to redirect to the target URL savely
- `bp` is set to true when a bypass has been found and executed so the content script can end gracefully
- `db(domain, bypass_function)` executes the bypass function if the user is on the domain itself or on a subdomain of it
- `hb(host_regex, bypass_function)` executes the bypass function if `location.host` matches the given regex
- `ad(function)` ensure that the DOM has been loaded when the given function is being executed
- `ui(msg)` shows the given message on the bottom right corner of the website if enabled

Also, instead of true and false, I use `!0` and `!1`, respectively.
