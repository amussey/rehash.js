// __tests__/rehash-test.js
jest.dontMock('../rehash');

describe('hashStrip', function() {
    var rehash;

    beforeEach(function() {
        rehash = require('../rehash');
    });

    it('clears single hash', function() {
      expect(rehash.__testonly__.hashStrip("#Awesome")).toEqual("Awesome");
    });

    it('clears multiple hashes', function() {
      expect(rehash.__testonly__.hashStrip("###Awesome")).toEqual("Awesome");
    });

    it('leaves later hashes intact', function() {
      expect(rehash.__testonly__.hashStrip("#Awesome#")).toEqual("Awesome#");
    });

    it('handles empty string', function() {
      expect(rehash.__testonly__.hashStrip("")).toEqual("");
    });

    it('leaves unhashed string', function() {
      expect(rehash.__testonly__.hashStrip("Awesome")).toEqual("Awesome");
    });
});

describe('hashStore', function() {
    var rehash;

    beforeEach(function() {
        rehash = require('../rehash');
    });

    it('builds a new array', function() {
        var result = rehash.__testonly__._hashStore("#awesome&win=yes");
        var expected = {
            _raw: 'awesome&win=yes',
            awesome: '',
            win: 'yes'
        }

        expect(result).toEqual(expected);
    });
});


describe('hashBuild', function() {
    var rehash;

    beforeEach(function() {
        rehash = require('../rehash');
    });

    it('builds a hash from a rehash', function() {
        var result = rehash.__testonly__._hashBuild({
            awesome: '',
            win: 'yes'
        });

        expect(result).toEqual("awesome&win=yes");
    });

    it('doesn\'t include an _ value', function() {
        var result = rehash.__testonly__._hashBuild({
            _raw: 'awesome&win=yes',
            awesome: '',
            win: 'yes'
        });

        expect(result).toEqual("awesome&win=yes");
    });
});
