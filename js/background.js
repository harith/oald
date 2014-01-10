var oaldWebsiteUrl = "http://www.oxfordadvancedlearnersdictionary.com/dictionary/";

/* Omnibox functionality */
chrome.omnibox.onInputEntered.addListener(
    function(text) {
        url = oaldWebsiteUrl + text;
        tabOptions = { "url" : url, "selected" : true };
        chrome.tabs.create(tabOptions);
});

function getHandler() {
    return function(info, tab) {
        url = oaldWebsiteUrl + info["selectionText"];
        tabOptions = { "url" : url, "selected" : true };
        chrome.tabs.create(tabOptions);
    }
}

// Add context menu item
chrome.contextMenus.create({
    "title" : "OALD definition for '%s'",
    "type" : "normal",
    "contexts" : ["selection"],
    "onclick" : getHandler()
});


/*
    Receives messages from any call made using
    chrome.extension.sendMessage( message , responseHandler );
*/
chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
        sendResponse({action: "Looking up " + message["selectionText"]});
        getHandler().call(this, message);
    }
);
