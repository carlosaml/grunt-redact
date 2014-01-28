'use strict';

var toggles = require("./lib/toggles.js");
var redact = require('redact');

module.exports = function (grunt) {
  grunt.registerMultiTask('toggles', "Pre-packaging feature toggle support for static applications where toggle-related code can't be delivered to the client.", function () {
    toggles.run(grunt, redact, this.options());
  });
};