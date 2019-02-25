var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var htmlhint = require('gulp-htmlhint');
var csso = require('gulp-csso');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var del = require('del');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');

gulp.task('clean',function(){
    return del('dist/');
});

//Проверка валидности html
gulp.task('htmlhint',function(){
   return gulp.src('app/html/*.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
});

//CSS
gulp.task('sass:build', function() {
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ])) 
    .pipe(csso())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

//JS
gulp.task('js:build',function(){
    return gulp.src('app/js/**/*.js')
    .pipe(sourcemaps.init()) 
    .pipe(uglify()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

//IMAGES
gulp.task('img:build',function(){
    return gulp.src('app/img/**/*.*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

//FONTS
gulp.task('fonts:build', function() {
    return gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({
        stream: true
    }))
})

//Отслеживание файлов
gulp.task('watch',function(){
    gulp.watch('app/scss/**/*.scss', gulp.series('sass:build')); 
    gulp.watch('app/js/**/*.js', gulp.series('js:build')); 
    gulp.watch('app/img/**/*.*', gulp.series('img:build'));
    gulp.watch('app/fonts/**/*.*', gulp.series('fonts:build'));  
})

gulp.task('browserSync',function(){
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

//Сборка
gulp.task('build',gulp.parallel(
    'watch',
    'browserSync',
    'sass:build',
    'fonts:build',
    'js:build',
    'img:build'
));