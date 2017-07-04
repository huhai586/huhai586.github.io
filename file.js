/**
 * Created by huhai on 2017/7/3.
 */
let fs = require("fs");
let path = require("path");

let dir = "./articles/articles_in_markdown"
// let text= fs.readFile(dir)
// console.log(text)

var files = fs.readdirSync(dir);
files.forEach(function (filename) {
  var fullname = path.join(dir,filename);
  var stats = fs.statSync(fullname);
  //filename += '/';
  // process.stdout.write(filename + '\t' +
  //   stats.size + '\t' +
  //   stats.mtime + '\n'
  // );

  if (!stats.isDirectory()){
    process.stdout.write("准备读取....." + filename +"     路径在"+fullname+"\n")
    fs.readFile(fullname,(error,buffer)=>{
      if(error){
        console.log(error)
      }
      // console.log("--------------------------  "+filename+"  --------------------------------")
      // console.log(buffer.toString())
      // console.log("----------------------------------------------------------")

      // extract the hide-summary
      let str = buffer.toString();
      var patt = new RegExp(/<hide-summary>(.*)<\/hide-summary>/,"g");
      let matchSummary = patt.exec(str);
      if(!matchSummary){
        console.warn(filename+ '    没有发现summary');
        return
      }
      console.log("summary", matchSummary[1])
    })

  }
});