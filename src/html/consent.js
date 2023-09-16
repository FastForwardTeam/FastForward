const consentStatus = localStorage.getItem('consentStatus');

document.getElementById("consentButton").addEventListener("click", function () {
    localStorage.setItem('consentStatus', 'granted');
    window.location.href = 'options.html';
});

document.getElementById("declineButton").addEventListener("click", function () {
    localStorage.setItem('consentStatus', 'declined');
    console.log("Decline button clicked");
 
    const popup = document.getElementById("popup");
    popup.style.display = "block";

    let countdownValue = 5;
    const countdownElement = document.getElementById("countdown");
    const countdownInterval = setInterval(function () {
        countdownValue -= 1;
        countdownElement.textContent = countdownValue;

        if (countdownValue === 0) {
            browser.management.uninstallSelf();

            popup.style.display = "none";
            
            clearInterval(countdownInterval);
        }
    }, 1000);

    document.getElementById("cancelButton").addEventListener("click", function () {
        popup.style.display = "none";
        
        clearInterval(countdownInterval);
    });
});
