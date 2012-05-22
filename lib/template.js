var fs = require('fs');
var path = require('path');

function Template(rootDirectory, templatePath) {
  this.rootDirectory = rootDirectory;
  this.templatePath = templatePath;
  this.template = fs.readFileSync(this.templatePath, "UTF-8");
}

Template.prototype.execute = function() {
  var text = this.template;
  
  var match;
  while ((match = /<!include (.*?)\/>/.exec(text)) != null) {
    var t = new Template(this.rootDirectory, this.includePath(match[1]));
    text = text.replace(match[0], t.execute());
  }
  
  return text;
}

Template.prototype.includePath = function(includeFile) {
  if (includeFile.substr(0, 1) == "/")
    return this.rootDirectory + "/" + includeFile;
  else
    return path.dirname(this.templatePath) + "/" + includeFile;
}

exports = module.exports = Template;