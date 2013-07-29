(function() {

    var DEFAULT_DISPLAY_STYLE = 'inline-block',
        POSITION_BUFFER       = 5, // in pixels
        RESET       = '<a href="#" target="new" id="oald-external"></a>',
        MAX_DEFS    = 3,
        oaldBaseURL = 'http://oald8.oxfordlearnersdictionaries.com/dictionary/',
        link        = document.createElement('a'),
        icon        = document.createElement('img'),
        helperText  = document.createElement('span');
        definitions = document.createElement('div');

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
        },
        minimum = function(a, b) {
            return a < b ? a : b;
        },
        CSSObject = function(style) {
            this.style = style;
            this.inlineCSSText = function() {
                var cssText = JSON.stringify(this.style);
                return cssText.replace(/["}{]/g,'').replace(/,/g,';');
            }
        };

    /* OALD call */
    var getWordDefinitions = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if ( xhr.readyState == 4 ) {
                definitions.innerHTML = RESET;
                var oaldLink = definitions.querySelector("#oald-external"),
                    root     = document.createElement("div"),
                    defs, iterations = 0, pronunciation;

                root.innerHTML = xhr.responseText;
                defs = root.querySelectorAll(".d");
                pronunciation = ' (' + root.querySelector(".i").textContent + ' )';

                oaldLink.style.display = "block";
                oaldLink.href = url;
                oaldLink.textContent = url.split('/').pop() + pronunciation;

                iterations = minimum( defs.length, MAX_DEFS );
                for ( var i = 0; i < iterations; i++ ) {
                    defs[i].style.display = "block";
                    definitions.appendChild(defs[i]);
                }
                show(definitions).call();
                hide(link).call(); 
            }
        };
        xhr.send();
    }

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
            "z-index"           : "9999",
            "cusror"            : "pointer"
        }),
        iconStyle = new CSSObject({
            "margin"         : "0",
            "padding"        : "0",
            "vertical-align" : "middle"
        }),
        helperTextStyle = new CSSObject({
            "margin"      : "0",
            "padding"     : "0",
            "margin-left" : "0.25em",
            "display"     : "none"
        }),
        definitionsStyle = new CSSObject({
            "display"     : "none",
            "position"    : "fixed",
            "color"       : "black",
            "font-size"   : "16px",
            "font-family" : "sans-serif",
            "z-index"     : "9999",
            "bottom"      : "0",
            "left"        : "0",
            "width"       : "100%",
            "border-top"  : "1px solid black",
            "padding"     : "2em",
            "text-align"  : "left",
            "background-color" : "#F0F0F0"
        });

    link.id             = 'oald-link';
    link.target         = 'new';
    link.style.cssText  = linkStyle.inlineCSSText();

    icon.style.cssText  = iconStyle.inlineCSSText();

    helperText.textContent   = 'see meaning';
    helperText.style.cssText = helperTextStyle.inlineCSSText();

    definitions.id              = 'oald-definitions';
    definitions.style.cssText   = definitionsStyle.inlineCSSText();

    link.appendChild(icon);
    link.appendChild(helperText);

    link.addEventListener( 'mouseover', show(helperText) );
    link.addEventListener( 'mouseout',  hide(helperText) );

    document.body.appendChild(link);
    document.body.appendChild(definitions);

    link.addEventListener('click', function(e) {
        e.preventDefault();
        icon.src = chrome.extension.getURL('img/spinner.gif');
        helperText.textContent = 'fetching…';
        getWordDefinitions(this.href);
    });
    document.addEventListener('dblclick', function(e) {
        var selection = window.getSelection().toString().trim();
        if ( selection !== '' ) {
            helperText.textContent = 'see meaning';
            icon.src        = chrome.extension.getURL('img/oald.ico');
            link.href       = oaldBaseURL + selection;
            link.style.left = e.pageX + POSITION_BUFFER + 'px';
            link.style.top  = e.pageY + POSITION_BUFFER + 'px';
            show(link).call();
        }
    });
    document.addEventListener( 'click', function(e) {
        /* Clicking anywhere else in the page removes selection.
         * We don't want OALD link to be shown after the selection
         * is removed. */
        if ( e.target.parentNode.id !== 'oald-link' ) {
            hide(link).call(); 
            hide(definitions).call();
        }
    });

})();
