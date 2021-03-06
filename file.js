/**
 * Created by huhai on 2017/7/3.
 */
let fs = require("fs");
let path = require("path");

let dir = "./articles/articles_in_markdown"
// let text= fs.readFile(dir)
// console.log(text)

var files = fs.readdirSync(dir);
const articles = []
let totalArtical = 0
let readFileCount = 0
files.forEach(function (filename) {
  let curArticle={}

  var fullname = path.join(dir,filename);

  var stats = fs.statSync(fullname);
  if (!stats.isDirectory()){
    //store
    ++totalArtical
    curArticle.filename=(filename.replace(/\.jade/g,""))
    curArticle.path=fullname
    curArticle.ctime=stats.mtime

    process.stdout.write("准备读取....." + filename +"     路径在"+fullname+"\n")
    fs.readFile(fullname,(error,buffer)=>{
      ++readFileCount
      if(error){
        console.log(error);
        return
      }
      // extract the hide-summary
      let str = buffer.toString();
      var patt = new RegExp(/<hide-summary>(.*)<\/hide-summary>/,"g");
      var pattIMG = new RegExp(/<hide-img>(.*)<\/hide-img>/,"g");
      let matchSummary = patt.exec(str);
      let matchIMG =pattIMG.exec(str);
      if(!matchSummary){
        console.warn(filename+ '  没有发现summary');
      }else{
        curArticle.summary=matchSummary[1]
      }
      if(!matchIMG){
        console.warn("没有发现title-img")
      }else{
        curArticle.titleIMG=(/src="(.*)"/g.exec(matchIMG[1]))[1]
      }
      articles.push(curArticle)
      if(readFileCount === totalArtical){
        fs.writeFile("articles/allArticles.json",JSON.stringify({data: articles},null, 2),'utf-8',function(){
          console.log("所有文章信息输出完毕")
        })
      }
    })

  }
});