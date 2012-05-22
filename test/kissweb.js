var should = require('should');
var kissweb = require('../lib/kissweb');

var TEST_PORT = 47536;

describe('kissweb', function() {
  describe('Test initialization', function() {
    var web;
    
    before(function() {
      web = new kissweb(TEST_PORT, "/tmp");
    });
    
    it('should return something', function() {
      should.exist(web);
      web.should.be.a('object');
    });
    
    it('should have initialized port', function() {
      web.should.have.property('port').and.eql(TEST_PORT);
    });
    
    it('should have initialized rootDirectory', function() {
      web.should.have.property('rootDirectory').and.eql('/tmp');
    });
  });
  
  describe('Running the webserver loop', function() {
    it('should not return', function() {
      new kissweb(TEST_PORT, "/tmp").work();
    })
  });
  
  describe('lookupMimetype', function() {
    var web;
    
    before(function() {
      web = new kissweb(TEST_PORT, "/tmp");
    });
    
    it('should send text/css mimetype for css files', function() {
      web.lookupMimeType('/stylesheets/main.css').should.eql('text/css');
    });
    
    it('should have mimetype html for html files', function() {
      web.lookupMimeType('/index.html').should.eql('text/html');
    });
    
    it('should have mimetype image/jpeg for jpg files', function() {
      web.lookupMimeType('/thomas.jpg').should.eql('image/jpeg');
      web.lookupMimeType('/thomas.jpeg').should.eql('image/jpeg');
      web.lookupMimeType('/thomas.JPG').should.eql('image/jpeg');
      web.lookupMimeType('/thomas.JPEG').should.eql('image/jpeg');      
    })
    
  });
});