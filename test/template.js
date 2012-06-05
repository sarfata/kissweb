var should = require('should');
var fs = require('fs');
var path = require('path');

var template = require('../lib/template');
var markdown = require('../lib/markdown');


describe('template', function() {
  it('should throw an error when given an unexisting template', function() {
    var e = null;
    try {
      var t = new template(testRoot(), "/tmp/this file does not exist");
    }
    catch (err) {
      e = err;
    }
    should.exist(e);
  });
  
  // TODO: Refactor those tests with a big loop and just execute the same function for each file.
  
  it('should return an empty string if the file is empty', function() {
    var file = testFilePath("empty.txt");
    var t = new template(testRoot(), file);    
    t.execute().should.eql("");
  });
  
  it('should return the full text of the template file when the template has no special marker', function() {
    var file = testFilePath("simple.txt");
    var t = new template(testRoot(), file);
    
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(file, "UTF-8"));
  });
  
  it('should replace include marker with the content of the file', function() {
    var file = testFilePath("test-include.txt");
    var t = new template(testRoot(), file);
    
    var text = t.execute();
    
    text.should.eql("BEFORE " + fs.readFileSync(testFilePath("simple.txt"), "UTF-8") + " AFTER");
  });
  
  it('should do includes recursively', function() {
    var file = testFilePath("test-include-rec.txt");
    var t = new template(testRoot(), file);
    var text = t.execute();
    
    text.should.eql("REC-BEFORE " + fs.readFileSync(testFilePath("simple.txt"), "UTF-8") + " AFTER-REC");
  });
  
  it('should include from the root directory if include path begins with a /', function() {
    var file = testFilePath("subfolder/test-include-absolute.txt");
    var t = new template(testRoot(), file);
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("simple.txt"), "UTF-8"));
  });
  
  it('should call the markdown converter ', function() {
    var file = testFilePath("test-include-md.html");
    var t = new template(testRoot(), file);
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("test-include-md.html.output"), "UTF-8"));
  });
  
  it('should only include up to the excerpt marker if called with excerpt', function() {
    var file = testFilePath("test-include-md-excerpt.html");
    var t = new template(testRoot(), file);
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("test-include-md-excerpt.html.output"), "UTF-8"));
  });

  it('should show full content if called without excerpt', function() {
    var file = testFilePath("test-include-md-notexcerpt.html");
    var t = new template(testRoot(), file);
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("test-include-md-notexcerpt.html.output"), "UTF-8"));
  });

  it('should replace the <!content/> tag with "" if no content template was specified', function() {
    var t = new template(testRoot(), testFilePath("content.html"));
    
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("content.html.output"), "UTF-8"));
  });
  
  it('should include the markdown in the template when it meets a <!content/> tag', function() {
    var content = new markdown(testFilePath("article.md"));
    var t = new template(testRoot(), testFilePath("content.html"), content);
    
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("content.html.output+article"), "UTF-8"));
  });
  
});

function testRoot(subdirectory) {
  subdirectory = subdirectory || "";
  return path.dirname(__filename) + "/templates/" + subdirectory;  
}

function testFilePath(file) {
  return path.dirname(__filename) + "/templates/" + file;
}