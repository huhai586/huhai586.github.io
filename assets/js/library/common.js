/**
 * Created by huhai on 2017/7/4.
 */
$(document).ready(function () {
  //got template
   $.get("/template/art_template/index.html").done((htmlStr)=>{
    // got data
     $.get("/articles/allArticles.json","json").done((data)=>{
       console.log("所有文章的数据", data)
        template("home", htmlStr);
        let compiledHTML =template("home", data)
       $(".javascript .section_item_content").html(compiledHTML).hide().fadeIn(300)
       $(this).trigger("loading_off")
     })
  })

  $(document).on("loading_off", ()=>{
    $(".loader").hide()
  })
})

