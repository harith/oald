(function() {

    var DEFAULT_DISPLAY_STYLE = 'inline-block',
        RESET       = '<a href="#" target="new" id="oald-external"></a>',
        MAX_DEFS    = 3,
        oaldBaseURL = 'https://oald8.oxfordlearnersdictionaries.com/dictionary/',
        definitions = document.createElement('div');

    definitions.id  = 'oald-definitions';
    document.body.appendChild(definitions);

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

    /* OALD call */
    var getWordDefinitions = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if ( xhr.readyState == 4 ) {
                definitions.innerHTML = RESET;
                var oaldLink = definitions.querySelector("#oald-external"),
                    root     = document.createElement("div"),
                    pronunciation = document.createElement("span"),
                    defs, iterations = 0, pronunciation;

                root.innerHTML = xhr.responseText;
                defs = root.querySelectorAll(".d");

                pronunciation.className = 'oald-pronunciation'
                pronunciation.textContent = ' /' + root.querySelector(".i").textContent + '/';

                oaldLink.style.display = "block";
                oaldLink.href = url;
                oaldLink.textContent = url.split('/').pop();
                oaldLink.appendChild(pronunciation);

                iterations = Math.min( defs.length, MAX_DEFS );
                for ( var i = 0; i < iterations; i++ ) {
                    defs[i].style.display = "block";
                    definitions.appendChild(defs[i]);
                }
                show(definitions).call();
            }
        };
        xhr.send();
    }

    document.addEventListener('dblclick', function(e) {
        var selection = window.getSelection().toString().trim();
        if ( selection !== '' ) {
            getWordDefinitions(oaldBaseURL + selection);
        }
    });

    document.addEventListener( 'click', function(e) {
        if ( e.target.parentNode.id !== 'oald-link' ) {
            hide(definitions).call();
        }
    });

})();
