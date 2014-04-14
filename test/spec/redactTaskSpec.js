var redactTask = require('../../tasks/lib/redactTask.js');

describe('grunt-redact plugin', function () {
  var context;
  var grunt;

  beforeEach(function () {
    context = jasmine.createSpyObj('context', ['options']);
    grunt = {file: {exists: function () {
    }}};
  });

  describe('when reading toggle states', function () {
    beforeEach(function () {
      redactTask.everythingOn = undefined;
      redactTask.toggleStates = undefined;
      redactTask.toggleStatesFileName = 'path/to/myBeautifulToggles.json';

      redactTask.file = jasmine.createSpyObj('file', ['exists', 'readJSON']);
    });

    it('should throw an error if the toggle states file does not exist and no toggles are defined in task the configuration', function () {
      redactTask.file.exists.andReturn(false);
      redactTask.toggleStates = undefined;

      expect(function () {
        redactTask._config().verify();
      }).toThrow(new Error("Could not find the toggle states file at path/to/myBeautifulToggles.json and no inline toggle states are defined"));

      expect(redactTask.file.exists).toHaveBeenCalledWith('path/to/myBeautifulToggles.json');
    });

    it('should not complain about the absence of the external file if inline toggles are defined', function () {
      redactTask.file.exists.andReturn(false);
      redactTask.toggleStates = { someToggle: false };

      expect(redactTask._config().verify()).toBeTruthy();
      expect(redactTask.file.exists).toHaveBeenCalledWith('path/to/myBeautifulToggles.json');
    });

    it('should return toggle config from external file in JSON format', function () {
      var config = {my_feature: true};
      redactTask.file.exists.andReturn(true);
      redactTask.file.readJSON.andReturn(config);
      expect(redactTask._config().read()).toBe(config);
      expect(redactTask.file.readJSON).toHaveBeenCalledWith('path/to/myBeautifulToggles.json');
    });

    it('should return toggle config from inline definitions in JSON format', function () {
      redactTask.toggleStates = { blablabla: true };
      redactTask.file.exists.andReturn(false);
      expect(redactTask._config().read()).toEqual({ blablabla: true });
      expect(redactTask.file.readJSON).not.toHaveBeenCalled();
    });

    it('should override states specified in file if they are also defined inline', function () {
      redactTask.file.exists.andReturn(true);
      redactTask.file.readJSON.andReturn({ blablabla: true });
      redactTask.toggleStates = {blablabla: false};

      expect(redactTask._config().read()).toEqual({ blablabla: false });
    });

    it('should set all toggles to true if everythingOn is set', function() {
      redactTask.everythingOn = true;
      redactTask.toggleStates = { someToggle: false };
      redactTask.file.exists.andReturn(true);
      redactTask.file.readJSON.andReturn({ blablabla: false });

      expect(redactTask._config().read()).toEqual({ blablabla: true, someToggle: true });
    });
  });

  describe('when files are to be listed', function () {
    it('should list files in a working directory', function () {
      redactTask.file = jasmine.createSpyObj('file', ['expandMapping']);
      redactTask.workingDirectory = "dir";

      var expected = [ 'files'];
      redactTask.file.expandMapping.andReturn(expected);

      var files = redactTask._listFiles("pattern");

      expect(files).toBe(expected);
      expect(redactTask.file.expandMapping).toHaveBeenCalledWith('pattern', 'dir', {cwd: 'dir', filter: 'isFile'});
    });
  });

  describe('when files are to be redacted', function () {
    var convert;
    var file;
    var filesToBeConverted;

    beforeEach(function () {
      file = redactTask.file = jasmine.createSpyObj('file', ['read', 'write']);
      convert = jasmine.createSpy('convert');
      redactTask.redact = jasmine.createSpyObj('redact', ['redactHtml', 'redactJavascript']);

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
      redactTask._readRedactWrite(filesToBeConverted, convert);

      expect(file.read).toHaveBeenCalledWith('file1');
      expect(file.read).toHaveBeenCalledWith('file2');
      expect(file.read.callCount).toBe(2);

      expect(file.write).toHaveBeenCalledWith('file1', 'redacted1');
      expect(file.write).toHaveBeenCalledWith('file2', 'redacted2');
      expect(file.write.callCount).toBe(2);
    });

    it('should redact HTML files', function () {
      spyOn(redactTask, '_readRedactWrite');
      spyOn(redactTask, '_listFiles');

      redactTask._listFiles.andReturn(['html']);
      redactTask._removeUnwantedFeaturesFrom().html();

      expect(redactTask._readRedactWrite).toHaveBeenCalledWith(['html'], redactTask.redact.redactHtml);
    });

    it('should redact javascript files', function () {
      spyOn(redactTask, '_readRedactWrite');
      spyOn(redactTask, '_listFiles');

      redactTask._listFiles.andReturn(['js']);
      redactTask._removeUnwantedFeaturesFrom().javascript();

      expect(redactTask._readRedactWrite).toHaveBeenCalledWith(['js'], redactTask.redact.redactJavascript);
    });
  });
});