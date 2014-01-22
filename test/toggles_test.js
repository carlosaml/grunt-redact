'use strict';

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var grunt = require("grunt"),
    should = require("should"),
    _ = grunt.util._;
 
var PurgeTogglesTask = require("../lib/purgeTogglesTask");

exports.toggles = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    
    should_work: function(test) {
        test.expect(1);
        test.equal(1, 1);
        test.done();
    },

    should_register_itself_with_grunt: function(test) {

        should.exist(PurgeTogglesTask.registerWithGrunt);

        PurgeTogglesTask.registerWithGrunt(grunt);

        should.exist(grunt.task._tasks[PurgeTogglesTask.taskName]);
        grunt.task._tasks[PurgeTogglesTask.taskName].info.should.equal(PurgeTogglesTask.taskDescription);

        test.done();
    },
};
