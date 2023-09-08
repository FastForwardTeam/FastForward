const bypasses = [/- bypasses -/];
const script_src = new URL(document.currentScript.src);
const ext_base_URL = script_src.searchParams.get('ext_base_URL');

function matchingBypass(bypasses) {
  for (const [key] of Object.entries(bypasses)) {
    if (key.charAt(0) === '/' && key.charAt(key.length - 1) === '/') {
      let pattern = new RegExp(key.substring(1, key.length - 1));
      return pattern.test(location.href) ? key : null;
    } else if (key === location.host) {
      return key;
    }
    return null;
  }
}

if (matchingBypass(bypasses)) {
  const bypass_url = bypasses[matchingBypass(bypasses)];

  import(ext_base_URL.concat(bypass_url)).then(({ default: bypass }) => {
    import(ext_base_URL.concat('helpers/dom.js')).then(
      ({ default: helpers }) => {
        const bps = new bypass();
        bps.set_helpers(helpers);
        console.log(`ensure_dom: ${bps.ensure_dom}`);
        if (bps.ensure_dom) {
          let executed = false;
          document.addEventListener('readystatechange', () => {
            if (
              ['interactive', 'complete'].includes(document.readyState) &&
              !executed
            ) {
              executed = true;
              bps.execute();
            }
          });
          document.addEventListener('DOMContentLoaded', () => {
            if (!executed) {
              executed = true;
              bps.execute();
            }
          });
        } else {
          bps.execute();
        }
      }
    );
  });
}
