const { src, dest, watch, parallel, series } = require("gulp");
const connect = require("gulp-connect");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

const resources = {
  scss: "./*.scss",
  html: "./*.html",
  dest: "./dist",
};

const includePaths = ["node_modules/layout.scss/src/scss"];

function serve() {
  return connect.server({
    root: ".",
    livereload: true,
    port: 3030,
  });
}

function compileScss() {
  return src("demo.scss")
    .pipe(
      sass({
        includePaths: includePaths,
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(dest(resources.dest))
    .pipe(connect.reload());
}

exports.default = series(compileScss, function () {
  watch(resources.scss, compileScss);
});

exports.dev = series(
  parallel(compileScss),
  parallel(serve, function () {
    watch(resources.scss, compileScss);
    watch(resources.html, function () {
      return src(resources.html).pipe(connect.reload());
    });
  })
);
