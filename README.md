# grunt-redact

[![Build Status](https://secure.travis-ci.org/carlosaml/grunt-redact.png?branch=master)](https://travis-ci.org/carlosaml/grunt-redact) [![Dependency Status](https://david-dm.org/carlosaml/grunt-redact.png)](https://david-dm.org/carlosaml/grunt-redact)

<img align="right" height="280" src="http://carlosaml.github.io/grunt-redact-1.png">

### What's this?
Pre-runtime feature toggle support for static applications where toggle-related code can't be delivered to the client.

Do you need pre-runtime feature toggle support for your client-side JavaScript app? Then you've come to the right place.

### Why?
In most scenarios client-side feature toggling is enough and you can get away with simple toggling mechanisms in your client-side app. However, in scenarios where clients simply cannot have any access to half-baked or hidden features, you need something that will remove all traces that there was ever any feature toggle in your codebase.

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

The task will redact JavaScript (\*\*/\*.js) and HTML (\*\*/\*.html) files inside the directory specified on `workingDirectory`.

#### HTML files

```html
<span feature="facebookLogin">Facebook login goes here</span>
<span not-feature="facebookLogin">Sorry, we do not support Facebook login yet</span>
```

#### JavaScript files

```js
if (feature.facebookLogin) {
  console.log('WE HAZ FACEBOOK LOGIN');
}
```

### Options

#### workingDirectory

Type: `String`

Location of files to be redacted. For example, it can be the path where you run your application when using `grunt server`.

**Note:** this should **_not_** be your source code folder, since files are edited in place—it should be a target folder from where you run your app, where file contents are disposable (and most likely ignored by your source control tool.) 

#### toggleStatesFile

Type: `String`

Location of the JSON file that contains your feature toggles and their respective states.

The file should contain a simple JavaScript object with the feature names and their respective states. For example:

```js
{
  "googleLogin": true,
  "facebookLogin": false
}
```

### Usage Examples

On your Gruntfile.js:

```js
grunt.initConfig({
  redact: {
    options: {
      workingDirectory: "target/"
    },
    jasmine: {
      options: {
        toggleStatesFile: "spec/toggleStatesForSpecs.json",
        workingDirectory: "target/jasmine/"
      }
    },
    watch: {
      options: {
        toggleStatesFile: "target/devToggleStates.json"
      }
    }
  },
});
```
