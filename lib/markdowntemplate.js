var fs = require('fs');
var path = require('path');
var marked = require('marked');

function MarkdownTemplate(filePath, excerpt) {
  this.template = fs.readFileSync(filePath, "UTF-8");
  
  if (excerpt == true) {
    var index = this.template.indexOf('<!readmore/>');
    
    this.template = this.template.substring(0, index);
  }
  else {
    this.template = this.template.replace(/<!readmore\/>[\s]*/, '');
  }
}

MarkdownTemplate.prototype.execute = function() {
  return marked(this.template);
}

exports = module.exports = MarkdownTemplate;