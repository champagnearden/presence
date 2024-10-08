// Set initial alarm to start at the nearest hour
chrome.runtime.onInstalled.addListener(() => {
    scheduleAlarm();
});

// Schedule alarm to run every hour between 8 AM to 7 PM
function scheduleAlarm() {
    chrome.alarms.clearAll(); // Clear all existing alarms
    const now = new Date();
    const startHour = 8; // 8 AM
    const endHour = 19; // 7 PM

    // If current hour is past the end hour, schedule for the next day
    if (now.getHours() >= endHour) {
        now.setDate(now.getDate() + 1); // Move to next day
        now.setHours(startHour, 0, 0, 0); // Set alarm for startHour on the next day
    } else if (now.getHours() < startHour) {
        now.setHours(startHour, 0, 0, 0); // Set alarm for startHour today if before startHour
    } else {
        now.setHours(now.getHours() + 1, 0, 0, 0); // Set alarm for the next hour
    }

    // Schedule alarms every hour until endHour
    while (now.getHours() <= endHour) {
        chrome.alarms.create('fetchDataAlarm', { when: now.getTime() });
        now.setHours(now.getHours() + 1, 0, 0, 0); // Move to the next hour
    }
}

// Listen for alarms and execute your code
chrome.alarms.onAlarm.addListener(alarm => {
if (alarm.name === 'fetchDataAlarm') {
    console.log('Alarm triggered, fetching data...');

    // Put your code here to fetch and process the data from Moodle
    // Example:
    retrieveCredentials(); // Function to fetch attendance data from Moodle
}
});
  

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "loginAndFetch") {
        retrieveCredentials();
    }
});

// Function to retrieve stored credentials
function retrieveCredentials() {
    return chrome.storage.local.get(['credentials'], (result) => {
      const credentials = result.credentials;
      if (credentials) {
        loginAndFetch(credentials.username);
      } else {
        console.log('Credentials not found.');
      }
    });
  }
  

  async function createOffscreenDocument() {
    const exists = await chrome.offscreen.hasDocument();
    if (!exists) {
        await chrome.offscreen.createDocument({
            url: chrome.runtime.getURL('xam.html'),
            reasons: [chrome.offscreen.Reason.DOM_PARSER],
            justification: 'Need to parse attendance HTML document',
        });
        console.log("Offscreen document created");
    }
}

// Function to fetch HTML and send it to the offscreen document for parsing
async function loginAndFetch(username) {
    const attendanceUrl = 'https://moodle.univ-ubs.fr/mod/attendance/view.php?id=433343';
    try {
        // Fetch the HTML response
        const attendanceResponse = await fetch(attendanceUrl, {
            credentials: 'include',
        });

        // Get the response as a text string
        const htmlString = await attendanceResponse.text();

        // Ensure the offscreen document is created
        await createOffscreenDocument();

        // Send the HTML string to the offscreen document for parsing
        chrome.runtime.sendMessage({ htmlString });
        console.log("Message sent to offscreen document");
    } catch (error) {
        console.error("Error fetching or parsing HTML:", error);
    }
}

// Handle the message when the link is returned from the offscreen document
chrome.runtime.onMessage.addListener((message) => {
    if (message.targetLink) {
        console.log("Target link found:", message.targetLink);
        // Do something with the target link, such as opening it
        chrome.tabs.create({ url: message.targetLink });
    } else {
        console.log("No target link found in the message.");
    }
});


