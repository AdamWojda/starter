var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    kraken       = require('gulp-kraken'),
    rename       = require('gulp-rename'),
    imagemin     = require('gulp-imagemin'),
    uglify       = require('gulp-uglify'),
    uglifyCss    = require('gulp-uglifycss'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    filter       = require('gulp-filter'),
    addSrc       = require('gulp-add-src'),
    bowerFiles   = require('gulp-main-bower-files'),
    jslint       = require('gulp-jslint'),
    size         = require('gulp-size'),
    plumber      = require('gulp-plumber'),
    pngquant     = require('imagemin-pngquant'),
    bs           = require('browser-sync').create();


var path = {

    base: './',

    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    watch: {
        js: 'js/**/*.js',
        css: 'css/external/**/*.css',
        scss: 'scss/**/*.scss',
        html: '*.html',
        img: 'img/**/*.*',
        fonts: 'fonts/**/*.*',
        bower: 'bower_components/**/*.*'
    },

    exclude: {
        mainCss: '!css/style.css',
        minifiedCss: '!css/style.min.css',
        mainJs: '!js/app.js',
        minifiedJs: '!js/app.min.js'
    }
};

var reportError = function(error) {
   var report     = '';
   var chalk      = gutil.colors.bold.red;
   var longpath   = error.file;
   var shortpath  = longpath.split('themes').slice(-1);
   var longerror  = error.message;
   var shorterror = longerror.split('  ').pop();

   report += '\n';
   report += chalk('--- GULP ERROR -----------------------------------------------------------------') + '\n';
   report += chalk('Task: ') + error.plugin + '\n';
   report += chalk('File: ') + shortpath + '\n';
   report += chalk(error.line + '/' + error.column + ': ') + shorterror + '\n';
   report += chalk('--------------------------------------------------------------------------------') + '\n';
   console.error(report);

   this.emit('end');
 }

gulp.task('minify_images', function() {

    return gulp.src('img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./img/'))
        .pipe(notify('Images Compressed'));

});


gulp.task('bower_javascript', function() {
    var s = size();
    return gulp.src('./bower.json')
        .pipe(plumber({
            'errorHandler': reportError
         }))
        .pipe(bowerFiles())
        .pipe(filter('**/*.js'))
        .pipe(addSrc('js/external/*.js'))
        .pipe(addSrc('js/scripts.js'))
        .pipe(uglify())
        .pipe(s)
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./js'))
        .pipe(bs.reload({stream: true}))
        .pipe(notify({
            onLast: true,
            message: () => `JS DONE ║║ File size ${s.prettySize}`
        }));

        bs.reload();
        done();

});

gulp.task('bower_full_javascript', function() {
    var s = size();
    return gulp.src('./bower.json')
        .pipe(plumber({
            'errorHandler': reportError
         }))
        .pipe(bowerFiles())
        .pipe(filter('**/*.js'))
        .pipe(addSrc('js/external/*.js'))
        .pipe(addSrc('js/scripts.js'))
        .pipe(s)
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: '' }))
        .pipe(gulp.dest('./js'))
        .pipe(bs.reload({stream: true}));

        bs.reload();
        done();
});

gulp.task('bower_final_css', function() {


    var s = size();
    return gulp.src('./bower.json')
        .pipe(plumber({
            'errorHandler': reportError
         }))
        .pipe(bowerFiles())
        .pipe(filter('**/*.css'))
        .pipe(addSrc('css/external/**/*.css'))
        .pipe(addSrc('scss/**/*.scss'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 10 versions', 'ie 9'))
        .pipe(uglifyCss())
        .pipe(s)
        .pipe(concat('style.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./css'))
        .pipe(notify({
            onLast: true,
            message: () => `CSS DONE ║║ File size ${s.prettySize}`
        }));

        bs.reload();
        done();


});

gulp.task('bower_full_css', function() {

    return gulp.src('./bower.json')
        .pipe(plumber({
            'errorHandler': reportError
         }))
        .pipe(bowerFiles())
        .pipe(filter('**/*.css'))
        .pipe(addSrc('css/external/**/*.css'))
        .pipe(addSrc('scss/**/*.scss'))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer('last 10 versions', 'ie 9'))
        .pipe(concat('style.css'))
        .pipe(rename({ suffix: '' }))
        .pipe(gulp.dest('./css'))
        .pipe(bs.reload({stream: true}));


        bs.reload();
        done();

});


// gulp.task('js-watch', ['bower_javascript','bower_full_javascript','bower_final_css'], function (done) {
//     bs.reload();
//     done();
// });
//
// gulp.task('serve', ['bower_javascript','bower_full_javascript','bower_final_css', 'minify_images', 'watch'], function () {
//
//     bs.init({
//         server: {
//             baseDir: path.base
//         }
//     });
//
//     gulp.watch([
//         path.watch.js,
//         path.watch.css,
//         path.watch.scss,
//         path.exclude.mainCss,
//         path.exclude.minifiedCss,
//     ], ['js-watch']);
//
// });

gulp.task('watch', function() {

    gulp.watch(path.watch.html).on('change', bs.reload);

    bs.init({
        server: {
            baseDir: path.base
        }
    });

    gulp.watch([
        path.watch.js,
        path.watch.bower,
        path.exclude.mainJs,
        path.exclude.minifiedJs,
    ], ['bower_javascript','bower_full_javascript']);

    gulp.watch([
        path.watch.bower,
        path.watch.scss,
        path.watch.css,
        path.exclude.mainCss,
        path.exclude.minifiedCss,
    ], ['bower_full_css', 'bower_final_css']);


});
