/**
 * Created by huhai on 2017/7/4.
 */
$(document).ready(function () {
  //render homepage

  var x={
    data: [
      {
        "filename": "about javascript.jade",
        "path": "articles\\articles_in_markdown\\about javascript.jade",
        "ctime": "2017-07-04T13:58:40.989Z",
        "summary": "这是summary来自copy的文章"
      },
      {
        "filename": "我的第一篇文章.jade",
        "path": "articles\\articles_in_markdown\\我的第一篇文章.jade",
        "ctime": "2017-07-04T14:45:56.840Z",
        "summary": "这是summary来自第一篇的文章"
      }
    ]
  }
var str = template("tpl-user",x)
  console.log(str)
})