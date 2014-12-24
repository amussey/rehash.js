// This builds in the indexOf Prototype for arrays
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
}

/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
 
// object.watch
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function (prop, handler) {
            var oldval = this[prop],
                newval = oldval,
                getter = function () {
                    return newval;
                },
                setter = function (val) {
                    oldval = newval;
                    return newval = handler.call(this, prop, oldval, val);
                };

            if (delete this[prop]) { // can't watch constants
                Object.defineProperty(this, prop, {
                    get: getter,
                    set: setter,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    });
}
 
// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
          enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
}


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
