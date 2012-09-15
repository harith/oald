(function(arguments) {

    var oaldWebsiteUrl = "http://www.oxfordadvancedlearnersdictionary.com/dictionary/";

    // This event is fired with the user accepts the input in the omnibox.
    chrome.omnibox.onInputEntered.addListener(
        function(text) {
            console.log('inputEntered: ' + text);
            url = oaldWebsiteUrl + text;
            tabOptions = { "url" : url, "selected" : true };
            chrome.tabs.create(tabOptions);
    });

    function getClickHandler() {
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
        "onclick" : getClickHandler()
    });

})();
