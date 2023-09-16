const isFirefox = /Firefox/i.test(navigator.userAgent);

if (isFirefox) {
    browser.storage.local.get('consentStatus').then(function (data) {
        const consentStatus = data.consentStatus;

        document.getElementById("consentButton").addEventListener("click", function () {
            browser.storage.local.set({ 'consentStatus': 'granted' }).then(function () {
                window.location.href = 'options.html';
            });
        });

        document.getElementById("declineButton").addEventListener("click", function () {
            browser.storage.local.set({ 'consentStatus': 'declined' }).then(function () {
                document.getElementById("consentStatusMessage").textContent = "You have declined consent. Some features of the extension may not be available.";

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
        });
    });
} else {return 0;}

