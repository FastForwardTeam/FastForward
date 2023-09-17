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
  
  if (isFirefox) {
      browser.runtime.onInstalled.addListener(async (details) => {
          if (details.reason === "install") {
              const consentStatus = await getConsentStatus();
  
              if (consentStatus !== 'granted') {
                  document.getElementById("consentButton").addEventListener("click", async function () {
                      await saveConsentStatus('granted');
                      window.location.href = 'options.html';
                  });
  
                  document.getElementById("declineButton").addEventListener("click", async function () {
                      await saveConsentStatus('declined');
                      const popup = document.getElementById("popup");
                      popup.style.display = "block";
  
                      let countdownValue = 5;
                      const countdownElement = document.getElementById("countdown");
                      const countdownInterval = setInterval(function () {
                          countdownValue -= 1;
                          countdownElement.textContent = countdownValue;
  
                          if (countdownValue === 0) {
                              browser.management.uninstallSelf();
                          }
                      }, 1000);
  
                      document.getElementById("cancelButton").addEventListener("click", function () {
                          popup.style.display = "none";
                          clearInterval(countdownInterval);
                      });
                  });
              }
          }
      });
  } else {
      // Not Firefox, load options.html directly
      window.location.href = 'options.html';
  }