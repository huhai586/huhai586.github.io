var gulp         = require('gulp'),
  plumber      = require('gulp-plumber'), // Prevent pipe breaking caused by errors from gulp plugins
  jade         = require('gulp-jade'),
  sass         = require('gulp-sass');
 let {getAlljadeFileName, gArticleJson} = require("./document_generate_control/Utils/common")


  gulp.task("index_jade", function () {
  var feeds = ['./template/index.jade'];
  return gulp.src(feeds)
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./'))
});

  gulp.task('sass', function () {
  return gulp.src('./assets/css/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("./assets/css"));
});

gulp.task("article_jade", function () {
  return gulp.src("./articles/articles_in_markdown/*.jade")
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./articles/articles_in_html'))
});

gulp.task("g_jade_json", function(){
  gArticleJson("./articles/articles_in_markdown")

})
gulp.task('build', ['index_jade', 'sass', 'article_jade',"g_jade_json"]);

