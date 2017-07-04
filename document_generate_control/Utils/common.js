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

const gArticleJson = function(dir){
  var files = fs.readdirSync(dir);
  const articles = []
  files.forEach(function (filename) {
    let curArticle={}

    var fullname = path.join(dir,filename);

    var stats = fs.statSync(fullname);
    //filename += '/';
    // process.stdout.write(filename + '\t' +
    //   stats.size + '\t' +
    //   stats.mtime + '\n'
    // );
    if (!stats.isDirectory()){
      curArticle.filename=filename
      curArticle.fullname=fullname

      process.stdout.write("准备读取....." + filename +"     路径在"+fullname+"\n")
      fs.readFile(fullname,(error,buffer)=>{
        if(error){
          console.log(error);
          return
        }
        // extract the hide-summary
        let str = buffer.toString();
        var patt = new RegExp(/<hide-summary>(.*)<\/hide-summary>/,"g");
        let matchSummary = patt.exec(str);
        if(!matchSummary){
          console.warn(filename+ '  没有发现summary');
        }else{
          curArticle.summary=matchSummary[1]
        }
        articles.push(curArticle)
      })

    }
  });

  fs.writeFile("allArticles.json",JSON.stringify(articles,null, 2),'utf-8',function(){
    console.log("所有文章信息输出完毕")
  })
}
module.exports={
  getAlljadeFileName: getAlljadeFileName,
  gArticleJson: gArticleJson
}