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
files.forEach(function (filename) {
  let curArticle={}

  var fullname = path.join(dir, filename);
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
        console.log("发现summary", matchSummary[1])
        curArticle.summary=matchSummary[1]
      }
      articles.push(curArticle)
      console.log("articles\/articles_in_markdown\about javascript.jade")
      // console.log(articles)
      fs.writeFileSync("allArticles.json",JSON.stringify(articles,null, 2),'utf-8')

    })

  }
});

