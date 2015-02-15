var Fs = require("fs");
var Path = require("path");

if(typeof String.prototype.endsWith !== "function") {
  String.prototype.endsWith = function (str) {
    return this.slice(-str.length) === str;
  };
}

if(typeof String.prototype.startsWith !== "function") {
  String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) === str;
  };
}

var addAllFilesApp = function () {
  var exts = ["js", "css", "html"];
  var contexts = null;
  var packageRoot = null;

  var main = function (rootDir) {
    contexts = {
      client: [],
      server: [],
      both: []
    };

    packageRoot = Path.resolve(rootDir);

    if(!packageRoot.endsWith("/")) {
      packageRoot = packageRoot + "/";
    }

    loadFolder(packageRoot, false, false, false, true);
    return contexts;
  };

  var isValidFile = function (filename, isRoot) {
    var valid = false;

    if(isRoot && (filename.endsWith("package.js"))) {
      return valid;
    }

    exts.forEach(function (ext) {
      if(filename.endsWith("." + ext)) {
        valid = true;
      }
    });

    return valid;
  };

  var loadFolder = function (folder, lib, client, server, isRoot) {
    var filenames=[];
    var folderContent = Fs.readdirSync(folder);

    // Load lib folder first
    folderContent.forEach(function(filename) {
        if(filename !== "lib") {
          return;
        }

        var absoluteFilename = Path.resolve(folder, filename);
        var stats = Fs.statSync(absoluteFilename);

        if(!stats.isDirectory()) {
          return;
        }

        var isClient = client;
        var isServer = server;
        var isLib = true;

        loadFolder(absoluteFilename, isLib, isClient, isServer);
    });

    // Load non lib folders
    folderContent.forEach(function(filename) {
        var absoluteFilename = Path.resolve(folder, filename);
        var stats = Fs.statSync(absoluteFilename);

        if(stats.isDirectory() && filename !== "lib" && filename !== "tests" &&
          !filename.startsWith(".")) {
          var isClient = !server && (client || filename === "client");
          var isServer = !client && (server || filename === "server");
          var isLib = lib;

          loadFolder(absoluteFilename, isLib, isClient, isServer);
        }
    });

    // Load non main files
    folderContent.forEach(function(filename) {
        if(filename.startsWith("main")) {
          return;
        }

        var absoluteFilename = Path.resolve(folder, filename);
        var stats = Fs.statSync(absoluteFilename);

        if(!stats.isDirectory() && isValidFile(absoluteFilename, isRoot)) {
          var context = "clientAndServer";

          if(client) {
            context = "clientOnly";
          }
          else if(server) {
            context = "serverOnly";
          }

          addFile(absoluteFilename, client, server);
        }
    });

    // Load main files
    folderContent.forEach(function(filename) {
        if(!filename.startsWith("main")) {
          return;
        }

        var absoluteFilename = Path.resolve(folder, filename);
        var stats = Fs.statSync(absoluteFilename);

        if(!stats.isDirectory() && isValidFile(absoluteFilename, isRoot)) {
          var context = "clientAndServer";

          if(client) {
            context = "clientOnly";
          }
          else if(server) {
            context = "serverOnly";
          }

          addFile(absoluteFilename, client, server);
        }
    });
  };

  var addFile = function (absolute, client, server) {
    var architecture = "both";

    if(client) {
      architecture = "client";
    }
    else if(server) {
      architecture = "server";
    }

    contexts[architecture].push(absolute.replace(packageRoot, ""));
  };

  return main;
};

module.exports = {
  getAllFiles: addAllFilesApp()
};
