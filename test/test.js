var should = require('should');
var supertest = require('supertest');

var server = supertest.agent('http://localhost:8080');

describe('File upload test cases',function(){
	it('should upload file',function(done){
		server
		.post('/files')
		.field('filename', 'test file')
		.attach('file', './test/linechatbot.jpg')
		.expect(200)
		.end(function(err,res){
			res.status.should.equal(200)
			done();
		});
	});
});