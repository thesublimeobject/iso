var coffee, gulp, gutil;

gulp = require('gulp');

coffee = require('gulp-coffee');

gutil = require('gulp-util');

gulp.task('coffee', function() {
  return gulp.src('./*.coffee').pipe(coffee({
    bare: true
  }).on('error', gutil.log)).pipe(gulp.dest('./'));
});
