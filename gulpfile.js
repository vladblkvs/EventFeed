let gulp = require("gulp");
let plumber = require("gulp-plumber");
let scss = require("gulp-sass");
let sourcemap = require("gulp-sourcemaps");
let autoprefixer = require("gulp-autoprefixer");
let csso = require("gulp-csso");
let posthtml = require("gulp-posthtml");
let include = require("posthtml-include");
let htmlmin = require("gulp-htmlmin");
let uglify = require("gulp-uglify-es").default;
let webp = require("gulp-webp");
let svgstore = require("gulp-svgstore");
let rename = require("gulp-rename");
let del = require("del");
let server = require("browser-sync").create();

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
});

gulp.task("css", function() {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(scss())
    .pipe(autoprefixer({
      cascade: true
    }))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
});

gulp.task("js", function() {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename(function(path) {
      if (path.basename === "script") {
        path.basename += ".min";
        path.extname = ".js";
      }
    }))
    .pipe(gulp.dest("build/js"))
});

gulp.task("sprite", function() {
  return gulp.src("source/img/sprite/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img"));
});

gulp.task("copy", function() {
  return gulp.src([
      // "source/manifest/site.webmanifest",
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "!source/img/sprite/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"))
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("css", "refresh"));
  gulp.watch("source/img/sprite/*svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean", "copy", "sprite", "html", "css", "js"));
gulp.task("start", gulp.series("build", "server"));
