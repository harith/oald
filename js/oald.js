(function() {

    var DEFAULT_DISPLAY_STYLE = 'inline-block',
        POSITION_BUFFER       = 5, // in pixels
        oaldBaseURL = 'http://oald8.oxfordlearnersdictionaries.com/dictionary/',
        link        = document.createElement('a'),
        icon        = document.createElement('img'),
        helperText  = document.createElement('span');

    var CSSObject = function(style) {
        this.style = style;
        this.inlineCSSText = function() {
            var cssText = JSON.stringify(this.style);
            return cssText.replace(/["}{]/g,'').replace(/,/g,';');
        }
    };

    /* To add inline CSS instead of CSS from a file. 
     * Inline CSS will override all other styles. */
    var linkStyle = new CSSObject({
            "margin"            : "0",
            "padding"           : "0",
            "position"          : "absolute",
            "display"           : "none",
            "text-decoration"   : "none",
            "padding"           : "0.25em",
            "border"            : "1px solid black",
            "border-radius"     : "2px",
            "background"        : "white",
            "font-size"         : "12px",
            "color"             : "black",
            "font-family"       : "sans-serif",
            "z-index"           : "9999"
        }),
        linkIconStyle = new CSSObject({
            "margin"         : "0",
            "padding"        : "0",
            "vertical-align" : "middle"
        }),
        helperTextStyle = new CSSObject({
            "margin"      : "0",
            "padding"     : "0",
            "margin-left" : "0.25em",
            "display"     : "none"
        });

    /* Utility functions 
     *
     * show, hide: These functions return functions so that 
     *             they can be used as event listeners
     */
    var hide = function(element) {
            return function() { element.style.display = 'none' };
        },
        show = function(element, displayType) {
            return function() { element.style.display = displayType || DEFAULT_DISPLAY_STYLE };
        };
     
    link.id             = 'oald-link';
    link.target         = 'new';
    link.style.cssText  = linkStyle.inlineCSSText();

    icon.src            = chrome.extension.getURL('oald.ico');
    icon.style.cssText  = linkIconStyle.inlineCSSText();

    helperText.textContent   = 'see meaning';
    helperText.style.cssText = helperTextStyle.inlineCSSText();

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
            link.style.left = e.pageX + POSITION_BUFFER + 'px';
            link.style.top  = e.pageY + POSITION_BUFFER + 'px';
            show(link).call();
        }
    });

    /* Clicking anywhere else in the page removes selection.
     * We don't want OALD link to be shown after the selection
     * is removed. */
    document.addEventListener( 'click', hide(link) );

})();
