(function(window) {

    function setUp() {
        if ("onhashchange" in window) { // event supported
            window.onhashchange = function (event) {
                hashStore(parent.location.hash);
                var rehashEvent = new Event('rehash');
                window.dispatchEvent(rehashEvent);
            }
        } else { // event not supported
            var storedHash = parent.location.hash;
            window.setInterval(function () {
                if (parent.location.hash != parent.location.rehash._raw) {
                    hashStore(parent.location.hash);
                    var rehashEvent = new Event('rehash');
                    window.dispatchEvent(rehashEvent);
                }
            }, 100);
        }
        hashStore(parent.location.hash);
    }


    /**
     * Removes the # from the front of a fragment.
     *
     * @param {number} hashURL A URL to strip a # from.
     * @return a URL sans #
     */
    function hashStrip(hashURL) {
        if (hashURL[0] == "#") {
            return hashStrip(hashURL.slice(1));
        }
        return hashURL;
    }


    function hashStore(hash) {
        hash = hashStrip(hash);

        var newRehash = {
            _raw: hash,
            _build: hashBuild,
        };
        var keys = hash.split("&");
        for (var i in keys) {
            if (keys[i].split("=").length > 1) {
                var value = decodeURI(keys[i].split("=")[1])
                var key = decodeURI(keys[i].split("=")[0])
                newRehash[key] = value;
            } else {
                var key = decodeURI(keys[i])
                newRehash[key] = "";
            }
        }
        parent.location.rehash = newRehash;
    }


    function hashBuild() {
        var newHash = [];
        for (var key in parent.location.rehash) {
            if (key[0] != "_") {
                if (parent.location.rehash[key] == "") {
                    newHash.push(encodeURI(key));
                } else {
                    newHash.push([encodeURI(key), encodeURI(parent.location.rehash[key])].join("="));
                }
            }
        }
        parent.location.hash = newHash.join("&");
    }


    function isJqueryInstalled() {
        return (typeof $() !== "object");
    }

    setUp();

})(window);
