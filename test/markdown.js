var should = require('should');
var md = require('../lib/markdown');
var fs = require('fs');
var path = require('path');

describe('markdowntemplate', function() {
  it('should throw an error when given an unexisting template', function() {
    var e = null;
    try {
      var t = new md("/tmp/this file does not exist");
    }
    catch (err) {
      e = err;
    }
    should.exist(e);
  });
  
  it('should return an empty string if the file is empty', function() {
    var file = testFilePath("empty.md");
    var t = new md(file);    
    t.execute().should.eql("");
  });
  
  it('should add some <p> when the template has no special marker', function() {
    var file = testFilePath("simple.md");
    var t = new md(file);
    
    var text = t.execute();
    
    text.should.eql("<p>" + fs.readFileSync(file, "UTF-8") + "</p>\n");
  });
  
  it('should perform markdown conversion', function() {
    var t = new md(testFilePath("test-markdown.md"));
    
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("test-markdown.md.output"), "UTF-8"));
  });
  
  it('should stop before the marker if called with a second true argument', function() {
    var t = new md(testFilePath('test-excerpt.md'), true);
    
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("test-excerpt.md.excerpt-output"), "UTF-8"));
  });
  
  it('should not include the excerpt marker if called without a second true argument', function() {
    var t = new md(testFilePath('test-excerpt.md'));
    
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("test-excerpt.md.output"), "UTF-8"));
  });
  
  it('the excerpt should be the full content if the excerpt tag is not found', function() {
    var t = new md(testFilePath('test-markdown.md'), true);
    
    var text = t.execute();
    
    text.should.eql(fs.readFileSync(testFilePath("test-markdown.md.output"), "UTF-8"));
  });
});

function testFilePath(file) {
  return path.dirname(__filename) + "/markdown/" + file;
}