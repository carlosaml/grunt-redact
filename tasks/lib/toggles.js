'use strict';

exports._config = function () {
    var file = this.file;
    var configFileName = "toggles.json";

    return {
        verify: function () {
            if (!file.exists(configFileName)) {
                throw new Error("Could not find the toggles.json file");
            }
        },
        read: function () {
            return file.readJSON(configFileName);
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

exports.run = function (grunt, redact) {
    //TODO: test this shit
    //TODO: get workingDirectory from options
    //TODO: perhaps get file extensions from options

    this.file = grunt.file;
    this.workingDirectory = 'target/main';
    this.redact = redact;

    exports._config().verify();
    this.features = this._config().read();

    exports._removeUnwantedFeaturesFrom().html();
    exports._removeUnwantedFeaturesFrom().javascript();
};
