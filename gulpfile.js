/* jshint node:true */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var karma = require('karma').server;
var argv = require('yargs').argv;
var $ = require('gulp-load-plugins')();
// Require plugins
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mergeTemplates = require('./merge_templates.js');
var fs = require('fs');
var cleanCSS = require("gulp-clean-css");
var sourcemaps  = require("gulp-sourcemaps");
const autoprefixer = require('gulp-autoprefixer');
 


gulp.task('styles', function() {
    return gulp.src([
        'app/styles/app-blue.scss',
        'app/styles/app-green.scss',
        'app/styles/app-red.scss',
        'app/styles/app-purple.scss',
        'app/styles/app-grey.scss',
        'app/styles/app-cyan.scss',
        ])
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('app/styles'));
});

gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
//.pipe($.jshint.reporter('jshint-stylish'))
//.pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function() {
    return gulp.src('app/scripts/**/*.js')
    .pipe($.jscs());
});

gulp.task('html', ['styles'], function() {
    var lazypipe = require('lazypipe');
    var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'bower_components/bootstrap/fonts', 'fonts');

    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('app/images/**/*')
// .pipe($.cache($.imagemin({
//   progressive: true,
//   interlaced: true
// })))
.pipe(gulp.dest('dist/images'));
});

gulp.task('lang', function() {
    return gulp.src('app/languages/**/*')
    .pipe(gulp.dest('dist/languages'));
});

gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')().concat('app/styles/fonts/**/*')
        .concat('bower_components/bootstrap/fonts/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('extras', function() {
    return gulp.src([
        'app/*.*',
        '!app/*.html',
        'node_modules/apache-server-configs/dist/.htaccess'
        ], {
            dot: true
        }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', ['styles'], function() {
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
// paths to bower_components should be relative to the current file
// e.g. in app/index.html you should use ../bower_components
.use('/bower_components', serveStatic('bower_components'))
.use(serveIndex('app'));

require('http').createServer(app)
.listen(9000)
.on('listening', function() {
    console.log('Started connect web server on http://localhost:9000');
});
});

gulp.task('serve', ['connect', 'fonts', 'lang', 'watch'], function() {
    if (argv.open) {
        require('opn')('http://localhost:9000');
    }
});

gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done);
});

// inject bower components
gulp.task('wiredep', function() {
    var wiredep = require('wiredep').stream;
    var exclude = [
    'bootstrap',
    'jquery',
    'es5-shim',
    'json3',
    'angular-scenario',
    'require'
    ];

    gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
    .pipe(wiredep({exclude: exclude}))
    .pipe(gulp.dest('app'));

    /*
    gulp.src('test/*.js')
    .pipe(wiredep({exclude: exclude, devDependencies: true}))
    .pipe(gulp.dest('test'));
    */
});

gulp.task('watch', ['connect'], function() {
    $.livereload.listen();
// watch for changes
    gulp.watch([
    'app/**/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '!app/templates.html'
    ]).on('change', function() {
        gulp.start('compress-js');
        /*
        mergeTemplates().then(function(output) {
            fs.writeFileSync("./app/templates.html", output);
        });
        */
        $.livereload.changed();
    });
    gulp.watch('app/styles/**/*.scss', ['compress-css']);
    //gulp.watch('bower.json', ['wiredep']);
});

gulp.task('builddist', ['jshint', 'html', 'images', 'lang', 'fonts', 'extras', 'styles'],
    function() {
        return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
    });

gulp.task('build', ['clean'], function() {
    gulp.start('builddist');
});

gulp.task('docs', [], function() {
    return gulp.src('app/scripts/**/**')
    .pipe($.ngdocs.process())
    .pipe(gulp.dest('./docs'));
});


var deps = [
"./bower_components/jquery/dist/jquery.min.js",
"scripts/extras/modernizr.custom.js",
"./bower_components/angular/angular.js",
"./bower_components/angular-sanitize/angular-sanitize.js",
"./bower_components/angular-animate/angular-animate.js",
"./bower_components/angular-aria/angular-aria.js",
"./bower_components/angular-material/angular-material.js",
"./bower_components/Chart.js/Chart.js",
"./bower_components/angular-chart.js/dist/angular-chart.js",
"./bower_components/angular-ui-router/release/angular-ui-router.js",
"./bower_components/angular-translate/angular-translate.js",
"./bower_components/angular-translate-loader-url/angular-translate-loader-url.js",
"./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
"./bower_components/angular-material-data-table/dist/md-data-table.js",
"./bower_components/zxcvbn/dist/zxcvbn.js",
"./bower_components/ng-idle/angular-idle.js"
];
var files = [
'./app/scripts/app.js',
'./app/scripts/controllers/*.js'
];
/*
var files = deps.concat([
'./app/scripts/app.js',
'./app/scripts/controllers/*.js'
]);
*/

gulp.task('scripts', function() {
    console.log("starting scripts");
    return gulp.src(files)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./app/scripts/'))
});
gulp.task('compress-js', ['scripts'], function() {
  gulp.src([
'./bower_components/angular/angular.js',
'./bower_components/angular-sanitize/angular-sanitize.js',
'./bower_components/angular-animate/angular-animate.js',
'./bower_components/angular-aria/angular-aria.js',
'./bower_components/angular-material/angular-material.js',
'./bower_components/Chart.js/Chart.js',
'./bower_components/angular-chart.js/dist/angular-chart.js',
'./bower_components/angular-ui-router/release/angular-ui-router.js',
'./bower_components/angular-translate/angular-translate.js',
'./bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
'./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
'./bower_components/angular-material-data-table/dist/md-data-table.js',
'./bower_components/zxcvbn/dist/zxcvbn.js',
'./bower_components/ng-idle/angular-idle.js',
'./bower_components/moment/moment.js',
'./bower_components/clipboard/dist/clipboard.js',
'./bower_components/ngclipboard/dist/ngclipboard.js',
      './app/scripts/main.js'
    ])
            .pipe(concat('concat.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('main.min.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('app/scripts/'));

});
gulp.task('compress-css', ['styles'], function() {
    console.log("cleaning CSS");
gulp.src([
"./bower_components/angular-material/angular-material.css",
"./bower_components/angular-chart.js/dist/angular-chart.css",
"./bower_components/c3/c3.css",
"./bower_components/angular-material-data-table/dist/md-data-table.css",
"./bower_components/flag-css/dist/css/flag-css.css",
"./bower_components/mdi/css/materialdesignicons.css",
"./bower_components/flag-icon-css/css/flag-icon.min.css",
"./app/styles/app-blue.css",
"./app/styles/custom.css"
  ])
        .pipe(concat('concat.css'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('main.min.css'))
    .pipe(cleanCSS(
       {
    }))
      .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(rename({
      basename: 'app',
      suffix: '.min',
  }))
  .pipe(gulp.dest('app/styles/'))

});