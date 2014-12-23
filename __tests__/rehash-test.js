// __tests__/sum-test.js
jest.dontMock('../rehash');

describe('hashStrip', function() {
    var rehash;

    beforeEach(function() {
        rehash = require('../rehash');
    });

    it('clears single hash', function() {
      expect(rehash.strip("#Awesome")).toBe("Awesome");
    });

    it('clears multiple hashes', function() {
      expect(rehash.strip("###Awesome")).toBe("Awesome");
    });

    it('leaves later hashes intact', function() {
      expect(rehash.strip("#Awesome#")).toBe("Awesome#");
    });

    it('handles empty string', function() {
      expect(rehash.strip("")).toBe("");
    });

    it('leaves unhashed string', function() {
      expect(rehash.strip("Awesome")).toBe("Awesome");
    });
});
