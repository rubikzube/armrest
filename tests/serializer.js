var server = require('./setup/server');
var armrest = require('../lib');
var enserializeCounter;
var deserializeCounter;

exports.simpleSerializer = function(test) {
	var config = {
		host: 'localhost:59903',
		logLevel: 'OFF',
		serializer: {
			contentType: 'application/json',
			serialize: function(content) {
				enserializeCounter += 1;
				return JSON.stringify(content);
			},
			deserialize: function(content) {
				deserializeCounter += 1;
				return JSON.parse(content);
			}
		}
	};
	var client = armrest.client(config);
	client.get({
		url: '/json',
		complete: function(err, response) {
			test.equals(enserializeCounter, 0, 'serialized');
			test.equals(deserializeCounter, 1, 'deserialized');
			test.ok(response);
			test.done();
		}
	});
};

exports.setUp = function(callback) {
	enserializeCounter = 0;
	deserializeCounter = 0;
	server.listen(59903, null, null, callback);
};

exports.tearDown = function(callback) {
	server.close(callback);
};

