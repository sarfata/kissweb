var http = require('http');
var fs = require('fs');
var util = require('util');
var url = require('url');
var path = require('path');

var template = require('./template');

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
  
  if (reqPath == "/") {
    reqPath = "/index.html";
  }
  
  reqPath = path.join(this.rootDirectory, path.normalize(reqPath))
  return reqPath;
};

KissWeb.prototype.lookupMimeType = function(requestPath) {
  var contentType = "text/html";
  
  if (path.extname(requestPath) == ".png") {
    contentType = "image/png";
  }
  if (path.extname(requestPath) == ".css") {
    contentType = "text/css";
  }
  if (path.extname(requestPath).toLowerCase() == ".jpg") {
    contentType = "image/jpeg";
  }
  if (path.extname(requestPath).toLowerCase() == ".jpeg") {
    contentType = "image/jpeg";
  }

  return contentType;
}

KissWeb.prototype.serveDynamicHtml = function(reqPath, res)
{
  try {
    var t = new template(this.rootDirectory, reqPath);
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(t.execute());
  }
  catch (err) {
    res.writeHead(500);
    res.end(util.inspect(err));
  }
}

KissWeb.prototype.serveStaticFile = function(reqPath, res, contentType)
{
  fs.readFile(reqPath, function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end(util.inspect(err));
    }
    else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
}

KissWeb.prototype.serve = function(req, res) {
  var reqPath = this.requestPathToFile(req.url);
  
  var contentType = this.lookupMimeType(reqPath);
  
  console.log('Request: %s - File: %s - ContentType: %s', req.url, reqPath, contentType);
  
  if (contentType == "text/html") 
    this.serveDynamicHtml(reqPath, res);
  else 
    this.serveStaticFile(reqPath, res, contentType);
};

