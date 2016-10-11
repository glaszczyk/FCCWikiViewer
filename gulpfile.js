var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var babel = require("gulp-babel");
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	return gulp.src('./sass/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autoprefixer())
	.pipe(rename('style.css'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task("es6", function () {
	return gulp.src("./es6js/script.js")
		.pipe(babel())
		.pipe(gulp.dest("./js"));
});

gulp.task("default", ["es6", "sass"], function(){
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch('./sass/**/*.scss', ['sass']);
	gulp.watch('./es6js/**/*.js', ['es6']);
	gulp.watch('./index.html', browserSync.reload);
	gulp.watch('./js/*.js', browserSync.reload);
});
