'use strict';

var configFileName = 'toggles.json';

exports._configFileExists = function (file) {
    if (!file.exists(configFileName)) {
        throw new Error("Could not find the toggles.json file");
    }
};

exports._config = function (file) {
    return file.readJSON(configFileName);
};

exports._redactHtmlFiles = function (file) {
    return;
};

exports.run = function (grunt) {
    exports._configFileExists(grunt.file);
};
