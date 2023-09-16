// Check if the user has already given or declined consent
const consentStatus = localStorage.getItem('consentStatus');

// Handle the "I Agree" button click event
document.getElementById("consentButton").addEventListener("click", function () {
    // Save consent in localStorage
    localStorage.setItem('consentStatus', 'granted');

    // You can add additional logic here, such as performing actions that require consent.

    // Example: Redirect to another page after consent
    window.location.href = 'options.html';
});

document.getElementById("declineButton").addEventListener("click", function () {
    // Save decline status in localStorage
    localStorage.setItem('consentStatus', 'declined');
    console.log("Decline button clicked");

    // Show the popup
    document.getElementById("popup").style.display = "block";
});

// Handle the "Uninstall" button click event within the popup
document.getElementById("uninstallPopupButton").addEventListener("click", function () {
    // Uninstall the extension
    browser.management.uninstallSelf();
});
