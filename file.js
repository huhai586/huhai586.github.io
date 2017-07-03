/**
 * Created by huhai on 2017/7/3.
 */
let fs = require("fs");
let path = require("path");

let dir = process.cwd();
var files = fs.readdirSync(dir);
files.forEach(function (filename) {
  var fullname = path.join(dir,filename);
  var stats = fs.statSync(fullname);
  if (stats.isDirectory()) filename += '/';
  process.stdout.write(filename + '\t' +
    stats.size + '\t' +
    stats.mtime + '\n'
  );
});