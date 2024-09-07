document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        storeCredentials(username);
        chrome.runtime.sendMessage({
            action: 'loginAndFetch',
            username: username,
        });
    });
});

// Function to store credentials securely
function storeCredentials(username) {
    chrome.storage.local.set({ 'credentials': { 'username': username } }, () => {
        console.log('Credentials stored:', username);
    });
}
  
