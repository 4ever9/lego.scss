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

function compileLego() {
    return src('./*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        // .pipe(sass().on('error', sass.logError))
        .pipe(dest('./dist'))
        .pipe(connect.reload());
}

exports.default = series(parallel(compileLego), function () {
    watch('./*.scss', compileLego)
})

exports.dev = series(parallel(compileLego), parallel(serve, function () {
    watch('./*.scss', compileLego)
    watch('./*.html', function () {
        return src('./*.html')
            .pipe(dest('./'))
            .pipe(connect.reload());
    })
}))
