const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
// const KeyForHosting = require('keyForHosting.js')
const fs = require('fs')
const svgSprite = require('gulp-svg-sprite');



function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src(['app/images/**/*',
        '!app/images/svg/*.svg'])
        .pipe(imagemin(
            [
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))

        .pipe(dest('dist/images'))
}

// function svgsprite() {
//     return src('app/images/svg/*.svg')
//         .pipe(svgSprite({
//             mode: {
//                 stack: {
//                     sprite: "../sprite.svg"  //sprite file name
//                 }
//             },
//         }
//         ))
//         .pipe(dest('app/images'));
// }

function scripts() {
    return src([
        // 'node_modules/jquery/dist/jquery.js',
        // 'node_modules/swiper/swiper-element.js',
        // 'node_modules/swiper/swiper.esm.js',
        'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js',
    ])
        .pipe((concat('main.min.js')))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html',
        'app/php/**/*'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

function uploadToHosting() {
    var conn = ftp.create({
        host: 'vh372.timeweb.ru',
        user: 'ch44857',
        password: fs.readFileSync("E:\Desktop on E\Landing_and_features/key.txt", "utf8"),
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        'dist/**/*.*'
    ];

    return src(globs)
        .pipe(conn.newer('/public_html'))
        .pipe(conn.dest('/public_html'));
}

function deploy(){
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
}


exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.uploadToHosting = uploadToHosting;
exports.deploy = deploy;

// exports.svgsprite = svgsprite;

exports.buildToHosting = series(styles, scripts, cleanDist, images, build, uploadToHosting);
exports.buildToHostingWithoutImg = series(styles, scripts, cleanDist, build, uploadToHosting);
exports.build = series(styles, scripts, cleanDist, images, build);

exports.default = parallel(styles, scripts, browsersync, watching);

