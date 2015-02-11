# meteor-pkg-get-all-files

A Meteor package builder's helper to add all files within your package in a
Meteor-esque manner

## Example usage

Consider the following sample package. The package.js is the following:

````javascript
Package.describe({
  name: "coolguy22:some-package",
  version: '1.2.3',
  summary: 'A summary here',
  git: 'The git url goes here',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');

  api.addFiles('lib/client/a.js', 'client');
  api.addFiles('lib/client/z.js', 'client');
  api.addFiles('lib/client/main.js', 'client');

  api.addFiles('lib/server/a.js', 'server');
  api.addFiles('lib/server/z.js', 'server');
  api.addFiles('lib/server/main.js', 'server');

  api.addFiles('lib/a.js');
  api.addFiles('lib/z.js');
  api.addFiles('lib/main.js');

  api.addFiles('client/a.js', 'client');
  api.addFiles('client/z.js', 'client');
  api.addFiles('client/main.js', 'client');

  api.addFiles('server/a.js', 'server');
  api.addFiles('server/z.js', 'server');
  api.addFiles('server/main.js', 'server');

  api.addFiles('a.js');
  api.addFiles('z.js');
  api.addFiles('main.js');
});
````

Using this package as a helper, the package.js file can become this:

````javascript
var packageName = "coolguy22:some-package";

Package.describe({
  name: packageName,
  version: '1.2.3',
  summary: 'A summary here',
  git: 'The git url goes here',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('bjwiley2:add-all-files@0.0.1');
  addAllFiles(api, packageName);
});
````

## How it works

Meteor-esque! The JavaScript, HTML, and CSS files in your package are loaded
according to these rules:

1. Files within a "lib" directory are loaded first

2. Files within a "server" directory are loaded only to the server

3. Files within a "client" directory are loaded only to the client

4. Files that match main.* are loaded after everything else

5. Files are loaded in alphabetical order

6. The deepest directories are loaded first in depth-first-search fashion

## Todo

1. Provide different ways to handle Package.onTest and Package.onUse
