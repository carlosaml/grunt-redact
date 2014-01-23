'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        watch: {
            jasmine: {
                files: ['tasks/**/*.js', 'test/**/*.js'],
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

    grunt.registerTask('test', ['jshint', 'jasmine_node']);

    grunt.registerTask('default', ['test']);

};
