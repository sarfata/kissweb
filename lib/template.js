var fs = require('fs');
var path = require('path');
var Markdown = require('./markdown');

/*
 * rootDirectory: 
 *   Defines where absolute paths will begin.
 * templatePath:
 *   File to process
 * content:
 *   Template-like object to generate content if the <!content/> tag is found
 *
 */
function Template(rootDirectory, templatePath, content) {
  this.rootDirectory = rootDirectory;
  this.templatePath = templatePath;
  this.content = content;
  
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
      if (this.content) 
        replace = this.content.execute();
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