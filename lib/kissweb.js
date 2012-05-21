var http = require('http');
var fs = require('fs');
var util = require('util');
var url = require('url');
var path = require('path');

function KissWeb(port, rootDirectory) {
  this.port = port;
  this.rootDirectory = rootDirectory;
};

exports = module.exports = KissWeb;

KissWeb.prototype.work = function() {
  var k = this;
  http.createServer(function(req, res) {
    k.serve(req, res);
  }).listen(this.port);
};

KissWeb.prototype.requestPathToFile = function(requestUrl) {
  var reqPath = url.parse(requestUrl).path;
  console.log("Requested path: %s", reqPath);
  
  if (reqPath == "/") {
    reqPath = "/index.html";
  }
  
  reqPath = path.join(this.rootDirectory, path.normalize(reqPath))
  return reqPath;
};

KissWeb.prototype.lookupMimeType = function(requestPath) {
  var contentType = "html";
  
  if (path.extname(requestPath) == ".png") {
    contentType = "image/png";
  }
  if (path.extname(requestPath) == ".css") {
    contentType = "text/css";
  }

  return contentType;
}

KissWeb.prototype.serve = function(req, res) {
  console.time('request');
  
  var reqPath = this.requestPathToFile(req.url);
  
  var contentType = this.lookupMimeType(reqPath);
  
  console.log('Request: %s - File: %s - ContentType: %s', req.url, reqPath, contentType);
  fs.readFile(reqPath, function(err, data) {
    if (err) {
      res.writeHead(500);
      res.end(util.inspect(err));
    }
    else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }

  });
  console.timeEnd('request');
};

