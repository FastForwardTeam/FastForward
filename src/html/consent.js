const isFirefox = /Firefox/i.test(navigator.userAgent);

if (isFirefox) {
    browser.storage.local.get('consentStatus').then(function (data) {
        const consentStatus = data.consentStatus;

        if (consentStatus !== 'granted') {
            document.getElementById("consentButton").addEventListener("click", function () {
                browser.storage.local.set({ 'consentStatus': 'granted' }).then(function () {
                    window.location.href = 'options.html';
                });
            });

            document.getElementById("declineButton").addEventListener("click", function () {
                browser.storage.local.set({ 'consentStatus': 'declined' }).then(function () {
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
        }
    });
} else {
    // Not Firefox, load options.html directly
    window.location.href = 'options.html';
}

