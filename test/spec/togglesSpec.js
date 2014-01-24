var toggles = require('../../tasks/lib/toggles.js');

describe('toggles plugin', function () {
    var context;
    var grunt;

    beforeEach(function () {
        context = jasmine.createSpyObj('context', ['options']);
        grunt = {file: {exists: function () {
        }}};
    });

    describe('when reading the toggles config file', function () {
        var fileSystem;

        beforeEach(function () {
            fileSystem = jasmine.createSpyObj('file', ['exists', 'readJSON']);
        });

        it('should throw an error if the toggles.json file does not exist', function () {
            fileSystem.exists.andReturn(false);
            expect(function () {
                toggles._ensureConfigFileExists(fileSystem);
            }).toThrow(new Error("Could not find the toggles.json file"));

            expect(fileSystem.exists).toHaveBeenCalledWith('toggles.json');
        });

        it('should return toggle config in JSON format', function () {
            var config = {my_feature: true};
            fileSystem.readJSON.andReturn(config);
            expect(toggles._readToggleConfig(fileSystem)).toBe(config);
            expect(fileSystem.readJSON).toHaveBeenCalledWith('toggles.json');
        });
    });

    describe('when it redacts', function () {
        var fileSystem;
        var redactor;

        beforeEach(function () {
            fileSystem = jasmine.createSpyObj('file', ['expandMapping', 'read', 'write']);
            redactor = jasmine.createSpyObj('redactor', ['redactHtml', 'redactJavascript']);
        });

        it('should redact HTML files in place', function () {
            var file1Original = '<html>File 1</html>';
            var file2Original = '<html>File 2</html>';
            var file1Redacted = '<html>File 1 REDACTED!</html>';
            var file2Redacted = '<html>File 2 REDACTED!</html>';

            fileSystem.expandMapping.andReturn([
                {src: 'src/main/file1.html', dest: 'src/main/file1.html'},
                {src: 'src/main/file2.html', dest: 'src/main/file2.html'}
            ]);
            fileSystem.read.andCallFake(function (fileName) {
                if (fileName === 'src/main/file1.html') {
                    return file1Original;
                }
                if (fileName === 'src/main/file2.html') {
                    return file2Original;
                }
                return null;
            });

            redactor.redactHtml.andCallFake(function (code) {
                if (code === file1Original) {
                    return file1Redacted;
                }
                if (code === file2Original) {
                    return file2Redacted;
                }
                return null;
            });

            var toggleConfig = {my_feature: true};

            toggles._redactHtmlFiles(fileSystem, redactor, 'src/main', toggleConfig);

            expect(fileSystem.expandMapping).toHaveBeenCalledWith('**/*.html', 'src/main', {cwd: 'src/main', filter: "isFile"});

            expect(fileSystem.read).toHaveBeenCalledWith('src/main/file1.html');
            expect(fileSystem.read).toHaveBeenCalledWith('src/main/file2.html');
            expect(fileSystem.read.callCount).toBe(2);

            expect(redactor.redactHtml).toHaveBeenCalledWith(file1Original, toggleConfig);
            expect(redactor.redactHtml).toHaveBeenCalledWith(file2Original, toggleConfig);
            expect(redactor.redactHtml.callCount).toBe(2);

            expect(fileSystem.write).toHaveBeenCalledWith('src/main/file1.html', file1Redacted);
            expect(fileSystem.write).toHaveBeenCalledWith('src/main/file2.html', file2Redacted);
            expect(fileSystem.write.callCount).toBe(2);
        });

        it('should redact JavaScript files in place', function () {
            var file1Original = 'if (featured.firstFeature) { doStuff(); }';
            var file2Original = 'if (featured.secondFeature) { doStuff(); }';
            var file1Redacted = '// File 1 REDACTED!';
            var file2Redacted = '// File 2 REDACTED!';

            fileSystem.expandMapping.andReturn([
                {src: 'src/main/file1.js', dest: 'src/main/file1.js'},
                {src: 'src/main/file2.js', dest: 'src/main/file2.js'}
            ]);
            fileSystem.read.andCallFake(function (fileName) {
                if (fileName === 'src/main/file1.js') {
                    return file1Original;
                }
                if (fileName === 'src/main/file2.js') {
                    return file2Original;
                }
                return null;
            });

            redactor.redactJavascript.andCallFake(function (code) {
                if (code === file1Original) {
                    return file1Redacted;
                }
                if (code === file2Original) {
                    return file2Redacted;
                }
                return null;
            });

            var toggleConfig = {myFeature: true};

            toggles._redactJavaScriptFiles(fileSystem, redactor, 'src/main', toggleConfig);

            expect(fileSystem.expandMapping).toHaveBeenCalledWith('**/*.js', 'src/main', {cwd: 'src/main', filter: "isFile"});

            expect(fileSystem.read).toHaveBeenCalledWith('src/main/file1.js');
            expect(fileSystem.read).toHaveBeenCalledWith('src/main/file2.js');
            expect(fileSystem.read.callCount).toBe(2);

            expect(redactor.redactJavascript).toHaveBeenCalledWith(file1Original, toggleConfig);
            expect(redactor.redactJavascript).toHaveBeenCalledWith(file2Original, toggleConfig);
            expect(redactor.redactJavascript.callCount).toBe(2);

            expect(fileSystem.write).toHaveBeenCalledWith('src/main/file1.js', file1Redacted);
            expect(fileSystem.write).toHaveBeenCalledWith('src/main/file2.js', file2Redacted);
            expect(fileSystem.write.callCount).toBe(2);
        });

    });
});