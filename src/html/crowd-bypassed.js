/*global brws*/
const timerElement = document.getElementById('timer');
const timerText = timerElement.querySelector('p');
const tempDisableCrowdButton = document.getElementById('temp-disable-crowd');

// Get target URL from search parameter
const urlParams = new URLSearchParams(window.location.search);
const targetUrl = urlParams.get('target');

function escapeHtml(unsafe) {
  if (!unsafe) return unsafe; //prevents null objects from throwing an error
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function updateDestinationMessage() {
  let msg = brws.i18n.getMessage(
    'crowdBypassedInfo',
    `<br><a href="${escapeHtml(
      targetUrl
    )}" class="link link-preview"><code> ${escapeHtml(targetUrl)} </a></code>`
  );
  document.querySelector('#crowd-bypass-info').innerHTML = msg;
}

tempDisableCrowdButton.addEventListener('click', () => {
  brws.storage.local.get(['options']).then((result) => {
    let opt = result.options;
    if (!opt.optionCrowdBypass) {
      return;
    }
    opt.optionCrowdBypass = false;
    brws.storage.local.set({ options: opt });
    brws.storage.local.set({ tempDisableCrowd: 'true' });
    // Create an alarm that will trigger after 10 minutes
    brws.alarms.create('enableCrowdBypass', { delayInMinutes: 10 });
    history.back();
  });
});

brws.storage.local.get('options', (result) => {
  if (!result.options.optionCrowdOpenDelayToggle) {
    return;
  }
  const delay = result.options.optionCrowdOpenDelay;
  // Show countdown timer
  let timeLeft = delay;
  timerElement.hidden = false;
  timerText.textContent = brws.i18n.getMessage(
    timeLeft === 1 ? 'crowdBypassedTimerSingular' : 'crowdBypassedTimer',
    [timeLeft]
  );

  const interval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(interval);
      window.open(targetUrl, '_blank').focus();
      timerElement.hidden = true;
    } else {
      timerText.textContent = brws.i18n.getMessage(
        timeLeft === 1 ? 'crowdBypassedTimerSingular' : 'crowdBypassedTimer',
        [timeLeft]
      );
    }
  }, 1000);
});

updateDestinationMessage();
