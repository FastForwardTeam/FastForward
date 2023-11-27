/*global brws*/
const trackerInfoElement = document.getElementById('tracker-info');

// Get tracker URL from search parameter
const urlParams = new URLSearchParams(window.location.search);
let trackerUrl = urlParams.get('url');
if (!trackerUrl) showError('no url param found');

function escapeHtml(str) {
  if (!str) return str; //prevents null objects from throwing an error
  return str
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
  const msg = brws.i18n.getMessage(
    'beforeNavigateDestination',
    `
    <code>
      <a href="${escapeHtml(url)}" class="link link-preview">
      ${escapeHtml(url)}
      </a>
    </code>`
  );
  const newDiv = document.createElement('div');

  newDiv.appendChild(document.createElement('br'));

  newDiv.innerHTML = msg;

  trackerInfoElement.textContent = '';
  trackerInfoElement.appendChild(newDiv);

  brws.storage.local.get('options').then((result) => {
    if (!result.options.optionInstantNavigationTrackers) return;
    window.location.replace(url);
  });
}

async function resolveTracker(url) {
  //special case for out.reddit.com
  const urlObj = new URL(url);
  if (urlObj.host === 'out.reddit.com') {
    const newUrl = urlObj.searchParams.get('url');
    if (newUrl) updateTrackerMessage(newUrl);
    else showError();
  }

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
