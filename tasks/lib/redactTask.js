'use strict';

exports._config = function () {
  var file = this.file;
  var toggleStatesFilePath = this.toggleStatesFileName;

  return {
    verify: function () {
      if (!file.exists(toggleStatesFilePath)) {
        throw new Error("Could not find the toggle states file at " + toggleStatesFilePath);
      }
    },
    read: function () {
      return file.readJSON(toggleStatesFilePath);
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
    html: function () {
      that._readRedactWrite(that._listFiles('**/*.html'), that.redact.redactHtml);
    },
    javascript: function () {
      that._readRedactWrite(that._listFiles('**/*.js'), that.redact.redactJavascript);
    }
  };
};

exports.run = function (grunt, redact, options) {
  this.file = grunt.file;
  this.redact = redact;

  this.workingDirectory = options['workingDirectory'];
  this.toggleStatesFileName = options['toggleStatesFile'];

  exports._config().verify();
  this.features = this._config().read();

  exports._removeUnwantedFeaturesFrom().html();
  exports._removeUnwantedFeaturesFrom().javascript();
};
