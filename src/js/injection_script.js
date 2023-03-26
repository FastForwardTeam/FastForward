const bypasses = {"acortalink.me":"bypasses/acortalink.js","www93.davisonbarker.pro":"bypasses/adfly.js","www96.lowrihouston.pro":"bypasses/adfly.js","akoam.to":"bypasses/akoam.js","anonym.ninja":"bypasses/anonym.js","brpaper.com":"bypasses/brpaper.js","cb.run":"bypasses/cbrun.js","cb.click":"bypasses/cbrun.js","complete2unlock.com":"bypasses/complete2unlock.js","cpmlink.net":"bypasses/cpmlink.js","daominhha.com/download":"bypasses/daominhha.js","earnme.club":"bypasses/earnme.js","usanewstoday.club":"bypasses/earnme.js","fastforward.team":"bypasses/fastforward.js","fc-lc.com":"bypasses/fclc.js","filedm.com":"bypasses/filedm.js","filehorse.com":"bypasses/filehorse.js","forex1pro.com":"bypasses/forex1pro.js","4shared.com":"bypasses/fourshared.js","fssquad.com":"bypasses/fssquad.js","gamesmega.net":"bypasses/gamesmega.js","gixen.com/home_1.php":"bypasses/gixen.js","leitup.com":"bypasses/leitup.js","liblink.pl":"bypasses/liblink.js","linkspy.cc":"bypasses/linkspy.js","linkvertise.com":"bypasses/linkvertise.js","linkvertise.net":"bypasses/linkvertise.js","link-to.net":"bypasses/linkvertise.js","lnk2.cc":"bypasses/lnk2cc.js","longfiles.com":"bypasses/longfiles.js","filepuma.com":"bypasses/longfiles.js","portableapps.com":"bypasses/longfiles.js","indishare.org":"bypasses/longfiles.js","solvetube.site":"bypasses/longfiles.js","mangalist.org":"bypasses/mangalist.js","mydramalist.com":"bypasses/mydramalist.js","onepieceex.net":"bypasses/onepieceex.js","online-fix.me/ext/":"bypasses/onlinefix.js","oracle.com":"bypasses/oracle.js","pirateproxy.wtf":"bypasses/pirateproxy.js","rekonise.com":"bypasses/rekonise.js","sfile.mobi":"bypasses/sfile.js","sfile.xyz":"bypasses/sfile.js","apkmos.com":"bypasses/sfile.js","links.shortenbuddy.com":"bypasses/shortenbuddy.js","shortmoz.link":"bypasses/shortmoz.js","/sourceforge.net/projects/.+/files/.+/download/":"bypasses/sourceforge.js","squidssh.com/li/go.php":"bypasses/squidssh.js","goodssh.com/li/go.php":"bypasses/squidssh.js","srt.am":"bypasses/srtam.js","sub4unlock.com":"bypasses/sub4unlock.js","syosetu.org":"bypasses/syosetu.js","tik.lat":"bypasses/tiklat.js","uiz.io":"bypasses/uiz.js","uiz.app":"bypasses/uiz.js","tlkm.id":"bypasses/uiz.js","vk.com/away.php?to=":"bypasses/vk.js","wadooo.com":"bypasses/wadooo.js","ytsubme.com":"bypasses/ytsubme.js"};

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