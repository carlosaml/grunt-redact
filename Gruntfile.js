/*
 * grunt-toggles
 * https://github.com/carlosaml/grunt-toggles
 *
 * Copyright (c) 2014 Carlos Lopes
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    karma: {
        unit: {
            configFile: 'test/config/karma.conf.js',
            singleRun: true
        }
    },

    // Configuration to be run (and then tested).
    toggles: {
        options: { }
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jshint', 'toggles', 'karma:unit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
