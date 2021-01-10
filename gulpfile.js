const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
var replace = require('gulp-replace');

/*
 --TOP LEVEL FUNCTIONS
    gulp.task - Define task
    gulp.src - Point to the files to use
    gulp.dest - point to the fodler to output 
    gulp.watch - Watch files and folders for changes
*/

// Logs Message
gulp.task('message', async function(){
    return console.log('Gulp is running...');
});

// Compile .njk files into html
gulp.task('copyHtml', async function(){
    gulp.src('./src/html/**')
            .pipe(nunjucks.compile())
            .pipe(gulp.dest('public'))
});

// Compile CNAME file
gulp.task('copyCNAME', async function(){
    return gulp.src('CNAME')
            .pipe(gulp.dest('public'))
});

// Optimize Images
gulp.task('imageMin', async function() {
    return gulp.src('./src/assets/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'))
});

// Scripts
gulp.task('scripts', async function() {
    return gulp.src('./src/assets/js/*')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/js'));
});

// Compile Sass
gulp.task('sass', async function() {
    return gulp.src('./src/assets/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/assets/css'));
});

// Compile webfonts
gulp.task('webfonts', async function() {
    return gulp.src('./src/assets/webfonts/*')
        .pipe(gulp.dest('public/assets/webfonts'));
});

// Cache busting task
gulp.task('cacheBust', async function() {
    const cbString = new Date().getTime();
    console.log(cbString);
    return gulp.src(['./public/partials/*'])
            .pipe(replace(/v=\d+/g, 'v=' + cbString))
            .pipe(gulp.dest('./public/partials/'))
});

gulp.task('default', gulp.series('message','copyHtml','imageMin','copyCNAME', 'scripts','sass','webfonts','cacheBust'));

gulp.task('watch', function(){
  gulp.watch('./src/html/**', gulp.series('copyHtml'));
  gulp.watch('CNAME', gulp.series('copyCNAME'));
  gulp.watch('./src/assets/js/*', gulp.series('scripts'));
  gulp.watch('./src/assets/images/**', gulp.series('imageMin'));
  gulp.watch('./src/assets/sass/*.scss', gulp.series('sass'));
  gulp.watch('./src/assets/webfonts/*', gulp.series('webfonts'));
});