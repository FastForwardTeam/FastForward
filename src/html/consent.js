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
    const permissionsToRequest = {
        origins: ["<all_urls>"],
    };
    function onResponse(response) {
        if (response) {
            console.log("Permission was granted");
            window.close(); // Close the window after permission is granted
        } else {
            console.log("Permission was refused");
            browser.management.uninstallSelf();
        }
        return browser.permissions.getAll();
    }
    const response = await browser.permissions.request(permissionsToRequest);
    const currentPermissions = await onResponse(response);
    console.log(`Current permissions:`, currentPermissions);
    await saveConsentStatus('consent-granted');
});

// Event listener for "Refuse" button
document.querySelector('#refuse').addEventListener('click', async function () {
    console.log("Uninstalling extension.");
    browser.management.uninstallSelf();
});