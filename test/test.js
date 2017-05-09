var should = require('should');
var supertest = require('supertest');

var server = supertest.agent('http://localhost:8080');
// file upload test case
describe('File upload test cases',function(){
	it('should upload file',function(done){
		server
		.post('/files')
		.field('filename', 'test file')
		.attach('file', './test/linechatbot.jpg')
		.expect(200)
		.end(function(err,res){
			res.status.should.equal(200);
			console.log(res.body);
			done();
		});
	});
});
// 新增 test case post with targets IMEI with get JSON
describe('Test targets test cases', function(){
	it('should get resultJSON',function(done){
		server
		.post('/targets')
		.send({ "IMEI":"358108042295385"})
		.set('Accept','application/json')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err,res){
			res.status.should.equal(200);
			console.log(res.body);
			done();
		});
	});
});