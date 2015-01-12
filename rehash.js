//
// rehash.js -- A URL fragment manipulation library.
//
// Version 1.0.0
//
// Copyright (c) 2014 Andrew Mussey, amussey.com
//
// Redistributable under a BSD license.
// See LICENSE for more information.
//
// For usage examples, see https://github.com/amussey/rehash.js/.
//

(function(window) {

    /**
     * The initial setup for rehash.js.  This adds the listeners for when the
     * hash changes and dispatches the rehash event when the new rehash array
     * has been constructed.
     */
    function setUp() {
        if ("onhashchange" in window) { // event supported
            window.onhashchange = function (event) {
                hashStore(parent.location.hash);
                var rehashEvent = new Event('rehash');
                window.dispatchEvent(rehashEvent);
                if (isJqueryInstalled()) {
                    $(window).trigger("rehash");
                }
            }
        } else { // event not supported
            var storedHash = parent.location.hash;
            window.setInterval(function () {
                if (parent.location.hash != parent.location.rehash._raw) {
                    hashStore(parent.location.hash);
                    var rehashEvent = new Event('rehash');
                    window.dispatchEvent(rehashEvent);
                    if (isJqueryInstalled()) {
                        $(window).trigger("rehash");
                    }
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


    /**
     * Break apart the provided hash and store it in location.rehash.
     *
     * @param {number} hash The new URL hash value.
     */
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


    /**
     * Build a new hash string from the values stored in the rehash array
     * and publish them to location.hash.
     */
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


    /**
     * Check if jQuery ha been included in the currently running script.
     *
     * @return True if jQuery is installed, false otherwise.
     */
    function isJqueryInstalled() {
        return (typeof $() === "object");
    }

    setUp();

})(window);
