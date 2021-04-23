const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del')
const babel = require('gulp-babel');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "./src/",
    },
    notify: false,
    online: true,
  });
}

function scripts() {
  return src(["./src/js/main.js"])
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(concat("main.min.js"))
  .pipe(uglify())
  .pipe(dest('./src/js/'))
  .pipe(browserSync.stream());
}

function styles() {
  return src('./src/sass/main.scss')
  .pipe(sass())
  .pipe(concat('main.min.css'))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'], grid: true
  }))
  .pipe(cleancss(({level: {1: {cpecialComments: 0}}})))
  .pipe(dest('./src/css/'))
  .pipe(browserSync.stream());
}

function images() {
  return src('src/assets/images/*.*')
  .pipe(newer('src/assets/images/dest'))
  .pipe(imagemin())
  .pipe(dest('src/assets/images/dest'))
}

function cleanimages () {
  return del('src/assets/images/dest/**/*', {force: true});
}

function cleandist () {
  return del('dist');
}

function startWatch() {
  watch(['src/**/sass/**/*'], styles);
  watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
  watch('src/**/*.html').on('change', browserSync.reload);
  watch('src/assets/images/');
}

function buildcopy() {
  return src([
    'src/css/**/*.min.css',
    'src/js/**/*.min.js',
    'src/assets/images/dest/**/*',
    'src/**/*.html',
  ], {base: 'src'})
  .pipe(dest('dist/'))
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimages = cleanimages;
exports.cleandist = cleandist;
exports.build = series(cleandist, styles, scripts, images, buildcopy);

exports.default = parallel(scripts, styles, browsersync, startWatch)
