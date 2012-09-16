/* Content script. Listens to double click events and sends the selected text to */
document.addEventListener('dblclick', function() {
    var selection = window.getSelection();
    console.log( "Selected text: " + selection.toString() );

    chrome.extension.sendMessage( {selectionText : selection.toString()}, function(response) {
        console.log(response.action);
    });
});
