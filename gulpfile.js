let preprocessor = 'scss',
    fileswatch   = 'html,htm,txt,json,md,woff2,js',
    baseDir      = 'src',
    online       = true,
    open         = true

let paths = {

	scripts: {
		src: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/libs/lazysizes/lazysizes.js',
      //'node_modules/owl.carousel/dist/owl.carousel.min.js',
      //'src/libs/fancybox/jquery.fancybox.js',
      //'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
      //'src/libs/maskedinput/jquery.maskedinput.min.js',

			//baseDir + '/js/common.js'
		],
		dest: baseDir + '/js',
	},

	styles: {
		src:  baseDir + '/scss/*.scss',
		dest: baseDir + '/css',
	},

	jsOutputName:  'libs.min.js'

}

const { src, dest, parallel, series, watch } = require('gulp');

const scss          = require('gulp-sass');
const gcmq          = require('gulp-group-css-media-queries');

const csso          = require('gulp-csso');
const cssbeautify   = require('gulp-cssbeautify');

const autoprefixer  = require('gulp-autoprefixer');
const browserSync   = require('browser-sync').create();

const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;
 
const imagemin      = require('gulp-imagemin');
const newer         = require('gulp-newer');

//const exec          = require('gulp-exec');
 
const rename        = require('gulp-rename');
const del           = require('del');

function browsersync() {
	browserSync.init({
		server: { baseDir: baseDir + '/' },
		notify: false,
    open: open,
		online: online
	})
}

function scripts() {
	return src(paths.scripts.src)
	.pipe(concat(paths.jsOutputName))
	.pipe(uglify())
	.pipe(dest(paths.scripts.dest))
	.pipe(browserSync.stream())
}

function styles() {
	return src(paths.styles.src)
  .pipe(eval(preprocessor)())
  .pipe(gcmq())
  .pipe(csso())
  .pipe(cssbeautify())
  .pipe(autoprefixer({ overrideBrowserslist: ['last 15 versions'], grid: true }))
	.pipe(dest('src/css'))
  .pipe(browserSync.stream())
}

function cssmin() {
  return src(baseDir + '/css/main.css')
  .pipe(csso())
  .pipe(rename({suffix: '.min'}))
  .pipe(dest('src/css'))
  .pipe(browserSync.stream())
}

function startwatch() {
	watch(baseDir  + '/**/' + preprocessor + '/**/*', series(styles, cssmin));
  watch(baseDir  + '/**/*.{' + fileswatch + '}').on('change', browserSync.reload);
}

function reactModules() {
  return src('src/scss/_modules/*.scss')
  .pipe(rename(function (path) {
    path.basename = path.basename.replace(/\_/g, '');
  }))
  .pipe(eval(preprocessor)())
  .pipe(gcmq())
  .pipe(csso())
  .pipe(cssbeautify())
  .pipe(autoprefixer({ overrideBrowserslist: ['last 15 versions'], grid: true }))
  .pipe(rename({suffix: '.module'}))
  .pipe(dest('dist/css/modules'))
}

function clearDist() {
  return del('dist');
}

function build(){
  return src(baseDir+'/css/*.css')
  .pipe(dest('dist/css')),
  src(baseDir+'/js/*.js')
  .pipe(dest('dist/js')),
  src(baseDir+'/fonts/**/*')
  .pipe(dest('dist/fonts')),
  src(baseDir+'/*.html')
  .pipe(dest('dist'))
}

exports.browsersync  = browsersync;
exports.styles       = styles;

exports.cssmin       = cssmin;
exports.reactModules = reactModules;

exports.scripts      = scripts;

exports.build       = parallel(scripts, series(clearDist, parallel(build), reactModules));

exports.default      = parallel(series(styles, cssmin), scripts, browsersync, startwatch);

