var gulp         = require('gulp'),
  plumber      = require('gulp-plumber'), // Prevent pipe breaking caused by errors from gulp plugins
  jade         = require('gulp-jade');

  gulp.task("jade", function () {
  var feeds = ['./template/index.jade'];

  return gulp.src(feeds)
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./'))
});