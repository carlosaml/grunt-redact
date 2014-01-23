var toggles = require('../../tasks/lib/toggles.js');

describe('toggles plugin', function () {
    var context;
    var grunt;

    beforeEach(function () {
        context = jasmine.createSpyObj('context', ['options']);
        grunt = {file: {exists: function () {
        }}};
    });

    describe('when the toggles file read', function () {
        var file;

        beforeEach(function () {
            file = jasmine.createSpyObj('file', ['exists', 'readJSON']);
        });

        it('should throw an error if the toggles.json file does not exist', function () {
            file.exists.andReturn(false);
            expect(function () {
                toggles._configFileExists(file);
            }).toThrow(new Error("Could not find the toggles.json file"));

            expect(file.exists).toHaveBeenCalledWith('toggles.json');
        });

        it('should return toggle config json', function () {
            var config = {my_feature: true};
            file.readJSON.andReturn(config);
            expect(toggles._config(file)).toBe(config);
            expect(file.readJSON).toHaveBeenCalledWith('toggles.json');
        });
    });

    describe('when redacted', function () {
        it('should redact html files', function () {
            toggles._redactHtmlFiles(['file1.html', 'file2.html'], {my_feature: true});
        });
    });
});