const bypasses = [/- bypasses -/];
const script_src = new URL(document.currentScript.src);
const ext_base_URL = script_src.searchParams.get('ext_base_URL');

if (location.host in bypasses) {
  const bypass_url = bypasses[location.host];

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
