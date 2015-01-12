//
// rehash.js -- A URL fragment manipulation library.
//
// Version 1.0.1
//
// Copyright (c) 2014 Andrew Mussey, amussey.com
//
// Redistributable under a BSD license.
// See LICENSE for more information.
//
// For usage examples, see https://github.com/amussey/rehash.js/.
//

var rehash = (function(window) {

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
                if (window.jQuery) {
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
                    if (window.jQuery) {
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
     * A wrapper function for _hashStore.  Assigns the hash that was broken apart
     * to location.rehash.
     *
     * @param {string} hash The new URL hash value.
     */
    function hashStore(hash) {
        newRehash = _hashStore(hash);
        newRehash._build = hashBuild;
        parent.location.rehash = newRehash;
    }


    /**
     * Break apart the provided hash and creates an object for location.rehash.
     *
     * @param {string} hash The new URL hash value.
     * @return A new object for location.rehash.
     */
    function _hashStore(hash) {
        hash = hashStrip(hash);

        var newRehash = {
            _raw: hash
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
        return newRehash;
    }


    /**
     * A wrapper function for _hashBuild.  Publishes the new hash string
     * (built from the values stored in the rehash array) to location.hash.
     */
    function hashBuild() {
        parent.location.hash = _hashBuild(parent.location.rehash);
    }


    /**
     * A private function that builds a new hash string from the values
     * stored in the rehash array.
     *
     * @param {object} rehash The current rehash value.
     * @return A string for assigning to location.hash.
     */
    function _hashBuild(rehash) {
        var newHash = [];
        for (var key in rehash) {
            if (key[0] != "_") {
                if (rehash[key] == "") {
                    newHash.push(encodeURI(key));
                } else {
                    newHash.push([encodeURI(key), encodeURI(rehash[key])].join("="));
                }
            }
        }
        return newHash.join("&");
    }


    setUp();

    /* test-code */
    var rehash = {
        __testonly__: {
            hashStrip: hashStrip,
            _hashStore: _hashStore,
            _hashBuild: _hashBuild
        }
    };
    return rehash;
    /* end-test-code */

})(window);

/* test-code */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = rehash;
}
/* end-test-code */
