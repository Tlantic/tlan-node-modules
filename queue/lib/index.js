//Load modules
var amqp = require('amqplib');
var when = require('when');
//Declare Internals
var internals = {};


/**
    Rabbit Create Connection
    
    @method connection
    @param options {Object} queue options
    @returns promise

    options = {
		url:'',

	}
**/
exports.connection = function(options) {
	var d = when.defer();
	var open = amqp.connect(options.url);
	open.then(function(conn) {
		var ok = conn.createChannel();
		ok = ok.then(function(ch) {
			d.resolve(ch);
		});
		return ok;
	}).then(null, console.warn);

	return d.promise;
};


/**
    Rabbit Send Message to exchanger
    
    @method send
    @param channel {Object} queue channel
    @param msg {Object} queue options
    @param options {Object} queue options
    @returns promise

    var options = {
			key: '',
			exchanger: '',
			url: ''
		}

**/
exports.send = function(channel, msg, options) {
	var d = when.defer();

	var result = channel.publish(options.exchanger, options.key, new Buffer(msg));
	if (result)
		d.resolve(result);
	else
		d.resolve(result);

	return d.promise;
};

/**
    Rabbit Queue Message Consumer
    
    @method consumer
    @param channel {Object} queue channel
    @param options {Object} queue options
	@param action {Function} queue consumer action
    @returns null

    var opts = {
		url: '',
		queue: '',
		noAck: false,
		durable: true
	};

**/
exports.consumer = function(channel, options, action) {

	channel.prefetch(1);

	channel.consume(options.queue, work, {
		noAck: options.noAck || false
	});

	function work(msg,b) {
		action(msg, channel);
	}

};
/**
    Rabbit Queue Consumer (Create and close connection)
    
    @method queueConsumer
    @param options {Object} queue options
    @param action {Function} queue consumer action
    @returns null

    options = {
		url:'',
		queue:'',
		noAck: true||false,
		durable: true||false
	}
**/
exports.queueConsumer = function(options, action) {

	amqp.connect(options.url).then(function(conn) {

		process.once('SIGINT', function() {
			conn.close();
		});
		return conn.createChannel().then(function(ch) {
			var ok = ch.assertQueue(options.queue, {
				durable: options.durable || true
			});

			ok = ok.then(function() {
				ch.prefetch(1);
			});
			ok = ok.then(function() {
				ch.consume(options.queue, work, {
					noAck: options.noAck || false
				});
			});

			return ok;

			function work(msg) {
				action(msg, ch);
			}

		});
	}).then(null, console.warn);
};


/**
    Rabbit Send Message to exchanger
    
    @method queueConsumer
    @param msg {Object} queue options
    @param key {String} queue route key
    @param options {Object} queue options
    @param success {Function} success send message
    @param error {Function} error send message
    @returns null

**/
exports.queueSendToExchanger = function(msg, options, success, error) {
	var err;
	amqp.connect(options.url).then(function(conn) {
		return when(conn.createChannel().then(function(ch) {
			try {
				ch.publish(options.exchanger, options.key, new Buffer(msg));
				//console.log(" [x] Sent %s,  %s: %s ", options.exchanger, options.key, msg);
			} catch (e) {
				err = e;
			}

			return ch.close();

		})).ensure(function() {
			conn.close();
			if (err)
				error(err);
			else
				success();
		})
	}).then(null, console.log);
}


exports.restAdapter = function() {

};

exports.simpleAdapter = function() {

};