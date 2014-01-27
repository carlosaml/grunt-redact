var grunt = require('grunt');

describe('functional test', function() {

  it('should redact HTML files', function() {
    var actual = grunt.file.read('./test/spec/functional/tmp/a-html-file.html');
    var expected = grunt.file.read('./test/spec/functional/expected/a-html-file.html');

    expect(actual).toBe(expected);
  });

  it('should redact JavaScript files', function() {
    var actual = grunt.file.read('./test/spec/functional/tmp/aJavaScriptFile.js');
    var expected = grunt.file.read('./test/spec/functional/expected/aJavaScriptFile.js');

    expect(actual).toBe(expected);
  });

});