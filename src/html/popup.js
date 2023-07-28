/*global brws*/
let defaultOptions = {
  navigationDelayToggle: true,
  navigationDelay: 10,
  optionTrackerBypass: false,
  optionInstantNavigationTrackers: false,
  optionBlockIpLoggers: true,
  optionCrowdBypass: false,
  optionCrowdOpenDelayToggle: false,
  optionCrowdOpenDelay: 5,
  optionCrowdCloseDelayToggle: false,
  optionCrowdCloseDelay: 15,
  whitelist: '',
};

async function saveOptions(options) {
  return brws.storage.local.set({ options: options });
}

async function getOptions() {
  return new Promise((resolve) => {
    brws.storage.local.get('options').then((result) => {
      resolve(result.options);
    });
  });
}

function displayExtensionVersion() {
  brws.storage.local
    .get('version')
    .then(
      (data) =>
        (document.getElementById('version').textContent = data.version + '-Mv3')
    );
}

function formatWhitelistDesc() {
  document.querySelector(
    "[data-message='optionsWhitelistDescription']"
  ).innerHTML = document
    .querySelector("[data-message='optionsWhitelistDescription']")
    .textContent.replace(
      'subdomain.domain.tld',
      '<code>subdomain.domain.tld</code>'
    )
    .replace('domain.tld', '<code>domain.tld</code>');
}

function addEventListeners() {
  document
    .querySelector('#whitelist')
    .addEventListener('input', async function () {
      let options = await getOptions();
      options['whitelist'] = this.value;
      saveOptions(options);
      checkTextareaValidity();
    });

  document
    .querySelector("#openOptions")
    .addEventListener('click', function () {
      window.open("/html/options.html");
    });

  document
    .querySelector('#addToWhitelist')
    .addEventListener('click', async function () {
      let value = document.getElementById("whitelist").value;
      let prefix = "";
      if(value != "" && value[value.length-1] != "\n") {
        prefix = "\n";
      }

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let hostname = new URL(tabs[0].url).host;
        let whitelistTextarea = document.getElementById("whitelist");
        if(!whitelistTextarea.value.includes(hostname)) {
          whitelistTextarea.value += prefix + hostname;
          whitelistTextarea.dispatchEvent(new Event('input'));
        }
      });
    });
}

function checkTextareaValidity() {
  let textarea = document.querySelector('#whitelist');
  if (textarea.value.includes('/')) {
    textarea.classList.add('invalid');
  } else {
    textarea.classList.remove('invalid');
  }
}

async function repopulateOptions() {
  let options = Object.assign({}, defaultOptions, await getOptions());
  let key = 'whitelist';
  let element = document.querySelector('#' + key);
  if (element.tagName === 'TEXTAREA') {
    element.value = options[key];
  }
  saveOptions(options);
}


document.addEventListener('DOMContentLoaded', async function () {
  await repopulateOptions();
  addEventListeners();
  checkTextareaValidity();
  formatWhitelistDesc();
  displayExtensionVersion();
});

function addBottomNavbar() {
  if (window.innerWidth < 768 && !document.querySelector('.bottom-navbar')) {
    const bottomNavbar = document.createElement('nav');
    document.body.appendChild(bottomNavbar);
    const bottomNavbarUl = document.createElement('ul');
    bottomNavbar.appendChild(bottomNavbarUl);

    const navLinks = document.querySelectorAll('.navlink');
    navLinks.forEach((link) => {
      bottomNavbarUl.appendChild(link);
    });

    bottomNavbar.classList.add('bottom-navbar');
  } else {
    const bottomNavbar = document.querySelector('.bottom-navbar');
    if (bottomNavbar) {
      const navLinks = bottomNavbar.querySelectorAll('.navlink');
      const nav = document.querySelector('nav:not(.bottom-navbar)');
      const navUl = nav.querySelector('ul');
      navLinks.forEach((link) => {
        navUl.appendChild(link);
      });
      bottomNavbar.remove();
    }
  }
}

addBottomNavbar();