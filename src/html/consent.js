// Function to save consent status
async function saveConsentStatus(consentStatus) {
    return browser.storage.local.set({ consentStatus: consentStatus });
}

// Function to get consent status
async function getConsentStatus() {
    return new Promise((resolve) => {
        browser.storage.local.get('consentStatus').then((result) => {
            resolve(result.consentStatus);
        });
    });
}

// Event listener for "Agree" button
document.querySelector('#agree').addEventListener('click', async function () {
    console.log("Agree button clicked.");
    await saveConsentStatus('consent-granted');
    window.location.href = 'options.html';
});

// Event listener for "Refuse" button
document.querySelector('#refuse').addEventListener('click', async function () {
    console.log("Uninstalling extension.");
    browser.management.uninstallSelf();
});