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




function hashLoad() {
    hashBreak();
}

function hashBreak(hashValue) {
    hashValue = (typeof hashValue == "undefined") ? parent.location.hash : hashValue;
    hashValue = (hashValue[0] == "#" ? hashValue.substring(1, hashValue.length) : hashValue);
    hashValueArray = hashValue.split("&");
    window.hashkey   = new Array();
    window.hashvalue = new Array();
    for (var i = 0; i < hashValueArray.length; i++) {
        var hashValuePair = hashValueArray[i].split("=");
        window.hashkey.push(hashValuePair[0]);
        window.hashvalue.push(hashValuePair[1]);
    }
}

function hashFind(keyValue) {
    if (window.hashkey == undefined || window.hashvalue == undefined) {
        window.hashkey = new Array();
        window.hashvalue = new Array();
    }
    var i = window.hashkey.indexOf(keyValue);
    if (i == -1) {
        return undefined;
    } else {
        return window.hashvalue[i];
    }
}

function hashIndexOf(keyValue) {
    if (window.hashkey == undefined || window.hashvalue == undefined) {
        window.hashkey = new Array();
        window.hashvalue = new Array();
    }
    return window.hashkey.indexOf(keyValue);
}

function hashJoin() {
    var finalhash = "";
    if (window.hashkey != undefined && window.hashvalue != undefined) {
        for (var i = 0; i < window.hashkey.length; i++) {
            finalhash += window.hashkey[i] + "=" + window.hashvalue[i];
            if (i+1 < window.hashkey.length) {
                finalhash += "&";
            }
        }
    }
    return finalhash;
}

function hashAdd(keyValue, valueValue) {
    if (window.hashkey == undefined || window.hashvalue == undefined) {
        window.hashkey = new Array();
        window.hashvalue = new Array();
    }
    var hashindexofkey = hashIndexOf(keyValue);
    if (hashindexofkey == -1) {
        alert("doesn't exist");
        window.hashkey[window.hashkey.length]     = keyValue;
        window.hashvalue[window.hashvalue.length] = valueValue;
        alert(hashJoin());

    } else {
        window.hashvalue[hashindexofkey] = valueValue;
    }
    parent.location.hash = hashJoin();
}

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
    
}
