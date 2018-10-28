var fs = require('fs');
var archiver = require('archiver');

var output = fs.createWriteStream(__dirname + '/{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}.xpi');
var archive = archiver('zip', {
  zlib: { level: 9 }
});
  
archive.pipe(output); 
archive.directory('src/', false);
archive.finalize();