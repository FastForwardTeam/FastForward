/*global brws*/
let defaultOptions = {
  navigationDelayToggle: true,
  navigationDelay: 3,
  optionTrackerBypass: false,
  optionInstantNavigationTrackers: false,
  optionBlockIpLoggers: true,
  optionCrowdBypass: false,
  optionCrowdOpenDelayToggle: false,
  optionCrowdOpenDelay: 3,
  optionCrowdCloseDelayToggle: false,
  optionCrowdCloseDelay: 15,
  displayContributeBanner: true,
  whitelist: 'example.com\n*.example.com',
};

const crowdTempDisabledMessage = document.querySelector(
  '#crowdTempDisabledMessage'
);
const optionCrowdBypass = document.querySelector('#optionCrowdBypass');

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
//Add number input boxes
function addNumberInputs() {
  const numberInputs = {
    'option-navigation-delay': 'navigationDelay',
    'option-crowd-open-delay': 'optionCrowdOpenDelay',
    'option-crowd-close-delay': 'optionCrowdCloseDelay',
  }; //key: for attribute of target, val: id of number input to be created
  for (let [key, value] of Object.entries(numberInputs)) {
    let element = document.querySelector(`[for="${key}"]`);
    let numberInput = document.createElement('input');
    numberInput.setAttribute('type', 'number');
    numberInput.setAttribute('id', value);
    numberInput.setAttribute('min', '0');
    numberInput.setAttribute('class', 'ffInput');
    element.innerHTML = element.innerHTML.replace('%', numberInput.outerHTML);
  }
}

function displayExtensionVersion() {
  const versionElement = document.getElementById('version');
  if (versionElement) {
    const extensionVersion = brws.runtime.getManifest().version + '-Mv3';
    versionElement.textContent = extensionVersion;
  }
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
  .querySelector("#close")
  .addEventListener('click', async function () {
    document.querySelector("#contribute").remove();
    let options = await getOptions();
    options["displayContributeBanner"] = false;
    saveOptions(options);
  });

  document
    .querySelectorAll('#options-form input[type="checkbox"]')
    .forEach(function (checkbox) {
      checkbox.addEventListener('change', async function () {
        let options = await getOptions();
        options[this.id] = this.checked;
        saveOptions(options);
      });
    });

  document
    .querySelector('#whitelist')
    .addEventListener('input', async function () {
      let options = await getOptions();
      options['whitelist'] = this.value;
      saveOptions(options);
      checkTextareaValidity();
    });

  document
    .querySelectorAll('#options-form input[type="number"]')
    .forEach(function (checkbox) {
      checkbox.addEventListener('change', async function () {
        let options = await getOptions();
        options[this.id] = this.value;
        saveOptions(options);
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
  if(options["displayContributeBanner"]) {document.querySelector("#contribute").hidden = false;}
  for (let key in options) {
    if(key == "displayContributeBanner") continue;
    let element = document.querySelector('#' + key);
    if (element.type === 'checkbox') {
      element.checked = options[key];
    } else if (element.type === 'number') {
      element.value = options[key];
    } else if (element.tagName === 'TEXTAREA') {
      element.value = options[key];
    }
  }
  saveOptions(options);
}

//only refresh the checkboxes otherwise the user won't be able to type anything
async function refreshOptions() {
  let options = Object.assign({}, defaultOptions, await getOptions());
  for (let key in options) {
    if(key == "displayContributeBanner") continue;
    let element = document.querySelector('#' + key);
    if (element.type === 'checkbox') {
      element.checked = options[key];
    }
    saveOptions(options);
  }
}
function refCrowdTempDisabledMsg() {
  brws.storage.local.get(['tempDisableCrowd']).then((result) => {
    if (result.tempDisableCrowd === 'true') {
      crowdTempDisabledMessage.hidden = false;
    } else {
      crowdTempDisabledMessage.hidden = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  addNumberInputs();
  await repopulateOptions();
  refCrowdTempDisabledMsg();
  addEventListeners();
  checkTextareaValidity();
  formatWhitelistDesc();
  displayExtensionVersion();
  setInterval(() => {
    refCrowdTempDisabledMsg();
    refreshOptions();
  }, 1000);
});

// If the user manually checks optionCrowdBypass, set tempDisableCrowd to false
optionCrowdBypass.addEventListener('change', () => {
  if (optionCrowdBypass.checked) {
    brws.storage.local.set({ tempDisableCrowd: 'false' });
    refCrowdTempDisabledMsg();
  }
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
