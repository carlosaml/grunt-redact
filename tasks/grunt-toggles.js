'use strict';

var toggles = require("./lib/toggles.js");
var redact = require('redact');

module.exports = function (grunt) {
    grunt.registerMultiTask('toggles', 'Does stuff related to toggles', function () {
        toggles.run.call(this, grunt, redact);
    });
};
