(function() {

    var DEFAULT_DISPLAY_STYLE = 'inline-block',
        oaldBaseURL = 'http://oald8.oxfordlearnersdictionaries.com/dictionary/',
        link        = document.createElement('a'),
        icon        = document.createElement('img'),
        helperText  = document.createElement('span');

    /* Utility functions */
    var hide = function(element) {
            return function() { element.style.display = 'none' };
        },
        show = function(element, displayType) {
            return function() { element.style.display = displayType || DEFAULT_DISPLAY_STYLE };
        };

    icon.src = chrome.extension.getURL('oald.ico');
    helperText.textContent = 'see meaning';

    link.id          = 'oald-link';
    link.target      = 'new';

    link.appendChild(icon);
    link.appendChild(helperText);

    link.addEventListener( 'click', hide(link) );
    link.addEventListener( 'mouseover', show(helperText) );
    link.addEventListener( 'mouseout',  hide(helperText) );

    document.body.appendChild(link);

    document.addEventListener('dblclick', function(e) {
        var selection = window.getSelection().toString().trim();
        if ( selection !== '' ) {
            link.href = oaldBaseURL + selection;
            link.style.left = e.pageX + 'px';
            link.style.top  = e.pageY + 'px';
            show(link).call();
        }
    });

    /* Clicking anywhere else in the page removes selection.
     * We don't want OALD link to be shown after the selection
     * is removed. */
    document.addEventListener( 'click', hide(link) );

})();
