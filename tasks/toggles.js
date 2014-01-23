'use strict';

var toggles = require("./lib/toggles.js");

module.exports = function (grunt) {
    grunt.registerMultiTask('toggles', 'Does stuff related to toggles', function () {
        toggles.run.call(this, grunt);
    });
};
