const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const { deleteAsync } = require('del');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const nunjucksRender = require('gulp-nunjucks-render');
const svgSprite = require('gulp-svg-sprite');

// For production or development?
let isProd = false;

// Variables for folder paths
const sourceDir = './src/';
const destDir = './dest/';
const stylesSrc = sourceDir + 'styles/**/*.scss';
const stylesDest = destDir + 'css/';
const jsSrc = sourceDir + '**/*.js';
const htmlSrc = sourceDir + '**/*.+(html|nunjucks)';
const htmlPageSrc = sourceDir + 'pages/' + '**/*.+(html|nunjucks)';
const htmlTemplatesSrc = sourceDir + 'templates';
const htmlDest = destDir;
const jsDest = destDir;
const imgSrc = sourceDir + 'images/**/*';
const imgDest = destDir + 'images';
const svgSrc = sourceDir + 'svg/**/*.svg';
const svgDest = destDir + 'svg';

function browserSyncTask(cb) {
    browserSync.init({
        server: destDir,
        port: 3000
    });
    cb();
}

function sassTask() {
    return gulp.src(stylesSrc)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(stylesDest))
        .pipe(browserSync.stream());
}

function jsTask() {
    return gulp.src(jsSrc)
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
}

function cleanTask() {
    return deleteAsync([destDir]);
}

function nunjucksTask() {
    return gulp.src(htmlPageSrc)
        .pipe(nunjucksRender({
            path: [htmlTemplatesSrc]
        }))
        .pipe(gulp.dest(htmlDest))
        .pipe(browserSync.stream());
}

function imagesTask() {
    return gulp.src(imgSrc)
        .pipe(gulp.dest(imgDest));
}

function svgSpriteTask() {
    return gulp.src(svgSrc)
        .pipe(svgSprite({
            mode: {
                symbol: {
                    dest: '.',
                    sprite: 'sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest(svgDest));
}

function watchTask() {
    gulp.watch(htmlSrc, nunjucksTask);
    gulp.watch(stylesSrc, sassTask);
    gulp.watch(jsSrc, jsTask);
    gulp.watch(imgSrc, imagesTask);
    gulp.watch(svgSrc, svgSpriteTask);
}

const build = gulp.series(
    cleanTask,
    gulp.parallel(sassTask, jsTask, nunjucksTask, imagesTask, svgSpriteTask)
);

const dev = gulp.series(
    build,
    gulp.parallel(watchTask, browserSyncTask)
);

const prod = gulp.series(
    (cb) => {
        isProd = true;
        cb();
    },
    build
);

module.exports = {
    build,
    dev,
    prod,
    default: dev
};
