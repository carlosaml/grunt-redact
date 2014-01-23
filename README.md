# grunt-toggles [![Build Status](https://travis-ci.org/carlosaml/grunt-toggles.png?branch=master)](https://travis-ci.org/carlosaml/grunt-toggles)

> Pre-packaging feature toggle support for client-side JavaScript applications.

> Do you need feature toggle support for your client-side JavaScript app? You've come to the right place.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-toggles --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-toggles');
```

## The "toggles" task

### Overview
In your project's Gruntfile, add a section named `toggles` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  toggles: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.src
Type: `String`
Default value: `src/`

The path where the source code is located.

### Usage Examples

```js
grunt.initConfig({
  toggles: {
    options: {
      something: "yes please"
    },
    some_target: {
      options: {
        something: "no way"
      }
    }
  },
});
```

## Release History
_(Nothing yet)_
