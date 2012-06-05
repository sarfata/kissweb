var fs = require('fs');
var path = require('path');
var marked = require('marked');

/* 
 * This is a wrapper to the markdown libary we use. It allows use to add some more 
 * markdown features:
 *
 * - If excerpt == true, then only the content of markdown, up to <!readmore/> will be returned.
 * 
 */
function Markdown(filePath, excerpt) {
  this.markdown = fs.readFileSync(filePath, "UTF-8");
  
  // If we are in excerpt mode
  if (excerpt == true) {
    var index = this.markdown.indexOf('<!readmore/>');

    // and if there is a <!readmore/> tag, 
    if (index >= 0) {
      // then remove the tag and everything that follows.
      this.markdown = this.markdown.substring(0, index);
    }
  }
  // Otherwise, just make sure, there is no tag in the content.
  else {
    this.markdown = this.markdown.replace(/<!readmore\/>[\s]*/, '');
  }
}

Markdown.prototype.execute = function() {
  return marked(this.markdown);
}

exports = module.exports = Markdown;