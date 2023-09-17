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

const isFirefox = /Firefox/i.test(navigator.userAgent);

document.addEventListener("DOMContentLoaded", function () {
    if (isFirefox) {
        browser.runtime.onInstalled.addListener(async (details) => {
            if (details.reason === "install") {
                const consentStatus = await getConsentStatus();
    
                if (consentStatus !== 'granted') {
                    const consentButton = document.getElementById("consentButton");
                    consentButton.addEventListener("click", async function () {
                        await saveConsentStatus('granted');
                        window.location.href = 'options.html';
                    });
    
                    const declineButton = document.getElementById("declineButton");
                    declineButton.addEventListener("click", async function () {
                        await saveConsentStatus('declined');
                        browser.management.uninstallSelf();
                    });
                }
            }
        });
    } else {
        // Not Firefox, load options.html directly
        window.location.href = 'options.html';
    }    
});