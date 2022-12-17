const bypasses = {
  'linkvertise.com': 'bypasses/linkvertise.js',
  'linkvertise.net': 'bypasses/linkvertise.js',
  'link-to.net': 'bypasses/linkvertise.js'
}

if (bypasses.hasOwnProperty(location.host)) {
  const bypass_url = bypasses[location.host]

  import(`${window.x8675309bp}${bypass_url}`).then(({ default: bypass }) => {
    import(`${window.x8675309bp}helpers/dom.js`).then(
      ({ default: helpers }) => {
        const bps = new bypass()
        bps.set_helpers(helpers)
        console.log('ensure_dom: %r', bps.ensure_dom)
        if (bps.ensure_dom) {
          let executed = false
          document.addEventListener('readystatechange', () => {
            if (
              ['interactive', 'complete'].includes(document.readyState) &&
              !executed
            ) {
              executed = true
              bps.execute()
            }
          })
          document.addEventListener('DOMContentLoaded', () => {
            if (!executed) {
              executed = true
              bps.execute()
            }
          })
        } else {
          bps.execute()
        }
      }
    )
  })
}
