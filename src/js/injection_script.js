const bypasses = {"www93.davisonbarker.pro":"bypasses/adfly.js","www96.lowrihouston.pro":"bypasses/adfly.js","akoam.to":"bypasses/akoam.js","anonym.ninja":"bypasses/anonym.js","brpaper.com":"bypasses/brpaper.js","cb.run":"bypasses/cbrun.js","cb.click":"bypasses/cbrun.js","complete2unlock.com":"bypasses/complete2unlock.js","https://crackedappsstore.com/(?:\\.|[^\\])*/\\?download.*":"bypasses/crackedappsstore.js","earnme.club":"bypasses/earnme.js","usanewstoday.club":"bypasses/earnme.js","fastforward.team":"bypasses/fastforward.js","filedm.com":"bypasses/filedm.js","forex1pro.com":"bypasses/forex1pro.js","gamesmega.net":"bypasses/gamesmega.js","linkvertise.com":"bypasses/linkvertise.js","linkvertise.net":"bypasses/linkvertise.js","link-to.net":"bypasses/linkvertise.js","mydramalist.com":"bypasses/mydramalist.js","onepieceex.net":"bypasses/onepieceex.js","pirateproxy.wtf":"bypasses/pirateproxy.js","rekonise.com":"bypasses/rekonise.js","sfile.mobi":"bypasses/sfile.js","sfile.xyz":"bypasses/sfile.js","apkmos.com":"bypasses/sfile.js","links.shortenbuddy.com":"bypasses/shortenbuddy.js","shortmoz.link":"bypasses/shortmoz.js","/sourceforge.net/projects/.+/files/.+/download/":"bypasses/sourceforge.js","srt.am":"bypasses/srtam.js","syosetu.org":"bypasses/syosetu.js","tik.lat":"bypasses/tiklat.js","wadooo.com":"bypasses/wadooo.js","ytsubme.com":"bypasses/ytsubme.js"};

if (bypasses.hasOwnProperty(location.host)) {
    const bypass_url = bypasses[location.host];
    
    import(`${window.x8675309bp}${bypass_url}`).then(({default: bypass}) => {
        import(`${window.x8675309bp}helpers/dom.js`).then(({default: helpers}) => {
            const bps = new bypass;
            bps.set_helpers(helpers);
            console.log('ensure_dom: %r', bps.ensure_dom);
            if (bps.ensure_dom) {
                let executed = false;
                document.addEventListener('readystatechange', () => {
                    if (['interactive', 'complete'].includes(document.readyState) && !executed) {
                        executed = true;
                        bps.execute();
                    }
                });
                document.addEventListener("DOMContentLoaded",()=>{
                    if (!executed) {
                        executed = true;
                        bps.execute();
                    }
                });
            } else {
                bps.execute();
            }   
        });
    });
}