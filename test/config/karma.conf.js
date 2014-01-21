module.exports = function (config) {
    "use strict";
    config.set({
        basePath: '../',

        files: [
          //  'main/assets/scripts/js/lib/angular/angular.js',
          //  'main/assets/scripts/js/lib/angular/angular-*.js',
          //  'test/lib/angular/angular-mocks.js',
          //  'main/assets/scripts/js/**/*.js',
            '*_test.js'
        ],

     //   exclude: [
     //       'main/assets/scripts/js/lib/angular/angular-loader.js',
     //       'main/assets/scripts/js/lib/angular/*.min.js',
     //       'main/assets/scripts/js/lib/angular/angular-scenario.js'
     //   ],

        //reporters: ['progress', 'coverage'],
        reporters: ['progress'],

  //      preprocessors  : {
  //        'main/assets/scripts/js/*.js': 'coverage'
  //      },

  //      coverageReporter : {
  //        reporters : [{type: 'clover'}, {type: 'html'}],
  //        dir : 'test/unit/coverage/'
  //      },

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine'
 //           'karma-coverage'
        ]

    });
};

