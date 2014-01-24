var toggles = require('../../tasks/lib/toggles.js');

describe('toggles plugin', function () {
    var context;
    var grunt;

    beforeEach(function () {
        context = jasmine.createSpyObj('context', ['options']);
        grunt = {file: {exists: function () {
        }}};
    });

    describe('when the toggles file is read', function () {
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

        it('should return toggle config json', function () {
            var config = {my_feature: true};
            fileSystem.readJSON.andReturn(config);
            expect(toggles._readToggleConfig(fileSystem)).toBe(config);
            expect(fileSystem.readJSON).toHaveBeenCalledWith('toggles.json');
        });
    });

    describe('when redacted', function () {
        var fileSystem;
        var redactor;

        beforeEach(function () {
            fileSystem = jasmine.createSpyObj('file', ['expand', 'read', 'write']);
            redactor = jasmine.createSpyObj('redactor', ['redactHtml']);
        });

        it('should redact HTML files in place', function () {
            var file1Original = '<html>File 1</html>';
            var file2Original = '<html>File 2</html>';
            var file1Redacted = 'file 1 REDACTED!';
            var file2Redacted = 'file 2 REDACTED!';

            fileSystem.expand.andReturn(['src/main/file1.html', 'src/main/file2.html']);
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

            expect(fileSystem.expand).toHaveBeenCalledWith({cwd: 'src/main', filter: "isFile"}, '**/*.html');

            expect(fileSystem.read).toHaveBeenCalledWith('src/main/file1.html');
            expect(fileSystem.read).toHaveBeenCalledWith('src/main/file2.html');
            expect(fileSystem.read.callCount).toBe(2);

            expect(redactor.redactHtml).toHaveBeenCalledWith(file1Original, toggleConfig);
            expect(redactor.redactHtml).toHaveBeenCalledWith(file2Original, toggleConfig);
            expect(redactor.redactHtml.callCount).toBe(2);

            expect(fileSystem.write).toHaveBeenCalledWith('src/main/file1.html', 'file 1 REDACTED!');
            expect(fileSystem.write).toHaveBeenCalledWith('src/main/file2.html', 'file 2 REDACTED!');
            expect(fileSystem.write.callCount).toBe(2);
        });
    });
});