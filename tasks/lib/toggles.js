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
    var htmlFiles = fileSystem.expandMapping('**/*.html', workingDirectory, {cwd: workingDirectory, filter: 'isFile'});

    htmlFiles.forEach(function (file) {
        var filePath = file.dest;

        var body = fileSystem.read(filePath);

        var redactedBody = redactor.redactHtml(body, toggleConfig);

        fileSystem.write(filePath, redactedBody);
    });
};

exports._redactJavaScriptFiles = function (fileSystem, redactor, workingDirectory, toggleConfig) {
    var jsFiles = fileSystem.expandMapping('**/*.js', workingDirectory, {cwd: workingDirectory, filter: 'isFile'});

    jsFiles.forEach(function (file) {
        var filePath = file.dest;

        var body = fileSystem.read(filePath);

        var redactedBody = redactor.redactJavascript(body, toggleConfig);

        fileSystem.write(filePath, redactedBody);
    });
};

exports.run = function (grunt, redact) {
    //TODO: test this shit
    //TODO: get workingDirectory from options

    exports._ensureConfigFileExists(grunt.file);
    var toggleConfig = exports._readToggleConfig(grunt.file);
    exports._redactHtmlFiles(grunt.file, redact, 'target/main', toggleConfig);
    exports._redactJavaScriptFiles(grunt.file, redact, 'target/main', toggleConfig);
};
