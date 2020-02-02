// Require gulp
var gulp = require('gulp');

// Require plugins
var concat = require('gulp-concat');
var minify = require('gulp-minify');

var deps = [
"./bower_components/jquery/dist/jquery.min.js",
"scripts/extras/modernizr.custom.js",
"./bower_components/angular/angular.js",
"./bower_components/angular-sanitize/angular-sanitize.js",
"./bower_components/angular-animate/angular-animate.js",
"./bower_components/angular-aria/angular-aria.js",
"./bower_components/angular-material/angular-material.js",
"./bower_components/angular-loading-bar/build/loading-bar.js",
"./bower_components/angular-ui-sortable/sortable.js",
"./bower_components/Chart.js/Chart.js",
"./bower_components/angular-chart.js/dist/angular-chart.js",
"./bower_components/perfect-scrollbar/js/perfect-scrollbar.js",
"./bower_components/angular-ui-router/release/angular-ui-router.js",
"./bower_components/angular-translate/angular-translate.js",
"./bower_components/angular-translate-loader-url/angular-translate-loader-url.js",
"./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
"./bower_components/angular-material-data-table/dist/md-data-table.js",
"./bower_components/zxcvbn/dist/zxcvbn.js",
"./bower_components/ng-idle/angular-idle.js"
];
var files = deps.concat([
'./scripts/app.js',
'./scripts/controllers/*.js'
]);

gulp.task('scripts', function() {
    return gulp.src(files)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./scripts/'));
});
gulp.task('compress', function() {
  gulp.src(['./scripts/main.js'])
    .pipe(minify())
    .pipe(gulp.dest('./scripts/'))
});
