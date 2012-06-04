var should = require('should');
var mdt = require('../lib/markdowntemplate');
var fs = require('fs');
var path = require('path');

describe('template', function() {
  it('should throw an error when given an unexisting template', function() {
    var e = null;
    try {
      var t = new mdt("/tmp/this file does not exist");
    }
    catch (err) {
      e = err;
    }
    should.exist(e);
  });
  
  it('should return an empty string if the file is empty', function() {
    var file = testFilePath("empty.txt");
    var t = new mdt(file);    
    t.execute().should.eql("");
  });
  
  it('should add some <p> when the template has no special marker', function() {
    var file = testFilePath("simple.txt");
    var t = new mdt(file);
    
    var text = t.execute();
    
    text.should.eql("<p>" + fs.readFileSync(file, "UTF-8") + "</p>\n");
  });
  
  it('should perform markdown conversion', function() {
    var t = new mdt(testFilePath("test1.md"));
    
    var text = t.execute();
    
    fs.writeFileSync("/tmp/test1.html", text, "UTF-8");
    
    text.should.eql(fs.readFileSync(testFilePath("test1.html"), "UTF-8"));
  });
  
});

function testFilePath(file) {
  return path.dirname(__filename) + "/templates/" + file;
}