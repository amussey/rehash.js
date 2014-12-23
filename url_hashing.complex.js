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



(function() {
    window.hashCan          = new Array();
    window.hashCan.nStored  = "";
    window.hashCan.nKey     = new Array();
    window.hashCan.nValue   = new Array();
    window.hashCan.nSuppress = new Array();
    window.hashCan.oStored  = "";
    //alert("created");
    window.hashCan.oKey     = new Array();
    window.hashCan.oValue   = new Array();
    window.hashCan.oSuppress = new Array();
    hashBreak(hashStrip(parent.location.hash));
    window.hashCan.oStored   = window.hashCan.nStored.slice(0);
    //alert("updated");
    window.hashCan.oKey      = window.hashCan.nKey.slice(0);
    window.hashCan.oValue    = window.hashCan.nValue.slice(0);
    window.hashCan.oSuppress = window.hashCan.nSuppress.slice(0);

    if ("onhashchange" in window) { // event supported?
        window.onhashchange = function (event) {
            //alert("changed 1");
            //hashBreak(parent.location.hash);
            /*alert(
                'Parent:\t\t\t'      + hashStrip(parent.location.hash) +
                '\nOld URL:\t\t'     + event.oldURL +
                '\nOld URL Strip:\t' + hashStrip(event.oldURL) +
                '\nNew URL:\t\t'     + event.newURL +
                '\nNew URL Strip:\t' + hashStrip(event.newURL));*/
            hashBreak(hashStrip(parent.location.hash));
            hashChanged();
            //hashBreak(hashStrip(event.oldURL), true);
        }
    } else { // event not supported:*/
        var storedHash = parent.location.hash;
        window.setInterval(function () {
            if (parent.location.hash != storedHash) {
                //alert("changed ");
                /*alert(
                    'Parent:\t\t\t'      + parent.location.hash +
                    '\nOld:' + storedHash);
                hashBreak(parent.location.hash);*/
                hashBreak(hashStrip(parent.location.hash));//, false);
                //hashBreak(hashStrip(storedHash), true);
                storedHash = parent.location.hash;
                hashChanged();
            }
        }, 100);
    }
})();




function hashStrip(hashURL) {
    return (hashURL.indexOf("#") != -1) ?
        hashURL.substring(hashURL.indexOf("#")+1, hashURL.length) :
        (hashURL.indexOf("https://") == -1 && hashURL.indexOf("http://") == -1 ? hashURL : "");
}



function hashBreak(hashValue) {
    window.hashCan.oStored   = window.hashCan.nStored.slice(0);
    window.hashCan.oKey      = window.hashCan.nKey.slice(0);
    window.hashCan.oValue    = window.hashCan.nValue.slice(0);
    window.hashCan.oSuppress = window.hashCan.nSuppress.slice(0);


    hashValue = (typeof hashValue == "undefined") ? hashStrip(parent.location.hash) : hashStrip(hashValue);

    hashValueArray = hashValue.split("&");
    window.hashCan.nStored = hashValue;
    for (var i = 0; i < hashValueArray.length; i++) {

        var hashValuePair = hashValueArray[i].split("=");
        hashSilentUpdate(hashValuePair[0], (hashValuePair[1] == undefined) ? "" : hashValuePair[1]);
    }
    window.hashCan.oStored = hashJoin(false, false);
}






function hashFind(keyValue, hashOld) {
    hashOld   = (typeof hashOld   == "undefined") ? false : hashOld;

    if (!hashOld) {
        var i = window.hashCan.nKey.indexOf(keyValue);
        if (i == -1) {
            return undefined;
        } else {
            return window.hashCan.nValue[i];
        }
    } else {
        var i = window.hashCan.oKey.indexOf(keyValue);
        if (i == -1) {
            return undefined;
        } else {
            return window.hashCan.oValue[i];
        }
    }
}

function hashGet(keyValue, hashOld) {
    return hashFind(keyValue, hashOld);
}







function hashIndexOf(keyValue, hashOld) {
    hashOld   = (typeof hashOld   == "undefined") ? false : hashOld;
    if (!hashOld) {
        return window.hashCan.nKey.indexOf(keyValue);
    } else {
        return window.hashCan.oKey.indexOf(keyValue);
    }
}





function hashJoin(showSuppressed, hashOld) {
    showSuppressed = (typeof showSuppressed == "undefined") ? false : showSuppressed;
    hashOld   = (typeof hashOld   == "undefined") ? false : hashOld;

    var finalhash = "";
    if (!hashOld) {


        if (window.hashCan.nKey.length > 0) {
            for (var i = 0; i < window.hashCan.nKey.length; i++) {
                if (!window.hashCan.nSuppress[i] || showSuppressed) {

                    finalhash += window.hashCan.nKey[i] + "=" + window.hashCan.nValue[i];
                    //if (i+1 < window.hashCan.nKey.length) {
                    finalhash += "&";
                    //}
                }
            }
            finalhash = finalhash.slice(0, -1);
        }
        window.hashCan.nStored = finalhash; 



    } else {
        if (window.hashCan.oKey.length > 0) {
            for (var i = 0; i < window.hashCan.oKey.length; i++) {
                if (!window.hashCan.oSuppress[i] || showSuppressed) {

                    finalhash += window.hashCan.oKey[i] + "=" + window.hashCan.oValue[i];
                    //if (i+1 < window.hashCan.nKey.length) {
                    finalhash += "&";
                    //}
                }
            }
            finalhash = finalhash.slice(0, -1);
        }
        window.hashCan.oStored = finalhash;
    }
    return finalhash;
}





function hashAdd(hashKey, hashValue, valueSuppress, hashOld) {
    hashSilentUpdate(hashKey, hashValue, valueSuppress);
    hashSet();
}

function hashUpdate(hashKey, hashValue, valueSuppress, hashOld) {
    hashSilentUpdate(hashKey, hashValue, valueSuppress);
    hashSet();
}


function hashSilentUpdate(hashKey, hashValue, valueSuppress, hashOld) {
    hashOld   = (typeof hashOld   == "undefined") ? false : hashOld;


    var hashindexofkey = hashIndexOf(hashKey, hashOld);
    if (!hashOld) { 
        if (hashindexofkey == -1) {
            //alert("Adding");
            valueSuppress = (typeof valueSuppress   == "undefined") ? false : valueSuppress;
            window.hashCan.nKey[window.hashCan.nKey.length]           = hashKey;
            window.hashCan.nValue[window.hashCan.nValue.length]       = hashValue;
            window.hashCan.nSuppress[window.hashCan.nSuppress.length] = valueSuppress;

            //alert(hashJoin());
        } else {
            //alert("Ending");

            hashSilentUpdate(
                hashKey,
                window.hashCan.nValue[hashindexofkey],
                window.hashCan.nSuppress[hashindexofkey],
                true);


            window.hashCan.nValue[hashindexofkey] = hashValue;
            window.hashCan.nSuppress[hashindexofkey] =
                (typeof valueSuppress   == "undefined") ? window.hashCan.nSuppress[hashindexofkey] : valueSuppress;
        }

    } else {
        //alert(hashKey + " : " + hashValue + " : " + valueSuppress);
        if (hashindexofkey == -1) {
            alert("Adding");
            valueSuppress = (typeof valueSuppress   == "undefined") ? false : valueSuppress;
            window.hashCan.oKey.push(hashKey);
            window.hashCan.oValue.push(hashValue);
            window.hashCan.oSuppress.push(valueSuppress);
            alert("WHAT" + window.hashCan.oSuppress[window.hashCan.oSuppress.length-1]);
            //alert(hashJoin());
        } else {
            //alert("Ending");
            window.hashCan.oValue[hashindexofkey] = hashValue;
            window.hashCan.oSuppress[hashindexofkey] =
                (typeof valueSuppress   == "undefined") ? window.hashCan.oSuppress[hashindexofkey] : valueSuppress;
        }

    }
    //parent.location.hash = hashJoin();
}



function hashSuppress(hashKey, valueSuppress) {
    var hashindexofkey = hashIndexOf(hashKey);
    if (hashindexofkey != -1) {
        window.hashCan.nSuppress[hashindexofkey] = valueSuppress;
    }
    hashSet();
}

function hashSilentSuppress(hashKey, valueSuppress) {
    var hashindexofkey = hashIndexOf(hashKey);
    if (hashindexofkey != -1) {
        window.hashCan.nSuppress[hashindexofkey] = valueSuppress;
    }
}


function hashSuppressAll(valueSuppress) {
    if (window.hashCan.nSuppress.length > 0) {
        for (var i = 0; i < window.hashCan.nSuppress.length; i++) {
            window.hashCan.nSuppress[i] = valueSuppress;
        }
    }
    hashSet();
}





function hashSet() {
    hashDelete("");
    parent.location.hash = hashJoin();
}


function hashDelete(deleteKey) {
    var i = hashIndexOf(deleteKey);
    if (i != -1) {
        //var oldKey      = window.hashCan.nKey.slice(0);
        //var oldValue    = window.hashCan.nValue.slice(0);
        //var oldSuppress = window.hashCan.nSuppress.slice(0);
        window.hashCan.nKey.splice(i,1); 
        window.hashCan.nValue.splice(i,1);
        window.hashCan.nSuppress.splice(i,1);
        hashSet();
        //window.hashCan.oKey      = oldKey.slice(0);
        //window.hashCan.nValue    = oldValue.slice(0);
        //window.hashCan.nSuppress = oldSuppress.slice(0);
        //hashSet();
        //alert("adding back " + oldKey + ":" + oldValue + "\n" + window.hashCan.oValue[window.hashCan.oValue.length-1]);
        //hashSilentUpdate(oldKey, oldValue, oldSuppress, true);

    }
    
}






/*
function hashUpdate(key, update) {
    hashAdd(keyValue, updateValue);
}

function hashDelete(deleteKey){
    if (hashIndexOf(deleteKey) != -1) {
        var i = hashIndexOf(deleteKey);
        window.hashkey.splice(i,1); 
        window.hashvalue.splice(i,1);
    }
    parent.location.hash = hashJoin();
    
}*/
