'use strict';

var path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('purge', 'Remove code that is toggled off.', function() {

    grunt.log.writeln('Looking for files');

    var files = grunt.file.expand({cwd: 'src', filter : "isFile"}, '**/*.css');

    files.forEach(function(file) {
      var sourcefile = path.resolve('src', file);
      var destfile = path.resolve('target', file);

      var body = grunt.file.read(sourcefile);

      var regex = new RegExp('\/\/\\s*toggle_start:\\s*?([^\\n]+)[\\s\\S]*?\/\/\\s*toggle_end\\s*[\\s\\r\\n]?', 'g');

      var newbody = body.replace(regex, function($0, $1)
      {
          //TODO: check here if specific toggle is on or off -- if code should stay, just return $0 
          return '';
          
          //var m = $1.replace(/^\s+|\s+$/g, ''); // trim
          //if ( m.indexOf('!') == -1 )
          //{
          //    if ( context.NODE_ENV != m ) return ''; else return $0;
          //}
          //else
          //{
          //    if (  '!'+context.NODE_ENV == m ) return ''; else return $0;
          //}

      });

      var newerbody = newbody.replace(new RegExp('^.*\/\/\\s*toggle_start:\\s*?([^\\n]+)\\n?', 'gm'), '').replace(new RegExp('\/\/\\s*toggle_end\\s*\\n?', 'gm'), '');

      if (body !== newerbody) {
          grunt.log.writeln('Writing file to ' + destfile);
          grunt.file.write(destfile, newbody);
      }
    });
  });

};
