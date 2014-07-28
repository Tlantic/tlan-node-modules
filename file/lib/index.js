var readline = require('readline'),
	fs = require('fs'),
	stream = require('stream'),
	when = require('when'),
	path = require("path");


exports.readFile = function(path, name, lineWork) {

	var d = when.defer();
	var lineNr = 0;
	try {

		if (!path)
			d.reject("FILE_NOT_FOUND");

		if (!name)
			d.reject("FILE_NOT_FOUND");
	
		var instream = fs.createReadStream(path+name);
	
		var outstream = new stream;

		var rl = readline.createInterface(instream, outstream);

		rl.on('line', function(line) {
			var id = lineNr + 1;
			lineWork(line, id, name);

		});

		rl.on('close', function() {
			d.resolve(name);
		});



	} catch (e) {
		d.reject(e);
	}

	return d.promise;
}


exports.getDirFiles = function(basePath) {

	var d = when.defer();

	fs.readdir(basePath, function(err, files) {

		if (err) {
			d.reject(err);
		}
		d.resolve(files);
	});
	
	return d.promise;

}

exports.write = function(path, name, line){
	var d = when.defer();

	fs.open(path+name, 'a', 666, function( e, id ) {
	  fs.write( id, line+'\n', null, 'utf8', function(){
	    fs.close(id, function(){
	     	d.resolve();
	    });
	  });
	});

	return d.promise;

}

exports.copy = _copy;

function _copy(src, dst, cb) {
    function copyHelper(err) {
      var is
        , os
        ;

      if (!err) {
        return cb(new Error("File " + dst + " exists."));
      }

      fs.stat(src, function (err, stat) {
        if (err) {
          return cb(err);
        }

        is = fs.createReadStream(src);
        os = fs.createWriteStream(dst);

        is.pipe(os);
        os.on('close', function (err) {
          if (err) {
            return cb(err);
          }

          fs.utimes(dst, stat.atime, stat.mtime, cb);
        });
      });
    }

    cb = cb || noop;
    fs.stat(dst, copyHelper);
  }

 exports.move = _move;

 function _move(src, dst, cb) {
    function copyIfFailed(err) {
      if (!err) {
        return cb(null);
      }
      _copy(src, dst, function(err) {
        if (!err) {
          // TODO 
          // should we revert the copy if the unlink fails?
          fs.unlink(src, cb);
        } else {
          cb(err);
        }
      });
    }

    cb = cb || noop;
    fs.stat(dst, function (err) {
      if (!err) {
        return cb(new Error("File " + dst + " exists."));
      }
      fs.rename(src, dst, copyIfFailed);
    });
  }
