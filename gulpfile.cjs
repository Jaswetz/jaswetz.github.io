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
const webp = require('gulp-webp');
const RevAll = require('gulp-rev-all');
const revRewrite = require('gulp-rev-rewrite');
const replace = require('gulp-replace');

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
        .pipe(gulpif(isProd, cleanCSS()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(stylesDest))
        .pipe(browserSync.stream());
}

function jsTask() {
    return gulp.src(jsSrc)
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulp.dest(jsDest));
}

function revTask() {
    return gulp.src([`${destDir}/**/*`])
        .pipe(RevAll.revision({
            dontRenameFile: ['.html'],
            dontUpdateReference: ['.html']
        }))
        .pipe(gulp.dest(destDir))
        .pipe(RevAll.manifestFile())
        .pipe(gulp.dest(destDir));
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
        .pipe(gulpif(isProd, (stream) =>
            revRewrite({
                manifest: gulp.src(destDir + '/rev-manifest.json', { allowEmpty: true })
            })(stream)
        ))
        .pipe(gulp.dest(htmlDest))
        .pipe(browserSync.stream());
}

function imagesTask() {
    return gulp.src(imgSrc)
        .pipe(gulpif(isProd, imagemin()))
        .pipe(gulp.dest(imgDest))
        .pipe(webp())
        .pipe(gulp.dest(imgDest));
}

function lazyLoadImagesTask() {
    return gulp.src(htmlDest + '/**/*.html')
        .pipe(replace(/<img(.*?)src="(.*?)"(.*?)>/g, '<img$1src="$2"$3 loading="lazy">'))
        .pipe(gulp.dest(htmlDest));
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
    gulp.parallel(sassTask, jsTask, imagesTask, audioTask, svgSpriteTask),
    nunjucksTask,
    lazyLoadImagesTask,
    (cb) => {
        if (isProd) {
            return revTask();
        }
        cb();
    }
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

module.exports = {
    build,
    dev,
    prod,
    default: dev
};
