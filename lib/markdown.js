var fs = require('fs');
var path = require('path');
var marked = require('marked');

function Markdown(filePath, excerpt) {
  this.markdown = fs.readFileSync(filePath, "UTF-8");
  
  if (excerpt == true) {
    var index = this.markdown.indexOf('<!readmore/>');

    if (index >= 0) {
      this.markdown = this.markdown.substring(0, index);
    }
  }
  else {
    this.markdown = this.markdown.replace(/<!readmore\/>[\s]*/, '');
  }
}

Markdown.prototype.execute = function() {
  return marked(this.markdown);
}

exports = module.exports = Markdown;