/*global brws*/
import { isGoodLink } from '../helpers/dom.js';
const trackerInfoElement = document.getElementById('tracker-info');

// Get tracker URL from search parameter
const urlParams = new URLSearchParams(window.location.search);
let trackerUrl = null;
if (isGoodLink(urlParams.get('tracker'))) trackerUrl = urlParams.get('tracker');

function escapeHtml(unsafe) {
  if (!unsafe) return unsafe; //prevents null objects from throwing an error
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showError(err) {
  console.error(err);
  trackerInfoElement.textContent = brws.i18n.getMessage('trackerBypassedError');
  trackerInfoElement.classList.add('text-warn');
  setTimeout(() => {
    if (trackerUrl) window.location.replace(trackerUrl);
    else console.error('no url param found');
  }, 3000);
}

function updateTrackerMessage(url) {
  let msg = brws.i18n.getMessage(
    'beforeNavigateDestination',
    `<br><a href="${escapeHtml(
      url
    )}" class="link link-preview"><code> ${escapeHtml(url)} </a></code>`
  );
  trackerInfoElement.innerHTML = msg;
  if (
    brws.storage.local.get(
      'options',
      (result) => result.options.optionInstantNavigationTrackers
    )
  ) {
    window.location.replace(url);
  }
}

async function resolveTracker(url) {
  url = url.replace(/(^\w+:|^)\/\//, '');
  try {
    const response = await fetch(`https://unshorten.me/json/${url}`);
    const data = await response.json();
    if (data.success && data.resolved_url && isGoodLink(data.resolved_url)) {
      updateTrackerMessage(data.resolved_url);
    } else {
      showError();
    }
  } catch (err) {
    showError(err);
  }
}

resolveTracker(trackerUrl);
