var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('js', function(){
        browserify('./Test.jsx')
            .transform(reactify)
            .bundle()
            .pipe(source(''))
            .pipe(gulp.dest('./build/js/'));
});

gulp.task('start', function () {
    nodemon({
        ext: 'jsx',
        script: 'server.js'
    }).on('restart', function () {
              console.log('restarted!')
    });
});
