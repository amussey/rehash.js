# rehash.js

rehash.js is a URL fragment manipulation library.

The main functionality that rehash.js adds is the ability to break out parameters in the URL in a style similar to that of standard URL GET parameters.  For example:

    http://amussey.com/#home&filter=projects

This URL would be broken out into an array containing the following info:

```javascript
// location.rehash
{
    _raw: "home&filter=projects",
    home: ""
    filter: "projects"
}
```

As you can see above, values are stored in `location.rehash` instead of `location.hash`.  The rehash library will automatically listen for changes to `location.hash` and update `location.rehash` accordingly.


## Usage

Rather than listening for the hash to change, listen for `rehash`:

```javascript
elem.addEventListener('rehash', function (e) { 
    // Perform some action on the new hash.
}, false);
```

This can also be performed with **jQuery**:

```javascript
$( "#foo" ).on( "rehash", function() {
    // Perform some action on the new hash.
});
```

If you have modified the values contained in the rehash array (`location.rehash`), they will not automatically appear in the fragment in the URL.  Instead, the fragment will have to be rebuilt.  This can be done by running:

```javascript
location.rehash._build();
```
