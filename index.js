var _ = require("underscore");
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

  var main = function (api, packageName) {
    contexts = [];
    var relativePathToPackage = "packages" + Path.sep + packageName;

    if(!process.cwd().endsWith(relativePathToPackage)) {
      try {
        process.chdir(relativePathToPackage);
      }
      catch(error) {
        throw new Error("Could not find " + relativePathToPackage);
        return;
      }
    }

    loadFolder(process.cwd(), false, false, false, true);

    contexts.forEach(function (context) {
      api.addFiles(context.absolute, context.architecture);
    });
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
    if(client && server) {
      throw new Error("There is either a server folder within a client folder" +
        " or vice versa at " + folder);
    }

    var filenames=[];
    var folderContent = Fs.readdirSync(folder);

    // Load lib folder first
    _.each(folderContent, function(filename) {
        if(filename !== "lib") {
          return;
        }

        var absoluteFilename = folder + Path.sep + filename;
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
    _.each(folderContent, function(filename) {
        var absoluteFilename = folder + Path.sep + filename;
        var stats = Fs.statSync(absoluteFilename);

        if(stats.isDirectory() && filename !== "lib" && !fileName.startsWith(".")) {
          var isClient = !server && (client || filename === "client");
          var isServer = !client && (server || filename === "server");
          var isLib = lib;

          loadFolder(absoluteFilename, isLib, isClient, isServer);
        }
    });

    // Load non main files
    _.each(folderContent, function(filename) {
        if(filename.startsWith("main")) {
          return;
        }

        var absoluteFilename = folder + Path.sep + filename;
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
    _.each(folderContent, function(filename) {
        if(!filename.startsWith("main")) {
          return;
        }

        var absoluteFilename = folder + Path.sep + filename;
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
    var architecture = undefined;

    if(client) {
      architecture = "client";
    }
    else if(server) {
      architecture = "server";
    }

    contexts.push({
      absolute: absolute,
      architecture: architecture
    });
  };

  return main;
};

module.exports = {
  addAllFiles: addAllFilesApp()
};
