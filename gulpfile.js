let preprocessor = 'scss',
    fileswatch   = 'html,htm,txt,json,md,woff2',
    baseDir      = 'src',
    online       = true,
    open         = true


const { src, dest, parallel, series, watch } = require('gulp');

const bssi         = require('browsersync-ssi')
const ssi          = require('ssi')

const scss          = require('gulp-sass');
const gcmq          = require('gulp-group-css-media-queries');

const csso          = require('gulp-csso');
const cssbeautify   = require('gulp-cssbeautify');

const autoprefixer  = require('gulp-autoprefixer');
const browserSync   = require('browser-sync').create();
const webpack       = require('webpack-stream');

const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;

//const exec          = require('gulp-exec');
 
const rename        = require('gulp-rename');
const del           = require('del');

function browsersync() {
	browserSync.init({
		server: { 
      baseDir: baseDir + '/',
      middleware: bssi({ baseDir: 'src/', ext: '.html' })
    },
		notify: false,
    open: open,
		online: online
	})
}

async function buildhtml() {
	let includes = new ssi('app/', 'dist/', '/**/*.html')
	includes.compile()
	del('dist/parts', { force: true })
}

function scripts() {
	return src(['src/js/*.js', '!src/js/*.min.js'])
		.pipe(webpack({
			mode: 'production',
			module: {
				rules: [
					{
						test: /\.(js)$/,
						exclude: /(node_modules)/,
						loader: 'babel-loader',
						query: {
							presets: ['@babel/env'],
							plugins: ['babel-plugin-root-import']
						}
					}
				]
			}
		})).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(rename('scripts.min.js'))
		.pipe(dest('src/js'))
		.pipe(browserSync.stream())
}


function styles() {
	return src('src/scss/*.scss')
  .pipe(eval(preprocessor)())
  .pipe(gcmq())
  .pipe(csso())
  .pipe(cssbeautify())
  .pipe(autoprefixer({ overrideBrowserslist: ['last 15 versions'], grid: true }))
	.pipe(dest('src/css'))
  .pipe(browserSync.stream())
}

function cssmin() {
  return src('src/css/main.css')
  .pipe(csso())
  .pipe(rename({suffix: '.min'}))
  .pipe(dest('src/css'))
  .pipe(browserSync.stream())
}

function startwatch() {
	watch(baseDir  + '/**/' + preprocessor + '/**/*', series(styles, cssmin));
  watch(['src/js/**/*.js', '!src/js/**/*.min.js'], scripts)
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
  src(baseDir+'/js/scripts.js')
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

exports.build        = parallel(scripts, series(clearDist, parallel(build), reactModules, buildhtml));

exports.default      = parallel(series(styles, cssmin), scripts, browsersync, startwatch);