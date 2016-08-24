var gulp = require('gulp');
var sass = require('gulp-sass');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

// Error notifications
var reportError = function(error) {
  $.notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(error);
  console.log(error.toString());
  this.emit('end');
}

// Sass processing
gulp.task('sass', function() {
  return gulp.src('scss/global.scss')
    .pipe($.sourcemaps.init())
    // Convert sass into css
    .pipe($.sass({
      outputStyle: 'expanded', // libsass doesn't support expanded yet
      precision: 3
    }))
    // Show errors
    .on('error', reportError)
    // Autoprefix properties
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    // Write sourcemaps
    .pipe($.sourcemaps.write())
    // Save css
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('js/**/*.js')
        .pipe(gulp.dest('js'));
});

// ES Lint (checks for javascript errors)
// Using ESLint instead of JSHint, because Drupal recommends it:
// @see https://www.drupal.org/node/1955232
gulp.task('eslint', function () {
  return gulp.src(['js/*.js'])
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

// Beautify JS
gulp.task('beautify', function() {
  gulp.src('js/*.js')
    .pipe($.beautify({indentSize: 2}))
    .pipe(gulp.dest('js'))
    .pipe($.notify({
      title: "JS Beautified",
      message: "JS files in the theme have been beautified.",
      onLast: true
    }));
});

// Run drush to clear the theme registry
gulp.task('cr', function() {
  return gulp.src('', {
    read: false
  })
  .pipe($.shell([
    'drush cr',
  ]))
  .pipe($.notify({
    title: "Drush",
    message: "Drupal CSS/JS caches rebuilt.",
    onLast: true
  }))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// BrowserSync
gulp.task('browser-sync', function() {
  //watch files
  var files = [
    'css/**/*.css',
    'js/**/*.js'
  ];
  //initialize browsersync
  browserSync.init(files, {
    notify: false,
    proxy: "http://paragraphs.local" // BrowserSync proxy, change to match your local environment
  });
});

/**
 * Tasks
 */

// When running `gulp`:
// Cache rebuild, no compression, no concatenation, no minification, linting JS.
gulp.task('default', ['sass', 'browser-sync'], function() {

  // Run sass tasks hen a .scss file changes.
  gulp.watch("scss/**/*.scss", ['sass']);

  // Run js tasks when a .js file changes.
  gulp.watch("js/**/*.js", ['js']);

  // Rebuild Drupal cache when a .twig, .yml or .theme file changes.
  gulp.watch(["templates/**/*.twig", "*.yml", "*.theme"], ['cr']);
});
