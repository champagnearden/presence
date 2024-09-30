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
  

async function loginAndFetch(username) {
    //const loginUrl = 'https://moodle.univ-ubs.fr/login/index.php';
    // TODO: remplacer id du cours par id custom
    const attendanceUrl = 'https://moodle.univ-ubs.fr/mod/attendance/view.php?id=433343';

    //const formData = new URLSearchParams();
    //formData.append('username', username);

    try {
        // Login and get attendance page HTML
        //const loginResponse = await fetch(loginUrl, {
        //    method: 'POST',
        //    body: formData,
        //    credentials: 'include'
        //});
//
        //if (!loginResponse.ok) {
        //    throw new Error('Login failed');
        //}

        const attendanceResponse = await fetch(attendanceUrl, {
            credentials: 'include'
        });

        const data = await attendanceResponse.text();

        // Find the unique <a> element inside the table using regex
        const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
        let match;
        let targetLink = null;

        while ((match = regex.exec(data)) !== null) {
            // Adjust the condition to match your specific criteria for uniqueness
            // For example, check text content or any other attribute
            if (match[0].includes('Renseigner le status de présence')) {
                targetLink = match[2];
                break; // Found the target link, exit the loop
            }
        }

        if (targetLink) {
            console.log('Found target link:', targetLink);

            // Optionally, interact with the link or perform further actions
            // Due to Manifest V3 restrictions, you may need a content script for interaction
        } else {
            console.log('Target link not found.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

