'use strict';

function PurgeTogglesTask(task) {
    this.originalTask = task;
 
//    this.options = task.options(PurgeTogglesTask.Defaults);
}
 
PurgeTogglesTask.prototype = {
    //TODO: remove grunt from here for testing purposes
    run: function(grunt) {
 
        grunt.log.writeln('Looking for files');

        //TODO: path should come from options also for testing purposes
        var path = require('path'); 
    
        var options = this.options();
    
        var toggle_states = grunt.file.readJSON(path.resolve(options.manifest_file));
        grunt.log.writeln(JSON.stringify(toggle_states));
    
        var allFiles = grunt.file.expand({cwd: 'src/main', filter: "isFile"}, '**/*');
        allFiles.forEach(function(file) {
          grunt.file.copy(path.resolve('src/main', file), path.resolve('target/main', file));
        });
    
        var htmlFiles = grunt.file.expand({cwd: 'target/main', filter : "isFile"}, '**/*.html');
    
        htmlFiles.forEach(function(file) {
          var sourcefile = path.resolve('target/main', file);
          var destfile = path.resolve('target/main', file);
    
          var body = grunt.file.read(sourcefile);
    
          var regex = new RegExp('\/\/\\s*toggle_start:\\s*?([^\\n]+)[\\s\\S]*?\/\/\\s*toggle_end\\s*[\\s\\r\\n]?', 'g');
    
          var newbody = body.replace(regex, function($0, $1)
          {
              //TODO: check here if specific toggle is on or off -- if code should stay, just return $0 
              //return '';
              
              var m = $1.replace(/^\s+|\s+$/g, ''); // trim
              if (toggle_states[m]) {
                return $0;
              }
              else {
                return '';
              }
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
            grunt.log.writeln('Did stuff to ' + destfile);
            grunt.file.write(destfile, newbody);
          }
    
        });
    }
};
 
//PurgeTogglesTask.Defaults = {
//    source_path: 'tmp/src'
//};
 
PurgeTogglesTask.taskName = 'toggles';
PurgeTogglesTask.taskDescription = 'Does stuff related to toggles';
 
PurgeTogglesTask.registerWithGrunt = function(grunt) {
    grunt.registerMultiTask(PurgeTogglesTask.taskName, PurgeTogglesTask.taskDescription, function() {
        var task = new PurgeTogglesTask(this);
        task.run(grunt);
    });
};

module.exports = PurgeTogglesTask;
