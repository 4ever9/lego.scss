const {src, dest, watch, parallel, series} = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const connect = require('gulp-connect');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
sass.compiler = require('node-sass');

function serve() {
    return connect.server({
        root: '.',
        livereload: true,
        port: 3030
    });
}

function compileMox() {
    return src('mox.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(dest('./dist'))
        .pipe(connect.reload());
}

exports.default = series(parallel(compileMox), function () {
    watch('mox.scss', compileMox)
})

exports.dev = series(parallel(compileMox), parallel(serve, function () {
    watch('mox.scss', compileMox)
    watch('./*.html', function () {
        return src('./*.html')
            .pipe(dest('./'))
            .pipe(connect.reload());
    })
}))