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
        beforeEach(function () {
            toggles.file = jasmine.createSpyObj('file', ['exists', 'readJSON']);
        });

        it('should throw an error if the toggles.json file does not exist', function () {
            toggles.file.exists.andReturn(false);
            expect(function () {
                toggles._config().verify();
            }).toThrow(new Error("Could not find the toggles.json file"));

            expect(toggles.file.exists).toHaveBeenCalledWith('toggles.json');
        });

        it('should return toggle config in JSON format', function () {
            var config = {my_feature: true};
            toggles.file.readJSON.andReturn(config);
            expect(toggles._config().read()).toBe(config);
            expect(toggles.file.readJSON).toHaveBeenCalledWith('toggles.json');
        });
    });

    describe('when files are to be listed', function () {
        it('should list files in a working directory', function () {
            toggles.file = jasmine.createSpyObj('file', ['expandMapping']);
            toggles.workingDirectory = "dir";

            var expected = [ 'files'];
            toggles.file.expandMapping.andReturn(expected);

            var files = toggles._listFiles("pattern");

            expect(files).toBe(expected);
            expect(toggles.file.expandMapping).toHaveBeenCalledWith('pattern', 'dir', {cwd: 'dir', filter: 'isFile'});
        });

    });

    describe('when files are to be redacted', function () {
        var convert;
        var file;
        var filesToBeConverted;

        beforeEach(function () {
            file = toggles.file = jasmine.createSpyObj('file', ['read', 'write']);
            convert = jasmine.createSpy('convert');
            toggles.redact = jasmine.createSpyObj('redact', ['redactHtml', 'redactJavascript']);

            var bodies = {file1: {original: "file1", redacted: 'redacted1'}, file2: {original: "file2", redacted: "redacted2"}};

            filesToBeConverted = [
                {dest: 'file1'},
                {dest: 'file2'}
            ];

            file.read.andCallFake(function (fileName) {
                return bodies[fileName].original;
            });

            convert.andCallFake(function (body) {
                return bodies[body].redacted;
            });

        });

        it('should edit file contents in place', function () {
            toggles._readRedactWrite(filesToBeConverted, convert);

            expect(file.read).toHaveBeenCalledWith('file1');
            expect(file.read).toHaveBeenCalledWith('file2');
            expect(file.read.callCount).toBe(2);

            expect(file.write).toHaveBeenCalledWith('file1', 'redacted1');
            expect(file.write).toHaveBeenCalledWith('file2', 'redacted2');
            expect(file.write.callCount).toBe(2);
        });

        it('should redact HTML files', function () {
            spyOn(toggles, '_readRedactWrite');
            spyOn(toggles, '_listFiles');

            toggles._listFiles.andReturn(['html']);
            toggles._removeUnwantedFeaturesFrom().html();

            expect(toggles._readRedactWrite).toHaveBeenCalledWith(['html'], toggles.redact.redactHtml);
        });

        it('should redact javascript files', function () {
            spyOn(toggles, '_readRedactWrite');
            spyOn(toggles, '_listFiles');

            toggles._listFiles.andReturn(['js']);
            toggles._removeUnwantedFeaturesFrom().javascript();

            expect(toggles._readRedactWrite).toHaveBeenCalledWith(['js'], toggles.redact.redactJavascript);
        });
    });
});