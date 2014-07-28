# Tlantic Queue Module

Provides an api for manipulating queues

###Example
```js
    
    var options = {
            key: config.queue.key,
            exchanger: config.queue.exchange,
            url: config.queue.url
        }

        //CREATE NEW CONNECTION
        var conn = tlanticQueue.connection(options);

        //SEND
        conn.then(function(channel){           
                var resp = {'data':'aaa'};
                tlanticQueue.send(channel, JSON.stringify(resp), options).then(function(result){
                console.log(result);
            })); 
            
        });

        //CREATE NEW CONNECTION
        var conn2 = tlanticQueue.connection(options);

        //CONSUMER
        conn2.then(function(channel) {
            var opts = {
                url: config.queue.url,
                queue: 'tlantic_area_queue',
                noAck: false,
                durable: true
            };

            tlanticQueue.consumer(channel, opts, function(msg, ch){
                var x = msg.content.toString();
                console.log(x);
                ch.ack(msg);
            })
        });

    
```


#### Methods

+ connection
```js
    Rabbit Create Connection
    
    method connection
    param options {Object} queue options
    returns promise

    options = {
        url:'',

    }

```

+ send
```js
    Rabbit Send Message to exchanger
    
    method queueConsumer
    param channel {Object} queue channel
    param msg {Object} queue options
    param options {Object} queue options
    returns promise

    var options = {
            key: '',
            exchanger: '',
            url: ''
        }

```

+ consumer
```js
   Rabbit Queue Message Consumer
    
    method consumer
    param channel {Object} queue channel
    param options {Object} queue options
    param action {Function} queue consumer action
    returns null

    var opts = {
        url: '',
        queue: '',
        noAck: false,
        durable: true
    };

```

+ queueConsumer
```js
	Rabbit Queue Consumer (Create and close connection)
    
    method queueConsumer
    param options {Object} queue options
    param action {Function} queue consumer action
    returns null

    options = {
		url:'',
		queue:'',
		noAck: true||false,
		durable: true||false
	}

```
+ queueSendToExchanger

```js
	Rabbit Send Message to exchanger (Create and close connection)
    
    method queueConsumer
    param msg {Object} queue options
    param key {String} queue route key
    param options {Object} queue options
    param success {Function} success send message
    param error {Function} error send message
    returns null

    options = {
		key: '',
		exchanger:'',
		url: ''
	}

    
```


#### Adapters

+ simpleAdapter
+ restAdapter
