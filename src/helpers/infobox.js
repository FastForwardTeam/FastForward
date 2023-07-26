/**
 * Inserts an info box into the DOM. This is used to show the user information or to complete a specific step (do a captcha, for example).
 * @param {string} text - The text to show in the info box.
 */
export function insertInfoBox(text) {
    let infobox_container = document.querySelector('div#ffibv1');

    if (!infobox_container) {
        infobox_container = document.createElement('div');
        infobox_container.setAttribute('id', 'ffibv1');
        infobox_container.setAttribute(
            'style',
            `
              z-index: 99999999; position: fixed; bottom: 0; line-height:normal;
              right: 0; padding: 20px; color:#111; font-size:21px;
              font-family:-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol;
              max-width:500px; display: flex; flex-direction: column-reverse;
          `
        );

        document.body.appendChild(infobox_container);
    }
    const div = document.createElement('div');
    div.style =
        'margin-left:20px; margin-bottom: 20px;background:#eee;border-radius:10px;padding:20px;box-shadow:#111 0px 5px 40px;cursor:pointer';
    div.innerHTML = `<img src="https://raw.githubusercontent.com/FastForwardTeam/FastForward/main/src/icon/48.png" style="width:24px;height:24px;margin-right:8px"><span style="display:inline"></span>`;
    div.setAttribute('aria-hidden', 'true');
    const span = div.querySelector('span');
    span.textContent = text;
    div.onclick = () => infobox_container.removeChild(div);
    infobox_container.appendChild(div);
    setTimeout(() => infobox_container.removeChild(div), 7000);
}

export default insertInfoBox;
