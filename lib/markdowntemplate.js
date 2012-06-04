var fs = require('fs');
var path = require('path');
var marked = require('marked');

function MarkdownTemplate(filePath) {
  this.template = fs.readFileSync(filePath, "UTF-8");
}

MarkdownTemplate.prototype.execute = function() {
  return marked(this.template);
}

exports = module.exports = MarkdownTemplate;