var toggles = require('../../tasks/lib/toggles.js');

describe('toggles plugin', function () {
    var grunt;

    beforeEach(function () {
        grunt = jasmine.createSpyObj('grunt', ['log']);
    });

    it('should toggle states from the manifest file', function () {
        toggles.run(grunt);
        expect(grunt.log).toHaveBeenCalledWith('log');
    });
});