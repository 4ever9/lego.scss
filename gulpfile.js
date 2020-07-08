const {src, dest, watch, parallel, series} = require('gulp');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

function serve() {
    return connect.server({
        root: '.',
        livereload: true,
        port: 3030
    });
}

function compileMox() {
    return src('./*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        // .pipe(sass().on('error', sass.logError))
        .pipe(dest('./dist'))
        .pipe(connect.reload());
}

exports.default = series(parallel(compileMox), function () {
    watch('./*.scss', compileMox)
})

exports.dev = series(parallel(compileMox), parallel(serve, function () {
    watch('./*.scss', compileMox)
    watch('./*.html', function () {
        return src('./*.html')
            .pipe(dest('./'))
            .pipe(connect.reload());
    })
}))