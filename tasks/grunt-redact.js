'use strict';

var redactTask = require("./lib/redactTask.js");
var redact = require('redact');

module.exports = function (grunt) {
  grunt.registerMultiTask('redact', "Pre-runtime feature toggle support for static applications where toggle-related code can't be delivered to the client.", function () {
    redactTask.run(grunt, redact, this.options());
  });
};