# meteor-pkg-get-all-files

A Meteor package builder"s helper to get all files within your package in a
Meteor-esque manner

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

Use this module as follows:

```javascript
var MeteorGetAll = require("meteor-pkg-get-all-files");

var onUseFiles = MeteorGetAll.getAllFiles("~/myMeteorProject/packages/myPackage");
var onTestFiles = MeteorGetAll.getAllFiles("~/myMeteorProject/packages/myPackage/tests");

// And then in your Meteor package's package.js:
api.addFiles(onUseFiles.both);
api.addFiles(onUseFiles.client, "client");
api.addFiles(onUseFiles.server, "server");
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

1. Files within a "lib" directory are loaded first

2. Files within a "server" directory are loaded only to the server

3. Files within a "client" directory are loaded only to the client

4. Files that match main.* are loaded after everything else

5. Files are loaded in alphabetical order

6. The deepest directories are loaded first in depth-first-search fashion

7. Folders named "tests" are ignored
