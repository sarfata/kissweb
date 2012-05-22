var should = require('should');
var template = require('../lib/template');
var fs = require('fs');
var path = require('path');

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
  })
});

function testRoot(subdirectory) {
  subdirectory = subdirectory || "";
  return path.dirname(__filename) + "/templates/" + subdirectory;  
}

function testFilePath(file) {
  return path.dirname(__filename) + "/templates/" + file;
}