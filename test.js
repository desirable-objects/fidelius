var Code = require('code'),
    expect = Code.expect,
    app = require('./app');

describe('Swallows', function() {

    var payload = {
      a: 'b'
    };

    it('Receives a post and then gives it back', function (done) {

      var options = {
        method: 'POST',
        url: '/in/abcde12345/200',
        payload: payload
      };

      app.inject(options, function(res) {
        expect(res.statusCode).to.equal(200);
        done();
      });

    });

    it('Gives the stored data back', function(done) {

      var options = {
        method: 'GET',
        url: '/out/abcde12345',
      };

      app.inject(options, function(res) {
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.deep.equal([payload]);
        done();
      });

    });

    it('Has deleted the stored data', function(done) {

      var options = {
        method: 'GET',
        url: '/out/abcde12345',
      };

      app.inject(options, function(res) {
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.have.length(0);
        done();
      });

    });

});
