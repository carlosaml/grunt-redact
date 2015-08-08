'use strict';

var _ = require("lodash");

exports._config = function () {
  var file = this.file;
  var toggleStatesFilePath = this.toggleStatesFileName;
  var toggleStates = this.toggleStates || {};
  var everythingOn = this.everythingOn || false;

  return {
    verify: function () {
      if ((_.isEmpty(toggleStatesFilePath) || !file.exists(toggleStatesFilePath)) && _.isEmpty(toggleStates)) {
        throw new Error("Could not find the toggle states file at " + toggleStatesFilePath + " and no inline toggle states are defined");
      }
      return true;
    },
    read: function () {
      var fromFile = {};
      if (!_.isEmpty(toggleStatesFilePath) && file.exists(toggleStatesFilePath)) {
        fromFile = file.readJSON(toggleStatesFilePath);
      }
      var merged = _.merge(fromFile, toggleStates);

      if (everythingOn) {
        return _.mapValues(merged, function (value) {
          console.log(value);
          return true;
        });
      }

      return merged;
    }
  };
};

exports._listFiles = function (pattern) {
  return this.file.expandMapping(pattern, this.workingDirectory, {cwd: this.workingDirectory, filter: 'isFile'});
};

exports._readRedactWrite = function (filesToBeConverted, convert) {
  var file = this.file;
  var features = this.features;

  filesToBeConverted.forEach(function (fileToBeConverted) {
    var body = file.read(fileToBeConverted.dest);
    file.write(fileToBeConverted.dest, convert(body, features));
  });
};

exports._removeUnwantedFeaturesFrom = function () {
  var that = this;
  return {
    html: function (patterns) {
      that._readRedactWrite(that._listFiles(patterns || '**/*.html'), that.redact.redactHtml);
    },
    javascript: function (patterns) {
      that._readRedactWrite(that._listFiles(patterns || '**/*.js'), that.redact.redactJavascript);
    }
  };
};

exports.run = function (grunt, redact, options) {
  this.file = grunt.file;
  this.redact = redact;

  this.workingDirectory = options['workingDirectory'];
  this.toggleStatesFileName = options['toggleStatesFile'];
  this.js_patterns = options['jsPatterns'];
  this.html_patterns = options['htmlPatterns'];
  this.toggleStates = options['toggleStates'];
  this.everythingOn = options['everythingOn'];

  exports._config().verify();
  this.features = this._config().read();

  exports._removeUnwantedFeaturesFrom().html(this.html_patterns);
  exports._removeUnwantedFeaturesFrom().javascript(this.js_patterns);
};
