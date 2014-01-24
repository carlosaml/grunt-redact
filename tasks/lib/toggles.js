'use strict';

var configFileName = 'toggles.json';

exports._ensureConfigFileExists = function (fileSystem) {
    if (!fileSystem.exists(configFileName)) {
        throw new Error("Could not find the toggles.json file");
    }
};

exports._readToggleConfig = function (fileSystem) {
    return fileSystem.readJSON(configFileName);
};

exports._redactHtmlFiles = function (fileSystem, redactor, workingDirectory, toggleConfig) {
    var htmlFiles = fileSystem.expand({cwd: workingDirectory, filter: 'isFile'}, '**/*.html');

    htmlFiles.forEach(function (file) {
        var body = fileSystem.read(file);

        var redactedBody = redactor.redact(body, toggleConfig);

        fileSystem.write(file, redactedBody);
    });
};

exports.run = function (grunt) {
    //TODO: test this shit
    //TODO: get workingDirectory from options

//    exports._ensureConfigFileExists(grunt.file);
//    var toggleConfig = exports._readToggleConfig(grunt.file);
//    exports._redactHtmlFiles(grunt.file, function() {}, 'src/main', toggleConfig);
};
