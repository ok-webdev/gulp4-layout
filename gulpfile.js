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
const htmlmin = require('gulp-htmlmin');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
    notify: true,
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
  .pipe(dest('./dist/js/'))
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
  .pipe(dest('./dist/css/'))
  .pipe(browserSync.stream());
}

function images() {
  return src('src/assets/images/*.{jpeg, jpg, png, svg}')
  .pipe(newer('dist/assets/images/'))
  .pipe(imagemin())
  .pipe(dest('dist/assets/images/'))
}

function html() {
  return src('./src/**/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
    }
  ))
  .pipe(dest('./dist/'))
  .pipe(browserSync.stream())
}

function fonts () {
  return src('./src/assets/fonts/*.*')
  .pipe(dest('./dist/assets/fonts/'));
}

function favicon () {
  return src ('./src/assets/favicon/*.*')
  .pipe(dest('./dist/assets/favicon/'));
}

function cleanimages () {
  return del('dist/assets/images/**/*', {force: true});
}

function cleandist () {
  return del('dist');
}

function startWatch() {
  watch('src/**/*.html').on('change', html, browserSync.reload);
  watch(['src/**/sass/**/*'], styles);
  watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
  watch('src/assets/');
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimages = cleanimages;
exports.cleandist = cleandist;
exports.html = html;
exports.fonts = fonts;
exports.favicon = favicon;

exports.default = parallel(html, fonts, favicon, scripts, styles, images, browsersync, startWatch);
