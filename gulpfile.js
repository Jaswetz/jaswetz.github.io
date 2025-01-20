const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const notify = require('gulp-notify');
const notifier = require('node-notifier');
const cleanCSS = require('gulp-clean-css');
const { deleteAsync } = require('del');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-html-minifier-terser');
const uglify = require('gulp-uglify');
const nunjucksRender = require('gulp-nunjucks-render');

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
const audioSrc = sourceDir + 'audio/*';
const audioDest = destDir + 'audio';
const svgSrc = sourceDir + 'svg';
const svgDest = destDir + 'svg';
const svgGlob = '**/*.svg';

// Define browser-sync ports
const browserPort = 3000;
const UIPort = 3003;

function browserSyncTask(cb) {
    browserSync.init({
        server: destDir,
        port: browserPort,
        ui: {
            port: UIPort
        },
        ghostMode: {
            links: false
        }
    });
    cb();
}

function handleErrors(error) {
    notifier.notify({
        title: 'Gulp Error',
        message: error.message
    });
    console.log(error);
    if (isProd) {
        process.exit(1);
    } else {
        this.emit('end');
    }
}

function sassTask() {
    return gulp.src(stylesSrc)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: isProd ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .on('error', handleErrors)
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(stylesDest))
        .pipe(browserSync.stream());
}

function jsTask() {
    return gulp.src(jsSrc)
        .pipe(gulpif(isProd, uglify()))
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
        .pipe(gulpif(isProd, htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
        })))
        .pipe(gulp.dest(htmlDest))
        .pipe(browserSync.stream());
}

function imagesTask() {
    return gulp.src(imgSrc)
        .pipe(gulpif(isProd, imagemin()))
        .pipe(gulp.dest(imgDest));
}

function audioTask() {
    return gulp.src(audioSrc)
        .pipe(gulp.dest(audioDest));
}

function svgSpriteTask() {
    const config = {
        svg: {
            namespaceClassnames: false
        },
        shape: {
            dest: "."
        },
        mode: {
            symbol: {
                dest: ".",
                sprite: "sprite.svg"
            }
        }
    };

    return gulp.src(svgGlob, { cwd: svgSrc })
        .pipe(gulpif(isProd, plumber()))
        .pipe(svgSprite(config)).on('error', function (error) { console.log(error); })
        .pipe(gulp.dest(svgDest))
        .pipe(notify({
            title: 'Gulp',
            message: 'SVG task complete'
        }));
}

function watchTask() {
    gulp.watch(htmlSrc, nunjucksTask);
    gulp.watch(stylesSrc, sassTask);
    gulp.watch(jsSrc, jsTask);
}

const build = gulp.series(
    cleanTask,
    gulp.parallel(sassTask, nunjucksTask, jsTask, imagesTask, audioTask, svgSpriteTask)
);

const dev = gulp.series(
    (cb) => {
        isProd = false;
        cb();
    },
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

exports.build = build;
exports.dev = dev;
exports.prod = prod;
exports.default = dev;
