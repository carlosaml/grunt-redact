var toggles = require('../../tasks/lib/toggles.js');

describe('toggles plugin', function () {
    describe('when the toggles file does not exist', function () {
        var file;

        beforeEach(function () {
            file = jasmine.createSpyObj('file', ['exists']);
        });

        it('should throw an error if the toggles.json file does not exist', function () {
            file.exists.andReturn(false);
            expect(function () {
                toggles._configFileExists(file);
            }).toThrow(new Error("Could not find a toggles.json file"));

            expect(file.exists).toHaveBeenCalledWith('toggles.json');

        });
    });
});