// Function to parse the provided HTML data and find the target link
function findTargetLink(htmlString) {
    // Parse the HTML string into a DOM document
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Define the XPath expression to find the <a> element inside td[3]
    const xpath ='//*[@id="region-main"]/div[2]/div[2]/table/tbody/tr[td[3]/a]/td[3]/a'
    // Use document.evaluate to search the parsed document with the provided XPath
    return doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null).iterateNext().href;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
    console.log("Message recieved in xam.js: ", message);
    if (message.htmlString) {
        // Parse the HTML and find the target link
        const targetLink = findTargetLink(message.htmlString);
        // Send the result back to the background script
        chrome.runtime.sendMessage({ targetLink });
    }
});