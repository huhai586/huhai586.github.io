var gulp         = require('gulp'),
  plumber      = require('gulp-plumber'), // Prevent pipe breaking caused by errors from gulp plugins
  jade         = require('gulp-jade'),
  sass         = require('gulp-sass');


  gulp.task("jade", function () {
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
