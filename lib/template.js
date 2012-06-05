var fs = require('fs');
var path = require('path');
var Markdown = require('./markdown');

function Template(rootDirectory, templatePath, contentMarkdown) {
  this.rootDirectory = rootDirectory;
  this.templatePath = templatePath;
  this.contentMarkdown = contentMarkdown;
  this.template = fs.readFileSync(this.templatePath, "UTF-8");
}

Template.prototype.execute = function() {
  var text = this.template;
  
  var match;
  while ((match = /<!([a-z]+)\s*(.*?)\/>/.exec(text)) != null) {
    var replace = "";
    if (match[1] == "include") {
      if (match[2].substr(-3) == ".md") {
        replace = new Markdown(this.includePath(match[2])).execute();
      }
      else {
        replace = new Template(this.rootDirectory, this.includePath(match[2])).execute();
      }
    }
    else if (match[1] == "excerpt") {
      replace = new Markdown(this.includePath(match[2]), true).execute();
    }
    else if (match[1] == "content") {
      replace = new Markdown(this.contentMarkdown).execute();
    }
    else {
      console.error("Unable to find a matching processor for command: " + match[1] + " (" + match[0] + ")");
    }
    text = text.replace(match[0], replace);
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