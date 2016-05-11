var gulp = require('gulp'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
dest = require('gulp-dest'),
cssnano = require('gulp-cssnano');

// Minify CSS files
gulp.task('minifyCSS', function() {
 return gulp.src('./styles/*.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./styles/MIN'));
});

// Minify JavaScript files
gulp.task('minifyJS', function() {
 return gulp.src('./scripts/*.js')
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./scripts/MIN'));
});

// Watch for changes
gulp.task('watch', function(){
 gulp.watch('./JS/*.js', ['JS']);
 gulp.watch('./CSS/*.css', ['CSS']);
});

// Automate tasks
gulp.task('default', ['minifyJS', 'minifyCSS'], function() {});
