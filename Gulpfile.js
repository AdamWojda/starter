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
    pngquant     = require('imagemin-pngquant'),
    bs           = require('browser-sync').create();

    gulp.task('browser-sync', function() {
        bs.init({
            server: {
                baseDir: "./"
            }
        });
    });

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
        .pipe(bowerFiles())
        .pipe(filter('**/*.js'))
        .pipe(addSrc('js/external/*.js'))
        .pipe(addSrc('js/scripts.js'))
        .pipe(uglify())
        .pipe(s)
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./js'))
        .pipe(bs.stream())
        .pipe(bs.reload({stream: true}))
        .pipe(notify({
            onLast: true,
            message: () => `JS DONE ║║ File size ${s.prettySize}`
        }));
});

gulp.task('bower_final_css', function() {


    var s = size();
    return gulp.src('./bower.json')
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
        .pipe(bs.stream())
        .pipe(bs.reload({stream: true}))
        .pipe(notify({
            onLast: true,
            message: () => `CSS DONE ║║ File size ${s.prettySize}`
        }));


});

gulp.task('bower_full_css', function() {

    return gulp.src('./bower.json')
        .pipe(bowerFiles())
        .pipe(filter('**/*.css'))
        .pipe(addSrc('css/external/**/*.css'))
        .pipe(addSrc('scss/**/*.scss'))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer('last 10 versions', 'ie 9'))
        .pipe(concat('style.css'))
        .pipe(rename({ suffix: '.full' }))
        .pipe(gulp.dest('./css'))
        .pipe(bs.reload({stream: true}));

});


gulp.task('js-watch', ['bower_javascript','bower_final_css'], function (done) {
    bs.reload();
    done();
});

gulp.task('serve', ['bower_javascript','bower_final_css'], function () {

    // Serve files from the root of this project
    bs.init({
        server: {
            baseDir: "./"
        }
    });

    // add bs.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch([
        'js/**/*.js',
        '!js/app.min.js',
        'css/**/*.css',
        'scss/**/*.scss',
        '!css/style.css',
        '!css/style.min.css'
    ], ['js-watch']);
});

gulp.task('watch_build', ['browser-sync'], function() {

    gulp.watch("*.html").on('change', bs.reload);

    gulp.watch([
        'js/external/*.js',
        'js/**/*.js',
        '!js/app.min.js',
        '/bower.json',
        'bower_components/**'
    ], ['bower_javascript']);

    gulp.watch([
        'bower_components/**',
        '/bower.json',
        'css/external/**/*.css',
        'scss/**/*.scss',
        '!css/style.css',
        '!css/style.min.css'
    ], ['bower_full_css', 'bower_final_css']);


});
