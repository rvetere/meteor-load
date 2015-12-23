# meteor-load

A Meteor package builder"s helper to get all files within your package in a
Meteor-esque manner.

We use this package as part of a larger node-based build tool 
called Norma (https://github.com/NewSpring/Norma), specifically 
norma-meteor-load (https://github.com/NewSpring/norma-meteor-load). 
We would love for you to use Norma as it will address the problem 
of completing the package.js file for you.

Our attempts at integrating this module directly into Meteor's package.js 
file have been unsuccessfull so far. If you are able to integrate this 
node module directly within Meteor, we would love to hear about it!

## The problem being solved

Consider the following sample package. The package.js is the following:

```javascript
Package.describe({
  name: "coolguy22:some-package",
  version: "1.2.3",
  summary: "A summary here",
  git: "The git url goes here",
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.0.3.1");

  api.addFiles("lib/client/a.js", "client");
  api.addFiles("lib/client/z.js", "client");
  api.addFiles("lib/client/main.js", "client");

  api.addFiles("lib/server/a.js", "server");
  api.addFiles("lib/server/z.js", "server");
  api.addFiles("lib/server/main.js", "server");

  api.addFiles("lib/a.js");
  api.addFiles("lib/z.js");
  api.addFiles("lib/main.js");

  api.addFiles("client/a.js", "client");
  api.addFiles("client/z.js", "client");
  api.addFiles("client/main.js", "client");

  api.addFiles("server/a.js", "server");
  api.addFiles("server/z.js", "server");
  api.addFiles("server/main.js", "server");

  api.addFiles("a.js");
  api.addFiles("z.js");
  api.addFiles("main.js");
});
```

That is a lot of files that Meteor requires you list out!

## Usage

You can use this package outside the scope of meteor, 
in a simple node script, to generate a list of files that you can 
copy/paste into your package.js like so:

```javascript
var MeteorLoad = require("meteor-load");
var onUseFiles = MeteorLoad.getAllFiles("~/myMeteorProject/packages/myPackage");
var onTestFiles = MeteorLoad.getAllFiles("~/myMeteorProject/packages/myPackage/tests");

// You can paste these lists into your package.js
console.log(onUseFiles); 
console.log(onTestFiles);
```

onUseFiles returns something like the following:

```json
{ "client":
   [ "lib/client/a.js",
     "lib/client/x.js",
     "lib/client/main.js",
     "client/lib/a.js",
     "client/lib/x.js",
     "client/lib/main.js",
     "client/server/a.js",
     "client/server/css.css",
     "client/a.js",
     "client/x.js",
     "client/main.js" ],
  "server":
   [ "lib/server/a.js",
     "lib/server/x.js",
     "lib/server/main.js",
     "server/lib/a.js",
     "server/lib/x.js",
     "server/lib/main.js",
     "server/client/x.js",
     "server/a.js",
     "server/x.js",
     "server/main.js" ],
  "both":
   [ "lib/lib/a.js",
     "lib/lib/x.js",
     "lib/lib/main.js",
     "lib/a.js",
     "lib/x.js",
     "lib/main.js",
     "a/lib/a.js",
     "a/lib/x.js",
     "a/lib/main.js",
     "a/a.js",
     "a/x.js",
     "a/main.js",
     "b/lib/a.js",
     "b/lib/x.js",
     "b/lib/main.js",
     "b/a.js",
     "b/x.js",
     "b/main.js",
     "a.js",
     "x.js",
     "main.js" ] }
```

onTestFiles returns something like the following:

```json
{ "client": [],
  "server": [],
  "both": [
    "setup.js",
    "tests.js" ] }
```

## How it works

Meteor-esque! The JavaScript, HTML, and CSS files in your package are loaded
according to these rules:

### Directories

1. Everything within "lib" directories are loaded first

2. Everything within "server" directories are loaded only to the server

3. Everything within "client" directories are loaded only to the client

4. Everything within "tests" directories are ignored

5. The deepest directories are loaded first in depth-first-search fashion

### Files

1. Files that match *.html and *.css  are loaded before everything else

2. Files that match main.* are loaded after everything else

3. Files are loaded in alphabetical order
