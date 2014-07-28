# Tlantic Database Module

Database api consumer

Use promise when.js module

#### Methods

+ save
```js
	
    Save document in collection
    
    method save
    param collection {String} collection name
    param data {Object} document data
    param connection {String} api url (ex:http://localhost:9000/database/) [optional]
    returns promise

   var data = {
        name: "Entrada em Loja",
        description: "Entrada em Loja"
    }

    db.save('rule', data).then(function(value) {
            console.log(value);
        }).catch(function handleError(e) {
            console.log(e);
    });

``` 
+ update

```js
	Update document in collection
    
    method update
    param collection {String} collection name
    param conditions {Object} filter conditions
    param data {Object} document data
    param connection {String} api url (ex:http://localhost:9000/database/) [optional]
    returns promise

    var data = {
        attachCode:"A4"
    }

    var conditions = {
        "_id" : "53b32f6d008c6a371f66b4d1",
    }

    db.update('rule', conditions, data).then(function(value) {
            console.log(value);
        }).catch(function handleError(e) {
            console(e);
    });

    
```

+ delete

```js
    Delete document in collection
    
    method delete
    param collection {String} collection name
    param conditions {Object} filter conditions
    param connection {String} api url (ex:http://localhost:9000/database/) [optional]
    returns promise

    var conditions = {
        "_id" : "53b32f6d008c6a371f66b4d1",
    }

    db.delete('rule', conditions).then(function(value) {
            console.log(value);
        }).catch(function handleError(e) {
            console(e);
    });

    
```

+ findById

```js
    find document by id in collection
    
    method findById
    param collection {String} collection name
    param id {String} document id
    param connection {String} api url (ex:http://localhost:9000/database/) [optional]
    returns promise

    db.findById('rule', '53b2c57684c1ef0c0f4621e7').then(function(value) {
        console.log(value);
    }).catch(function handleError(e) {
        console.log(e);
    });

    
```

+ find

```js
    find document in collection
    
    method find
    param collection {String} collection name
    param conditions {Object} filter conditions
    param fields {Array} return document field (ex: name _id)
    param options {Object} return options data
    param connection {String} api url (ex:http://localhost:9000/database/) [optional]
    returns promise

    db.find('rule')).then(function(value) {
        console.log(value);
    }).catch(function handleError(e) {
        console.log(e);
    });
});

    
```


