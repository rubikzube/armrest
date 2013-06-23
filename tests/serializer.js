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
		success: function(data) {
			test.equals(enserializeCounter, 0, 'serialized');
			test.equals(deserializeCounter, 1, 'deserialized');
			test.equals(data.results, 42, 'Got some data');
			test.done();
		}
	});
};

exports.complexSerializer = function(test) {
	var config = {
		host: 'localhost:59903',
		logLevel: 'OFF',
		serializer: {
			'application/json' : {
				serialize: function(content) {
					enserializeCounter += 10;
					return JSON.stringify(content);
				},
				deserialize: function(content) {
					deserializeCounter += 10;
					return JSON.parse(content);
				}
			},
			'text/plain' : {
				serialize: function(content) {
					enserializeCounter += 1;
					return content;
				},
				deserialize: function(content) {
					deserializeCounter += 1;
					return content;
				}
			}
		}
	};
	var client = armrest.client(config);
	client.get({
		url: '/json-unannounced',
		success: function(data) {
			test.equals(enserializeCounter, 0, 'serialized');
			test.equals(deserializeCounter, 1, 'deserialized');
			test.equals(typeof(data), 'string', 'Got some data');
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

