'use strict';

var configfileName = 'toggles.json';

exports._configFileExists = function (file) {
    if (!file.exists(configfileName)) {
        throw new Error("Could not find a toggles.json file");
    }
};

exports._config = function (file) {
    return file.readJSON(configfileName);
};

exports._redactHtmlFiles = function (file) {
    return;
};

exports.run = function (grunt) {
    exports._configFileExists(grunt.file);
};
