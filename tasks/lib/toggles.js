'use strict';

exports._configFileExists = function (file) {
    if (!file.exists('toggles.json')) {
        throw new Error("Could not find a toggles.json file");
    }
};

exports.run = function (grunt) {
    exports._configFileExists(grunt.file);
};
