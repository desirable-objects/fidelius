var Hapi = require('hapi'),
    Joi = require('joi');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 2186 });

var requests = {};

server.route({
    method: 'POST',
    path: '/in/{key}/{code}',
    config: {
      description: 'Post to this endpoint to store the post request',
      validate: {
        params: {
          key: Joi.string().required().allow(Object.keys(requests)).description('API Key'),
          code: Joi.number().required().description('Desired return status code')
        }
      }
    },
    handler: function (request, reply) {

        var key = request.params.key,
            code = request.params.code;

        if (!requests.hasOwnProperty(key)) {
          requests[key] = [];
        }

        requests[key].push(request.payload);
        reply().code(code);
    }
});

server.route({
    method: 'GET',
    path: '/out/{key}',
    config: {
      description: 'Post to this endpoint to retrieve the posted request(s)',
      validate: {
        params: {
          key: Joi.string().required().allow(Object.keys(requests)).description('API Key')
        }
      }
    },
    handler: function (request, reply) {

        var key = request.params.key,
            stored = requests[key];

            requests[key] = [];

        reply(stored);
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

module.exports = server;
