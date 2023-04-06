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
    numberInput.setAttribute('style', 'width:34px');
    element.innerHTML = element.innerHTML.replace('%', numberInput.outerHTML);
  }
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
    .querySelectorAll('#options-form input[type="checkbox"]')
    .forEach(function (checkbox) {
      checkbox.addEventListener('change', async function () {
        let options = await getOptions();
        options[this.id] = this.checked;
        saveOptions(options);
      });
    });

  document
    .querySelector('#saveWhitelist')
    .addEventListener('click', async function () {
      let options = await getOptions();
      options['whitelist'] = document.querySelector('#whitelist').value;
      saveOptions(options);
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

async function repopulateOptions() {
  let options = Object.assign({}, defaultOptions, await getOptions());
  for (let key in options) {
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
