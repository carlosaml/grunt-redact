'use strict';

function PurgeTogglesTask(task) {
    this.originalTask = task;
 
    this.options = task.options();
//    no need for default options right now
//    this.options = task.options(PurgeTogglesTask.Defaults);
}
 
PurgeTogglesTask.prototype = {
    //TODO: remove grunt from here for testing purposes
    run: function(grunt) {

        grunt.log.writeln('Running');
 
        //TODO: path should come from options also for testing purposes
        var path = require('path'); 
    
        var options = this.options();
    
        var toggle_states = grunt.file.readJSON(path.resolve(options.manifest_file));
        grunt.log.writeln(JSON.stringify(toggle_states));

        var open_keyword = 'toggle';
        var close_keyword = 'endtoggle';
        var source_dir = 'src/main';
        var destination_dir = 'target/main';
        var target_dir = destination_dir;
    
        var allFiles = grunt.file.expand({cwd: source_dir, filter: "isFile"}, '**/*');
        allFiles.forEach(function(file) {
            grunt.file.copy(path.resolve(source_dir, file), path.resolve(destination_dir, file));
        });

        var purgeToggles = function(files, type) {
            var startblock;
            var endblock;

            if ( type === 'html' || typeof type === 'undefined' ) {
                startblock = '<!--\\s*'+open_keyword+':\\s*([^-]+)-->';
                endblock   = '<!--\\s*'+close_keyword+'\\s*-->';
            }
            else if ( type === 'js' || type === 'css' ) {
                startblock = '\/\/\\s*'+open_keyword+':\\s*?([^\\n]+)';
                endblock   = '\/\/\\s*'+close_keyword+'\\s*';
            }

            files.forEach(function(file) {
                var sourcefile = path.resolve(target_dir, file);
                var destfile = path.resolve(target_dir, file);
        
                var body = grunt.file.read(sourcefile);
        
                var regex = new RegExp(startblock + '[\\s\\S]*?' + endblock + '[\\s\\r\\n]?', 'g');
        
                var newbody = body.replace(regex, function($0, $1)
                {
                    var toggle_name = $1.replace(/^\s+|\s+$/g, ''); // trim
                    if (toggle_states[toggle_name]) {
                        return $0;
                    }
                    else {
                        return '';
                    }
                });
        
                //remove tags themselves
                var newerbody = body.replace(new RegExp('^.*'+startblock + '\\n?', 'gm'), '').replace(new RegExp(endblock   + '\\n?', 'gm'), '');
        
                if (body !== newerbody) {
                    grunt.log.writeln('Did stuff to ' + destfile);
                    grunt.file.write(destfile, newbody);
                }
        
            });
        };
    
        var htmlFiles = grunt.file.expand({cwd: target_dir, filter : "isFile"}, '**/*.html');
        var cssFiles = grunt.file.expand({cwd: target_dir, filter : "isFile"}, '**/*.css');
    
        purgeToggles(htmlFiles, 'html');
        purgeToggles(cssFiles, 'css');
    }
};
 
//PurgeTogglesTask.Defaults = {
//    source_path: 'tmp/src'
//};
 
PurgeTogglesTask.taskName = 'toggles';
PurgeTogglesTask.taskDescription = 'Does stuff related to toggles';
 
PurgeTogglesTask.registerWithGrunt = function(grunt) {
    grunt.registerMultiTask(PurgeTogglesTask.taskName, PurgeTogglesTask.taskDescription, function() {
        grunt.log.writeln('running');
        var task = new PurgeTogglesTask(this);
        task.run(grunt);
    });
};

module.exports = PurgeTogglesTask;
