//Load modules
var http = require('http'),
    url = require('url'),
    when = require('when');

//Declare Internals
var internals = {};

//Config

var database = "http://localhost:9000/database/"



internals.request = function(connection, options, callback, error){
	try{

    var reqUrl = url.parse(connection);
 
    // http.request settings
    var settings = {
        host: reqUrl.hostname,
        port: reqUrl.port || 80,
        path: reqUrl.pathname,
        headers: options.headers || {},
        method: options.method || 'GET'
    };

  
    if(options.params){
        options.params = JSON.stringify(options.params);
        settings.headers['Content-Type'] = 'application/json';
        settings.headers['Content-Length'] = options.params.length;
    };
 
    var req = http.request(settings);
  
    if(options.params){ req.write(options.params) };

 
    req.on('response', function(res){
    	   
        res.body = '';
        res.setEncoding('utf-8');
 
        res.on('data', function(chunk){ res.body += chunk });
 
        res.on('end', function(){
            callback(res.body, res);
        });
    });

    req.on('error', function(e) {
	  error(e);
	});
 

    req.end();

	}catch(e){
		throw new Error('oops!');
	}
	
}

exports.save = function(collection, data, connection) {
	var d = when.defer();
	connection = connection || database;

	internals.request(connection +"/"+ collection, {
		method: 'POST',
		params: data
	}, function(body, res) {
		var rs = JSON.parse(body);
		if(rs.status==='ERROR')
			d.reject(JSON.parse(body).data);
		else
			d.resolve(JSON.parse(body).data);
	}, function(e) {
		d.reject(e);
	});

	return d.promise;

};

exports.update = function(collection, conditions, data,  connection) {
	var d = when.defer();
	connection = connection || database;

	internals.request(connection+"/"+ collection, {
		method: 'PUT',
		params: {
			conditions: conditions,
			data: data
		}
	}, function(body, res) {
		var rs = JSON.parse(body);
		if(rs.status==='ERROR')
			d.reject(JSON.parse(body).data);
		else
			d.resolve(JSON.parse(body).data);
	}, function(e) {
		d.reject(e);
	});

	return d.promise;

};


exports.delete = function(collection, conditions, connection) {
	var d = when.defer();
	connection = connection || database;

	internals.request(connection+"/"+ collection, {
		method: 'DELETE',
		params: {
			conditions: conditions || {}
		}
	}, function(body, res) {
		var rs = JSON.parse(body);
		if(rs.status==='ERROR')
			d.reject(JSON.parse(body).data);
		else
			d.resolve(JSON.parse(body).data);
	}, function(e) {
		d.reject(e);
	});

	return d.promise;

};

exports.findById = function(collection, id, connection) {
	var d = when.defer();

	connection = connection || database;

	connection = connection + collection + "/" + id;

	internals.request(connection, {
		method: 'GET'
	}, function(body, res) {
		var rs = JSON.parse(body);
		if(rs.status==='ERROR')
			d.reject(JSON.parse(body).data);
		else
			d.resolve(JSON.parse(body).data);
	}, function(e) {
		d.reject(e);
	});

	return d.promise;

};


exports.find = function(collection, conditions, fields, options, connection) {
	var d = when.defer(),
		method = 'find';
	connection = connection || database;

	connection = connection + collection + "/" + method;

	internals.request(connection, {
		method: 'POST',
		params: {
			conditions: conditions || {},
			fields: fields || {},
			options: options || {}

		}
	}, function(body, res) {
		var rs = JSON.parse(body);
		if(rs.status==='ERROR')
			d.reject(JSON.parse(body).data);
		else
			d.resolve(JSON.parse(body).data);
	}, function(e) {
		d.reject(e);
	});

	return d.promise;

};

