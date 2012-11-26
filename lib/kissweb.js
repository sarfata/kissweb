var http = require('http');
var fs = require('fs');
var util = require('util');
var url = require('url');
var path = require('path');

var template = require('./template');
var markdown = require('./markdown');


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
	var contentType = "text/plain";

	if (path.extname(requestPath) == ".png") {
		contentType = "image/png";
	}
	else if (path.extname(requestPath) == ".css") {
		contentType = "text/css";
	}
	else if (path.extname(requestPath).toLowerCase() == ".jpg") {
		contentType = "image/jpeg";
	}
	else if (path.extname(requestPath).toLowerCase() == ".jpeg") {
		contentType = "image/jpeg";
	}
	else if (path.extname(requestPath).toLowerCase() == ".html") {
		contentType = "text/html";
	}
	else if (path.extname(requestPath).toLowerCase() == ".md") {
		contentType = "text/x-markdown"
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
		this.serveError(res, err);
	}
}

KissWeb.prototype.serveMarkdown = function(reqPath, res)
{
	try {
		// watch out for security problem here
		var t = new template(this.rootDirectory, this.rootDirectory + "/_template.html", new markdown(this.rootDirectory + "/" + reqPath));

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(t.execute());
	}
	catch (err) {
		this.serveError(res, err);
	}
}

KissWeb.prototype.serveStaticFile = function(reqPath, res, contentType)
{
	var k = this;
	fs.readFile(reqPath, function(err, data) {
		if (err) {
			k.serve404(res);
		}
		else {
			res.writeHead(200, {'Content-Type': contentType});
			res.end(data);
		}
	});
}

KissWeb.prototype.serveError = function(response, error)
{
	if (error.code == 'ENOENT') {
		this.serve404(response);
	}
	else {
		response.writeHead(500);
		response.end(util.inspect(error));
	}
}

KissWeb.prototype.serve404 = function(response)
{
	try {
		reqPath = path.join(this.rootDirectory, "/404.html");
		var t = new template(this.rootDirectory, reqPath);

		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end(t.execute());
	}
	catch (err) {
		// Do not call serveError here or we will get into an infinite loop...
		response.writeHead(500);
		response.end(util.inspect(err));
	}
}

KissWeb.prototype.serve = function(req, res) {
	var reqPath = this.requestPathToFile(req.url);

	var contentType = this.lookupMimeType(reqPath);

	console.log('Request: %s - File: %s - ContentType: %s', req.url, reqPath, contentType);

	if (contentType == "text/html")
		this.serveDynamicHtml(reqPath, res);
	else if (contentType == "text/x-markdown")
		this.serveMarkdown(reqPath, res);
	else
		this.serveStaticFile(reqPath, res, contentType);
};

