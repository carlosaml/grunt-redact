# grunt-redact

[![Build Status](https://secure.travis-ci.org/carlosaml/grunt-redact.png?branch=master)](https://travis-ci.org/carlosaml/grunt-redact)

<img align="right" height="280" src="http://carlosaml.github.io/grunt-redact.png">

### What's this?

Pre-runtime feature toggle support for static applications where toggle-related code can't be delivered to the client.

### Why?

Do you need pre-runtime feature toggle support for your client-side JavaScript app? Then you've come to the right place.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-redact --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-redact');
```

## The "redact" task

### Overview
In your project's Gruntfile, add a section named `redact` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  redact: {
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
  redact: {
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
