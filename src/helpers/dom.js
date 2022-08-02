export function insertInfoBox(text) {
    let infobox_container = document.querySelector('div#ffibv1');

    if (!infobox_container) {
        infobox_container = document.createElement('div');
        infobox_container.setAttribute('id', 'ffibv1');
        infobox_container.setAttribute('style', `
			z-index: 99999999; position: fixed; bottom: 0; line-height:normal;
			right: 0; padding: 20px; color:#111; font-size:21px;
			font-family:-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol;
			max-width:500px; display: flex; flex-direction: column-reverse;
		`);

        document.body.appendChild(infobox_container);
    }
    const div = document.createElement("div");
    div.style = 'margin-left:20px; margin-bottom: 20px;background:#eee;border-radius:10px;padding:20px;box-shadow:#111 0px 5px 40px;cursor:pointer';
    div.innerHTML = `<img src="${window.x8675309bp}icon/48.png" style="width:24px;height:24px;margin-right:8px"><span style="display:inline"></span>`;
    div.setAttribute("tabindex","-1");
    div.setAttribute("aria-hidden","true");
    const span = div.querySelector("span");
    span.textContent=text;
    div.onclick= () => document.body.removeChild(div);
    infobox_container.appendChild(div);
}

export function unsafelyNavigate(target, referer=null) {
    //The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
    let url = `https://fastforward.team/bypassed?target=${encodeURIComponent(target)}`;
    if (referer)
        url += `&referer=${encodeURIComponent(referer)}`;

    switch(target)//All values here have been tested using "Take me to destinations after 0 seconds."
    {
        case (/(krnl\.place|hugegames\.io)/.exec(target)||{}).input:
            url+="&safe_in=15"
            break;
        case (/(bowfile\.com)/.exec(target)||{}).input:
            url+="&safe_in=20"
            break;
    }

    location.assign(url);
}

export function parseTarget (target) {
    return target instanceof HTMLAnchorElement ? target.href : target;
}

export function safelyNavigate(target, drophash) {
    target = parseTarget(target)
    if(!isGoodLink(target))
        return false

    // bypassed=true
    let url = new URL(target)
    if(!drophash&&(!url||!url.hash))
        target+=location.hash

    unsafelyNavigate(target)
    return true
}

export function isGoodLink(link) {
    if(typeof link !== "string" || link.split("#")[0] === location.href.split("#")[0])
    {
        return false
    }
    try
    {
        let u = new URL(decodeURI(link).trim().toLocaleLowerCase())
        //check if host is a private/internal ip
        if (u.hostname === 'localhost' || u.hostname === '[::1]' || /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(u.hostname)) {
            return false
        }
        const parts = u.hostname.split('.');
        if (parts[0] === '10' || (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || (parts[0] === '192' && parts[1] === '168')) {
            return false
        }
        // Check if protocol is safe
        let safeProtocols = ["http:", "https:", "mailto:", "irc:", "telnet:", "tel:", "svn:"]
        if (!safeProtocols.includes(u.protocol)) {
            return false
        }
    }
    catch(e)
    {
        return false
    }
    return true
}

export default {
    insertInfoBox,
    safelyNavigate,
    unsafelyNavigate,
    parseTarget,
    isGoodLink
}
