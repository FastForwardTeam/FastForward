/*global brws*/
const trackerInfoElement = document.getElementById('tracker-info');

// Get tracker URL from search parameter
const urlParams = new URLSearchParams(window.location.search);
let trackerUrl = urlParams.get('tracker');
if (!trackerUrl) showError('no url param found');

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
  const trackerInfoElement = document.getElementById('tracker-info');
  const msg = brws.i18n.getMessage('beforeNavigateDestination', url);
  const newDiv = document.createElement('div');

  const aElement = document.createElement('a');
  aElement.href = url;
  aElement.className = 'link link-preview';

  const codeElement = document.createElement('code');
  codeElement.textContent = escapeHtml(url);

  aElement.appendChild(codeElement);
  newDiv.appendChild(document.createElement('br'));
  newDiv.appendChild(aElement);

  newDiv.appendChild(document.createTextNode(msg));

  trackerInfoElement.textContent = '';
  trackerInfoElement.appendChild(newDiv);

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
    if (data.success && data.resolved_url) {
      updateTrackerMessage(data.resolved_url);
    } else {
      showError();
    }
  } catch (err) {
    showError(err);
  }
}

resolveTracker(trackerUrl);
