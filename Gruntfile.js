/*
 * grunt-toggles
 * https://github.com/carlosaml/grunt-toggles
 *
 * Copyright (c) 2014 Carlos Lopes
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        jshint: {
            all: [
                'Gruntfile.js',
                'lib/**/*.js',
                'tasks/**/*.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        watch: {
            nodeunit: {
                files: ['lib/**/*.js', 'tasks/**/*.js', 'test/**/*.js'],
                tasks: ['test'],
                options: {
                    livereload: true
                }
            }
        },

        jasmine_node: {
            projectRoot: "./test/spec",
            forceExit: true
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('test', ['clean', 'jshint', 'jasmine_node']);

    grunt.registerTask('default', ['test']);

};
