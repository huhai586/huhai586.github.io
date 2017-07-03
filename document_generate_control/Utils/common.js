/**
 * Created by huhai on 2017/7/3.
 */
let fs = require("fs");
let path = require("path");

const  getAlljadeFileName = function(src) {
  var fs = require("fs");
  if (fs.existsSync(src)) {
    var files = fs.readdirSync(src);
    let fileNameArray=[]
    files.forEach(function(filename){
      fileNameArray.push(filename)
    })
    console.log(fileNameArray)
    return fileNameArray;
  }
  return null;
}

module.exports=getAlljadeFileName